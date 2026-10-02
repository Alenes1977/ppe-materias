# Contraste de fuentes: Grado en Gestión Aplicada

**Revisión:** 2 de octubre de 2026 (actualización con el anexo 4.1); web y Google Sheets consultados el 25 de septiembre de 2026  
**Criterio:** la memoria de verificación vigente (Verifica) es la referencia canónica. El anexo 4.1 recibido se integra en la referencia canónica. Cuando otras fuentes difieren, el JSON conserva los valores del Verifica.

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
- El anexo 4.1 ya se ha revisado. Confirma las nueve distribuciones temporales de materia y las siete asignaturas básicas: Gestión Empresarial 1 y 2 (p. 6), Contabilidad y Finanzas 1 (p. 11), Comunicación Empresarial 1 y 2 (p. 14) y Segundo y Tercer Idioma Moderno 1 (p. 16). El resto de los nombres individualizados sigue procediendo de la web: el anexo tampoco los enumera exhaustivamente. No queda pendiente acceder al anexo, sino confirmar con los responsables el detalle que el propio Verifica no explicita.

## Contraste adicional de la matriz de competencias

Se revisó la pestaña «Competencias» del archivo «Resultados de aprendizaje_GESTIÓN APLICADA_Plan 21_para Guías Docentes_20260417». La matriz relaciona competencias con columnas de asignaturas y aporta una comprobación complementaria de los resultados de aprendizaje por curso. En seis de los ocho bloques que se pueden comparar, la unión de resultados marcados en la hoja coincide con los resultados de la materia del JSON: Contabilidad y Finanzas, Derecho, Comunicación en Idiomas Modernos, Prácticas académicas externas, Trabajo Fin de Grado y Formación Transversal.

| Materia o aspecto | Diferencia observada |
| --- | --- |
| Empresa y Entorno | El JSON incluye RA12 y RA13 para la materia, pero la matriz no los marca en las columnas de Gestión Empresarial 1–7. La hoja sí asigna RA12 a Derecho 2, Prácticas externas y CORE, y RA13 a Comunicación Empresarial 3–6 y Prácticas externas. |
| Código CE8 | La fila 25 de la hoja se identifica como «CE8 RA28», aunque la descripción corresponde a RA27 («Gestionar eficazmente los documentos asociados a los sistemas de gestión y procesos de la organización conforme a los principios de la calidad total»). La descripción sí coincide con el resultado RA27 del JSON; la matriz lo marca en Gestión Empresarial 1, 3 y 4. |
| Comunicación en las Organizaciones | El JSON incluye RA16 en esta materia; la hoja marca RA16 en las columnas genéricas de Inglés, Francés y Alemán, no en Comunicación Empresarial 1–6. La hoja, además, marca RA20 en Comunicación Empresarial 3–6, que no figura entre los resultados de esta materia en el JSON. |
| Formación Complementaria | El JSON identifica «Intercambio Académico», pero la hoja no contiene una columna propia para esta asignatura; no se puede contrastar su asignación de resultados. |

La matriz no contiene créditos ni semestres y representa los idiomas mediante columnas genéricas. No permite validar la secuenciación del plan ni resolver la discrepancia de créditos que aparece en las cabeceras web de los módulos I y II. Estos hallazgos se registran como diferencias entre la matriz del Plan 21 y la información del JSON; se mantiene como criterio canónico el Verifica vigente y no se modifican los datos del JSON por esta sola comparación. El anexo ahora confirma expresamente RA12 y RA13 en Empresa y Entorno (p. 7), y RA16, sin RA20, en Comunicación en las Organizaciones (p. 14). También identifica CE8 como RA27 (p. 7); las discrepancias de la matriz quedan, por tanto, respaldadas por la fuente canónica.

## Ponderaciones de evaluación acreditadas por el anexo

El 2 de octubre de 2026 se recibió y revisó el anexo 4.1 de 25 páginas. Su CSV **966597729780096717618167**, visible en el documento, coincide exactamente con la referencia de la p. 23 de la memoria vigente. La huella SHA1 del archivo recibido, **F00CDD1150B936309A60B116371F6FFA4196E455**, también coincide exactamente con la consignada en la p. 23 del Verifica. Se ha acreditado así la identidad del archivo. Los metadatos registran una modificación el 26 de marzo de 2026.

Se incorporaron al JSON los **48 pares de ponderación mínima y máxima de las nueve materias**, transcritos de las tablas del anexo y comprobados visualmente. La retirada previa queda como antecedente de la revisión: la carencia documental que la motivó está resuelta. Los códigos de resultados de aprendizaje, las referencias a actividades formativas y los sistemas de evaluación de las nueve materias ya coincidían con el anexo y se conservaron.

Las cifras son **horquillas autorizadas por materia**, no porcentajes fijos de cada asignatura. Los extremos de las horquillas no tienen que sumar 100; los pesos concretos de una evaluación sí deben sumar 100 y respetar los límites aplicables. No se generaron ponderaciones ni resultados específicos por asignatura a partir de esta información agregada. Para Formación Complementaria, el anexo advierte expresamente que los datos de intercambio son **orientativos y dependen de las universidades de destino** (p. 20).

| Materia | Mínimo–máximo por sistema | Página del PDF del anexo |
| --- | --- | ---: |
| Empresa y Entorno | SE1: 0–10 %; SE2: 5–20 %; SE3: 30–80 %; SE4: 0–20 %; SE5: 20–60 %; SE6: 0–10 % | 9 |
| Derecho | SE1: 0–10 %; SE2: 0–20 %; SE3: 30–80 %; SE4: 0–20 %; SE5: 20–60 %; SE6: 0–10 % | 11 |
| Contabilidad y Finanzas | SE1: 0–10 %; SE2: 0–20 %; SE3: 30–80 %; SE4: 0–20 %; SE5: 20–60 %; SE6: 0–10 % | 13 |
| Comunicación en las Organizaciones | SE1: 0–10 %; SE2: 5–20 %; SE3: 5–30 %; SE4: 0–20 %; SE5: 40–80 %; SE6: 0–20 % | 16 |
| Comunicación en Idiomas Modernos | SE7: 10–30 %; SE8: 10–30 %; SE9: 10–30 %; SE10: 10–30 %; SE11: 10–30 % | 17–18 |
| Prácticas académicas externas | SE2: 0–20 %; SE3: 0–20 %; SE4: 0–20 %; SE5: 70–90 % | 19 |
| Formación Complementaria | SE1: 0–10 %; SE2: 5–20 %; SE3: 5–30 %; SE5: 40–80 %; SE6: 0–20 % | 20–21 |
| Trabajo Fin de Grado | SE1: 0–20 %; SE3: 0–30 %; SE4: 0–20 %; SE5: 70–90 %; SE6: 0–20 % | 23 |
| Formación Transversal | SE1: 0–30 %; SE2: 0–80 %; SE3: 0–80 %; SE5: 0–80 %; SE6: 0–20 % | 25 |

La memoria anterior de 8 de mayo de 2023 y la guía docente de Gestión Empresarial 1, grupo B, se conservan como antecedentes de la búsqueda. La fuente utilizada ahora para los límites es el anexo vigente recibido, leído directamente; los porcentajes efectivos de una guía docente no se extrapolan al resto del plan.

## Alcance y aspectos que deben revisar los responsables

El JSON queda completado con las ponderaciones previstas en su esquema actual. Ese esquema registra referencias a actividades y metodologías, pero no horas de actividad, presencialidad, idiomas de impartición ni contenidos; el anexo conserva ese detalle documental. No se añadieron campos nuevos ni se inventó una asignación de metodologías MD por materia que el anexo no proporciona.

Siguen pendientes la corrección de las cabeceras web de los módulos I y II y la revisión de la matriz de competencias. Además, la lectura del anexo identifica estos puntos:

- **Detalle de asignaturas:** solo enumera individualmente las siete asignaturas básicas. Los nombres de las restantes asignaturas del JSON proceden de la web, con ECTS y secuenciación compatibles con los repartos canónicos por materia. Formación Complementaria también contempla créditos optativos de la propia Universidad, además del intercambio (p. 20), sin enumerar una oferta que permita completar otras asignaturas concretas.
- **Descripción del Core:** el texto general de la p. 4 habla de dos asignaturas obligatorias y dos optativas de 3 ECTS, mientras que la ficha del módulo y de Formación Transversal declara 18 ECTS obligatorios (p. 24), como el PDF principal vigente. Se mantiene en el JSON la ficha específica; conviene revisar la descripción general para eliminar la contradicción.
- **Horas de actividades:** las filas de Empresa y Entorno suman 1.971 horas para 78 ECTS (p. 9) y las de Comunicación en las Organizaciones, 681 horas para 27 ECTS (p. 15). Si se aplica la razón de 25 horas por ECTS que arrojan las restantes fichas, serían 1.950 y 675 horas. Se solicita confirmar el criterio de cómputo; no se corrigen las cifras del documento por inferencia.
- **Presencialidad de prácticas:** AF5 figura con 550 horas y 0 % de presencialidad (p. 19), aunque otras fichas presentan AF5 con 100 %. Se solicita aclarar el sentido de esta diferencia para las actividades en empresas; el JSON actual no contiene ese campo.

Las páginas indicadas son posiciones dentro del PDF recibido. La página 13 muestra «3» en su pie, por lo que se utiliza la posición PDF para evitar ambigüedad.

## Fuentes

- [Memoria de verificación vigente, Gestión Aplicada (PDF local)](memoria-vigente-2026_GestionAplicada.pdf), identificador 2503801; distribución de módulos en las pp. 9-17; sistemas de evaluación en p. 18; referencia al anexo 4.1 en p. 23.
- [Memoria vigente del título publicada por UNAV (2026)](https://www.unav.edu/documents/d/escuela-de-gestion-aplicada/memoria-vigente-2026), identificador 2503801, fechada el 26 de marzo de 2026.
- [Anexo 4.1 vigente recibido y revisado el 2 de octubre de 2026 (copia local)](anexo-4.1-plan-estudios-gestion-aplicada-2026.pdf), 25 páginas, CSV 966597729780096717618167. [Referencia ministerial del mismo CSV](https://sede.educacion.gob.es/cid/966597729780096717618167.pdf), enlazada en la p. 23 del Verifica.
- [Matriz de resultados de aprendizaje para guías docentes (Google Sheets), pestaña Competencias](https://docs.google.com/spreadsheets/d/13n82JWOVkWu1yXI_yYIpcW-CaMI7NSuAr1qqExhTDQo/edit?gid=1634743879#gid=1634743879), título del archivo fechado 17 de abril de 2026; consultada el 25 de septiembre de 2026. Copia XLSX incluida en el paquete.
- [Plan de estudios del Grado en Gestión Aplicada (Universidad de Navarra)](https://www.unav.edu/web/grado-en-gestion-aplicada-applied-management/plan-de-estudios), consultado el 25 de septiembre de 2026.
- [Memoria anterior del Grado en Gestión Aplicada (UNAV, 8 de mayo de 2023)](https://www.unav.edu/documents/5463875/30551519/Memoria%2BVigente%2BGrado%2Ben%2BGesti%C3%B3n%2BAplicada%2B-%2BApplied%2BManagement.pdf/9b478a18-331d-650a-76c4-5c00e474abf5?t=1686756866235), apartados 5.5.1.8 de sistemas de evaluación.
- [Guía docente de Gestión Empresarial 1, grupo B, curso 2026-27](https://asignatura.unav.edu/GESTIO-08366-2627.pdf), ejemplo de ponderaciones específicas publicadas para una asignatura.
