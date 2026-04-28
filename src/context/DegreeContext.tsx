import { createContext, useContext, useMemo, type FC, type ReactNode } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DEGREES, getDegree } from '../data/degrees';
import { getSubjectsFromPlan } from '../lib/dataUtils';
import type { DegreeInfo, DegreePlan, LearningOutcomeLabel } from '../types/degree';
import type { ProcessedSubject } from '../lib/dataUtils';

const LAST_DEGREE_KEY = 'lastDegreeId';

// ── Tipos del contexto ────────────────────────────────────────────────────────

interface DegreeContextValue {
  degreeInfo: DegreeInfo;
  degreePlan: DegreePlan;
  /** Lista plana de asignaturas/cursos procesados */
  subjects: ProcessedSubject[];
  /** Acceso directo a las etiquetas de learning outcomes */
  labelLO: LearningOutcomeLabel;
}

// ── Contexto ──────────────────────────────────────────────────────────────────

export const DegreeContext = createContext<DegreeContextValue | null>(null);

export function useDegree(): DegreeContextValue {
  const ctx = useContext(DegreeContext);
  if (!ctx) {
    throw new Error('useDegree must be used inside <DegreeLayout>');
  }
  return ctx;
}

// ── Layout wrapper (:degreeId/*) ──────────────────────────────────────────────

/**
 * Montado como layout de la ruta /:degreeId/*.
 * Lee el degreeId desde la URL, valida que exista en el registro y provee
 * el contexto a todos los hijos. Si el ID es inválido redirige a /.
 */
export const DegreeLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { degreeId } = useParams<{ degreeId: string }>();
  const entry = degreeId ? getDegree(degreeId) : undefined;

  if (!entry) {
    return <Navigate to="/" replace />;
  }

  // Persistir el último grado elegido para la redirección desde /
  try {
    localStorage.setItem(LAST_DEGREE_KEY, degreeId!);
  } catch {}

  return (
    <DegreeProviderInner meta={entry.meta} plan={entry.plan}>
      {children}
    </DegreeProviderInner>
  );
};

// ── Provider interno (separado para memoización limpia) ───────────────────────

const DegreeProviderInner: FC<{
  meta: DegreeInfo;
  plan: DegreePlan;
  children: ReactNode;
}> = ({ meta, plan, children }) => {
  const subjects = useMemo(() => getSubjectsFromPlan(plan), [plan]);

  const value: DegreeContextValue = {
    degreeInfo: meta,
    degreePlan: plan,
    subjects,
    labelLO: meta.learningOutcomeLabel,
  };

  return (
    <DegreeContext.Provider value={value}>{children}</DegreeContext.Provider>
  );
};

// ── Helpers exportados ────────────────────────────────────────────────────────

/** Lista de todos los grados disponibles para la pantalla de selección */
export { DEGREES };

/** Devuelve el último degreeId guardado en localStorage, si existe */
export function getLastDegreeId(): string | null {
  try {
    const id = localStorage.getItem(LAST_DEGREE_KEY);
    return id && getDegree(id) ? id : null;
  } catch {
    return null;
  }
}
