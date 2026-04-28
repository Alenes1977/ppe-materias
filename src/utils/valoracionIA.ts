import type { GuiaDocenteData } from '../components/AsistenteGuiaDocente';
import type { ProcessedSubject } from '../lib/dataUtils';
import type { DegreeInfo, DegreePlan } from '../types/degree';

/** @deprecated Usa ProcessedSubject */
type AsignaturaProcesada = ProcessedSubject;

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
  degreeInfo: DegreeInfo,
  degreePlan: DegreePlan,
): Promise<ValoracionIAResponse> {
  try {
    const loDict = degreePlan.learningOutcomes;
    const loLabel = degreeInfo.learningOutcomeLabel;

    const guiaCompleta = {
      degreeId: degreeInfo.id,
      degreeName: degreeInfo.name,
      learningOutcomeLabel: loLabel.plural,
      planSchemaVersion: 2,
      asignatura: {
        nombre: asignatura.nombre,
        modulo: asignatura.modulo,
        materia: asignatura.materia,
        ects: asignatura.ects,
        curso: asignatura.curso,
        semestre: asignatura.semestre,
        [loLabel.plural]:
          asignatura.resultados_aprendizaje?.map((id) => ({
            id,
            descripcion: loDict[id] ?? 'Descripción no encontrada',
          })) ?? [],
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
