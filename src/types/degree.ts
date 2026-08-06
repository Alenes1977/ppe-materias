export interface LearningOutcomeLabel {
  singular: string;
  plural: string;
  acronym: string;
}

export interface DegreeInfo {
  id: string;
  name: string;
  shortName: string;
  university: string;
  ructCode?: string;
  anecaVerified: boolean;
  verificationYear?: string;
  lastUpdated?: string;
  primaryColor: string;
  learningOutcomeLabel: LearningOutcomeLabel;
}

/** Semestre de una asignatura: 1, 2 o anual */
export type Semester = 1 | 2 | 'annual';

export interface TrainingActivity {
  id: string;
  name: string;
  description: string;
}

export interface EvaluationSystem {
  id: string;
  name: string;
  description: string;
}

export interface TeachingMethodology {
  id: string;
  name: string;
  description: string;
}

export interface EvaluationEntry {
  /** ID referenciando a evaluationSystems */
  system: string;
  minWeight: string;
  maxWeight: string;
}

export interface CourseEntry {
  name: string;
  /** "Obligatoria" | "Optativa" | "Básica" | "Trabajo Fin de Grado" | etc. */
  type: string;
  year: number;
  semester: Semester;
  ects: number;
  /** Evaluación propia de la asignatura (si difiere de la materia) */
  evaluation?: EvaluationEntry[];
  /** Competencias/resultados propios de la asignatura (si difieren de la materia) */
  learningOutcomes?: string[];
}

export interface SubjectGroup {
  name: string;
  ects: number;
  /** IDs de TrainingActivity */
  trainingActivities: string[];
  /** IDs de TeachingMethodology (opcional) */
  teachingMethodologies?: string[];
  evaluation: EvaluationEntry[];
  /** IDs de learningOutcomes del plan */
  learningOutcomes: string[];
  courses: CourseEntry[];
}

export interface ModuleData {
  name: string;
  ects: number;
  subjects: SubjectGroup[];
}

export interface DegreePlan {
  schemaVersion: number;
  /** Diccionario ID → texto de cada resultado/competencia */
  learningOutcomes: Record<string, string>;
  trainingActivities: TrainingActivity[];
  /** Campo opcional: puede ser [] si el plan no los define */
  teachingMethodologies: TeachingMethodology[];
  evaluationSystems: EvaluationSystem[];
  modules: ModuleData[];
}
