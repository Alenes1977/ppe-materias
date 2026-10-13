# Desarrollo local y entregas a UNAV

Actualizado el 13 de octubre de 2026.

GitLab es la referencia para la aplicación oficial. En GitHub mantenemos el
desarrollo y las herramientas para comprobar cambios. Cada entrega a UNAV parte
de su `main` actual e incorpora los cambios funcionales revisados.

## Qué se ha hecho

| Cambio | Resultado |
| --- | --- |
| Revisión de ambos repositorios | GitLab tenía un historial independiente, creado el 6 de agosto, con cambios de IT hasta el 2 de septiembre. |
| Entrega de Gestión Aplicada | Se incorporaron el plan actualizado, el registro del grado, la adaptación de ponderaciones y el cálculo de 240 ECTS. |
| Ajuste de PPE 2017 | Se añadió AF5 al Core Curriculum en un commit separado. |
| Subida a GitLab | Los commits `ba94a63`, `08b6b0d` y `8d37db1` se añadieron a `main` mediante un push normal autorizado. |
| Conservación de IT | En esa entrega, los 23 archivos modificados por IT permanecieron idénticos a `a76bc71`. Los cambios funcionales afectaron a otros 15 archivos. |
| Sincronización de GitHub | `3dfaccc` unió ambos historiales y dejó los archivos iguales a GitLab `8d37db1`. Los documentos y temporales exclusivos de GitHub quedaron conservados en su historial. |
| Pruebas locales | Se añadió `npm run dev:local` para revisar pantallas sin iniciar sesión en CAS. |
| Publicación desde GitHub | El workflow AWS pasa a ejecución manual para que los pushes de desarrollo no lancen despliegues. |

La igualdad de archivos se comprobó al sincronizar. Las herramientas locales y
esta documentación introducen diferencias intencionadas en GitHub. Esas
diferencias no deben trasladarse automáticamente a GitLab.

El último `main` de GitLab comprobado para esta documentación es
`8d37db16546688cf4910fd4046712fb85f11cfd1`. Es una referencia histórica: consultar
siempre el remoto antes de preparar la siguiente entrega.

## Cómo probar en local

Desde la raíz del repositorio:

```powershell
npm ci
npm run dev:local
```

Abrir <http://127.0.0.1:5173>. Para revisar directamente el plan:
<http://127.0.0.1:5173/gestion-aplicada/plan-estudios>.

Este modo funciona sin `.env` ni cuenta CAS. Arranca Vite, muestra el aviso
«Pruebas locales · Acceso CAS desactivado» y actualiza las pantallas al guardar
los archivos. `Ctrl+C` detiene el servidor iniciado desde la terminal.

Si Windows bloquea una dependencia al instalar, cerrar los procesos de
desarrollo o las herramientas del editor que la estén usando y repetir la
instalación. No hace falta cambiar versiones del proyecto para resolver un
bloqueo de archivos.

La valoración por IA y el envío de guías conservan sus conexiones a servicios
reales. Para revisar pantallas y datos, evitar esas acciones de envío.

### Cómo queda aislado el modo local

- `package.json` añade `dev:local` y `test:local`.
- `vite.config.ts` reconoce el modo `local-preview`, fija loopback y desactiva
  los proxies `/api`, `/saml` y `/login/metadata` en ese modo.
- Vite define `__LOCAL_PREVIEW__`. `RequireCasSession.tsx` solo omite la consulta
  de sesión cuando esa constante y `import.meta.env.DEV` están activas.
- La configuración rechaza `local-preview` en builds, `vite preview` y con
  `NODE_ENV=production`. El build habitual conserva la consulta
  `/api/auth/session` y la redirección `/saml/login`.
- El backend `server/`, los certificados, Docker y el pipeline GitLab conservan
  su implementación. El modo local no arranca Express ni contacta con CAS.
- `scripts/local-preview.test.mjs` comprueba las restricciones de activación.

`npm run dev:all` mantiene el desarrollo con CAS. Requiere la configuración de
`.env.example` y que el CAS de pruebas acepte la URL de retorno local. Esa
autorización y el login real deben comprobarse con IT.

### Comprobaciones

```powershell
npm run test:local
node --test scripts/credit-summary.test.mjs
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Durante la preparación pasaron las cuatro pruebas del modo local y las seis
de créditos, además de tipos, lint, formato y compilación. Se abrió Gestión
Aplicada y se navegó al módulo de optativas sin login. También se comprobó que
el bundle de producción conserva CAS y excluye la vista local.

## Qué debe conservarse en una entrega a UNAV

Comparar estos archivos con el `main` de GitLab descargado para esa entrega:

| Área | Archivos que se conservan |
| --- | --- |
| Autenticación y certificados | `server/`, `src/components/RequireCasSession.tsx`, `src/App.tsx` |
| Configuración y dependencias | `vite.config.ts`, `tsconfig.server.json`, `package.json`, `package-lock.json`, `.env.example` |
| Infraestructura y publicación | `Dockerfile`, `.dockerignore`, `.gitlab-ci.yml`, `.github/`, `scripts/ci-*`, `public/health`, `nginx.conf` si existe |
| Controles de IT y documentación operativa | `.eslintrc.cjs`, `.eslintignore`, `docs/gitlab-registry.md` |

La regla incluye archivos que IT añada después. Revisar sus cambios desde el
ancestro común permite detectar ampliaciones de infraestructura y cambios en
archivos de la aplicación.

Las entregas de contenido pueden necesitar datos, tipos y componentes a la
vez. Por ejemplo, el plan de Gestión Aplicada requirió adaptar las ponderaciones
opcionales. Definir ese conjunto antes de copiar archivos evita dejar el plan
incompleto o reemplazar cambios nuevos de IT.

Si una mejora requiere modificar autenticación, infraestructura o dependencias,
hay que revisar ese alcance expresamente con el usuario y coordinar la
configuración con IT cuando corresponda.

## Procedimiento para una futura entrega

### 1. Preparar la base actual

Guardar y validar los cambios de GitHub. El árbol de trabajo debe estar limpio
antes de preparar la entrega. Estos comandos solo descargan información y crean
una copia local; ejecutar desde la raíz del repositorio:

```powershell
$githubCommit = git rev-parse HEAD
$unavUrl = 'https://code.unav.edu/team-ia/eurekai-guias-docentes.git'
git fetch --no-tags $unavUrl main
if ($LASTEXITCODE -ne 0) { throw 'No se pudo descargar main de UNAV.' }
$unavBase = git rev-parse FETCH_HEAD
$sharedBase = git merge-base $githubCommit $unavBase
if ($LASTEXITCODE -ne 0) { throw 'Revisar los historiales antes de continuar.' }
$delivery = Join-Path (Split-Path (Get-Location).Path -Parent) 'ppe-materias-entrega-unav'
if (Test-Path -LiteralPath $delivery) { throw 'Elegir una carpeta de entrega nueva.' }
git worktree add --detach $delivery $unavBase
```

El worktree comparte los objetos Git y mantiene sus propios archivos e índice.
Se pueden preparar commits locales en él y subirlos después a `main` sin crear
una rama remota.

### 2. Elegir y revisar los cambios

Crear una lista explícita de archivos. Ejemplo de una entrega que solo modifica
el contenido de un plan:

```powershell
$files = @('src/data/gestion-aplicada-plan.json')
git diff $sharedBase $githubCommit -- $files
git diff $sharedBase $unavBase -- $files
```

La segunda comparación muestra las modificaciones nuevas de UNAV en esos
archivos. Si tiene cambios, integrar los fragmentos necesarios en la copia de
entrega conservando lo añadido allí. Si está vacía y la primera comparación
contiene exactamente lo que se quiere entregar, se puede trasladar esa versión:

```powershell
git -C $delivery restore --source=$githubCommit --worktree -- $files
git -C $delivery diff --stat $unavBase
git -C $delivery diff $unavBase
git -C $delivery status --short
```

Evitar la copia completa del repositorio, el merge global de GitHub y el
cherry-pick de commits que mezclen contenido y herramientas locales. Quedan
fuera de las entregas habituales `dev:local`, el bypass del frontend, su prueba,
`AGENTS.md`, esta guía y el cambio del workflow de GitHub a ejecución manual.

### 3. Validar y guardar la entrega

En la carpeta de entrega, instalar las dependencias y ejecutar los comandos
disponibles en GitLab: tipos, lint, formato, build y pruebas afectadas. Si se ha
modificado código relacionado con el servidor, comprobar también su arranque
y las respuestas sin sesión. El login real con CAS exige el entorno autorizado.

Revisar que los archivos protegidos permanezcan iguales a `$unavBase`, que el
diff contenga solo la lista acordada y que `git status` no muestre añadidos
inesperados. Añadir únicamente los archivos elegidos y crear commits locales:

```powershell
$protected = @(
  'server', 'src/App.tsx', 'src/components/RequireCasSession.tsx',
  'vite.config.ts', 'tsconfig.server.json', 'package.json', 'package-lock.json',
  '.env.example', 'Dockerfile', '.dockerignore', '.gitlab-ci.yml', '.github',
  'scripts/ci-*', 'public/health', 'nginx.conf', '.eslintrc.cjs',
  '.eslintignore', 'docs/gitlab-registry.md'
)
git -C $delivery diff --exit-code $unavBase -- $protected
if ($LASTEXITCODE -ne 0) { throw 'Se han modificado archivos protegidos de UNAV.' }
git -C $delivery add -- $files
git -C $delivery diff --cached --check
git -C $delivery diff --cached --name-status
git -C $delivery diff --cached
# Tras revisar el contenido, usar un mensaje que describa la entrega.
git -C $delivery commit -m 'Actualiza el contenido revisado del plan'
```

### 4. Publicar solo con autorización para esa entrega

Consultar otra vez el `main` remoto. Si ha cambiado respecto a `$unavBase`,
incorporar los cambios nuevos y repetir la revisión antes de subir.

Solo después de la autorización explícita para publicar en UNAV:

```powershell
$remoteMain = git ls-remote $unavUrl refs/heads/main
if ($LASTEXITCODE -ne 0) { throw 'No se pudo consultar GitLab.' }
if (($remoteMain -split '\s+')[0] -ne $unavBase) {
  throw 'UNAV ha avanzado: revisar de nuevo la entrega.'
}
git -C $delivery push $unavUrl HEAD:refs/heads/main
```

Usar un push normal. Si GitLab rechaza la escritura, conservar la entrega local
y resolver el motivo; mantener la protección de la rama. Tras un push correcto,
comparar el SHA remoto con el commit enviado. Revisar aparte el pipeline, el
despliegue y el acceso real con CAS.

## Publicar el desarrollo en GitHub

Comprobar que `origin` apunta a
`https://github.com/Alenes1977/ppe-materias.git`. Revisar el diff y ejecutar las
comprobaciones antes de crear el commit y usar `git push origin main`.

El workflow `.github/workflows/deploy.yml` queda con `workflow_dispatch`, por
lo que su despliegue AWS requiere una ejecución manual. Mantener esta
configuración en GitHub y ejecutar el despliegue solo cuando se solicite
expresamente. El pipeline `.gitlab-ci.yml` conserva el comportamiento de UNAV.

La publicación de esta documentación y del modo local tiene como destino
exclusivo GitHub. GitLab y la web oficial quedan fuera de esta entrega.
