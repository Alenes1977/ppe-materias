import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import type { ValoracionIAResponse } from './valoracionIA';

function initVfs(): boolean {
  const vfs =
    (pdfFonts as { pdfMake?: { vfs?: unknown }; vfs?: unknown })?.pdfMake
      ?.vfs ||
    (pdfFonts as { pdfMake?: { vfs?: unknown }; vfs?: unknown })?.vfs ||
    (pdfFonts as { default?: { pdfMake?: { vfs?: unknown } } })?.default
      ?.pdfMake?.vfs;

  if (vfs) {
    (pdfMake as typeof pdfMake & { vfs?: unknown }).vfs = vfs;
    return true;
  }

  console.error('No se pudo encontrar vfs en pdfFonts', pdfFonts);
  alert('Error al inicializar las fuentes PDF. Inténtalo de nuevo.');
  return false;
}

function limpiarSaltos(texto: string): string {
  return texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
}

function convertirNegritasMarkdown(
  linea: string,
): Array<string | { text: string; bold: true }> {
  const partes: Array<string | { text: string; bold: true }> = [];
  const regexNegrita = /\*\*(.*?)\*\*/g;
  let ultimoIndice = 0;
  let match: RegExpExecArray | null = regexNegrita.exec(linea);

  while (match) {
    if (match.index > ultimoIndice) {
      partes.push(linea.slice(ultimoIndice, match.index));
    }

    partes.push({ text: match[1], bold: true });
    ultimoIndice = regexNegrita.lastIndex;
    match = regexNegrita.exec(linea);
  }

  if (ultimoIndice < linea.length) {
    partes.push(linea.slice(ultimoIndice));
  }

  if (partes.length === 0) {
    partes.push(linea);
  }

  return partes;
}

function buildDocDefinition(valoracion: ValoracionIAResponse) {
  const fechaGeneracion = new Date();
  const fechaVisible = fechaGeneracion.toLocaleString('es-ES');

  const contenido: Array<Record<string, unknown>> = [
    {
      text: 'Retroalimentación IA - Guía Docente',
      style: 'titulo',
    },
    {
      text: `Generado: ${fechaVisible}`,
      style: 'meta',
      margin: [0, 0, 0, 14],
    },
  ];

  if (valoracion.puntuacion != null) {
    contenido.push({
      text: `Puntuación general: ${valoracion.puntuacion}/10`,
      style: 'puntuacion',
      margin: [0, 0, 0, 14],
    });
  }

  if (valoracion.valoracion) {
    const lineas = limpiarSaltos(valoracion.valoracion).split('\n');

    contenido.push({ text: 'Valoración detallada', style: 'seccion' });

    lineas.forEach((linea) => {
      if (linea.trim() === '') {
        contenido.push({ text: ' ', margin: [0, 0, 0, 4] });
        return;
      }

      contenido.push({
        text: convertirNegritasMarkdown(linea),
        margin: [0, 0, 0, 4],
        style: 'texto',
      });
    });
  }

  if (valoracion.recomendaciones && valoracion.recomendaciones.length > 0) {
    contenido.push({
      text: 'Recomendaciones de mejora',
      style: 'seccion',
      margin: [0, 10, 0, 8],
    });

    contenido.push({
      ul: valoracion.recomendaciones.map((recomendacion) =>
        convertirNegritasMarkdown(recomendacion),
      ),
      style: 'texto',
      margin: [0, 0, 0, 6],
    });
  }

  return {
    pageMargins: [56, 48, 56, 56],
    content: contenido,
    defaultStyle: {
      fontSize: 11,
      color: '#1f2937',
      lineHeight: 1.35,
    },
    styles: {
      titulo: {
        fontSize: 18,
        bold: true,
        color: '#1e3a8a',
        margin: [0, 0, 0, 6],
      },
      meta: {
        fontSize: 10,
        color: '#6b7280',
      },
      puntuacion: {
        fontSize: 13,
        bold: true,
        color: '#1d4ed8',
      },
      seccion: {
        fontSize: 13,
        bold: true,
        color: '#0f172a',
        margin: [0, 8, 0, 6],
      },
      texto: {
        fontSize: 11,
      },
    },
  };
}

export function generarPDFValoracionIA(valoracion: ValoracionIAResponse) {
  if (!valoracion.success) {
    return;
  }

  if (!initVfs()) {
    return;
  }

  const fecha = new Date().toISOString().slice(0, 10);
  pdfMake
    .createPdf(buildDocDefinition(valoracion))
    .download(`retroalimentacion-ia-${fecha}.pdf`);
}
