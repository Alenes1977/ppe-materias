import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(
  new URL('../src/lib/creditSummary.ts', import.meta.url),
  'utf8',
);
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const { getCreditSummary } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

function readPlan(name) {
  return JSON.parse(
    readFileSync(
      new URL(`../src/data/${name}-plan.json`, import.meta.url),
      'utf8',
    ).replace(/^\uFEFF/, ''),
  );
}

test('Gestión Aplicada: 240 ECTS con un único bloque optativo de 24', () => {
  const plan = readPlan('gestion-aplicada');
  const original = JSON.stringify(plan);
  const summary = getCreditSummary(plan.modules);
  assert.equal(summary.ectsTotal, 240);
  assert.equal(summary.ectsBasicas, 60);
  assert.equal(summary.ectsObligatorias, 150);
  assert.equal(summary.ectsOptativas, 24);
  assert.equal(summary.ectsTrabajoFinGrado, 6);
  assert.equal(summary.ectsOtros, 0);
  assert.equal(summary.electiveChoices.length, 1);
  assert.equal(summary.electiveChoices[0].offered, 48);
  assert.deepEqual(summary.electiveChoices[0].options, [
    'Prácticas Académicas Externas',
    'Intercambio Académico',
  ]);
  assert.equal(
    JSON.stringify(plan),
    original,
    'Conserva ambas opciones del plan',
  );

  const courses = plan.modules.flatMap((m) =>
    m.subjects.flatMap((s) => s.courses),
  );
  for (const option of summary.electiveChoices[0].options) {
    const selected = courses.filter(
      (c) => c.type !== 'Optativa' || c.name === option,
    );
    for (let year = 1; year <= 4; year++) {
      assert.equal(
        selected
          .filter((c) => c.year === year)
          .reduce((sum, c) => sum + c.ects, 0),
        60,
        `${option}, curso ${year}`,
      );
    }
  }
});

for (const degree of ['ppe', 'ppe2017', 'enfermeria']) {
  test(`${degree}: mantiene los créditos de las asignaturas`, () => {
    const plan = readPlan(degree);
    const summary = getCreditSummary(plan.modules);
    const courses = plan.modules.flatMap((m) =>
      m.subjects.flatMap((s) => s.courses),
    );
    assert.equal(summary.ectsTotal, 240);
    assert.equal(summary.electiveChoices.length, 0);
    for (const [type, key] of [
      ['Básica', 'ectsBasicas'],
      ['Obligatoria', 'ectsObligatorias'],
      ['Optativa', 'ectsOptativas'],
      ['Trabajo Fin de Grado', 'ectsTrabajoFinGrado'],
    ]) {
      assert.equal(
        summary[key],
        courses
          .filter((c) => c.type === type)
          .reduce((sum, c) => sum + c.ects, 0),
      );
    }
  });
}

test('Un módulo obligatorio discrepante no se recorta como si fueran alternativas', () => {
  const summary = getCreditSummary([
    {
      name: 'Obligatorias',
      ects: 6,
      subjects: [{ courses: [{ name: 'A', type: 'Obligatoria', ects: 12 }] }],
    },
  ]);
  assert.equal(summary.ectsTotal, 12);
  assert.equal(summary.electiveChoices.length, 0);
});

test('El editor admite módulos vacíos y oferta optativa todavía incompleta', () => {
  assert.equal(getCreditSummary([]).ectsTotal, 0);
  const summary = getCreditSummary([
    {
      name: 'Optativas',
      ects: 24,
      subjects: [{ courses: [{ name: 'A', type: 'Optativa', ects: 6 }] }],
    },
  ]);
  assert.equal(summary.ectsTotal, 6);
  assert.equal(summary.electiveChoices.length, 0);
});
