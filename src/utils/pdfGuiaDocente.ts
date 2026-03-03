import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import logoSVG from '../assets/marca-unav-negro.svg?raw';
import htmlToPdfmake from 'html-to-pdfmake';
import ppeData from '../data/ppe.json';

import type { GuiaDocenteData } from '../components/AsistenteGuiaDocente';
import type { AsignaturaProcesada } from '../lib/dataUtils';

const competenciasDict: Record<string, string> = (
  ppeData as { resultados_aprendizaje: Record<string, string> }
).resultados_aprendizaje;

function initVfs(): boolean {
  const vfs =
    pdfFonts?.default?.pdfMake?.vfs ||
    pdfFonts?.pdfMake?.vfs ||
    pdfFonts?.default ||
    pdfFonts;
  if (vfs) {
    Object.assign(pdfMake, { vfs });
    return true;
  }
  console.error('No se pudo encontrar vfs en pdfFonts', pdfFonts);
  alert('Error al inicializar las fuentes PDF. Contacta con soporte.');
  return false;
}

function buildDocDefinition(
  guia: GuiaDocenteData,
  asignatura: AsignaturaProcesada,
) {
  const docDefinition = {
    pageMargins: [70, 40, 70, 70],
    content: [
      {
        columns: [
          {
            svg: logoSVG,
            width: 100,
          },
          {
            text: `Guía docente ${guia.presentacion.anioAcademico}`,
            alignment: 'right',
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 0],
          },
        ],
        columnGap: 20,
        margin: [0, 0, 0, 20],
      },
      {
        text: asignatura.nombre,
        style: 'tituloAsignatura',
        margin: [0, 0, 0, 10],
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 200,
            y2: 0,
            lineWidth: 2,
            lineColor: '#1e3a8a',
          },
        ],
        width: 200,
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
      { text: 'Presentación', style: 'sectionHeader' },
      {
        ul: [
          `Asignatura: ${asignatura.nombre}`,
          'Titulación: Grado en Filosofía, Política y Economía (PPE)',
          `Año académico: ${guia.presentacion.anioAcademico}`,
          `Módulo / Materia: ${asignatura.modulo} / ${asignatura.materia}`,
          `ECTS: ${asignatura.ects}`,
          `Curso / Semestre: ${asignatura.curso} / ${asignatura.semestre}`,
          `Profesores: ${guia.presentacion.profesores
            .map((p) => `${p.nombre} (${p.email})`)
            .join(', ')}`,
          `Idioma: ${guia.presentacion.idioma}`,
          `Aula: ${guia.presentacion.aula}`,
          `Horario: ${guia.presentacion.horario}`,
        ],
        margin: [0, 0, 0, 10],
      },
      { text: 'Breve resumen:', style: 'subHeader' },
      {
        stack: htmlToPdfmake(guia.presentacion.resumen),
        margin: [0, 0, 0, 10],
      },
      { text: 'Competencias', style: 'sectionHeader' },
      {
        ul: (asignatura.resultados_aprendizaje || []).map((codigo: string) => ({
          text: [
            { text: `${codigo}: `, bold: true },
            { text: competenciasDict[codigo] || 'Descripción no encontrada' },
          ],
        })),
        margin: [0, 0, 0, 10],
      },
      { text: 'Programa', style: 'sectionHeader' },
      {
        ul: guia.programa
          .map((u) => {
            const desc =
              u.descripcion && u.descripcion.trim() !== ''
                ? htmlToPdfmake(u.descripcion)
                : null;
            return desc
              ? [
                  { text: u.titulo, bold: true },
                  { margin: [0, 0, 0, 5], stack: desc },
                ]
              : [{ text: u.titulo, bold: true }];
          })
          .map((arr) => ({ stack: arr })),
        margin: [0, 0, 0, 10],
      },
      { text: 'Actividades formativas', style: 'sectionHeader' },
      {
        ul: guia.actividades
          .map((a) => {
            const desc =
              a.descripcion && a.descripcion.trim() !== ''
                ? htmlToPdfmake(a.descripcion)
                : null;
            return desc
              ? [
                  { text: a.nombre, bold: true },
                  { margin: [0, 0, 0, 5], stack: desc },
                ]
              : [{ text: a.nombre, bold: true }];
          })
          .map((arr) => ({ stack: arr })),
        margin: [0, 0, 0, 10],
      },
      { text: 'Evaluación', style: 'sectionHeader' },
      {
        ul: guia.evaluacion
          .map((e) => {
            const desc =
              e.descripcion && e.descripcion.trim() !== ''
                ? htmlToPdfmake(e.descripcion)
                : null;
            return desc
              ? [
                  { text: `${e.tipo} (${e.porcentaje}%)`, bold: true },
                  { margin: [0, 0, 0, 5], stack: desc },
                ]
              : [{ text: `${e.tipo} (${e.porcentaje}%)`, bold: true }];
          })
          .map((arr) => ({ stack: arr })),
        margin: [0, 0, 0, 10],
      },
      {
        text: 'Convocatoria Extraordinaria',
        style: 'subHeader',
        margin: [0, 20, 0, 5],
      },
      ...htmlToPdfmake(guia.convocatoriaExtra),
      { text: 'Horario de atención', style: 'sectionHeader' },
      ...Object.entries(guia.horario)
        .map(
          ([email, franjas]: [
            string,
            { lugar: string; dia: string; hora: string }[],
          ]) => {
            const prof = guia.presentacion.profesores.find(
              (p) => p.email === email,
            );
            return [
              {
                text: prof ? prof.nombre : email,
                bold: true,
                margin: [0, 5, 0, 0],
              },
              {
                ul: franjas.map((f) => `${f.lugar} | ${f.dia} | ${f.hora}`),
                margin: [15, 0, 0, 0],
              },
              { text: email, margin: [15, 0, 0, 10] },
            ];
          },
        )
        .flat(),
      { text: 'Bibliografía y recursos', style: 'sectionHeader' },
      ...htmlToPdfmake(guia.bibliografia),
    ],
    styles: {
      sectionHeader: {
        fontSize: 16,
        bold: true,
        color: '#1e3a8a',
        margin: [0, 10, 0, 5],
      },
      subHeader: {
        fontSize: 13,
        bold: true,
        margin: [0, 5, 0, 2],
      },
      tituloAsignatura: {
        fontSize: 22,
        bold: true,
        color: '#1e3a8a',
        alignment: 'center',
        margin: [0, 10, 0, 20],
      },
    },
  };
  return docDefinition;
}

export function generarPDFGuiaDocente(
  guia: GuiaDocenteData,
  asignatura: AsignaturaProcesada,
) {
  if (!initVfs()) return;
  pdfMake
    .createPdf(buildDocDefinition(guia, asignatura))
    .download('guia-docente.pdf');
}

export function getGuiaDocentePDFBase64(
  guia: GuiaDocenteData,
  asignatura: AsignaturaProcesada,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!initVfs()) {
      reject(new Error('No se pudo inicializar las fuentes PDF.'));
      return;
    }
    pdfMake.createPdf(buildDocDefinition(guia, asignatura)).getBase64(resolve);
  });
}
