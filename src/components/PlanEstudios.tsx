import React from 'react';
import { Link } from 'react-router-dom';
import data from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faChevronRight,
  faGraduationCap,
  faCalendarAlt,
  faUniversity,
} from '@fortawesome/free-solid-svg-icons';
import { generateSlug } from '../utils/stringUtils';

const PlanEstudios: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-14 pt-24">
        {/* Encabezado de la página */}
        <div className="mb-12 text-center">
          <div className="mb-8 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            Plan de estudios oficial
          </div>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            Plan de Estudios
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Explora la estructura completa del Grado en Filosofía, Política y
            Economía. Conoce los módulos, materias y asignaturas que componen
            este programa formativo.
          </p>
        </div>

        {/* Resumen del plan */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <h2 className="text-2xl font-bold">Estructura General</h2>
            <p className="mt-2 text-blue-100">
              Información básica del plan de estudios
            </p>
          </div>
          <div className="grid gap-8 p-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Información Básica
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center rounded-lg bg-gray-50 p-3">
                  <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FontAwesomeIcon icon={faUniversity} />
                  </span>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">
                      Titulación
                    </span>
                    <span className="text-gray-900">
                      Grado en Filosofía, Política y Economía
                    </span>
                  </div>
                </li>
                <li className="flex items-center rounded-lg bg-gray-50 p-3">
                  <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </span>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">
                      Créditos ECTS
                    </span>
                    <span className="text-gray-900">240 ECTS</span>
                  </div>
                </li>
                <li className="flex items-center rounded-lg bg-gray-50 p-3">
                  <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </span>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">
                      Duración
                    </span>
                    <span className="text-gray-900">4 años académicos</span>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Distribución de Créditos
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Formación Básica
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                      60 ECTS
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Obligatorias
                    </span>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                      120 ECTS
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Optativas</span>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                      48 ECTS
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">
                      Trabajo Fin de Grado
                    </span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      12 ECTS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos del plan de estudios */}
        <div className="mb-12">
          <div className="mb-8 flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Módulos del Plan de Estudios
            </h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.modulos.map((modulo, index) => (
              <Link
                key={index}
                to={`/plan-estudios/${generateSlug(modulo.nombre)}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                  <h3 className="text-xl font-bold">{modulo.nombre}</h3>
                  <div className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm">
                    {modulo.ects} ECTS
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold uppercase text-gray-500">
                        Materias
                      </h4>
                      <p className="text-gray-700">
                        {modulo.materias.length} materias en este módulo
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase text-gray-500">
                        Asignaturas
                      </h4>
                      <p className="text-gray-700">
                        {modulo.materias.reduce(
                          (total, materia) =>
                            total + materia.asignaturas.length,
                          0,
                        )}{' '}
                        asignaturas en total
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-medium text-blue-600">
                    Ver detalle del módulo
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

        {/* Cursos y semestres */}
        <div>
          <div className="mb-8 flex items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Distribución por Cursos
            </h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>

          {[1, 2, 3, 4].map((curso) => (
            <div key={curso} className="mb-8 last:mb-0">
              <h3 className="mb-4 inline-block rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-lg font-bold text-white">
                {curso}º Curso
              </h3>

              {/* Semestres */}
              <div className="grid gap-6 md:grid-cols-2">
                {['1', '2'].map((semestre) => {
                  const asignaturasFiltradas = data.modulos
                    .flatMap((modulo) =>
                      modulo.materias.flatMap((materia) =>
                        materia.asignaturas
                          .filter(
                            (asignatura) =>
                              asignatura.curso === curso.toString() &&
                              (asignatura.semestre === semestre ||
                                asignatura.semestre === 'anual'),
                          )
                          .map((asignatura) => ({
                            ...asignatura,
                            modulo: modulo.nombre,
                            materia: materia.nombre,
                          })),
                      ),
                    )
                    .sort((a, b) => a.nombre.localeCompare(b.nombre));

                  return (
                    <div
                      key={semestre}
                      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <h4 className="mb-4 text-lg font-semibold text-gray-800">
                        {semestre === '1' ? 'Primer' : 'Segundo'} Semestre
                      </h4>
                      {asignaturasFiltradas.length > 0 ? (
                        <ul className="space-y-2">
                          {asignaturasFiltradas.map((asignatura, idx) => (
                            <li key={idx}>
                              <Link
                                to={`/asignaturas/${asignatura.nombre
                                  .replace(/\s+/g, '-')
                                  .toLowerCase()}`}
                                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50"
                              >
                                <div className="flex items-center">
                                  <FontAwesomeIcon
                                    icon={faBook}
                                    className="mr-3 text-blue-500"
                                  />
                                  <span className="font-medium text-gray-700">
                                    {asignatura.nombre}
                                  </span>
                                </div>
                                {asignatura.semestre === 'anual' && (
                                  <span className="ml-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                                    Anual
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="rounded-lg bg-gray-50 p-4 text-center text-gray-500">
                          No hay asignaturas para este semestre
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanEstudios;
