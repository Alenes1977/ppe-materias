import type { DegreeInfo, DegreePlan } from '../types/degree';
import { validateReferences } from '../lib/planAdapter';

import ppeMeta from './ppe-meta.json';
import ppePlanRaw from './ppe-plan.json';
import ppe2017Meta from './ppe2017-meta.json';
import ppe2017PlanRaw from './ppe2017-plan.json';
import enfermeriaMeta from './enfermeria-meta.json';
import enfermeriaPlanRaw from './enfermeria-plan.json';

export interface DegreeEntry {
  meta: DegreeInfo;
  plan: DegreePlan;
}

const ppePlan = ppePlanRaw as unknown as DegreePlan;
validateReferences(ppePlan);

const ppe2017Plan = ppe2017PlanRaw as unknown as DegreePlan;
validateReferences(ppe2017Plan);

const enfermeriaPlan = enfermeriaPlanRaw as unknown as DegreePlan;
validateReferences(enfermeriaPlan);

export const DEGREES: Record<string, DegreeEntry> = {
  ppe: {
    meta: ppeMeta as DegreeInfo,
    plan: ppePlan,
  },
  'ppe-2017': {
    meta: ppe2017Meta as DegreeInfo,
    plan: ppe2017Plan,
  },
  enfermeria: {
    meta: enfermeriaMeta as DegreeInfo,
    plan: enfermeriaPlan,
  },
};

export const DEGREE_IDS = Object.keys(DEGREES) as (keyof typeof DEGREES)[];

export function getDegree(id: string): DegreeEntry | undefined {
  return DEGREES[id];
}
