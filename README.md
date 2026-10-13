<div align="center">
  <img src="/src/assets/FaviconUnav_rojo.svg" height="80px" alt="UNAV logo"/>
</div>

# Portal PPE - Plan de Estudios y Guía Docente

**Aplicación web para la consulta y gestión académica del Grado en Filosofía, Política y Economía (PPE) de la Universidad de Navarra.**

## Descripción

Este portal permite consultar de forma centralizada toda la información académica del Grado en PPE:

- Estructura del plan de estudios: módulos, materias y asignaturas
- Competencias y resultados de aprendizaje
- Actividades formativas y sistemas de evaluación
- Detalle de cada asignatura y materia
- Generación asistida de la Guía Docente oficial para cada asignatura

La información está verificada por la ANECA y corresponde al plan de estudios oficial vigente.

## Funcionalidades principales

- **Explorador del plan de estudios:** Navega por módulos, materias y asignaturas con toda su información.
- **Buscador de asignaturas:** Acceso rápido a la ficha de cada asignatura.
- **Competencias y resultados de aprendizaje:** Consulta y análisis de competencias asociadas a cada asignatura.
- **Asistente para la Guía Docente:** Genera la guía docente oficial de cada asignatura paso a paso, con exportación a PDF/Word.
- **Resumen y estadísticas:** Visualización de la estructura y datos clave del grado.

## Tecnologías

- [React 18](https://react.dev/) + [TypeScript]
- [Vite] + [Tailwind CSS]
- [React Router DOM] para navegación SPA
- [FontAwesome] para iconografía
- [pdfmake], [docx], [react-quill] para generación de documentos


## Pruebas en local

La [guía de desarrollo y entregas a UNAV](docs/desarrollo-local-y-entregas-unav.md)
explica la relación entre GitHub y GitLab, las protecciones del modo local y el
procedimiento para entregar cambios conservando CAS y la configuración de IT.

Para revisar los planes y las pantallas sin iniciar sesión en CAS:

```sh
npm ci
npm run dev:local
```

Abre http://127.0.0.1:5173. Este modo muestra el aviso «Pruebas locales»,
escucha únicamente en la interfaz local y permite navegar sin cuenta ni `.env`.
Los cambios en los archivos se reflejan automáticamente. Detén el servidor con
`Ctrl+C`.

El comando arranca solo Vite y desactiva sus proxies de autenticación. No arranca
el servidor Express ni contacta con CAS. Las funciones que envían información a
servicios externos, como la valoración por IA y el envío de guías, siguen usando
sus servicios habituales.

El modo `local-preview` se rechaza al compilar, al usar `vite preview` y cuando
`NODE_ENV=production`. Las compilaciones habituales mantienen la autenticación
CAS. `npm run dev:all` conserva el desarrollo con el servidor CAS y su configuración
en `.env`.

Comprobaciones disponibles:

```sh
npm run test:local
node --test scripts/credit-summary.test.mjs
npm run typecheck
npm run lint
npm run format:check
npm run build
```

## Estructura del proyecto

- `src/components/` — Componentes React principales (plan de estudios, asignaturas, guía docente, etc.)
- `src/data/` — Datos oficiales del plan de estudios (ppe.json)
- `src/utils/` — Utilidades para generación de PDF/Word y helpers
- `public/` — Recursos estáticos

---
Alejandro Néstor García Martínez. Universidad de Navarra · PPE · 2026
