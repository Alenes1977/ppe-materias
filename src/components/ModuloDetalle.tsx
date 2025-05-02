import React from 'react';
import { Link, useParams } from 'react-router-dom';
import data from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faBook,
  faListAlt,
} from '@fortawesome/free-solid-svg-icons';

// Tipos para TypeScript
interface Asignatura {
  nombre: string;
  curso: string;
  semestre: string;
  competencias: string[];
}

interface Materia {
  nombre: string;
  ECTS?: string;
  'ECTS-n'?: string;
  'ECTS-basicos'?: string;
  'ECTS-obligatorios'?: string;
  'ECTS-optativos'?: string;
  asignaturas: Asignatura[];
  'actividad-formativa': string[];
  evaluacion: {
    tipo: string;
    'ponderacion-minima': string;
    'ponderacion-maxima': string;
  }[];
}

const ModuloDetalle: React.FC = () => {
  const { nombre } = useParams<{ nombre: string }>();

  // Encontrar el módulo correspondiente
  const modulo = data.modulos.find(
    (m) => m.nombre.replace(/\s+/g, '-').toLowerCase() === nombre,
  );

  // Función para obtener el número de ECTS de una materia, considerando diferentes formatos
  const obtenerECTSMateria = (materia: Materia): string => {
    return materia.ECTS || materia['ECTS-n'] || '0';
  };

  if (!modulo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Módulo no encontrado
          </h2>
          <p className="mb-6 text-gray-600">
            No se ha encontrado el módulo especificado. Puede que la URL sea
            incorrecta.
          </p>
          <Link
            to="/plan-estudios"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver al plan de estudios
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
            to="/plan-estudios"
            className="inline-flex items-center font-medium text-blue-600 hover:underline"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver al plan de estudios
          </Link>
        </div>

        {/* Cabecera del módulo */}
        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-md">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <h1 className="mb-2 text-3xl font-bold">{modulo.nombre}</h1>
            <div className="mt-2 inline-block rounded-full bg-white bg-opacity-20 px-4 py-1">
              <span className="font-medium">{modulo.ects} ECTS</span>
            </div>
          </div>

          <div className="p-6">
            {/* Descripción del módulo */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Sobre este módulo
              </h2>
              <p className="text-gray-700">
                El módulo {modulo.nombre} comprende {modulo.materias.length}{' '}
                materias con un total de {modulo.ects} créditos ECTS.
              </p>
            </div>

            {/* Listado de Materias */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Materias del módulo
              </h2>
              <div className="space-y-4">
                {modulo.materias.map((materia, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">
                      <FontAwesomeIcon
                        icon={faListAlt}
                        className="mr-2 text-blue-500"
                      />
                      {materia.nombre}
                    </h3>
                    {obtenerECTSMateria(materia) !== '0' && (
                      <div className="mb-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                          {obtenerECTSMateria(materia)} ECTS
                        </span>
                      </div>
                    )}

                    {/* Asignaturas de esta materia */}
                    <div className="mt-4">
                      <h4 className="mb-2 text-sm font-semibold uppercase text-gray-500">
                        Asignaturas
                      </h4>
                      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
                        {materia.asignaturas.map((asignatura, idx) => (
                          <li key={idx} className="p-3 hover:bg-gray-50">
                            <Link
                              to={`/asignaturas/${asignatura.nombre
                                .replace(/\s+/g, '-')
                                .toLowerCase()}`}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <FontAwesomeIcon
                                  icon={faBook}
                                  className="mr-3 text-blue-500"
                                />
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {asignatura.nombre}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {asignatura.curso}º Curso -{' '}
                                    {asignatura.semestre === 'anual'
                                      ? 'Anual'
                                      : `${asignatura.semestre}º Semestre`}
                                  </p>
                                </div>
                              </div>
                              <FontAwesomeIcon
                                icon={faArrowLeft}
                                className="rotate-180 transform text-gray-400"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actividades formativas */}
                    {materia['actividad-formativa'] &&
                      materia['actividad-formativa'].length > 0 && (
                        <div className="mt-6">
                          <h4 className="mb-2 text-sm font-semibold uppercase text-gray-500">
                            Actividades Formativas
                          </h4>
                          <ul className="space-y-1 rounded-lg bg-gray-50 p-4">
                            {materia['actividad-formativa'].map(
                              (actividad, actIdx) => (
                                <li
                                  key={actIdx}
                                  className="flex items-start text-sm"
                                >
                                  <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                  <span className="text-gray-700">
                                    {actividad}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Sistema de evaluación */}
                    {materia.evaluacion && materia.evaluacion.length > 0 && (
                      <div className="mt-6">
                        <h4 className="mb-2 text-sm font-semibold uppercase text-gray-500">
                          Sistema de Evaluación
                        </h4>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                  Tipo de Evaluación
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                  Ponderación Mín.
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                  Ponderación Máx.
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {materia.evaluacion.map((item, evalIdx) => (
                                <tr
                                  key={evalIdx}
                                  className={
                                    evalIdx % 2 === 0
                                      ? 'bg-white'
                                      : 'bg-gray-50'
                                  }
                                >
                                  <td className="whitespace-normal px-4 py-3 text-sm text-gray-900">
                                    {item.tipo}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                    {item['ponderacion-minima']}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                    {item['ponderacion-maxima']}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuloDetalle;
