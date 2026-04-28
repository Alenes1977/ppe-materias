import type { DegreeInfo, DegreePlan } from '../types/degree';
import { adaptLegacyPlan, validateReferences } from '../lib/planAdapter';

import ppeMeta from './ppe-meta.json';
import ppeLegacyRaw from './ppe.json';
import ppe2017Meta from './ppe2017-meta.json';
import ppe2017PlanRaw from './ppe2017-plan.json';

export interface DegreeEntry {
  meta: DegreeInfo;
  plan: DegreePlan;
}

const ppe2017Plan = ppe2017PlanRaw as unknown as DegreePlan;
validateReferences(ppe2017Plan);

export const DEGREES: Record<string, DegreeEntry> = {
  ppe: {
    meta: ppeMeta as DegreeInfo,
    plan: adaptLegacyPlan(ppeLegacyRaw),
  },
  'ppe-2017': {
    meta: ppe2017Meta as DegreeInfo,
    plan: ppe2017Plan,
  },
};

export const DEGREE_IDS = Object.keys(DEGREES) as (keyof typeof DEGREES)[];

export function getDegree(id: string): DegreeEntry | undefined {
  return DEGREES[id];
}
