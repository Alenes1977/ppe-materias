/**
 * Script de un solo uso: normaliza ppe2017.json al esquema canónico DegreePlan.
 * Ejecutar con: node scripts/normalize-ppe2017.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '../src/data/ppe2017.json');
const dest = join(__dirname, '../src/data/ppe2017-plan.json');

const raw = JSON.parse(readFileSync(src, 'utf8'));

// ── 1. Recopilar strings únicos de actividades y evaluación ─────────────────
const activitySet = new Set();
const evalSet = new Set();

for (const modulo of raw.modulos) {
  for (const materia of modulo.materias) {
    for (const a of materia['actividad-formativa'] ?? []) activitySet.add(a);
    for (const e of materia['evaluacion'] ?? []) evalSet.add(e.tipo);
    // Asignaturas con evaluación propia
    for (const asig of materia.asignaturas ?? []) {
      for (const e of asig['evaluacion'] ?? []) evalSet.add(e.tipo);
    }
  }
}

// ── 2. Generar catálogos con IDs ─────────────────────────────────────────────
const activities = [...activitySet].map((name, i) => ({
  id: `AF${i + 1}`,
  name,
  description: '',
}));

const evaluations = [...evalSet].map((name, i) => ({
  id: `SE${i + 1}`,
  name,
  description: '',
}));

const actByName = Object.fromEntries(activities.map((a) => [a.name, a.id]));
const evalByName = Object.fromEntries(evaluations.map((e) => [e.name, e.id]));

// ── 3. Normalizar semestre ───────────────────────────────────────────────────
function normalizeSemester(s) {
  if (s === 'anual' || s === 'annual') return 'annual';
  const n = parseInt(s, 10);
  return isNaN(n) ? 'annual' : n;
}

// ── 4. Construir módulos canónicos ───────────────────────────────────────────
const modules = raw.modulos.map((modulo) => ({
  name: modulo.nombre,
  ects: parseInt(modulo.ects, 10) || modulo.ects,
  subjects: modulo.materias.map((materia) => ({
    name: materia.nombre,
    ects: parseInt(materia.ECTS, 10) || materia.ECTS,
    trainingActivities: (materia['actividad-formativa'] ?? []).map(
      (a) => actByName[a] ?? a,
    ),
    evaluation: (materia['evaluacion'] ?? []).map((e) => ({
      system: evalByName[e.tipo] ?? e.tipo,
      minWeight: e['ponderacion-minima'] ?? '0%',
      maxWeight: e['ponderacion-maxima'] ?? '100%',
    })),
    learningOutcomes: materia.competencias ?? materia.resultados_aprendizaje ?? [],
    courses: (materia.asignaturas ?? []).map((asig) => {
      const entry = {
        name: asig.nombre,
        type: asig.tipo ?? 'Obligatoria',
        year: parseInt(asig.curso, 10) || asig.curso,
        semester: normalizeSemester(asig.semestre),
        ects: asig.ects,
        learningOutcomes: asig.competencias ?? asig.resultados_aprendizaje ?? [],
      };
      if (asig.evaluacion?.length) {
        entry.evaluation = asig.evaluacion.map((e) => ({
          system: evalByName[e.tipo] ?? e.tipo,
          minWeight: e['ponderacion-minima'] ?? '0%',
          maxWeight: e['ponderacion-maxima'] ?? '100%',
        }));
      }
      return entry;
    }),
  })),
}));

// ── 5. Resultado final ────────────────────────────────────────────────────────
const plan = {
  schemaVersion: 1,
  learningOutcomes: raw.competencias,
  trainingActivities: activities,
  teachingMethodologies: [],
  evaluationSystems: evaluations,
  modules,
};

writeFileSync(dest, JSON.stringify(plan, null, 2), 'utf8');
console.log(`✓ ppe2017-plan.json generado en ${dest}`);
console.log(`  - ${activities.length} actividades formativas`);
console.log(`  - ${evaluations.length} sistemas de evaluación`);
console.log(`  - ${modules.length} módulos`);
