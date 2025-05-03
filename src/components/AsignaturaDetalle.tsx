import React from 'react';
import { Link, useParams } from 'react-router-dom';
import data from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faGraduationCap,
  faBuilding,
  faCalendarAlt,
  faBookOpen,
  faClipboardList,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import BackButton from './BackButton';
import { generateSlug } from '../utils/stringUtils';

// Tipo para las competencias
type CompetenciasType = {
  [key: string]: string;
};

const AsignaturaDetalle: React.FC = () => {
  const { nombre } = useParams<{ nombre: string }>();

  // Encontrar la asignatura correspondiente
  let asignaturaInfo = null;
  let moduloInfo = null;
  let materiaInfo = null;

  // Buscar en todos los módulos y materias
  for (const modulo of data.modulos) {
    for (const materia of modulo.materias) {
      const asignatura = materia.asignaturas.find(
        (a) => generateSlug(a.nombre) === nombre,
      );

      if (asignatura) {
        asignaturaInfo = {
          ...asignatura,
          modulo: modulo.nombre,
          materia: materia.nombre,
          actividadesFormativas: materia['actividad-formativa'],
          evaluacion: materia.evaluacion,
        };
        moduloInfo = modulo;
        materiaInfo = materia;
        break;
      }
    }
    if (asignaturaInfo) break;
  }

  if (!asignaturaInfo) {
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
            to="/asignaturas"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver a asignaturas
          </Link>
        </div>
      </div>
    );
  }

  // Si llegamos aquí, sabemos que asignaturaInfo, moduloInfo y materiaInfo no son null
  // TypeScript no lo infiere automáticamente, así que hacemos una comprobación adicional
  if (!moduloInfo || !materiaInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Error al cargar la asignatura
          </h2>
          <p className="mb-6 text-gray-600">
            No se ha podido cargar la información completa de la asignatura.
          </p>
          <Link
            to="/asignaturas"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver a asignaturas
          </Link>
        </div>
      </div>
    );
  }

  // Función para obtener la descripción de una competencia
  const getCompetenciaDescripcion = (competenciaId: string): string => {
    return (
      (data.competencias as CompetenciasType)[competenciaId] ||
      'Descripción no disponible'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
        {/* Navegación de regreso */}
        <div className="mb-6 sm:mb-8">
          <BackButton to="/asignaturas" label="Volver a asignaturas" />
        </div>

        {/* Cabecera de la asignatura */}
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
              {asignaturaInfo.semestre === 'anual'
                ? 'Anual'
                : `${asignaturaInfo.semestre}º Semestre`}
            </span>
            <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-800 sm:px-4 sm:py-2 sm:text-sm">
              {asignaturaInfo.ects} ECTS
            </span>
          </div>
        </div>

        {/* Contenedor principal */}
        <div className="space-y-6 sm:space-y-8">
          {/* Grid de dos columnas para Ubicación y Competencias */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {/* Columna izquierda: Información básica */}
            <div>
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
                    <h3 className="text-sm font-medium text-gray-500">
                      Módulo
                    </h3>
                    <Link
                      to={`/plan-estudios/${generateSlug(moduloInfo.nombre)}`}
                      className="mt-1 block rounded-lg bg-blue-50 p-2 text-sm text-blue-700 transition-all hover:bg-blue-100 sm:p-3"
                    >
                      {moduloInfo.nombre}
                    </Link>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Materia
                    </h3>
                    <Link
                      to={`/materias/${generateSlug(materiaInfo.nombre)}`}
                      className="mt-1 block rounded-lg bg-purple-50 p-2 text-sm text-purple-700 transition-all hover:bg-purple-100 sm:p-3"
                    >
                      {materiaInfo.nombre}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Competencias */}
            <div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 flex items-center text-lg font-bold text-gray-800 sm:mb-6 sm:text-xl">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-3 text-blue-600"
                  />
                  Competencias
                </h2>
                {asignaturaInfo.competencias &&
                asignaturaInfo.competencias.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {asignaturaInfo.competencias.map((competencia, index) => (
                      <Link
                        key={index}
                        to={`/competencias/${competencia}`}
                        className="group relative inline-flex items-center rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 transition-all hover:from-blue-100 hover:to-blue-200 sm:px-4 sm:py-2 sm:text-sm"
                        title={getCompetenciaDescripcion(competencia)}
                      >
                        <span>{competencia}</span>
                        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 transform rounded-lg bg-gray-900 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 sm:w-72">
                          {getCompetenciaDescripcion(competencia)}
                          <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No hay competencias especificadas para esta asignatura.
                  </p>
                )}
              </div>
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
            {asignaturaInfo.actividadesFormativas &&
            asignaturaInfo.actividadesFormativas.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {asignaturaInfo.actividadesFormativas.map(
                  (actividad, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs sm:text-sm"
                    >
                      <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></div>
                      <span className="text-gray-700">{actividad}</span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No hay actividades formativas especificadas para esta
                asignatura.
              </p>
            )}
          </div>

          {/* Sistema de evaluación */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center text-lg font-bold text-gray-800 sm:mb-6 sm:text-xl">
              <FontAwesomeIcon
                icon={faChartBar}
                className="mr-3 text-blue-600"
              />
              Sistema de Evaluación
            </h2>
            {asignaturaInfo.evaluacion &&
            asignaturaInfo.evaluacion.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th scope="col" className="px-4 py-3 text-left sm:px-6">
                          <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                            Tipo de Evaluación
                          </span>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center sm:px-6"
                        >
                          <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                            Ponderación Mínima
                          </span>
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center sm:px-6"
                        >
                          <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                            Ponderación Máxima
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {asignaturaInfo.evaluacion.map((item, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }
                        >
                          <td className="whitespace-normal px-4 py-3 sm:px-6">
                            <span className="text-xs font-medium text-gray-900 sm:text-sm">
                              {item.tipo}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-center sm:px-6">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 sm:px-2.5">
                              {item['ponderacion-minima']}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-center sm:px-6">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 sm:px-2.5">
                              {item['ponderacion-maxima']}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No hay información de evaluación disponible para esta
                asignatura.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignaturaDetalle;
