/**
 * planAdapter.ts
 *
 * Convierte el esquema legacy de ppe.json al esquema canónico DegreePlan.
 * También valida la consistencia de referencias (actividades, sistemas de
 * evaluación y learningOutcomes deben existir en sus catálogos).
 *
 * Para ppe2017-plan.json, que ya sigue el esquema canónico, se usa directamente
 * este mismo validador de referencias sin conversión.
 */

import type {
  DegreePlan,
  TrainingActivity,
  EvaluationSystem,
  TeachingMethodology,
  ModuleData,
  SubjectGroup,
  CourseEntry,
  EvaluationEntry,
  Semester,
} from '../types/degree';

// ── Tipos del esquema legacy (ppe.json) ──────────────────────────────────────

interface LegacyActivity {
  id: string;
  nombre: string;
  descripcion: string;
}

interface LegacyMethodology {
  id: string;
  nombre: string;
  descripcion: string;
}

interface LegacyEvalSystem {
  id: string;
  nombre: string;
  descripcion: string;
}

interface LegacyEvalEntry {
  tipo: string;
  'ponderacion-minima': string;
  'ponderacion-maxima': string;
}

interface LegacyAsignatura {
  nombre: string;
  tipo?: string;
  curso: number;
  semestre: number | string;
  ects: number;
  evaluacion?: LegacyEvalEntry[];
}

interface LegacyMateria {
  nombre: string;
  ECTS: number | string;
  'actividad-formativa': string[];
  evaluacion: LegacyEvalEntry[];
  resultados_aprendizaje?: string[];
  asignaturas: LegacyAsignatura[];
}

interface LegacyModulo {
  nombre: string;
  ects: number;
  materias: LegacyMateria[];
}

interface LegacyPlan {
  resultados_aprendizaje: Record<string, string>;
  actividades_formativas: LegacyActivity[];
  metodologias_docentes?: LegacyMethodology[];
  sistemas_evaluacion: LegacyEvalSystem[];
  modulos: LegacyModulo[];
}

// ── Normalización de semestre ────────────────────────────────────────────────

function normalizeSemester(s: number | string): Semester {
  if (s === 'anual' || s === 'annual') return 'annual';
  const n = typeof s === 'number' ? s : parseInt(s as string, 10);
  if (n === 1) return 1;
  if (n === 2) return 2;
  return 'annual';
}

// ── Conversión ───────────────────────────────────────────────────────────────

export function adaptLegacyPlan(raw: unknown): DegreePlan {
  const legacy = raw as LegacyPlan;

  const trainingActivities: TrainingActivity[] = (
    legacy.actividades_formativas ?? []
  ).map((a) => ({ id: a.id, name: a.nombre, description: a.descripcion }));

  const teachingMethodologies: TeachingMethodology[] = (
    legacy.metodologias_docentes ?? []
  ).map((m) => ({ id: m.id, name: m.nombre, description: m.descripcion }));

  const evaluationSystems: EvaluationSystem[] = (
    legacy.sistemas_evaluacion ?? []
  ).map((s) => ({ id: s.id, name: s.nombre, description: s.descripcion }));

  const modules: ModuleData[] = (legacy.modulos ?? []).map((modulo) => ({
    name: modulo.nombre,
    ects: modulo.ects,
    subjects: (modulo.materias ?? []).map((materia) => {
      const evalEntries: EvaluationEntry[] = (materia.evaluacion ?? []).map(
        (e) => ({
          system: e.tipo,
          minWeight: e['ponderacion-minima'],
          maxWeight: e['ponderacion-maxima'],
        }),
      );

      const courses: CourseEntry[] = (materia.asignaturas ?? []).map((asig) => {
        const entry: CourseEntry = {
          name: asig.nombre,
          type: asig.tipo ?? 'Obligatoria',
          year: asig.curso,
          semester: normalizeSemester(asig.semestre),
          ects: asig.ects,
        };
        if (asig.evaluacion?.length) {
          entry.evaluation = asig.evaluacion.map((e) => ({
            system: e.tipo,
            minWeight: e['ponderacion-minima'],
            maxWeight: e['ponderacion-maxima'],
          }));
        }
        return entry;
      });

      const subject: SubjectGroup = {
        name: materia.nombre,
        ects:
          typeof materia.ECTS === 'string'
            ? parseInt(materia.ECTS, 10)
            : materia.ECTS,
        trainingActivities: materia['actividad-formativa'] ?? [],
        evaluation: evalEntries,
        learningOutcomes: materia.resultados_aprendizaje ?? [],
        courses,
      };
      return subject;
    }),
  }));

  const plan: DegreePlan = {
    schemaVersion: 1,
    learningOutcomes: legacy.resultados_aprendizaje ?? {},
    trainingActivities,
    teachingMethodologies,
    evaluationSystems,
    modules,
  };

  validateReferences(plan);
  return plan;
}

// ── Validación de referencias ────────────────────────────────────────────────

/**
 * Comprueba que todos los IDs usados en módulos/materias existan en sus
 * catálogos. Emite warnings en consola pero no lanza errores en producción.
 */
export function validateReferences(plan: DegreePlan): void {
  const activityIds = new Set(plan.trainingActivities.map((a) => a.id));
  const evalIds = new Set(plan.evaluationSystems.map((s) => s.id));
  const loIds = new Set(Object.keys(plan.learningOutcomes));

  const warn = (msg: string) => console.warn(`[planAdapter] ${msg}`);

  for (const mod of plan.modules) {
    for (const subj of mod.subjects) {
      for (const afId of subj.trainingActivities) {
        if (!activityIds.has(afId)) {
          warn(
            `Actividad "${afId}" en materia "${subj.name}" no existe en el catálogo.`,
          );
        }
      }
      for (const evalEntry of subj.evaluation) {
        if (!evalIds.has(evalEntry.system)) {
          warn(
            `Sistema de evaluación "${evalEntry.system}" en materia "${subj.name}" no existe en el catálogo.`,
          );
        }
      }
      for (const loId of subj.learningOutcomes) {
        if (!loIds.has(loId)) {
          warn(
            `Learning outcome "${loId}" en materia "${subj.name}" no existe en el diccionario.`,
          );
        }
      }
      for (const course of subj.courses) {
        for (const evalEntry of course.evaluation ?? []) {
          if (!evalIds.has(evalEntry.system)) {
            warn(
              `Sistema de evaluación "${evalEntry.system}" en asignatura "${course.name}" no existe en el catálogo.`,
            );
          }
        }
      }
    }
  }
}
