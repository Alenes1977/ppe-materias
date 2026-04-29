import fs from 'fs';

const path = 'src/data/enfermeria-plan.json';
const raw = fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
const plan = JSON.parse(raw);

function nameToId(items) {
  const m = new Map();
  for (const item of items) {
    m.set(item.name, item.id);
  }
  return m;
}

const afMap = nameToId(plan.trainingActivities);
const mdMap = nameToId(plan.teachingMethodologies);
const seMap = nameToId(plan.evaluationSystems);

function mapLbl(map, v, ctx) {
  if (map.has(v)) return map.get(v);
  if (/^(AF|MD|SE)\d+$/.test(v)) return v;
  throw new Error(`${ctx}: unknown "${v}"`);
}

for (let mi = 1; mi < plan.modules.length; mi++) {
  for (const subj of plan.modules[mi].subjects) {
    subj.trainingActivities = subj.trainingActivities.map((x) =>
      mapLbl(afMap, x, subj.name),
    );
    if (Array.isArray(subj.teachingMethodologies)) {
      subj.teachingMethodologies = subj.teachingMethodologies.map((x) =>
        mapLbl(mdMap, x, subj.name),
      );
    }
    for (const ev of subj.evaluation) {
      ev.system = mapLbl(seMap, ev.system, subj.name);
    }
    for (const course of subj.courses) {
      if (course.evaluation) {
        for (const ev of course.evaluation) {
          ev.system = mapLbl(seMap, ev.system, `${course.name} / ${subj.name}`);
        }
      }
    }
  }
}

fs.writeFileSync(path, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
console.log('OK');
