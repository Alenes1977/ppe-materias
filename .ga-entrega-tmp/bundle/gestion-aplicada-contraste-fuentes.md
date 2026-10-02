# Contraste de fuentes: Grado en Gestión Aplicada

**Revisión:** 25 de septiembre de 2026  
**Criterio:** la memoria de verificación vigente (Verifica) es la referencia canónica. Cuando la cabecera de la web difiere, el JSON conserva los valores del Verifica.

## Discrepancia en los créditos de los módulos

| Módulo | Verifica | Cabecera de la web | Desglose de asignaturas en la web | JSON |
| --- | ---: | ---: | ---: | ---: |
| I. Empresa | 108 ECTS (p. 9) | 111 ECTS | 108 ECTS | 108 ECTS |
| II. Comunicación e Idiomas Modernos | 84 ECTS (p. 13) | 81 ECTS | 84 ECTS | 84 ECTS |
| III. Optativas | 24 ECTS (p. 15) | 24 ECTS | 24 ECTS, a elegir entre opciones | 24 ECTS |
| IV. Trabajo Fin de Grado | 6 ECTS (p. 16) | 6 ECTS | 6 ECTS | 6 ECTS |
| V. Core Curriculum | 18 ECTS (p. 17) | 18 ECTS | 18 ECTS | 18 ECTS |
| **Total** | **240 ECTS** | **240 ECTS** | **240 ECTS** | **240 ECTS** |

La diferencia se concentra en los dos primeros módulos: la cabecera web asigna 3 ECTS más a Empresa y 3 ECTS menos a Comunicación e Idiomas Modernos. El total del grado no cambia.

El propio desglose de asignaturas publicado en la web suma 108 ECTS para Empresa (Gestión Empresarial: 78; Derecho: 12; Contabilidad y Finanzas: 18) y 84 ECTS para Comunicación e Idiomas Modernos (Comunicación Empresarial: 27; Idiomas: 57). Esos subtotales coinciden con el Verifica; por tanto, la discrepancia está en las cifras de las cabeceras de módulo de la web.

## Criterio aplicado al JSON

El archivo [gestion-aplicada-plan.json](src/data/gestion-aplicada-plan.json) sigue la distribución del Verifica: **108 + 84 + 24 + 6 + 18 = 240 ECTS**. Se completaron las asignaturas de Gestión Empresarial 3 a 7, se ajustaron nombres y periodos de las asignaturas para reflejar el plan publicado, y se actualizaron los resultados de aprendizaje a los códigos RA1-RA30 usados en la memoria. La etiqueta de resultados del grado también se ajustó en [gestion-aplicada-meta.json](src/data/gestion-aplicada-meta.json).

El módulo de Optativas tiene 24 ECTS, aunque las dos materias y sus opciones aparecen con 24 ECTS cada una: son alternativas, no 48 ECTS que deban cursarse conjuntamente. La distribución anual resultante es de 60 ECTS por curso al escoger una de las opciones.

## Contraste de secuenciación

Se compararon los cursos, semestres y ECTS de la tabla de asignaturas de la web con el despliegue temporal de la memoria vigente (pp. 10-17). La suma de créditos por semestre coincide con la distribución de la memoria y con la secuenciación del JSON.

- Los idiomas figuran como anuales en la web y en el JSON. La memoria los registra como 9 ECTS repartidos en 4,5 ECTS en cada uno de los dos semestres del curso; las duraciones son compatibles.
- Derecho suma 6 ECTS en el semestre 6 y 6 ECTS en el semestre 7 tanto en la memoria como en el desglose web. Sin embargo, la memoria vigente dice que no constan elementos de nivel 3 para esta materia; los nombres «Derecho 1» y «Derecho 2» aparecen en la web, no en el detalle de nivel 3 disponible en el PDF.
- El PDF principal de la memoria vigente no detalla a nivel 3 todas las asignaturas que aparecen en la web. La p. 23 remite estos detalles al anexo 4.1. Por eso se puede confirmar la coincidencia de la distribución temporal agregada, pero la comprobación de todos los nombres y desgloses individualizados queda pendiente de revisar ese anexo.

## Contraste adicional de la matriz de competencias

Se revisó la pestaña «Competencias» del archivo «Resultados de aprendizaje_GESTIÓN APLICADA_Plan 21_para Guías Docentes_20260417». La matriz relaciona competencias con columnas de asignaturas y aporta una comprobación complementaria de los resultados de aprendizaje por curso. En seis de los ocho bloques que se pueden comparar, la unión de resultados marcados en la hoja coincide con los resultados de la materia del JSON: Contabilidad y Finanzas, Derecho, Comunicación en Idiomas Modernos, Prácticas académicas externas, Trabajo Fin de Grado y Formación Transversal.

| Materia o aspecto | Diferencia observada |
| --- | --- |
| Empresa y Entorno | El JSON incluye RA12 y RA13 para la materia, pero la matriz no los marca en las columnas de Gestión Empresarial 1–7. La hoja sí asigna RA12 a Derecho 2, Prácticas externas y CORE, y RA13 a Comunicación Empresarial 3–6 y Prácticas externas. |
| Código CE8 | La fila 25 de la hoja se identifica como «CE8 RA28», aunque la descripción corresponde a RA27 («Gestionar eficazmente los documentos asociados a los sistemas de gestión y procesos de la organización conforme a los principios de la calidad total»). La descripción sí coincide con el resultado RA27 del JSON; la matriz lo marca en Gestión Empresarial 1, 3 y 4. |
| Comunicación en las Organizaciones | El JSON incluye RA16 en esta materia; la hoja marca RA16 en las columnas genéricas de Inglés, Francés y Alemán, no en Comunicación Empresarial 1–6. La hoja, además, marca RA20 en Comunicación Empresarial 3–6, que no figura entre los resultados de esta materia en el JSON. |
| Formación Complementaria | El JSON identifica «Intercambio Académico», pero la hoja no contiene una columna propia para esta asignatura; no se puede contrastar su asignación de resultados. |

La matriz no contiene créditos ni semestres y representa los idiomas mediante columnas genéricas. No permite validar la secuenciación del plan ni resolver la discrepancia de créditos que aparece en las cabeceras web de los módulos I y II. Estos hallazgos se registran como diferencias entre la matriz del Plan 21 y la información del JSON; se mantiene como criterio canónico el Verifica vigente y no se modifican los datos del JSON por esta sola comparación.

## Ponderaciones de evaluación

Se eliminaron del JSON los 48 pares de ponderación mínima/máxima; se mantuvieron las referencias a los sistemas de evaluación. En la memoria vigente de 2026, el apartado 4.3 (p. 18) describe los sistemas, y la p. 23 remite el detalle de planificación al anexo 4.1, que no está incluido en el PDF local de 29 páginas. La referencia descargable del anexo conduce a la sede del Ministerio, que solicita un CAPTCHA; no se pudo comprobar allí el contenido del archivo.

La búsqueda en UNAV sí localizó una memoria anterior, fechada el 8 de mayo de 2023, con tablas de ponderaciones mínimas y máximas por materia. Sus rangos coinciden con los que había en el JSON, pero esa memoria ya no es la Verifica vigente y no se usó para conservarlos. Además, la guía docente 2026-27 de Gestión Empresarial 1, grupo B, publica porcentajes concretos para esa asignatura (evaluación continua 70%, SE3 30%; dentro de la continua, SE2 10%, SE4 5% y SE5 55%). Son ponderaciones efectivas de una guía docente, no los rangos mínimos/máximos de cada materia del Verifica, y no se generalizaron a otras asignaturas.

Hasta contrastar los rangos del anexo 4.1 vigente, el JSON deja esos porcentajes sin informar. La aplicación también los presenta como pendientes de validar y no aplica horquillas no confirmadas.

## Fuentes

- [Memoria de verificación vigente, Gestión Aplicada (PDF local)](memoria-vigente-2026_GestionAplicada.pdf), identificador 2503801; distribución de módulos en las pp. 9-17; sistemas de evaluación en p. 18; referencia al anexo 4.1 en p. 23.
- [Memoria vigente del título publicada por UNAV (2026)](https://www.unav.edu/documents/d/escuela-de-gestion-aplicada/memoria-vigente-2026), identificador 2503801, fechada el 26 de marzo de 2026.
- [Anexo 4.1 de la memoria vigente (referencia CSV)](https://sede.educacion.gob.es/cid/966597729780096717618167.pdf), enlazado en la p. 23 del Verifica; el acceso automatizado solicita CAPTCHA.
- [Matriz de resultados de aprendizaje para guías docentes (Google Sheets), pestaña Competencias](https://docs.google.com/spreadsheets/d/13n82JWOVkWu1yXI_yYIpcW-CaMI7NSuAr1qqExhTDQo/edit?gid=1634743879#gid=1634743879), título del archivo fechado 17 de abril de 2026; consultada el 25 de septiembre de 2026. Copia XLSX incluida en el paquete.
- [Plan de estudios del Grado en Gestión Aplicada (Universidad de Navarra)](https://www.unav.edu/web/grado-en-gestion-aplicada-applied-management/plan-de-estudios), consultado el 25 de septiembre de 2026.
- [Memoria anterior del Grado en Gestión Aplicada (UNAV, 8 de mayo de 2023)](https://www.unav.edu/documents/5463875/30551519/Memoria%2BVigente%2BGrado%2Ben%2BGesti%C3%B3n%2BAplicada%2B-%2BApplied%2BManagement.pdf/9b478a18-331d-650a-76c4-5c00e474abf5?t=1686756866235), apartados 5.5.1.8 de sistemas de evaluación.
- [Guía docente de Gestión Empresarial 1, grupo B, curso 2026-27](https://asignatura.unav.edu/GESTIO-08366-2627.pdf), ejemplo de ponderaciones específicas publicadas para una asignatura.
