import type React from 'react';
import { useContext } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faCalendarDays,
  faChevronRight,
  faGraduationCap,
  faUniversity,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { generateSlug } from '../utils/stringUtils';
import { DegreeContext } from '../context/DegreeContext';
import { DEGREES } from '../data/degrees';

/** Tipos de obligatoriedad mostrados por separado en la distribución (siguen dentro del total ECTS). */
const TIPO_TRABAJO_FIN_GRADO = 'Trabajo Fin de Grado';

const PlanEstudios: React.FC = () => {
  const { degreeId } = useParams<{ degreeId: string }>();
  const ctx = useContext(DegreeContext);
  const degree = degreeId ? DEGREES[degreeId] : null;
  const degreePlan = ctx?.degreePlan ?? degree?.plan;
  const degreeInfo = ctx?.degreeInfo ?? degree?.meta;
  const base = degreeId ? `/${degreeId}` : '';

  if (!degreePlan || !degreeInfo) {
    return <Navigate to="/" replace />;
  }

  const todasCourses = degreePlan.modules.flatMap((m) =>
    m.subjects.flatMap((s) => s.courses),
  );

  const ectsBasicas = todasCourses
    .filter((c) => c.type === 'Básica')
    .reduce((sum, c) => sum + c.ects, 0);
  const ectsObligatorias = todasCourses
    .filter((c) => c.type === 'Obligatoria')
    .reduce((sum, c) => sum + c.ects, 0);
  const ectsOptativas = todasCourses
    .filter((c) => c.type === 'Optativa')
    .reduce((sum, c) => sum + c.ects, 0);
  const ectsTrabajoFinGrado = todasCourses
    .filter((c) => c.type === TIPO_TRABAJO_FIN_GRADO)
    .reduce((sum, c) => sum + c.ects, 0);

  const ectsTotal = todasCourses.reduce((sum, c) => sum + c.ects, 0);
  const ectsDesglosados =
    ectsBasicas + ectsObligatorias + ectsOptativas + ectsTrabajoFinGrado;
  const ectsOtros = ectsTotal - ectsDesglosados;

  const maxYear = Math.max(...todasCourses.map((c) => c.year), 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-16 sm:pb-14 sm:pt-20 md:pt-24">
        {/* Encabezado */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            Plan de estudios oficial
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            Plan de Estudios
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-gray-600 sm:text-base md:text-lg">
            Explora la estructura completa del {degreeInfo.name}. Conoce los
            módulos, materias y asignaturas que componen este programa
            formativo.
          </p>
        </div>

        {/* Resumen */}
        <div className="mb-8 grid gap-4 sm:mb-12 sm:gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 sm:mb-4 sm:text-xl">
              <FontAwesomeIcon
                icon={faUniversity}
                className="mr-2 text-blue-600 sm:mr-3"
              />
              Información Básica
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center rounded-lg bg-gray-50 p-3 sm:p-4">
                <div>
                  <span className="block text-xs font-medium text-gray-500 sm:text-sm">
                    Titulación
                  </span>
                  <span className="text-sm text-gray-900 sm:text-base">
                    {degreeInfo.name}
                  </span>
                </div>
              </li>
              <li className="flex items-center rounded-lg bg-gray-50 p-3 sm:p-4">
                <div>
                  <span className="block text-xs font-medium text-gray-500 sm:text-sm">
                    Duración
                  </span>
                  <span className="text-sm text-gray-900 sm:text-base">
                    {maxYear} años académicos
                  </span>
                </div>
              </li>
              <li className="flex items-center rounded-lg bg-gray-50 p-3 sm:p-4">
                <div>
                  <span className="block text-xs font-medium text-gray-500 sm:text-sm">
                    Total Créditos
                  </span>
                  <span className="text-sm text-gray-900 sm:text-base">
                    {ectsTotal} ECTS
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 sm:mb-4 sm:text-xl">
              <FontAwesomeIcon
                icon={faLayerGroup}
                className="mr-2 text-blue-600 sm:mr-3"
              />
              Distribución de créditos ECTS
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {ectsBasicas > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
                  <span className="text-sm font-medium text-gray-700 sm:text-base">
                    Asignaturas Básicas
                  </span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 sm:px-3 sm:text-sm">
                    {ectsBasicas} ECTS
                  </span>
                </div>
              )}
              {ectsObligatorias > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
                  <span className="text-sm font-medium text-gray-700 sm:text-base">
                    Asignaturas Obligatorias
                  </span>
                  <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-800 sm:px-3 sm:text-sm">
                    {ectsObligatorias} ECTS
                  </span>
                </div>
              )}
              {ectsOptativas > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
                  <span className="text-sm font-medium text-gray-700 sm:text-base">
                    Asignaturas Optativas
                  </span>
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 sm:px-3 sm:text-sm">
                    {ectsOptativas} ECTS
                  </span>
                </div>
              )}
              {ectsTrabajoFinGrado > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
                  <span className="text-sm font-medium text-gray-700 sm:text-base">
                    Trabajo Fin de Grado
                  </span>
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-900 sm:px-3 sm:text-sm">
                    {ectsTrabajoFinGrado} ECTS
                  </span>
                </div>
              )}
              {ectsOtros > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
                  <span
                    className="text-sm font-medium text-gray-700 sm:text-base"
                    title="Créditos con otro tipo de asignatura (p. ej. prácticum u optativa de especialización)"
                  >
                    Otros créditos
                  </span>
                  <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-800 sm:px-3 sm:text-sm">
                    {ectsOtros} ECTS
                  </span>
                </div>
              )}
              {ectsTotal > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
                  <span className="text-sm font-medium text-gray-700 sm:text-base">
                    Total
                  </span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 sm:px-3 sm:text-sm">
                    {ectsTotal} ECTS
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Módulos */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-6 flex items-center sm:mb-8">
            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Módulos del Plan de Estudios
            </h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {degreePlan.modules.map((modulo) => (
              <Link
                key={modulo.name}
                to={`${base}/plan-estudios/${generateSlug(modulo.name)}`}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6"
              >
                <div className="mb-3 sm:mb-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 sm:px-3 sm:text-sm">
                    {modulo.ects} ECTS
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-800 group-hover:text-blue-600 sm:mb-4 sm:text-xl">
                  {modulo.name}
                </h3>
                <div className="mt-auto space-y-2 sm:space-y-3">
                  <Link
                    to={`${base}/materias`}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 transition-all hover:bg-purple-50 hover:text-purple-700 sm:px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-gray-600 sm:text-sm">
                      Materias
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800">
                        {modulo.subjects.length}
                      </span>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="ml-2 h-3 w-3 transform text-gray-400 transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                  <Link
                    to={`${base}/asignaturas`}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 transition-all hover:bg-green-50 hover:text-green-700 sm:px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-gray-600 sm:text-sm">
                      Asignaturas
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800">
                        {modulo.subjects.reduce(
                          (t, s) => t + s.courses.length,
                          0,
                        )}
                      </span>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="ml-2 h-3 w-3 transform text-gray-400 transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                  <div className="mt-3 flex items-center justify-end text-xs font-medium text-blue-600 sm:mt-4 sm:text-sm">
                    Ver detalle
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="ml-2 transform transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Distribución por cursos */}
        <div>
          <div className="mb-6 flex items-center sm:mb-8">
            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Distribución por Cursos
            </h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent" />
          </div>

          {Array.from({ length: maxYear }, (_, i) => i + 1).map((curso) => {
            const delPrimerCuatri = todasCourses
              .filter((c) => c.year === curso && c.semester === 1)
              .sort((a, b) => a.name.localeCompare(b.name));
            const delSegundoCuatri = todasCourses
              .filter((c) => c.year === curso && c.semester === 2)
              .sort((a, b) => a.name.localeCompare(b.name));
            const anuales = todasCourses
              .filter((c) => c.year === curso && c.semester === 'annual')
              .sort((a, b) => a.name.localeCompare(b.name));

            return (
              <div key={curso} className="mb-6 last:mb-0 sm:mb-8">
                <h3 className="mb-3 inline-flex items-center rounded-lg bg-blue-100 px-3 py-1.5 text-base font-bold text-blue-800 sm:mb-4 sm:px-4 sm:py-2 sm:text-lg">
                  <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                  {curso}º Curso
                </h3>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  {[delPrimerCuatri, delSegundoCuatri].map((lista, idx) => {
                    const cuatriIdx = idx + 1;
                    return (
                      <div
                        key={cuatriIdx}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
                      >
                        <h4 className="mb-3 text-base font-semibold text-gray-800 sm:mb-4 sm:text-lg">
                          {cuatriIdx === 1 ? 'Primer' : 'Segundo'} cuatrimestre
                        </h4>
                        {lista.length > 0 ? (
                          <ul className="space-y-2 sm:space-y-3">
                            {lista.map((c) => (
                              <li key={`${curso}-${c.name}-q${cuatriIdx}`}>
                                <Link
                                  to={`${base}/asignaturas/${generateSlug(
                                    c.name,
                                  )}`}
                                  className="group flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 sm:p-4"
                                >
                                  <div className="flex min-w-0 flex-1 items-start gap-2">
                                    <FontAwesomeIcon
                                      icon={faBook}
                                      className="mt-0.5 shrink-0 text-blue-500 sm:mr-0"
                                    />
                                    <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-700 group-hover:text-blue-600 sm:text-base">
                                      {c.name}
                                    </span>
                                  </div>
                                  <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 sm:px-2.5">
                                    {c.ects} ECTS
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Sin asignaturas.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {anuales.length > 0 && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm sm:mt-6 sm:p-6">
                    <h4 className="mb-2 flex flex-wrap items-center gap-2 text-base font-semibold text-amber-950 sm:mb-3 sm:text-lg">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="text-amber-600"
                      />
                      Asignaturas anuales
                      <span className="text-xs font-normal text-amber-800/80 sm:text-sm">
                        (imparten a lo largo del curso académico)
                      </span>
                    </h4>
                    <ul className="space-y-2 sm:space-y-3">
                      {anuales.map((c) => (
                        <li key={`${curso}-${c.name}-annual`}>
                          <Link
                            to={`${base}/asignaturas/${generateSlug(c.name)}`}
                            className="group flex items-start gap-3 rounded-lg border border-amber-200 bg-white p-3 transition-all hover:border-amber-300 hover:bg-amber-50/80 sm:p-4"
                          >
                            <div className="flex min-w-0 flex-1 items-start gap-2">
                              <FontAwesomeIcon
                                icon={faBook}
                                className="mt-0.5 shrink-0 text-amber-600 sm:mr-0"
                              />
                              <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-800 group-hover:text-amber-900 sm:text-base">
                                {c.name}
                              </span>
                            </div>
                            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 sm:px-2.5">
                              {c.ects} ECTS
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanEstudios;
