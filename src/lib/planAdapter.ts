/**
 * planAdapter.ts
 *
 * Valida la consistencia de referencias de un DegreePlan canónico:
 * las actividades formativas, sistemas de evaluación y learning outcomes
 * referenciados en módulos/materias/asignaturas deben existir en sus
 * catálogos respectivos.
 */

import type { DegreePlan } from '../types/degree';

/**
 * Comprueba que todos los IDs usados en módulos/materias/asignaturas
 * existan en sus catálogos. Emite warnings en consola pero no lanza
 * errores en producción.
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
        for (const loId of course.learningOutcomes ?? []) {
          if (!loIds.has(loId)) {
            warn(
              `Learning outcome "${loId}" en asignatura "${course.name}" no existe en el diccionario.`,
            );
          }
        }
      }
    }
  }
}
