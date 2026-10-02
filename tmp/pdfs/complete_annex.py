from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from io import BytesIO
import json, shutil

ROOT = Path.cwd()
data_path = ROOT / 'src/data/gestion-aplicada-plan.json'
data = json.loads(data_path.read_text(encoding='utf-8-sig'))
parsed = json.loads((ROOT / 'tmp/pdfs/annex-parsed.json').read_text(encoding='utf-8'))
subjects = [s for m in data['modules'] for s in m['subjects']]
pages = ['9', '11', '13', '16', '17–18', '19', '20–21', '23', '25']
assert len(subjects) == len(parsed) == 9
count = 0
for s, source in zip(subjects, parsed):
    assert s['name'] == source['name']
    assert set(s['learningOutcomes']) == set(source['ra'])
    assert [a.split()[0] for a in s['trainingActivities']] == [a[0] for a in source['activities']]
    assert [e['system'].split()[0] for e in s['evaluation']] == [e[0] for e in source['evaluation']]
    for e, (system, low, high) in zip(s['evaluation'], source['evaluation']):
        assert 0 <= int(low) <= int(high) <= 100
        e['minWeight'] = low + '%'
        e['maxWeight'] = high + '%'
        count += 1
assert count == 48
data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
annex = next(Path('C:/Users/angarcia/Downloads').glob('4.1. Plan de estudios. Grado Gestio*n Aplicada.pdf'))
annex_copy = ROOT / 'anexo-4.1-plan-estudios-gestion-aplicada-2026.pdf'
shutil.copy2(annex, annex_copy)

md_path = ROOT / 'gestion-aplicada-contraste-fuentes.md'
md = md_path.read_text(encoding='utf-8')
md = md.replace('**Revisión:** 25 de septiembre de 2026', '**Revisión:** 2 de octubre de 2026 (actualización con el anexo 4.1); web y Google Sheets consultados el 25 de septiembre de 2026')
md = md.replace('Cuando la cabecera de la web difiere, el JSON conserva los valores del Verifica.', 'El anexo 4.1 recibido se integra en la referencia canónica. Cuando otras fuentes difieren, el JSON conserva los valores del Verifica.')
md = md.replace('- El PDF principal de la memoria vigente no detalla a nivel 3 todas las asignaturas que aparecen en la web. La p. 23 remite estos detalles al anexo 4.1. Por eso se puede confirmar la coincidencia de la distribución temporal agregada, pero la comprobación de todos los nombres y desgloses individualizados queda pendiente de revisar ese anexo.', '- El anexo 4.1 ya se ha revisado. Confirma las nueve distribuciones temporales de materia y las siete asignaturas básicas: Gestión Empresarial 1 y 2 (p. 6), Contabilidad y Finanzas 1 (p. 11), Comunicación Empresarial 1 y 2 (p. 14) y Segundo y Tercer Idioma Moderno 1 (p. 16). El resto de los nombres individualizados sigue procediendo de la web: el anexo tampoco los enumera exhaustivamente. No queda pendiente acceder al anexo, sino confirmar con los responsables el detalle que el propio Verifica no explicita.')
md = md.replace('no se modifican los datos del JSON por esta sola comparación.', 'no se modifican los datos del JSON por esta sola comparación. El anexo ahora confirma expresamente RA12 y RA13 en Empresa y Entorno (p. 7), y RA16, sin RA20, en Comunicación en las Organizaciones (p. 14). También identifica CE8 como RA27 (p. 7); las discrepancias de la matriz quedan, por tanto, respaldadas por la fuente canónica.')

weight_intro = '''## Ponderaciones de evaluación acreditadas por el anexo

El 2 de octubre de 2026 se recibió y revisó el anexo 4.1 de 25 páginas. Su CSV **966597729780096717618167**, visible en el documento, coincide exactamente con la referencia de la p. 23 de la memoria vigente. Los metadatos registran una modificación el 26 de marzo de 2026; la correspondencia documental se acredita por el CSV, no por el nombre del archivo.

Se incorporaron al JSON los **48 pares de ponderación mínima y máxima de las nueve materias**, transcritos de las tablas del anexo y comprobados visualmente. La retirada previa queda como antecedente de la revisión: la carencia documental que la motivó está resuelta. Los códigos de resultados de aprendizaje, las referencias a actividades formativas y los sistemas de evaluación de las nueve materias ya coincidían con el anexo y se conservaron.

Las cifras son **horquillas autorizadas por materia**, no porcentajes fijos de cada asignatura. Los extremos de las horquillas no tienen que sumar 100; los pesos concretos de una evaluación sí deben sumar 100 y respetar los límites aplicables. No se generaron ponderaciones ni resultados específicos por asignatura a partir de esta información agregada. Para Formación Complementaria, el anexo advierte expresamente que los datos de intercambio son **orientativos y dependen de las universidades de destino** (p. 20).

| Materia | Mínimo–máximo por sistema | Página del PDF del anexo |
| --- | --- | ---: |
'''
range_rows = []
for s, source, page in zip(subjects, parsed, pages):
    weights = '; '.join(f'{code}: {low}–{high} %' for code, low, high in source['evaluation'])
    range_rows.append((s['name'], weights, page))
weight_intro += '\n'.join('| ' + ' | '.join(row) + ' |' for row in range_rows)
weight_intro += '''

La memoria anterior de 8 de mayo de 2023 y la guía docente de Gestión Empresarial 1, grupo B, se conservan como antecedentes de la búsqueda. La fuente utilizada ahora para los límites es el anexo vigente recibido, leído directamente; los porcentajes efectivos de una guía docente no se extrapolan al resto del plan.

## Alcance y aspectos que deben revisar los responsables

El JSON queda completado con las ponderaciones previstas en su esquema actual. Ese esquema registra referencias a actividades y metodologías, pero no horas de actividad, presencialidad, idiomas de impartición ni contenidos; el anexo conserva ese detalle documental. No se añadieron campos nuevos ni se inventó una asignación de metodologías MD por materia que el anexo no proporciona.

Siguen pendientes la corrección de las cabeceras web de los módulos I y II y la revisión de la matriz de competencias. Además, la lectura del anexo identifica estos puntos:

- **Detalle de asignaturas:** solo enumera individualmente las siete asignaturas básicas. Los nombres de las restantes asignaturas del JSON proceden de la web, con ECTS y secuenciación compatibles con los repartos canónicos por materia. Formación Complementaria también contempla créditos optativos de la propia Universidad, además del intercambio (p. 20), sin enumerar una oferta que permita completar otras asignaturas concretas.
- **Descripción del Core:** el texto general de la p. 4 habla de dos asignaturas obligatorias y dos optativas de 3 ECTS, mientras que la ficha del módulo y de Formación Transversal declara 18 ECTS obligatorios (p. 24), como el PDF principal vigente. Se mantiene en el JSON la ficha específica; conviene revisar la descripción general para eliminar la contradicción.
- **Horas de actividades:** las filas de Empresa y Entorno suman 1.971 horas para 78 ECTS (p. 9) y las de Comunicación en las Organizaciones, 681 horas para 27 ECTS (p. 15). Si se aplica la razón de 25 horas por ECTS que arrojan las restantes fichas, serían 1.950 y 675 horas. Se solicita confirmar el criterio de cómputo; no se corrigen las cifras del documento por inferencia.
- **Presencialidad de prácticas:** AF5 figura con 550 horas y 0 % de presencialidad (p. 19), aunque otras fichas presentan AF5 con 100 %. Se solicita aclarar el sentido de esta diferencia para las actividades en empresas; el JSON actual no contiene ese campo.

Las páginas indicadas son posiciones dentro del PDF recibido. La página 13 muestra «3» en su pie, por lo que se utiliza la posición PDF para evitar ambigüedad.

'''
start = md.index('## Ponderaciones de evaluación')
end = md.index('## Fuentes', start)
md = md[:start] + weight_intro + md[end:]
md = md.replace('- [Anexo 4.1 de la memoria vigente (referencia CSV)](https://sede.educacion.gob.es/cid/966597729780096717618167.pdf), enlazado en la p. 23 del Verifica; el acceso automatizado solicita CAPTCHA.', '- [Anexo 4.1 vigente recibido y revisado el 2 de octubre de 2026 (copia local)](anexo-4.1-plan-estudios-gestion-aplicada-2026.pdf), 25 páginas, CSV 966597729780096717618167. [Referencia ministerial del mismo CSV](https://sede.educacion.gob.es/cid/966597729780096717618167.pdf), enlazada en la p. 23 del Verifica.')
md_path.write_text(md, encoding='utf-8')
print('JSON: incorporados', count, 'pares de ponderaciones. Markdown y copia del anexo actualizados.')
