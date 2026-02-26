import type React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faGraduationCap,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import data from '../data/ppe.json';
import BackButton from './BackButton';
import { generateSlug } from '../utils/stringUtils';

const CompetenciaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Obtener la descripción de la competencia
  const descripcion = (
    data.resultados_aprendizaje as { [key: string]: string }
  )[id || ''];

  if (!descripcion || !id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Competencia no encontrada
          </h2>
          <p className="mb-6 text-gray-600">
            No se ha encontrado la competencia especificada. Puede que la URL
            sea incorrecta.
          </p>
          <Link
            to="/competencias"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
            Volver a competencias
          </Link>
        </div>
      </div>
    );
  }

  // Determinar el tipo de competencia y su color
  const getTipoCompetencia = (id: string) => {
    if (id.startsWith('CB')) return { tipo: 'Básica', color: 'blue' };
    if (id.startsWith('CG')) return { tipo: 'General', color: 'indigo' };
    if (id.startsWith('CE')) return { tipo: 'Específica', color: 'purple' };
    if (id.startsWith('CT')) return { tipo: 'Transversal', color: 'teal' };
    return { tipo: 'Desconocida', color: 'gray' };
  };

  const { tipo, color } = getTipoCompetencia(id);

  // Encontrar todas las asignaturas que incluyen esta competencia y organizarlas por módulo
  const asignaturasPorModulo = data.modulos.reduce(
    (acc, modulo) => {
      const asignaturasModulo = modulo.materias.flatMap((materia) =>
        materia.asignaturas
          .filter((asignatura) =>
            asignatura.resultados_aprendizaje.includes(id),
          )
          .map((asignatura) => ({
            ...asignatura,
            modulo: modulo.nombre,
            materia: materia.nombre,
          })),
      );

      if (asignaturasModulo.length > 0) {
        acc[modulo.nombre] = asignaturasModulo;
      }

      return acc;
    },
    {} as {
      [key: string]: Array<{ nombre: string; modulo: string; materia: string }>;
    },
  );

  // Aplanar la lista para las estadísticas
  const asignaturasConCompetencia = Object.values(asignaturasPorModulo).flat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
        {/* Navegación */}
        <div className="mb-4 sm:mb-6">
          <BackButton to="/competencias" label="Volver a competencias" />
        </div>

        {/* Cabecera */}
        <div className="mb-8 text-center sm:mb-12">
          <div
            className={`mb-6 inline-block rounded-full bg-${color}-100 px-3 py-1.5 text-xs font-semibold text-${color}-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm`}
          >
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            Competencia {tipo}
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
            to="/asignaturas"
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
            to="/materias"
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
            to="/plan-estudios"
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

        {/* Lista de asignaturas por módulo */}
        <div className="space-y-6 sm:space-y-8">
          {Object.entries(asignaturasPorModulo).map(([modulo, asignaturas]) => (
            <div
              key={modulo}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <Link
                to={`/plan-estudios/${generateSlug(modulo)}`}
                className="group mb-4 flex items-center sm:mb-6"
              >
                <h2 className="flex items-center text-lg font-bold text-gray-800 group-hover:text-blue-600 sm:text-xl">
                  <FontAwesomeIcon
                    icon={faLayerGroup}
                    className={`mr-2 text-${color}-600 group-hover:text-blue-600 sm:mr-3`}
                  />
                  {modulo}
                </h2>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ml-2 transform text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </Link>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {asignaturas.map((asignatura, index) => (
                  <Link
                    key={index}
                    to={`/asignaturas/${generateSlug(asignatura.nombre)}`}
                    className="group flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 sm:p-4"
                  >
                    <h3 className="mb-2 text-sm font-medium text-gray-800 group-hover:text-blue-600 sm:text-base">
                      {asignatura.nombre}
                    </h3>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center rounded-full bg-${color}-100 px-2 py-1 text-xs font-medium text-${color}-800`}
                      >
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
