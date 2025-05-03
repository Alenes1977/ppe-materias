import React from 'react';
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
  const descripcion = (data.competencias as { [key: string]: string })[
    id || ''
  ];

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
          .filter((asignatura) => asignatura.competencias.includes(id))
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
    {} as { [key: string]: Array<any> },
  );

  // Aplanar la lista para las estadísticas
  const asignaturasConCompetencia = Object.values(asignaturasPorModulo).flat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-14 pt-24">
        {/* Navegación */}
        <div className="mb-6">
          <BackButton to="/competencias" label="Volver a competencias" />
        </div>

        {/* Cabecera */}
        <div className="mb-12 text-center">
          <div
            className={`mb-8 inline-block rounded-full bg-${color}-100 px-4 py-2 text-sm font-semibold text-${color}-800`}
          >
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            Competencia {tipo}
          </div>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            {id}
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            {descripcion}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link
            to="/asignaturas"
            className="group rounded-xl border border-green-200 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:bg-green-50 hover:shadow-md"
          >
            <div className="mb-2 text-2xl font-bold text-green-600">
              {asignaturasConCompetencia.length}
            </div>
            <div className="text-sm text-gray-600 group-hover:text-green-600">
              Asignaturas
            </div>
          </Link>
          <Link
            to="/materias"
            className="group rounded-xl border border-purple-200 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:bg-purple-50 hover:shadow-md"
          >
            <div className="mb-2 text-2xl font-bold text-purple-600">
              {new Set(asignaturasConCompetencia.map((a) => a.materia)).size}
            </div>
            <div className="text-sm text-gray-600 group-hover:text-purple-600">
              Materias
            </div>
          </Link>
          <Link
            to="/plan-estudios"
            className="group rounded-xl border border-blue-200 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:bg-blue-50 hover:shadow-md"
          >
            <div className="mb-2 text-2xl font-bold text-blue-600">
              {Object.keys(asignaturasPorModulo).length}
            </div>
            <div className="text-sm text-gray-600 group-hover:text-blue-600">
              Módulos
            </div>
          </Link>
        </div>

        {/* Lista de asignaturas por módulo */}
        <div className="space-y-8">
          {Object.entries(asignaturasPorModulo).map(([modulo, asignaturas]) => (
            <div
              key={modulo}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <Link
                to={`/plan-estudios/${generateSlug(modulo)}`}
                className="group mb-6 flex items-center"
              >
                <h2 className="flex items-center text-xl font-bold text-gray-800 group-hover:text-blue-600">
                  <FontAwesomeIcon
                    icon={faLayerGroup}
                    className={`mr-3 text-${color}-600 group-hover:text-blue-600`}
                  />
                  {modulo}
                </h2>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ml-2 transform text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </Link>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {asignaturas.map((asignatura, index) => (
                  <Link
                    key={index}
                    to={`/asignaturas/${generateSlug(asignatura.nombre)}`}
                    className="group flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50"
                  >
                    <h3 className="mb-2 font-medium text-gray-800 group-hover:text-blue-600">
                      {asignatura.nombre}
                    </h3>
                    <div className="mt-auto flex flex-wrap gap-2 text-sm">
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
