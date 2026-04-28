import type { DegreePlan, Semester } from '../types/degree';
import { slugify } from '../lib/utils';

// ── Tipos exportados ──────────────────────────────────────────────────────────

export interface Evaluacion {
  /** ID del sistema de evaluación */
  tipo: string;
  'ponderacion-minima': string;
  'ponderacion-maxima': string;
}

export interface ActividadFormativa {
  nombre: string;
}

/**
 * Representación plana de una asignatura/curso, enriquecida con el contexto
 * de su materia y módulo. Usada en el asistente y en los listados.
 */
export interface ProcessedSubject {
  id: string;
  nombre: string;
  curso: number;
  semestre: Semester;
  ects: number;
  materia: string;
  modulo: string;
  /** IDs de actividades formativas de la materia */
  'actividad-formativa': string[];
  /** Sistemas de evaluación (de la asignatura si los tiene, o de la materia) */
  evaluacion: Evaluacion[];
  /** IDs de learning outcomes asociados a la materia */
  resultados_aprendizaje: string[];
}

/** @deprecated Usa ProcessedSubject */
export type AsignaturaProcesada = ProcessedSubject;

// ── Función pura ──────────────────────────────────────────────────────────────

/**
 * Extrae una lista plana de asignaturas/cursos desde un DegreePlan canónico.
 * No cachea: la caché vive en DegreeContext (useMemo sobre el plan activo).
 */
export function getSubjectsFromPlan(plan: DegreePlan): ProcessedSubject[] {
  const list: ProcessedSubject[] = [];

  for (const modulo of plan.modules) {
    for (const materia of modulo.subjects) {
      if (materia.name === 'Optativas') continue;

      for (const course of materia.courses) {
        if (course.name === 'Optativas') continue;

        const evalEntries: Evaluacion[] = (
          course.evaluation ?? materia.evaluation
        ).map((e) => ({
          tipo: e.system,
          'ponderacion-minima': e.minWeight,
          'ponderacion-maxima': e.maxWeight,
        }));

        list.push({
          id: slugify(course.name),
          nombre: course.name,
          curso: course.year,
          semestre: course.semester,
          ects: course.ects,
          materia: materia.name,
          modulo: modulo.name,
          'actividad-formativa': materia.trainingActivities,
          evaluacion: evalEntries,
          resultados_aprendizaje: materia.learningOutcomes,
        });
      }
    }
  }

  return list.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

/**
 * Busca una asignatura por slug en una lista ya procesada.
 */
export function getSubjectById(
  subjects: ProcessedSubject[],
  id: string,
): ProcessedSubject | undefined {
  return subjects.find((s) => s.id === id);
}

// ── Compatibilidad con código que usaba getAsignaturas() ─────────────────────
// Los componentes que aún llamen a getAsignaturas() recibirán un error claro
// para que se migren a useDegree().subjects.
export function getAsignaturas(): never {
  throw new Error(
    'getAsignaturas() ha sido eliminado. Usa useDegree().subjects en su lugar.',
  );
}
export function getAsignaturaById(): never {
  throw new Error(
    'getAsignaturaById() ha sido eliminado. Usa getSubjectById(subjects, id) en su lugar.',
  );
}
