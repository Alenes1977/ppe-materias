import type React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faClipboardList,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import BackButton from './BackButton';
import { generateSlug } from '../utils/stringUtils';
import { useDegree } from '../context/DegreeContext';

const CompetenciaDetalle: React.FC = () => {
  const { id, degreeId } = useParams<{ id: string; degreeId: string }>();
  const { degreePlan, labelLO } = useDegree();
  const base = `/${degreeId}`;

  const descripcion = id ? degreePlan.learningOutcomes[id] : undefined;
  const labelSingular =
    labelLO.singular.charAt(0).toUpperCase() + labelLO.singular.slice(1);

  if (!descripcion || !id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            {labelSingular} no encontrada
          </h2>
          <p className="mb-6 text-gray-600">
            No se ha encontrado la {labelLO.singular} especificada.
          </p>
          <Link
            to={`${base}/competencias`}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
            Volver a {labelLO.plural}
          </Link>
        </div>
      </div>
    );
  }

  const asignaturasPorModulo = degreePlan.modules.reduce(
    (acc, modulo) => {
      const list = modulo.subjects.flatMap((subj) => {
        if (!subj.learningOutcomes.includes(id)) return [];
        return subj.courses.map((course) => ({
          nombre: course.name,
          modulo: modulo.name,
          materia: subj.name,
          curso: course.year,
          ects: course.ects,
        }));
      });
      if (list.length > 0) acc[modulo.name] = list;
      return acc;
    },
    {} as Record<string, { nombre: string; modulo: string; materia: string; curso: number; ects: number }[]>,
  );

  const asignaturasConCompetencia = Object.values(asignaturasPorModulo).flat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
        <div className="mb-4 sm:mb-6">
          <BackButton to={`${base}/competencias`} label={`Volver a ${labelLO.plural}`} />
        </div>

        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
            {labelSingular}
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            {id}
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-gray-600 sm:text-lg">
            {descripcion}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
          <Link
            to={`${base}/asignaturas`}
            className="group rounded-xl border border-green-200 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:bg-green-50 hover:shadow-md sm:p-6"
          >
            <div className="mb-1 text-xl font-bold text-green-600 sm:mb-2 sm:text-2xl">
              {asignaturasConCompetencia.length}
            </div>
            <div className="text-xs text-gray-600 group-hover:text-green-600 sm:text-sm">
              Asignaturas
            </div>
          </Link>
          <Link
            to={`${base}/materias`}
            className="group rounded-xl border border-purple-200 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:bg-purple-50 hover:shadow-md sm:p-6"
          >
            <div className="mb-1 text-xl font-bold text-purple-600 sm:mb-2 sm:text-2xl">
              {new Set(asignaturasConCompetencia.map((a) => a.materia)).size}
            </div>
            <div className="text-xs text-gray-600 group-hover:text-purple-600 sm:text-sm">
              Materias
            </div>
          </Link>
          <Link
            to={`${base}/plan-estudios`}
            className="group rounded-xl border border-blue-200 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:bg-blue-50 hover:shadow-md sm:col-span-2 sm:p-6 md:col-span-1"
          >
            <div className="mb-1 text-xl font-bold text-blue-600 sm:mb-2 sm:text-2xl">
              {Object.keys(asignaturasPorModulo).length}
            </div>
            <div className="text-xs text-gray-600 group-hover:text-blue-600 sm:text-sm">
              Módulos
            </div>
          </Link>
        </div>

        {/* Asignaturas por módulo */}
        <div className="space-y-6 sm:space-y-8">
          {Object.entries(asignaturasPorModulo).map(([modulo, asignaturas]) => (
            <div
              key={modulo}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <Link
                to={`${base}/plan-estudios/${generateSlug(modulo)}`}
                className="group mb-4 flex items-center sm:mb-6"
              >
                <h2 className="flex items-center text-lg font-bold text-gray-800 group-hover:text-blue-600 sm:text-xl">
                  <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-blue-600 sm:mr-3" />
                  {modulo}
                </h2>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ml-2 transform text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </Link>
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {asignaturas.map((asignatura) => (
                  <Link
                    key={asignatura.nombre}
                    to={`${base}/asignaturas/${generateSlug(asignatura.nombre)}`}
                    className="group flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 sm:p-4"
                  >
                    <h3 className="mb-2 text-sm font-medium text-gray-800 group-hover:text-blue-600 sm:text-base">
                      {asignatura.nombre}
                    </h3>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {asignatura.curso}º curso
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                        {asignatura.ects} ECTS
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetenciaDetalle;
