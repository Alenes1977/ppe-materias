# GitLab Container Registry → ECS

En cada push a `main` (tras tests OK) el job `build_image` construye una imagen
**linux/amd64** (Fargate) y la publica en el registro del propio proyecto GitLab.

Pipeline: [`.gitlab-ci.yml`](../.gitlab-ci.yml). Imagen: [`Dockerfile`](../Dockerfile)
(SPA Vite + Express SAML2 en el puerto **8181**). Health: `GET /health` (sin autenticación).

Kaniko, no Docker-in-Docker: el runner de `code.unav.edu` no permite DinD privilegiado.

El **Container Registry** no es el Package Registry. Hay que usar Deploy → Container Registry.

---

## 1. Activar el Container Registry

En el proyecto: **Deploy → Container Registry**. Si la página no existe, hay que
pedirle a infra que habilite el registro en la instancia GitLab.

La URL de la imagen la da GitLab en esa pantalla. En este proyecto suele ser:

`registry.code.unav.edu/team-ia/eurekai-guias-docentes`

(o `code.unav.edu:5050/team-ia/eurekai-guias-docentes`). En CI se usa `$CI_REGISTRY_IMAGE`,
no hace falta escribirla a mano.

El job de CI entra al registro con `$CI_REGISTRY` / `$CI_REGISTRY_USER` /
`$CI_REGISTRY_PASSWORD` (token del job). No hace falta crear un usuario extra para publicar.

---

## 2. Variables CI (Settings → CI/CD → Variables)

Esta SPA **no embebe** variables `VITE_*` en el bundle (los datos van en `src/data/`).
No hay variables de build obligatorias que añadir a mano.

`$CI_REGISTRY`, `$CI_REGISTRY_IMAGE`, `$CI_REGISTRY_USER` y `$CI_REGISTRY_PASSWORD`
las rellena GitLab solo.

No pongas secretos de runtime en CI/CD Variables. `SESSION_SECRET` y el resto de
SAML van en la **task ECS** (runtime), no en la imagen.

Si más adelante se añaden `VITE_*`, créalas aquí (no Protected si `main` no está
protegida) y pásalas a Kaniko con `--build-arg` en `scripts/ci-build-registry.sh`.

---

## 3. Qué hace el pipeline

El runner no puede **ejecutar** el contenedor (DinD bloqueado). Para que ECS no
reciba una imagen rota, el CI comprueba lo más cercano al arranque real:

| Job            | Cuándo              | Qué                                                                                         |
| -------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `test`         | MR y ramas          | typecheck, lint, format, **`vite build`**, arranque prod + **`GET /health`** |
| `build_image`  | `main` tras `test`  | Kaniko linux/amd64 → `:SHA` y `:latest`                                      |
| `verify_image` | `main` tras el push | La imagen existe en el registry y el manifiesto es **linux/amd64**           |

`/health` es el mismo path que debe usar el health check del target group de ECS.
Si el build no arranca, el pipeline falla **antes** de publicar.

Tags:

- `$CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA`
- `$CI_REGISTRY_IMAGE:latest`

---

## 4. Usar la imagen en ECS

Campo `image` de la task:

`registry.code.unav.edu/team-ia/eurekai-guias-docentes:latest`

- Puerto del contenedor: **8181** (variable `PORT`; Express la lee).
- Health check: `GET /health` (HTTP, sin auth). El proceso **no arranca** en
  producción sin `SESSION_SECRET`: ECS marcaría la task unhealthy.
- Plataforma: **LINUX/X86_64**.
- Las tasks deben alcanzar `registry.code.unav.edu` por **HTTPS**.

El registro de GitLab es **privado**. ECS necesita credenciales de pull:

1. En GitLab: **Project access token** con scope `read_registry`.
   Usuario del bot: `project_<id>_bot_…` (**sin** `@`).
2. Secret en AWS Secrets Manager con las claves exactas `username` y `password`:

```json
{
  "username": "project_<id>_bot_…",
  "password": "<token>"
}
```

3. IAM **execution role** de la task: `secretsmanager:GetSecretValue`.
   En la política puedes usar un nombre con comodín (`…-*`); en la task hay que
   poner el **ARN completo** del secret.
4. En la task definition: `repositoryCredentials.credentialsParameter` = ese ARN
   (Private registry authentication).

Runtime de la task (no van en el build). `PORT=8181` ya está; hay que añadir:

| Variable         | Valor                                      | Obligatorio |
| ---------------- | ------------------------------------------ | ----------- |
| `SESSION_SECRET` | cadena aleatoria ≥32 (`openssl rand -base64 48`) | Sí     |
| `APP_BASE_URL`   | `https://guiadocente.unav.edu`             | No (ese es el default) |
| `SAML_ISSUER`    | `https://guiadocente.unav.edu`             | No (ese es el default) |
| `CAS_BASE_URL`   | `https://cas.unav.es/cas`                  | No (ese es el default) |

Sin `SESSION_SECRET` la nueva revisión de la task **no llega a healthy**. Los
certificados del IdP van en la imagen (`server/cas.crt`, `server/caspre.crt`).

---

## 5. Build local (opcional)

```bash
docker build --platform linux/amd64 \
  -t registry.code.unav.edu/team-ia/eurekai-guias-docentes:local .

docker login registry.code.unav.edu
docker push registry.code.unav.edu/team-ia/eurekai-guias-docentes:local
```

El host exacto es el de **Deploy → Container Registry**.
