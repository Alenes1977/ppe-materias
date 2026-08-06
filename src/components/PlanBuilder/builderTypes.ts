export type Semester = '1' | '2' | 'annual';

export interface MetaFormState {
  id: string;
  name: string;
  shortName: string;
  university: string;
  ructCode: string;
  anecaVerified: boolean;
  verificationYear: string;
  lastUpdated: string;
  primaryColor: string;
  loSingular: string;
  loPlural: string;
  loAcronym: string;
}

export interface LOEntry {
  _key: string;
  id: string;
  text: string;
}

export interface CatalogItem {
  _key: string;
  id: string;
  name: string;
  description: string;
}

export interface EvalEntry {
  _key: string;
  system: string;
  minWeight: string;
  maxWeight: string;
}

export interface CourseFormState {
  _key: string;
  name: string;
  type: string;
  year: number;
  semester: Semester;
  ects: number;
  hasOwnEval: boolean;
  evaluation: EvalEntry[];
  hasOwnLO: boolean;
  learningOutcomes: string[];
  expanded: boolean;
}

export interface SubjectFormState {
  _key: string;
  name: string;
  ects: number;
  trainingActivities: string[];
  evaluation: EvalEntry[];
  learningOutcomes: string[];
  courses: CourseFormState[];
  expanded: boolean;
}

export interface ModuleFormState {
  _key: string;
  name: string;
  ects: number;
  subjects: SubjectFormState[];
  expanded: boolean;
}
