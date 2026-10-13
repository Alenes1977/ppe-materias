# Trabajo en este repositorio

## Destinos y alcance

- GitHub (`origin`, `https://github.com/Alenes1977/ppe-materias.git`) contiene el
  desarrollo y las herramientas de pruebas locales.
- GitLab (`https://code.unav.edu/team-ia/eurekai-guias-docentes.git`) es la base
  canónica de la aplicación oficial de UNAV. CAS/SAML, autenticación e
  infraestructura pertenecen a la implementación de IT.
- Una petición de push a GitHub autoriza únicamente ese destino. Para publicar
  en GitLab hace falta una instrucción explícita del usuario para esa entrega.
- Las entregas autorizadas a GitLab se realizan directamente a `main`, mediante
  un push normal. No usar `--force`, `--mirror` ni reescribir su historial.
- Conservar el workflow AWS de GitHub como ejecución manual. Un push de
  desarrollo no debe activar un despliegue. Ejecutar ese workflow requiere una
  petición explícita de despliegue.

## Desarrollo local

- Usar `npm run dev:local` para probar pantallas sin CAS, en `127.0.0.1:5173`.
- Mantener las restricciones de `local-preview`: solo servidor de desarrollo,
  loopback, sin proxy CAS y rechazado en builds, preview y producción.
- Mantener CAS activo en los builds normales. Nunca añadir un bypass al backend
  de producción, relajar la validación SAML ni incorporar credenciales.
- Los envíos de guías y las funciones de IA usan servicios externos reales.
  Las pruebas de navegación no deben invocarlos salvo que la tarea lo requiera.

## Preparación de una entrega a UNAV

Seguir [la guía de entregas](docs/desarrollo-local-y-entregas-unav.md).

1. Descargar el `main` actual de GitLab y partir de él en una copia de trabajo
   aparte. Conservar el trabajo local del usuario.
2. Definir una lista explícita de archivos y cambios funcionales que requiere
   la entrega. Revisar las dependencias entre datos, tipos y componentes.
3. Comparar cada archivo con los cambios nuevos de GitLab antes de trasladarlo.
   Si ambas partes lo han editado, integrar los fragmentos necesarios.
4. Excluir las herramientas de desarrollo local y las reglas de GitHub.
   Evitar merges globales de GitHub y copias completas sobre GitLab.
5. Mantener idénticos a la base de GitLab los archivos protegidos que enumera
   la guía. Si la entrega exige tocar alguno, explicar el cambio y comprobar
   que la autorización del usuario lo cubre antes de modificarlo.
6. Validar tipos, lint, formato, compilación y las pruebas afectadas. Revisar
   el diff completo y confirmar que el remoto sigue en la base revisada.
7. Subir solo cuando esté autorizado y verificar el SHA remoto al terminar.
   Si GitLab avanzó, volver a integrar y revisar. Un rechazo de protección de
   rama no autoriza a cambiar permisos ni a forzar la subida.

## Validación

En GitHub están disponibles `npm run test:local`,
`node --test scripts/credit-summary.test.mjs`, `npm run typecheck`,
`npm run lint`, `npm run format:check` y `npm run build`.
En la copia de GitLab usar los comandos presentes allí: el modo local y su
prueba pueden estar excluidos de la entrega.

Informar por separado de las pruebas locales, la subida de código y la
verificación del despliegue/login real. Un push correcto no confirma que la
web oficial se haya desplegado ni que CAS haya completado una sesión.
