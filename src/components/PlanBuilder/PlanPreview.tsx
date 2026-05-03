import type React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faUniversity,
  faLayerGroup,
  faBookOpen,
  faClipboardList,
  faChartBar,
  faChevronDown,
  faChevronRight,
  faBook,
  faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';
import type {
  MetaFormState,
  LOEntry,
  CatalogItem,
  ModuleFormState,
  SubjectFormState,
} from './builderTypes';
import type { Semester as DegreeSemester } from '../../types/degree';
import { CourseTypePill } from '../CourseTypePill';
import {
  courseYearPillClass,
  ectsPillClass,
  semesterPillClass,
} from '../../utils/courseBadgeStyles';
import { formatCatalogEntry } from '../../utils/stringUtils';

const semLabel = (s: string) => {
  if (s === 'annual') return 'Anual';
  return `${s}º Sem.`;
};

function toDegreeSemester(s: string): DegreeSemester {
  if (s === 'annual') return 'annual';
  if (s === '1') return 1;
  return 2;
}

// ── Tarjeta de materia expandible ────────────────────────────────────────────

interface SubjectCardProps {
  subject: SubjectFormState;
  trainingActivities: CatalogItem[];
  evaluationSystems: CatalogItem[];
  learningOutcomes: LOEntry[];
  loLabel: string;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  trainingActivities,
  evaluationSystems,
  learningOutcomes,
  loLabel,
}) => {
  const [open, setOpen] = useState(false);

  const actDict = Object.fromEntries(trainingActivities.map((a) => [a.id, a]));
  const evalDict = Object.fromEntries(evaluationSystems.map((s) => [s.id, s]));
  const loDict = Object.fromEntries(learningOutcomes.map((lo) => [lo.id, lo]));

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Cabecera materia */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <FontAwesomeIcon
          icon={open ? faChevronDown : faChevronRight}
          className="w-3 shrink-0 text-gray-400"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-800">
            {subject.name || (
              <em className="font-normal text-gray-400">Sin nombre</em>
            )}
          </p>
          <p className="text-xs text-gray-400">
            {subject.courses.length} asignatura
            {subject.courses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <span className={ectsPillClass()}>{subject.ects} ECTS</span>
      </button>

      {open ? (
        <div className="space-y-5 border-t border-gray-100 px-5 py-5">
          {/* Asignaturas — tabla horizontal */}
          {subject.courses.length > 0 && (
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <FontAwesomeIcon icon={faBookOpen} className="text-blue-400" />
                Asignaturas
              </h4>
              <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-medium text-gray-500">
                      <th className="px-4 py-2 text-left">Nombre</th>
                      <th className="px-3 py-2 text-center">Tipo</th>
                      <th className="px-3 py-2 text-center">Curso</th>
                      <th className="px-3 py-2 text-center">Sem.</th>
                      <th className="px-3 py-2 text-right">ECTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {subject.courses.map((course) => (
                      <tr
                        key={course._key}
                        className="transition-colors hover:bg-blue-50/40"
                      >
                        <td className="px-4 py-2.5 font-medium text-gray-800">
                          {course.name || (
                            <em className="font-normal text-gray-400">
                              Sin nombre
                            </em>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          {course.type ? (
                            <div className="flex justify-center">
                              <CourseTypePill type={course.type} />
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={courseYearPillClass(course.year ?? 1)}
                          >
                            {course.year}º
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={semesterPillClass(
                              toDegreeSemester(course.semester),
                            )}
                          >
                            {semLabel(course.semester)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <div className="flex justify-end">
                            <span className={ectsPillClass()}>
                              {course.ects} ECTS
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actividades + Evaluación en dos columnas */}
          {(subject.trainingActivities.length > 0 ||
            subject.evaluation.length > 0) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {subject.trainingActivities.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <FontAwesomeIcon
                      icon={faClipboardList}
                      className="text-blue-400"
                    />
                    Actividades formativas
                  </h4>
                  <ul className="space-y-1.5">
                    {subject.trainingActivities.map((afId) => (
                      <li
                        key={afId}
                        className="flex items-center gap-2 text-xs text-gray-600"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                        {formatCatalogEntry(afId, actDict[afId]?.name)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {subject.evaluation.length > 0 && (
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                    <FontAwesomeIcon
                      icon={faChartBar}
                      className="text-blue-400"
                    />
                    Evaluación
                  </h4>
                  <ul className="space-y-1.5">
                    {subject.evaluation.map((ev) => (
                      <li
                        key={ev._key}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs"
                      >
                        <span className="text-gray-700">
                          {formatCatalogEntry(
                            ev.system,
                            evalDict[ev.system]?.name,
                          )}
                        </span>
                        <span className="ml-2 shrink-0 text-gray-400">
                          <span className="font-medium text-blue-600">
                            {ev.minWeight}
                          </span>
                          {' – '}
                          <span className="font-medium text-green-600">
                            {ev.maxWeight}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Resultados de aprendizaje */}
          {subject.learningOutcomes.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="text-blue-400"
                />
                {loLabel}
              </h4>
              <ul className="space-y-1.5">
                {subject.learningOutcomes.map((loId) => (
                  <li
                    key={loId}
                    className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs"
                  >
                    <span className="mt-0.5 shrink-0 rounded-full bg-blue-200 px-1.5 py-0.5 font-bold text-blue-800">
                      {loId}
                    </span>
                    <span className="text-gray-700">
                      {loDict[loId]?.text ?? loId}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

// ── Tarjeta de módulo expandible ──────────────────────────────────────────────

interface ModuleCardProps {
  module: ModuleFormState;
  trainingActivities: CatalogItem[];
  evaluationSystems: CatalogItem[];
  learningOutcomes: LOEntry[];
  loLabel: string;
  primaryColor: string;
}

const ModuleCardPreview: React.FC<ModuleCardProps> = ({
  module,
  trainingActivities,
  evaluationSystems,
  learningOutcomes,
  loLabel,
  primaryColor,
}) => {
  const [open, setOpen] = useState(false);

  const totalCourses = module.subjects.reduce(
    (s, subj) => s + subj.courses.length,
    0,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cabecera módulo */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex-1">
          <div className="mb-2">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {module.ects} ECTS
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {module.name || (
              <em className="font-normal text-gray-400">Sin nombre</em>
            )}
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">
            {module.subjects.length} materia
            {module.subjects.length !== 1 ? 's' : ''} · {totalCourses}{' '}
            asignatura{totalCourses !== 1 ? 's' : ''}
          </p>
        </div>
        <FontAwesomeIcon
          icon={open ? faChevronDown : faChevronRight}
          className="shrink-0 text-gray-400"
        />
      </button>

      {open ? (
        <div className="border-t border-gray-100 px-5 py-4">
          {module.subjects.length === 0 ? (
            <p className="py-4 text-center text-sm italic text-gray-400">
              Sin materias definidas.
            </p>
          ) : (
            <div className="space-y-3">
              {module.subjects.map((subject) => (
                <SubjectCard
                  key={subject._key}
                  subject={subject}
                  trainingActivities={trainingActivities}
                  evaluationSystems={evaluationSystems}
                  learningOutcomes={learningOutcomes}
                  loLabel={loLabel}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────

interface Props {
  meta: MetaFormState;
  learningOutcomes: LOEntry[];
  trainingActivities: CatalogItem[];
  evaluationSystems: CatalogItem[];
  modules: ModuleFormState[];
}

const PlanPreview: React.FC<Props> = ({
  meta,
  learningOutcomes,
  trainingActivities,
  evaluationSystems,
  modules,
}) => {
  const loLabel = meta.loPlural
    ? meta.loPlural.charAt(0).toUpperCase() + meta.loPlural.slice(1)
    : 'Resultados de aprendizaje';

  const todasCourses = modules.flatMap((m) =>
    m.subjects.flatMap((s) => s.courses),
  );

  const ectsBasicas = todasCourses
    .filter((c) => c.type === 'Básica')
    .reduce((sum, c) => sum + (c.ects || 0), 0);
  const ectsObligatorias = todasCourses
    .filter((c) => c.type === 'Obligatoria')
    .reduce((sum, c) => sum + (c.ects || 0), 0);
  const ectsOptativas = todasCourses
    .filter((c) => c.type === 'Optativa')
    .reduce((sum, c) => sum + (c.ects || 0), 0);
  const ectsTrabajoFinGrado = todasCourses
    .filter((c) => c.type === 'Trabajo Fin de Grado')
    .reduce((sum, c) => sum + (c.ects || 0), 0);
  const ectsTotal = todasCourses.reduce((sum, c) => sum + (c.ects || 0), 0);
  const ectsOtros =
    ectsTotal -
    ectsBasicas -
    ectsObligatorias -
    ectsOptativas -
    ectsTrabajoFinGrado;

  const maxYear = Math.max(...todasCourses.map((c) => c.year ?? 1), 4);

  const primaryColor = meta.primaryColor || '#1e3a8a';

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}06 100%)`,
          border: `1px solid ${primaryColor}25`,
        }}
      >
        <div
          className="mb-3 inline-block rounded-full px-3 py-1.5 text-xs font-semibold text-white"
          style={{ backgroundColor: primaryColor }}
        >
          <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
          Vista previa del plan
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {meta.name ? (
            meta.name
          ) : (
            <em className="font-normal text-gray-400">Sin nombre todavía</em>
          )}
        </h2>
        {Boolean(meta.shortName || meta.university) && (
          <p className="mt-1 text-sm text-gray-500">
            {[meta.shortName, meta.university].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      {/* Info básica + distribución */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700">
            <FontAwesomeIcon icon={faUniversity} className="text-blue-500" />
            Información básica
          </h3>
          <dl className="space-y-2">
            {[
              { label: 'Titulación', value: meta.name },
              { label: 'Universidad', value: meta.university },
              { label: 'Duración', value: `${maxYear} años` },
              { label: 'Total créditos', value: `${ectsTotal} ECTS` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5"
              >
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="text-sm font-medium text-gray-800">
                  {value || '—'}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700">
            <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500" />
            Distribución de créditos
          </h3>
          {ectsTotal === 0 ? (
            <p className="text-sm italic text-gray-400">
              Añade asignaturas con ECTS para ver la distribución.
            </p>
          ) : (
            <div className="space-y-2">
              {ectsBasicas > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                  <span className="text-xs font-medium text-gray-700">
                    Asignaturas básicas
                  </span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                    {ectsBasicas} ECTS
                  </span>
                </div>
              )}
              {ectsObligatorias > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                  <span className="text-xs font-medium text-gray-700">
                    Asignaturas obligatorias
                  </span>
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800">
                    {ectsObligatorias} ECTS
                  </span>
                </div>
              )}
              {ectsOptativas > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                  <span className="text-xs font-medium text-gray-700">
                    Asignaturas optativas
                  </span>
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                    {ectsOptativas} ECTS
                  </span>
                </div>
              )}
              {ectsTrabajoFinGrado > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                  <span className="text-xs font-medium text-gray-700">
                    Trabajo Fin de Grado
                  </span>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-900">
                    {ectsTrabajoFinGrado} ECTS
                  </span>
                </div>
              )}
              {ectsOtros > 0 && (
                <div
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5"
                  title="Otros tipos (p. ej. prácticum u optativa de especialización)"
                >
                  <span className="text-xs font-medium text-gray-700">
                    Otros créditos
                  </span>
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-800">
                    {ectsOtros} ECTS
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5">
                <span className="text-xs font-bold text-gray-700">Total</span>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  {ectsTotal} ECTS
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Módulos */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-800">Módulos del plan</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        {modules.length === 0 ? (
          <p className="italic text-gray-400">Sin módulos definidos todavía.</p>
        ) : (
          <div className="space-y-3">
            {modules.map((module) => (
              <ModuleCardPreview
                key={module._key}
                module={module}
                trainingActivities={trainingActivities}
                evaluationSystems={evaluationSystems}
                learningOutcomes={learningOutcomes}
                loLabel={loLabel}
                primaryColor={primaryColor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Distribución por cursos */}
      {todasCourses.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800">
              Distribución por cursos
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
          </div>

          {Array.from({ length: maxYear }, (_, i) => i + 1).map((curso) => {
            const asigsCurso = todasCourses.filter((c) => c.year === curso);
            if (asigsCurso.length === 0) return null;
            const primerCuatri = asigsCurso.filter((c) => c.semester === '1');
            const segundoCuatri = asigsCurso.filter((c) => c.semester === '2');
            const anuales = asigsCurso.filter((c) => c.semester === 'annual');
            return (
              <div key={curso} className="mb-5 last:mb-0">
                <div className="mb-3">
                  <span
                    className={`${courseYearPillClass(
                      curso,
                    )} text-sm font-bold`}
                  >
                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                    {curso}º Curso
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[primerCuatri, segundoCuatri].map((lista, idx) => {
                    const q = idx + 1;
                    return (
                      <div
                        key={q}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <h4 className="mb-3 text-sm font-semibold text-gray-600">
                          {q === 1 ? 'Primer' : 'Segundo'} cuatrimestre
                        </h4>
                        {lista.length > 0 ? (
                          <ul className="space-y-1.5">
                            {lista.map((c) => (
                              <li
                                key={c._key}
                                className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                              >
                                <div className="flex items-start gap-3">
                                  <FontAwesomeIcon
                                    icon={faBook}
                                    className="mt-0.5 shrink-0 text-blue-500"
                                  />
                                  <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-700">
                                    {c.name || (
                                      <em className="font-normal text-gray-400">
                                        Sin nombre
                                      </em>
                                    )}
                                  </span>
                                  <div className="flex shrink-0 items-start gap-2">
                                    <CourseTypePill type={c.type} />
                                    <span className={ectsPillClass()}>
                                      {c.ects} ECTS
                                    </span>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs italic text-gray-400">
                            Sin asignaturas.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {anuales.length > 0 && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
                    <h4 className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-amber-950">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="text-amber-600"
                      />
                      Asignaturas anuales
                      <span className="text-xs font-normal text-amber-800/80">
                        (curso académico completo)
                      </span>
                    </h4>
                    <ul className="space-y-1.5">
                      {anuales.map((c) => (
                        <li
                          key={c._key}
                          className="rounded-lg border border-amber-200 bg-white p-3"
                        >
                          <div className="flex items-start gap-3">
                            <FontAwesomeIcon
                              icon={faBook}
                              className="mt-0.5 shrink-0 text-amber-600"
                            />
                            <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-800">
                              {c.name || (
                                <em className="font-normal text-gray-400">
                                  Sin nombre
                                </em>
                              )}
                            </span>
                            <div className="flex shrink-0 items-start gap-2">
                              <CourseTypePill type={c.type} />
                              <span className={ectsPillClass()}>
                                {c.ects} ECTS
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlanPreview;
