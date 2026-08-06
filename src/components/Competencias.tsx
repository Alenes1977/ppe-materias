import { type FC, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faClipboardList,
  faChartLine,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import BackButton from './BackButton';
import { useDegree } from '../context/DegreeContext';

const Competencias: FC = () => {
  const { degreeId } = useParams<{ degreeId: string }>();
  const { degreePlan, labelLO } = useDegree();
  const base = `/${degreeId}`;

  const totalCourses = useMemo(
    () =>
      degreePlan.modules.flatMap((m) => m.subjects.flatMap((s) => s.courses))
        .length,
    [degreePlan],
  );

  const countCoursesForLO = (loId: string): number =>
    degreePlan.modules.flatMap((m) =>
      m.subjects.flatMap((s) =>
        s.learningOutcomes.includes(loId) ? s.courses : [],
      ),
    ).length;

  const outcomes = useMemo(
    () =>
      Object.entries(degreePlan.learningOutcomes)
        .map(([id, descripcion]) => ({
          id,
          descripcion,
          numAsignaturas: countCoursesForLO(id),
        }))
        .sort((a, b) => {
          const numA = parseInt(a.id.replace(/\D/g, ''), 10);
          const numB = parseInt(b.id.replace(/\D/g, ''), 10);
          return (isNaN(numA) ? 999 : numA) - (isNaN(numB) ? 999 : numB);
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [degreePlan],
  );

  const stats = useMemo(() => {
    const total = outcomes.length;
    const totalPresencias = outcomes.reduce((s, o) => s + o.numAsignaturas, 0);
    return {
      total,
      totalCourses,
      media: total > 0 ? totalPresencias / total : 0,
    };
  }, [outcomes, totalCourses]);

  const labelPlural =
    labelLO.plural.charAt(0).toUpperCase() + labelLO.plural.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
        <div className="mb-4 sm:mb-6">
          <BackButton to={`${base}/inicio`} />
        </div>

        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            {labelPlural}
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            {labelPlural}
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-gray-600 sm:text-lg">
            Explora {stats.total > 0 ? `los ${stats.total}` : 'los'}{' '}
            {labelLO.plural} del grado y su presencia en las asignaturas del
            plan de estudios.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
              <div className="min-w-0">
                <p className="text-3xl font-bold tabular-nums tracking-tight text-blue-700 sm:text-4xl md:text-5xl">
                  {stats.total}
                </p>
                <h3 className="mt-1.5 text-sm font-semibold text-gray-800 sm:mt-2 sm:text-base">
                  {labelPlural} definidas
                </h3>
              </div>
              <FontAwesomeIcon
                icon={faClipboardList}
                className="mt-1 shrink-0 text-2xl text-blue-500/80 sm:text-3xl"
                aria-hidden
              />
            </div>
            <p className="text-xs text-gray-600 sm:text-sm">
              Total de {labelLO.plural} en el plan de estudios.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
              <div className="min-w-0">
                <p className="text-3xl font-bold tabular-nums tracking-tight text-indigo-700 sm:text-4xl md:text-5xl">
                  {stats.totalCourses}
                </p>
                <h3 className="mt-1.5 text-sm font-semibold text-gray-800 sm:mt-2 sm:text-base">
                  Asignaturas del plan
                </h3>
              </div>
              <FontAwesomeIcon
                icon={faBookOpen}
                className="mt-1 shrink-0 text-2xl text-indigo-500/80 sm:text-3xl"
                aria-hidden
              />
            </div>
            <p className="text-xs text-gray-600 sm:text-sm">
              Asignaturas totales consideradas para el cálculo.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
              <div className="min-w-0">
                <p className="text-3xl font-bold tabular-nums tracking-tight text-teal-700 sm:text-4xl md:text-5xl">
                  {stats.media.toFixed(1)}
                </p>
                <h3 className="mt-1.5 text-sm font-semibold text-gray-800 sm:mt-2 sm:text-base">
                  Media de presencia
                </h3>
              </div>
              <FontAwesomeIcon
                icon={faLayerGroup}
                className="mt-1 shrink-0 text-2xl text-teal-500/80 sm:text-3xl"
                aria-hidden
              />
            </div>
            <p className="text-xs text-gray-600 sm:text-sm">
              Asignaturas de media por {labelLO.singular}.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {outcomes.map((outcome) => {
            const pct =
              stats.totalCourses > 0
                ? (outcome.numAsignaturas / stats.totalCourses) * 100
                : 0;
            return (
              <Link
                key={outcome.id}
                to={`${base}/competencias/${outcome.id}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                <div className="mb-3 flex items-center justify-between sm:mb-4">
                  <div className="rounded-lg bg-blue-500 px-2 py-1 text-xs font-bold text-white sm:px-3 sm:py-1.5 sm:text-sm">
                    {outcome.id}
                  </div>
                  <div className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 sm:px-3">
                    {outcome.numAsignaturas} asignaturas
                  </div>
                </div>
                <p className="mb-4 flex-grow text-xs leading-relaxed text-gray-600 sm:mb-6 sm:text-sm">
                  {outcome.descripcion}
                </p>
                <div className="mt-auto">
                  <div className="mb-1.5 flex items-center justify-between text-xs sm:mb-2 sm:text-sm">
                    <span className="font-medium text-gray-700">
                      Presencia en el plan
                    </span>
                    <span className="font-medium text-blue-600">
                      {Math.round(pct)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 sm:h-2">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Competencias;
