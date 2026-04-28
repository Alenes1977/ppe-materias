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


## Estructura del proyecto

- `src/components/` — Componentes React principales (plan de estudios, asignaturas, guía docente, etc.)
- `src/data/` — Datos oficiales del plan de estudios (ppe.json)
- `src/utils/` — Utilidades para generación de PDF/Word y helpers
- `public/` — Recursos estáticos

---
Alejandro Néstor García Martínez. Universidad de Navarra · PPE · 2026
