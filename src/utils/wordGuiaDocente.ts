import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  convertInchesToTwip,
  HeadingLevel,
} from 'docx';
import { saveAs } from 'file-saver';
import type { GuiaDocenteData } from '../components/AsistenteGuiaDocente';
import type { AsignaturaProcesada } from '../lib/dataUtils';
import ppeData from '../data/ppe.json';

export async function generarWordGuiaDocente(
  guia: GuiaDocenteData,
  asignatura: AsignaturaProcesada,
) {
  const competenciasDict = (
    ppeData as { resultados_aprendizaje: Record<string, string> }
  ).resultados_aprendizaje;

  // Función auxiliar para convertir HTML a párrafos (eliminando tags HTML)
  const limpiarHTML = (html: string): string => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  // Función para crear párrafo con texto en negrita
  const parrafoNegrita = (text: string): Paragraph => {
    return new Paragraph({
      children: [
        new TextRun({
          text,
          bold: true,
        }),
      ],
      spacing: { line: 240, after: 80 },
    });
  };

  // Función para crear secciones
  const crearSeccion = (
    titulo: string,
    contenido: Paragraph[],
  ): Paragraph[] => [
    new Paragraph({
      children: [
        new TextRun({
          text: titulo,
          bold: true,
          size: 28 * 2,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 200 },
    }),
    ...contenido,
  ];

  const sections: Paragraph[] = [];

  // Presentación
  sections.push(
    ...crearSeccion('Presentación', [
      new Paragraph({
        text: `Asignatura: ${asignatura.nombre}`,
        spacing: { line: 240, after: 120 },
      }),
      new Paragraph({
        text: 'Titulación: Grado en Filosofía, Política y Economía (PPE)',
        spacing: { line: 240, after: 120 },
      }),
      new Paragraph({
        text: `Año académico: ${guia.presentacion.anioAcademico}`,
        spacing: { line: 240, after: 120 },
      }),
      new Paragraph({
        text: `Módulo / Materia: ${asignatura.modulo} / ${asignatura.materia}`,
        spacing: { line: 240, after: 120 },
      }),
      new Paragraph({
        text: `ECTS: ${asignatura.ects}`,
        spacing: { line: 240, after: 120 },
      }),
      new Paragraph({
        text: `Curso / Semestre: ${asignatura.curso} / ${asignatura.semestre}`,
        spacing: { line: 240, after: 120 },
      }),
      new Paragraph({
        text: `Profesores: ${guia.presentacion.profesores
          .map((p) => `${p.nombre} (${p.email})`)
          .join(', ')}`,
        spacing: { line: 240, after: 120 },
      }),
      new Paragraph({
        text: `Idioma: ${guia.presentacion.idioma}`,
        spacing: { line: 240, after: 120 },
      }),
      new Paragraph({
        text: `Aula: ${guia.presentacion.aula}`,
        spacing: { line: 240, after: 120 },
      }),
      new Paragraph({
        text: `Horario: ${guia.presentacion.horario}`,
        spacing: { line: 240, after: 120 },
      }),
      new Paragraph({
        text: `Breve resumen: ${limpiarHTML(guia.presentacion.resumen)}`,
        spacing: { line: 240, after: 200 },
      }),
    ]),
  );

  // Competencias
  const competenciasContent: Paragraph[] = [];
  asignatura.resultados_aprendizaje?.forEach((c: string) => {
    competenciasContent.push(
      new Paragraph({
        text: `${c}: ${competenciasDict[c] || 'Descripción no encontrada'}`,
        spacing: { line: 240, after: 120 },
        bullet: { level: 0 },
      }),
    );
  });
  sections.push(...crearSeccion('Competencias', competenciasContent));

  // Programa
  const programaContent: Paragraph[] = [];
  guia.programa.forEach((u) => {
    programaContent.push(parrafoNegrita(u.titulo));
    programaContent.push(
      new Paragraph({
        text: limpiarHTML(u.descripcion),
        spacing: { line: 240, after: 120 },
        indent: { left: convertInchesToTwip(0.25) },
      }),
    );
  });
  sections.push(...crearSeccion('Programa', programaContent));

  // Actividades formativas
  const actividadesContent: Paragraph[] = [];
  guia.actividades.forEach((a) => {
    actividadesContent.push(parrafoNegrita(a.nombre));
    actividadesContent.push(
      new Paragraph({
        text: limpiarHTML(a.descripcion),
        spacing: { line: 240, after: 120 },
        indent: { left: convertInchesToTwip(0.25) },
      }),
    );
  });
  sections.push(...crearSeccion('Actividades formativas', actividadesContent));

  // Evaluación
  const evaluacionContent: Paragraph[] = [];
  guia.evaluacion.forEach((e) => {
    evaluacionContent.push(parrafoNegrita(`${e.tipo} (${e.porcentaje}%)`));
    evaluacionContent.push(
      new Paragraph({
        text: limpiarHTML(e.descripcion),
        spacing: { line: 240, after: 120 },
        indent: { left: convertInchesToTwip(0.25) },
      }),
    );
  });
  evaluacionContent.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Convocatoria Extraordinaria:',
          bold: true,
        }),
      ],
      spacing: { before: 200, after: 80 },
    }),
  );
  evaluacionContent.push(
    new Paragraph({
      text: limpiarHTML(guia.convocatoriaExtra),
      spacing: { line: 240, after: 120 },
      indent: { left: convertInchesToTwip(0.25) },
    }),
  );
  sections.push(...crearSeccion('Evaluación', evaluacionContent));

  // Horario de atención
  const horarioContent: Paragraph[] = [];
  Object.entries(guia.horario).forEach(([email, franjas]) => {
    const prof = guia.presentacion.profesores.find((p) => p.email === email);
    horarioContent.push(
      parrafoNegrita(`${prof ? `${prof.nombre} (${email})` : email}`),
    );

    interface HorarioAtencion {
      lugar: string;
      dia: string;
      hora: string;
    }

    (franjas as HorarioAtencion[]).forEach((f) => {
      horarioContent.push(
        new Paragraph({
          text: `${f.lugar} | ${f.dia} | ${f.hora}`,
          spacing: { line: 240, after: 80 },
          bullet: { level: 0 },
          indent: { left: convertInchesToTwip(0.25) },
        }),
      );
    });
  });
  sections.push(...crearSeccion('Horario de atención', horarioContent));

  // Bibliografía
  const biblioContent: Paragraph[] = [
    new Paragraph({
      text: limpiarHTML(guia.bibliografia),
      spacing: { line: 240, after: 120 },
    }),
  ];
  sections.push(...crearSeccion('Bibliografía y recursos', biblioContent));

  // Crear el documento
  const doc = new Document({
    sections: [
      {
        children: sections,
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
      },
    ],
  });

  // Generar y descargar
  const blob = await Packer.toBlob(doc);
  const filename = `Guia_Docente_${asignatura.nombre.replace(
    /\s+/g,
    '_',
  )}_${new Date().getFullYear()}.docx`;
  saveAs(blob, filename);
}
