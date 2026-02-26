import type { GuiaDocenteData } from '../components/AsistenteGuiaDocente';
import type { AsignaturaProcesada } from '../lib/dataUtils';
import ppeData from '../data/ppe.json';

const competenciasDict: Record<string, string> = (
  ppeData as { resultados_aprendizaje: Record<string, string> }
).resultados_aprendizaje;

export interface ValoracionIAResponse {
  success: boolean;
  valoracion?: string;
  recomendaciones?: string[];
  puntuacion?: number;
  error?: string;
}

export async function enviarGuiaParaValoracion(
  guia: GuiaDocenteData,
  asignatura: AsignaturaProcesada,
): Promise<ValoracionIAResponse> {
  try {
    // Organizar toda la información de la guía como JSON
    const guiaCompleta = {
      asignatura: {
        nombre: asignatura.nombre,
        modulo: asignatura.modulo,
        materia: asignatura.materia,
        ects: asignatura.ects,
        curso: asignatura.curso,
        semestre: asignatura.semestre,
        competencias:
          asignatura.resultados_aprendizaje?.map((codigo) => ({
            codigo,
            descripcion:
              competenciasDict[codigo] || 'Descripción no encontrada',
          })) || [],
      },
      presentacion: {
        profesores: guia.presentacion.profesores,
        idioma: guia.presentacion.idioma,
        aula: guia.presentacion.aula,
        horario: guia.presentacion.horario,
        resumen: guia.presentacion.resumen,
      },
      programa: guia.programa,
      actividades: guia.actividades,
      evaluacion: guia.evaluacion,
      convocatoriaExtra: guia.convocatoriaExtra,
      horarioAtencion: guia.horario,
      bibliografia: guia.bibliografia,
      timestamp: new Date().toISOString(),
    };

    // Enviar al webhook de n8n
    const response = await fetch(
      'https://n8n.alejandronestor.eu/webhook/asistente-guia-unav',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(guiaCompleta),
      },
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const resultado = await response.json();

    // Manejar la estructura anidada de n8n
    const valoracionTexto =
      resultado.response?.body?.output ||
      resultado.output ||
      resultado.valoracion;

    return {
      success: true,
      valoracion: valoracionTexto,
      recomendaciones: resultado.recomendaciones,
      puntuacion: resultado.puntuacion,
    };
  } catch (error) {
    console.error('Error al enviar guía para valoración:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
