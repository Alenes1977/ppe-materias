import type { FC } from 'react';

/** Valor canónico de `course.type` para TFG en los planes JSON */
export const COURSE_TYPE_TFG = 'Trabajo Fin de Grado';

const TYPE_CLASSES: Record<string, string> = {
  Básica: 'border-amber-200/70 bg-amber-100 text-amber-900',
  Obligatoria: 'border-violet-200/70 bg-violet-100 text-violet-900',
  Optativa: 'border-green-200/70 bg-green-100 text-green-900',
  [COURSE_TYPE_TFG]: 'border-rose-200/70 bg-rose-100 text-rose-900',
};

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs font-medium',
  md: 'px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm',
} as const;

export interface CourseTypePillProps {
  type: string | null | undefined;
  /** `sm` para listas; `md` para cabeceras destacadas */
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}

export const CourseTypePill: FC<CourseTypePillProps> = ({
  type,
  size = 'sm',
  className = '',
}) => {
  const label = (type?.trim() || 'Obligatoria') as string;
  const colors =
    TYPE_CLASSES[label] ?? 'border-slate-200/70 bg-slate-100 text-slate-800';
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border ${SIZE_CLASSES[size]} ${colors} ${className}`.trim()}
    >
      {label}
    </span>
  );
};
