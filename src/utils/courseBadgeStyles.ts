import type { Semester } from '../types/degree';

const SM_PAD = 'px-2 py-0.5 text-xs sm:px-2.5';
const MD_PAD = 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm';

/** Cuatro tonos que rotan si hay más cursos (5º, 6º…): cielo, índigo, teal, pizarra */
const CURSO_TONES = [
  'border-sky-200/70 bg-sky-100 text-sky-900',
  'border-indigo-200/70 bg-indigo-100 text-indigo-900',
  'border-teal-200/70 bg-teal-100 text-teal-900',
  'border-slate-300/80 bg-slate-200 text-slate-900',
] as const;

function cursoToneIndex(year: number): number {
  return (Math.max(1, year) - 1) % CURSO_TONES.length;
}

function padding(size: 'sm' | 'md'): string {
  return size === 'md' ? MD_PAD : SM_PAD;
}

/** Pill de curso académico (1º, 2º…) */
export function courseYearPillClass(
  year: number,
  size: 'sm' | 'md' = 'sm',
): string {
  const tone = CURSO_TONES[cursoToneIndex(year)];
  return `inline-flex items-center rounded-full border font-medium ${padding(
    size,
  )} ${tone}`;
}

/** Pill de período: 1er cuatri, 2º cuatri, anual */
export function semesterPillClass(
  semester: Semester,
  size: 'sm' | 'md' = 'sm',
): string {
  let tone: string;
  if (semester === 'annual' || semester === ('anual' as Semester)) {
    tone = 'border-orange-200/70 bg-orange-100 text-orange-900';
  } else if (semester === 1) {
    tone = 'border-emerald-200/70 bg-emerald-100 text-emerald-900';
  } else {
    tone = 'border-cyan-200/70 bg-cyan-100 text-cyan-900';
  }
  return `inline-flex items-center rounded-full border font-medium ${padding(
    size,
  )} ${tone}`;
}

/** ECTS: mismo aspecto en toda la app */
export function ectsPillClass(size: 'sm' | 'md' = 'sm'): string {
  return `inline-flex items-center rounded-full border border-zinc-200/80 bg-zinc-100 font-medium text-zinc-800 ${padding(
    size,
  )}`;
}
