import type React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faGraduationCap,
  faBuilding,
  faCalendarAlt,
  faBookOpen,
  faClipboardList,
  faChartBar,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import BackButton from './BackButton';
import { generateSlug } from '../utils/stringUtils';
import { useDegree } from '../context/DegreeContext';
import type { Semester } from '../types/degree';

const semLabel = (s: Semester) => {
  if (s === 'annual') return 'Anual';
  return `${s}º Semestre`;
};

const AsignaturaDetalle: React.FC = () => {
  const { nombre, degreeId } = useParams<{
    nombre: string;
    degreeId: string;
  }>();
  const { degreePlan, labelLO } = useDegree();
  const base = `/${degreeId}`;

  const actDict = Object.fromEntries(
    degreePlan.trainingActivities.map((a) => [a.id, a]),
  );
  const evalDict = Object.fromEntries(
    degreePlan.evaluationSystems.map((s) => [s.id, s]),
  );

  let asignaturaInfo: {
    nombre: string;
    tipo: string;
    curso: number;
    semestre: Semester;
    ects: number;
    modulo: string;
    materia: string;
    actividadesFormativas: string[];
    evaluacion: { tipo: string; min: string; max: string }[];
    resultadosAprendizaje: string[];
  } | null = null;
  let moduloName: string | null = null;
  let materiaName: string | null = null;

  for (const modulo of degreePlan.modules) {
    for (const materia of modulo.subjects) {
      const course = materia.courses.find(
        (c) => generateSlug(c.name) === nombre,
      );
      if (course) {
        asignaturaInfo = {
          nombre: course.name,
          tipo: course.type ?? 'Obligatoria',
          curso: course.year,
          semestre: course.semester,
          ects: course.ects,
          modulo: modulo.name,
          materia: materia.name,
          actividadesFormativas: materia.trainingActivities,
          evaluacion: (course.evaluation ?? materia.evaluation).map((e) => ({
            tipo: e.system,
            min: e.minWeight,
            max: e.maxWeight,
          })),
          resultadosAprendizaje: materia.learningOutcomes,
        };
        moduloName = modulo.name;
        materiaName = materia.name;
        break;
      }
    }
    if (asignaturaInfo) break;
  }

  if (!asignaturaInfo || !moduloName || !materiaName) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Asignatura no encontrada
          </h2>
          <p className="mb-6 text-gray-600">
            No se ha encontrado la asignatura especificada. Puede que la URL sea
            incorrecta.
          </p>
          <Link
            to={`${base}/asignaturas`}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver a asignaturas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
        <div className="mb-6 sm:mb-8">
          <BackButton to={`${base}/asignaturas`} label="Volver a asignaturas" />
        </div>

        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2">
            <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
            Ficha de asignatura
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            {asignaturaInfo.nombre}
          </h1>
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 sm:px-4 sm:py-2 sm:text-sm">
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
              {asignaturaInfo.curso}º Curso
            </span>
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-medium text-indigo-800 sm:px-4 sm:py-2 sm:text-sm">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              {semLabel(asignaturaInfo.semestre)}
            </span>
            <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-800 sm:px-4 sm:py-2 sm:text-sm">
              {asignaturaInfo.ects} ECTS
            </span>
            {asignaturaInfo.tipo === 'Básica' && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 sm:px-4 sm:py-2 sm:text-sm">
                <FontAwesomeIcon icon={faStar} className="mr-2" />
                Básica
              </span>
            )}
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {/* Ubicación */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-4 flex items-center text-lg font-bold text-gray-800 sm:text-xl">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="mr-3 text-blue-600"
                />
                Ubicación en el Plan de Estudios
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Módulo</h3>
                  <Link
                    to={`${base}/plan-estudios/${generateSlug(moduloName)}`}
                    className="mt-1 block rounded-lg bg-blue-50 p-2 text-sm text-blue-700 transition-all hover:bg-blue-100 sm:p-3"
                  >
                    {moduloName}
                  </Link>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Materia</h3>
                  <Link
                    to={`${base}/materias/${generateSlug(materiaName)}`}
                    className="mt-1 block rounded-lg bg-purple-50 p-2 text-sm text-purple-700 transition-all hover:bg-purple-100 sm:p-3"
                  >
                    {materiaName}
                  </Link>
                </div>
              </div>
            </div>

            {/* Learning outcomes */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-1 flex items-center text-lg font-bold text-gray-800 sm:text-xl">
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="mr-3 text-blue-600"
                />
                {labelLO.plural.charAt(0).toUpperCase() +
                  labelLO.plural.slice(1)}
              </h2>
              <p className="mb-4 text-xs text-gray-500 sm:mb-5">
                De la materia:{' '}
                <Link
                  to={`${base}/materias/${generateSlug(materiaName)}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {materiaName}
                </Link>
              </p>
              {asignaturaInfo.resultadosAprendizaje.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {asignaturaInfo.resultadosAprendizaje.map((loId) => (
                    <Link
                      key={loId}
                      to={`${base}/competencias/${loId}`}
                      className="group relative inline-flex items-center rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 transition-all hover:from-blue-100 hover:to-blue-200 sm:px-4 sm:py-2 sm:text-sm"
                      title={degreePlan.learningOutcomes[loId]}
                    >
                      <span>{loId}</span>
                      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 transform rounded-lg bg-gray-900 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 sm:w-72">
                        {degreePlan.learningOutcomes[loId] || 'Sin descripción'}
                        <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-4 border-transparent border-t-gray-900" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No hay {labelLO.plural} especificadas para esta materia.
                </p>
              )}
            </div>
          </div>

          {/* Actividades formativas */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center text-lg font-bold text-gray-800 sm:text-xl">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="mr-3 text-blue-600"
              />
              Actividades Formativas
            </h2>
            {asignaturaInfo.actividadesFormativas.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {asignaturaInfo.actividadesFormativas.map((afId) => {
                  const act = actDict[afId];
                  return (
                    <div
                      key={afId}
                      className="rounded-lg border border-blue-100 bg-blue-50 p-3 sm:p-4"
                    >
                      <p className="font-medium text-blue-800">
                        {act?.name ?? afId}
                      </p>
                      {act?.description && (
                        <p className="mt-1 text-xs text-blue-600 sm:text-sm">
                          {act.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No hay actividades formativas especificadas.
              </p>
            )}
          </div>

          {/* Evaluación */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center text-lg font-bold text-gray-800 sm:text-xl">
              <FontAwesomeIcon
                icon={faChartBar}
                className="mr-3 text-blue-600"
              />
              Sistema de Evaluación
            </h2>
            {asignaturaInfo.evaluacion.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Sistema
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Mín.
                      </th>
                      <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Máx.
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {asignaturaInfo.evaluacion.map((ev, i) => {
                      const se = evalDict[ev.tipo];
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="py-3 pr-4 text-sm text-gray-800">
                            {se?.name ?? ev.tipo}
                          </td>
                          <td className="py-3 text-right text-sm text-gray-600">
                            {ev.min}
                          </td>
                          <td className="py-3 text-right text-sm text-gray-600">
                            {ev.max}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No hay sistemas de evaluación especificados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignaturaDetalle;
