import React from 'react';
import { Link, useParams } from 'react-router-dom';
import data from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faGraduationCap,
  faBuilding,
  faCalendarAlt,
  faList,
} from '@fortawesome/free-solid-svg-icons';

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
        (a) => a.nombre.replace(/\s+/g, '-').toLowerCase() === nombre,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navegación de regreso */}
        <div className="mb-6">
          <Link
            to="/asignaturas"
            className="inline-flex items-center font-medium text-blue-600 hover:underline"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver a asignaturas
          </Link>
        </div>

        {/* Cabecera de la asignatura */}
        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-md">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <h1 className="mb-2 text-3xl font-bold">{asignaturaInfo.nombre}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                <span>{asignaturaInfo.curso}º Curso</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                <span>
                  {asignaturaInfo.semestre === 'anual'
                    ? 'Anual'
                    : `${asignaturaInfo.semestre}º Semestre`}
                </span>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 bg-blue-50 p-4">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="mr-2 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Módulo:
                </span>
                <Link
                  to={`/plan-estudios/${moduloInfo.nombre
                    .replace(/\s+/g, '-')
                    .toLowerCase()}`}
                  className="ml-2 text-sm text-blue-600 hover:underline"
                >
                  {moduloInfo.nombre}
                </Link>
              </div>

              <div className="flex items-center">
                <FontAwesomeIcon icon={faList} className="mr-2 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Materia:
                </span>
                <span className="ml-2 text-sm text-gray-900">
                  {materiaInfo.nombre}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Competencias */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Competencias
              </h2>
              {asignaturaInfo.competencias &&
              asignaturaInfo.competencias.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {asignaturaInfo.competencias.map((competencia, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      {competencia}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No hay competencias especificadas para esta asignatura.
                </p>
              )}
            </div>

            {/* Actividades formativas */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Actividades Formativas
              </h2>
              {asignaturaInfo.actividadesFormativas &&
              asignaturaInfo.actividadesFormativas.length > 0 ? (
                <ul className="space-y-2 rounded-lg bg-gray-50 p-4">
                  {asignaturaInfo.actividadesFormativas.map(
                    (actividad, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                        <span className="text-gray-700">{actividad}</span>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No hay actividades formativas especificadas para esta
                  asignatura.
                </p>
              )}
            </div>

            {/* Sistema de evaluación */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Sistema de Evaluación
              </h2>
              {asignaturaInfo.evaluacion &&
              asignaturaInfo.evaluacion.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Tipo de Evaluación
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Ponderación Mínima
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          Ponderación Máxima
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
                          <td className="whitespace-normal px-6 py-4 text-sm text-gray-900">
                            {item.tipo}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item['ponderacion-minima']}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {item['ponderacion-maxima']}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">
                  No hay información de evaluación disponible para esta
                  asignatura.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsignaturaDetalle;
