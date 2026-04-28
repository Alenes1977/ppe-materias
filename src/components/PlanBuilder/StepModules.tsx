import type React from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faChevronDown,
  faChevronRight,
  faInfoCircle,
  faLayerGroup,
  faBook,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import type {
  ModuleFormState,
  SubjectFormState,
  CourseFormState,
  EvalEntry,
  CatalogItem,
  LOEntry,
} from './builderTypes';

const uid = () => Math.random().toString(36).slice(2, 9);

const COURSE_TYPES = [
  'Obligatoria',
  'Optativa',
  'Básica',
  'Optativa de especialización',
  'Trabajo Fin de Grado',
  'Prácticum',
];

const inputCls =
  'w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

// ── Tabla de evaluación (reutilizable en materia y asignatura) ────────────────

interface EvalTableProps {
  entries: EvalEntry[];
  evaluationSystems: CatalogItem[];
  onChange: (entries: EvalEntry[]) => void;
}

const EvalTable: React.FC<EvalTableProps> = ({
  entries,
  evaluationSystems,
  onChange,
}) => {
  const add = () =>
    onChange([
      ...entries,
      { _key: uid(), system: '', minWeight: '', maxWeight: '' },
    ]);

  const update = <K extends keyof Omit<EvalEntry, '_key'>>(
    key: string,
    field: K,
    value: EvalEntry[K],
  ) =>
    onChange(
      entries.map((e) => (e._key === key ? { ...e, [field]: value } : e)),
    );

  const remove = (key: string) =>
    onChange(entries.filter((e) => e._key !== key));

  return (
    <div className="space-y-2">
      {entries.map((e) => (
        <div
          key={e._key}
          className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
        >
          <select
            value={e.system}
            onChange={(ev) => update(e._key, 'system', ev.target.value)}
            className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
          >
            <option value="">— Sistema —</option>
            {evaluationSystems.map((s) => (
              <option key={s._key} value={s.id}>
                {s.id}
                {s.name ? ` – ${s.name}` : ''}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={e.minWeight}
            onChange={(ev) => update(e._key, 'minWeight', ev.target.value)}
            className="w-16 rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            placeholder="Mín %"
          />
          <input
            type="text"
            value={e.maxWeight}
            onChange={(ev) => update(e._key, 'maxWeight', ev.target.value)}
            className="w-16 rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
            placeholder="Máx %"
          />
          <button
            type="button"
            onClick={() => remove(e._key)}
            className="rounded p-1 text-gray-400 hover:text-red-500"
          >
            <FontAwesomeIcon icon={faTrash} className="text-xs" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1 rounded-lg border border-dashed border-blue-300 px-3 py-1.5 text-xs text-blue-600 hover:border-blue-500 hover:bg-blue-50"
      >
        <FontAwesomeIcon icon={faPlus} />
        Añadir sistema de evaluación
      </button>
    </div>
  );
};

// ── Asignatura (CourseCard) ───────────────────────────────────────────────────

interface CourseCardProps {
  course: CourseFormState;
  evaluationSystems: CatalogItem[];
  learningOutcomes: LOEntry[];
  onUpdate: (updater: (c: CourseFormState) => CourseFormState) => void;
  onRemove: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  evaluationSystems,
  learningOutcomes,
  onUpdate,
  onRemove,
}) => {
  const set = <K extends keyof CourseFormState>(
    field: K,
    value: CourseFormState[K],
  ) => onUpdate((c) => ({ ...c, [field]: value }));

  const loOptions = learningOutcomes.map((lo) => ({
    value: lo.id,
    label: `${lo.id}: ${lo.text.slice(0, 70)}${lo.text.length > 70 ? '…' : ''}`,
  }));

  const selectedLO = loOptions.filter((o) =>
    course.learningOutcomes.includes(o.value),
  );

  return (
    <div className="overflow-hidden rounded-lg border border-indigo-100 bg-indigo-50/30">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-indigo-50"
        onClick={() => set('expanded', !course.expanded)}
      >
        <FontAwesomeIcon
          icon={course.expanded ? faChevronDown : faChevronRight}
          className="w-3 text-indigo-400"
        />
        <FontAwesomeIcon
          icon={faGraduationCap}
          className="text-xs text-indigo-400"
        />
        <span className="flex-1 truncate text-sm font-medium text-gray-700">
          {course.name || (
            <em className="font-normal text-gray-400">Nueva asignatura</em>
          )}
        </span>
        <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600">
          {course.type || '—'} · {course.ects || '?'} ECTS
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded p-1.5 text-gray-400 hover:text-red-500"
          title="Eliminar asignatura"
        >
          <FontAwesomeIcon icon={faTrash} className="text-xs" />
        </button>
      </div>

      {course.expanded ? (
        <div className="grid gap-3 border-t border-indigo-100 px-3 py-3 sm:grid-cols-6">
          {/* Nombre */}
          <div className="sm:col-span-3">
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Nombre
            </label>
            <input
              type="text"
              className={inputCls}
              value={course.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Nombre de la asignatura"
            />
          </div>
          {/* Tipo */}
          <div className="sm:col-span-3">
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Tipo
            </label>
            <select
              className={inputCls}
              value={course.type}
              onChange={(e) => set('type', e.target.value)}
            >
              <option value="">— Selecciona tipo —</option>
              {COURSE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {/* Curso */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Curso
            </label>
            <select
              className={inputCls}
              value={course.year}
              onChange={(e) => set('year', Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>
                  {y}º
                </option>
              ))}
            </select>
          </div>
          {/* Semestre */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Semestre
            </label>
            <select
              className={inputCls}
              value={course.semester}
              onChange={(e) =>
                set('semester', e.target.value as CourseFormState['semester'])
              }
            >
              <option value="1">1er semestre</option>
              <option value="2">2º semestre</option>
              <option value="annual">Anual</option>
            </select>
          </div>
          {/* ECTS */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-500">
              ECTS
            </label>
            <input
              type="number"
              className={inputCls}
              value={course.ects || ''}
              onChange={(e) => set('ects', Number(e.target.value))}
              min={1}
              max={60}
              placeholder="6"
            />
          </div>

          {/* Evaluación propia */}
          <div className="sm:col-span-6">
            <div className="mb-2 flex items-center gap-2">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={course.hasOwnEval}
                  onChange={(e) => set('hasOwnEval', e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer relative h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
              </label>
              <span className="text-xs font-medium text-gray-600">
                Evaluación propia (distinta de la materia)
              </span>
            </div>
            {course.hasOwnEval ? (
              <EvalTable
                entries={course.evaluation}
                evaluationSystems={evaluationSystems}
                onChange={(ev) => set('evaluation', ev)}
              />
            ) : null}
          </div>

          {/* Resultados propios */}
          <div className="sm:col-span-6">
            <div className="mb-2 flex items-center gap-2">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={course.hasOwnLO}
                  onChange={(e) => set('hasOwnLO', e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer relative h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
              </label>
              <span className="text-xs font-medium text-gray-600">
                Resultados / competencias propios (distintos de la materia)
              </span>
            </div>
            {course.hasOwnLO ? (
              <Select
                isMulti
                options={loOptions}
                value={selectedLO}
                onChange={(selected) =>
                  set(
                    'learningOutcomes',
                    selected.map((s) => s.value),
                  )
                }
                placeholder="Selecciona resultados…"
                classNamePrefix="rselect"
                noOptionsMessage={() => 'Sin resultados definidos'}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ── Materia (SubjectCard) ─────────────────────────────────────────────────────

interface SubjectCardProps {
  subject: SubjectFormState;
  trainingActivities: CatalogItem[];
  evaluationSystems: CatalogItem[];
  learningOutcomes: LOEntry[];
  onUpdate: (updater: (s: SubjectFormState) => SubjectFormState) => void;
  onRemove: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  trainingActivities,
  evaluationSystems,
  learningOutcomes,
  onUpdate,
  onRemove,
}) => {
  const set = <K extends keyof SubjectFormState>(
    field: K,
    value: SubjectFormState[K],
  ) => onUpdate((s) => ({ ...s, [field]: value }));

  const addCourse = () => {
    const newCourse: CourseFormState = {
      _key: uid(),
      name: '',
      type: 'Obligatoria',
      year: 1,
      semester: '1',
      ects: 6,
      hasOwnEval: false,
      evaluation: [],
      hasOwnLO: false,
      learningOutcomes: [],
      expanded: true,
    };
    onUpdate((s) => ({ ...s, courses: [...s.courses, newCourse] }));
  };

  const updateCourse = (
    key: string,
    updater: (c: CourseFormState) => CourseFormState,
  ) =>
    onUpdate((s) => ({
      ...s,
      courses: s.courses.map((c) => (c._key === key ? updater(c) : c)),
    }));

  const removeCourse = (key: string) =>
    onUpdate((s) => ({
      ...s,
      courses: s.courses.filter((c) => c._key !== key),
    }));

  const afOptions = trainingActivities.map((af) => ({
    value: af.id,
    label: `${af.id} – ${af.name}`,
  }));

  const loOptions = learningOutcomes.map((lo) => ({
    value: lo.id,
    label: `${lo.id}: ${lo.text.slice(0, 70)}${lo.text.length > 70 ? '…' : ''}`,
  }));

  const selectedAF = afOptions.filter((o) =>
    subject.trainingActivities.includes(o.value),
  );

  const selectedLO = loOptions.filter((o) =>
    subject.learningOutcomes.includes(o.value),
  );

  return (
    <div className="overflow-hidden rounded-xl border border-teal-200 bg-white shadow-sm">
      {/* Header materia */}
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-teal-50"
        onClick={() => set('expanded', !subject.expanded)}
      >
        <FontAwesomeIcon
          icon={subject.expanded ? faChevronDown : faChevronRight}
          className="w-3 text-teal-400"
        />
        <FontAwesomeIcon icon={faBook} className="text-sm text-teal-500" />
        <span className="flex-1 text-sm font-semibold text-gray-700">
          {subject.name || (
            <em className="font-normal text-gray-400">Nueva materia</em>
          )}
        </span>
        <span className="rounded bg-teal-100 px-2 py-0.5 text-xs text-teal-700">
          {subject.ects || '?'} ECTS · {subject.courses.length} asignaturas
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded p-1.5 text-gray-400 hover:text-red-500"
          title="Eliminar materia"
        >
          <FontAwesomeIcon icon={faTrash} className="text-xs" />
        </button>
      </div>

      {subject.expanded ? (
        <div className="space-y-5 border-t border-teal-100 px-4 py-4">
          {/* Nombre y ECTS */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Nombre de la materia
              </label>
              <input
                type="text"
                className={inputCls}
                value={subject.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="ej. Filosofía del conocimiento"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                ECTS totales
              </label>
              <input
                type="number"
                className={inputCls}
                value={subject.ects || ''}
                onChange={(e) => set('ects', Number(e.target.value))}
                min={1}
                placeholder="12"
              />
            </div>
          </div>

          {/* Actividades formativas */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Actividades formativas
            </label>
            <Select
              isMulti
              options={afOptions}
              value={selectedAF}
              onChange={(selected) =>
                set(
                  'trainingActivities',
                  selected.map((s) => s.value),
                )
              }
              placeholder="Selecciona actividades formativas…"
              classNamePrefix="rselect"
              noOptionsMessage={() => 'Sin actividades definidas en el paso 3'}
            />
          </div>

          {/* Resultados de aprendizaje */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              Resultados de aprendizaje / competencias
            </label>
            <Select
              isMulti
              options={loOptions}
              value={selectedLO}
              onChange={(selected) =>
                set(
                  'learningOutcomes',
                  selected.map((s) => s.value),
                )
              }
              placeholder="Selecciona resultados…"
              classNamePrefix="rselect"
              noOptionsMessage={() => 'Sin resultados definidos en el paso 2'}
            />
          </div>

          {/* Evaluación */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-500">
              Sistemas de evaluación de la materia
            </label>
            <EvalTable
              entries={subject.evaluation}
              evaluationSystems={evaluationSystems}
              onChange={(ev) => set('evaluation', ev)}
            />
          </div>

          {/* Asignaturas */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Asignaturas ({subject.courses.length})
              </span>
              <button
                type="button"
                onClick={addCourse}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
              >
                <FontAwesomeIcon icon={faPlus} />
                Añadir asignatura
              </button>
            </div>

            {subject.courses.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-indigo-200 py-6 text-center">
                <p className="text-xs text-gray-400">
                  Pulsa &ldquo;Añadir asignatura&rdquo; para agregar las
                  asignaturas de esta materia
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {subject.courses.map((course) => (
                  <CourseCard
                    key={course._key}
                    course={course}
                    evaluationSystems={evaluationSystems}
                    learningOutcomes={learningOutcomes}
                    onUpdate={(updater) => updateCourse(course._key, updater)}
                    onRemove={() => removeCourse(course._key)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ── Módulo (ModuleCard) ───────────────────────────────────────────────────────

interface ModuleCardProps {
  module: ModuleFormState;
  trainingActivities: CatalogItem[];
  evaluationSystems: CatalogItem[];
  learningOutcomes: LOEntry[];
  onUpdate: (updater: (m: ModuleFormState) => ModuleFormState) => void;
  onRemove: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  trainingActivities,
  evaluationSystems,
  learningOutcomes,
  onUpdate,
  onRemove,
}) => {
  const set = <K extends keyof ModuleFormState>(
    field: K,
    value: ModuleFormState[K],
  ) => onUpdate((m) => ({ ...m, [field]: value }));

  const addSubject = () => {
    const newSubject: SubjectFormState = {
      _key: uid(),
      name: '',
      ects: 0,
      trainingActivities: [],
      evaluation: [],
      learningOutcomes: [],
      courses: [],
      expanded: true,
    };
    onUpdate((m) => ({ ...m, subjects: [...m.subjects, newSubject] }));
  };

  const updateSubject = (
    key: string,
    updater: (s: SubjectFormState) => SubjectFormState,
  ) =>
    onUpdate((m) => ({
      ...m,
      subjects: m.subjects.map((s) => (s._key === key ? updater(s) : s)),
    }));

  const removeSubject = (key: string) =>
    onUpdate((m) => ({
      ...m,
      subjects: m.subjects.filter((s) => s._key !== key),
    }));

  const totalSubjectEcts = module.subjects.reduce(
    (s, subj) => s + (subj.ects || 0),
    0,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-md">
      {/* Header módulo */}
      <div
        className="flex cursor-pointer items-center gap-3 bg-blue-50 px-5 py-4 hover:bg-blue-100"
        onClick={() => set('expanded', !module.expanded)}
      >
        <FontAwesomeIcon
          icon={module.expanded ? faChevronDown : faChevronRight}
          className="w-3 text-blue-500"
        />
        <FontAwesomeIcon
          icon={faLayerGroup}
          className="text-base text-blue-600"
        />
        <span className="flex-1 text-base font-bold text-gray-800">
          {module.name || (
            <em className="font-normal text-gray-400">Nuevo módulo</em>
          )}
        </span>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {module.ects || '?'} ECTS · {module.subjects.length} materias
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded p-1.5 text-gray-400 hover:text-red-500"
          title="Eliminar módulo"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {module.expanded ? (
        <div className="space-y-5 px-5 py-5">
          {/* Nombre y ECTS */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Nombre del módulo
              </label>
              <input
                type="text"
                className={inputCls}
                value={module.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="ej. Filosofía, Economía…"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                ECTS totales
                {totalSubjectEcts > 0 && (
                  <span className="ml-1 text-gray-400">
                    ({totalSubjectEcts} en materias)
                  </span>
                )}
              </label>
              <input
                type="number"
                className={inputCls}
                value={module.ects || ''}
                onChange={(e) => set('ects', Number(e.target.value))}
                min={1}
                placeholder="66"
              />
            </div>
          </div>

          {/* Materias */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Materias ({module.subjects.length})
              </span>
              <button
                type="button"
                onClick={addSubject}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                <FontAwesomeIcon icon={faPlus} />
                Añadir materia
              </button>
            </div>

            {module.subjects.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-teal-200 py-10 text-center">
                <FontAwesomeIcon
                  icon={faBook}
                  className="text-2xl text-gray-300"
                />
                <p className="text-sm text-gray-400">
                  Pulsa &ldquo;Añadir materia&rdquo; para crear las materias de
                  este módulo
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {module.subjects.map((subject) => (
                  <SubjectCard
                    key={subject._key}
                    subject={subject}
                    trainingActivities={trainingActivities}
                    evaluationSystems={evaluationSystems}
                    learningOutcomes={learningOutcomes}
                    onUpdate={(updater) => updateSubject(subject._key, updater)}
                    onRemove={() => removeSubject(subject._key)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────

interface Props {
  modules: ModuleFormState[];
  onChange: (modules: ModuleFormState[]) => void;
  trainingActivities: CatalogItem[];
  evaluationSystems: CatalogItem[];
  learningOutcomes: LOEntry[];
}

const StepModules: React.FC<Props> = ({
  modules,
  onChange,
  trainingActivities,
  evaluationSystems,
  learningOutcomes,
}) => {
  const addModule = () => {
    onChange([
      ...modules,
      {
        _key: uid(),
        name: '',
        ects: 0,
        subjects: [],
        expanded: true,
      },
    ]);
  };

  const updateModule = (
    key: string,
    updater: (m: ModuleFormState) => ModuleFormState,
  ) => onChange(modules.map((m) => (m._key === key ? updater(m) : m)));

  const removeModule = (key: string) =>
    onChange(modules.filter((m) => m._key !== key));

  const totalModules = modules.length;
  const totalSubjects = modules.reduce((s, m) => s + m.subjects.length, 0);
  const totalCourses = modules.reduce(
    (s, m) => m.subjects.reduce((s2, subj) => s2 + subj.courses.length, s),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5 shrink-0" />
        <span>
          Define la estructura del plan: <strong>módulos</strong> →{' '}
          <strong>materias</strong> → <strong>asignaturas</strong>. Las
          actividades formativas, resultados y sistemas de evaluación
          disponibles provienen de los pasos anteriores.
        </span>
      </div>

      {/* Contadores */}
      {totalModules > 0 && (
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Módulos', value: totalModules, color: 'blue' },
            { label: 'Materias', value: totalSubjects, color: 'teal' },
            { label: 'Asignaturas', value: totalCourses, color: 'indigo' },
          ].map(({ label, value, color }) => (
            <span
              key={label}
              className={`rounded-full bg-${color}-100 px-3 py-1 text-sm font-semibold text-${color}-700`}
            >
              {value} {label.toLowerCase()}
            </span>
          ))}
        </div>
      )}

      {/* Botón añadir módulo */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={addModule}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faPlus} />
          Añadir módulo
        </button>
      </div>

      {modules.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <FontAwesomeIcon
            icon={faLayerGroup}
            className="text-4xl text-gray-300"
          />
          <p className="text-gray-400">
            Pulsa &ldquo;Añadir módulo&rdquo; para comenzar a estructurar el
            plan de estudios
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((module) => (
            <ModuleCard
              key={module._key}
              module={module}
              trainingActivities={trainingActivities}
              evaluationSystems={evaluationSystems}
              learningOutcomes={learningOutcomes}
              onUpdate={(updater) => updateModule(module._key, updater)}
              onRemove={() => removeModule(module._key)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StepModules;
