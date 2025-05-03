import React from 'react';
import { Link } from 'react-router-dom';
import data from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faChevronRight,
  faGraduationCap,
  faUniversity,
  faLayerGroup,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { generateSlug } from '../utils/stringUtils';

const PlanEstudios: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
              <FontAwesomeIcon
                icon={faUniversity}
                className="mr-3 text-blue-600"
              />
              Información Básica
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center rounded-lg bg-gray-50 p-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Titulación
                  </span>
                  <span className="text-gray-900">
                    Grado en Filosofía, Política y Economía
                  </span>
                </div>
              </li>
              <li className="flex items-center rounded-lg bg-gray-50 p-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Duración
                  </span>
                  <span className="text-gray-900">4 años académicos</span>
                </div>
              </li>
              <li className="flex items-center rounded-lg bg-gray-50 p-4">
                <div>
                  <span className="block text-sm font-medium text-gray-500">
                    Total Créditos
                  </span>
                  <span className="text-gray-900">240 ECTS</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
              <FontAwesomeIcon
                icon={faLayerGroup}
                className="mr-3 text-blue-600"
              />
              Distribución de Créditos
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <span className="font-medium text-gray-700">
                  Formación Básica
                </span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  60 ECTS
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <span className="font-medium text-gray-700">Obligatorias</span>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  120 ECTS
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <span className="font-medium text-gray-700">Optativas</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  48 ECTS
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <span className="font-medium text-gray-700">
                  Trabajo Fin de Grado
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                  12 ECTS
                </span>
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
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {modulo.ects} ECTS
                  </span>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-800 group-hover:text-blue-600">
                  {modulo.nombre}
                </h3>
                <div className="mt-auto space-y-3">
                  <Link
                    to="/materias"
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 transition-all hover:bg-purple-50 hover:text-purple-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-sm text-gray-600 group-hover:text-purple-700">
                      Materias
                    </span>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 group-hover:text-purple-700">
                        {modulo.materias.length}
                      </span>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="ml-2 h-3 w-3 transform text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-purple-700"
                      />
                    </div>
                  </Link>
                  <Link
                    to="/asignaturas"
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 transition-all hover:bg-green-50 hover:text-green-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-sm text-gray-600 group-hover:text-green-700">
                      Asignaturas
                    </span>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 group-hover:text-green-700">
                        {modulo.materias.reduce(
                          (total, materia) =>
                            total + materia.asignaturas.length,
                          0,
                        )}
                      </span>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="ml-2 h-3 w-3 transform text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-green-700"
                      />
                    </div>
                  </Link>
                  <div className="mt-4 flex items-center justify-end text-sm font-medium text-blue-600">
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
              <h3 className="mb-4 inline-flex items-center rounded-lg bg-blue-100 px-4 py-2 text-lg font-bold text-blue-800">
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
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
                        <ul className="space-y-3">
                          {asignaturasFiltradas.map((asignatura, idx) => (
                            <li key={idx}>
                              <Link
                                to={`/asignaturas/${generateSlug(
                                  asignatura.nombre,
                                )}`}
                                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50"
                              >
                                <div className="flex items-center">
                                  <FontAwesomeIcon
                                    icon={faBook}
                                    className="mr-3 text-blue-500"
                                  />
                                  <span className="font-medium text-gray-700 group-hover:text-blue-600">
                                    {asignatura.nombre}
                                  </span>
                                </div>
                                {asignatura.semestre === 'anual' && (
                                  <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                    <FontAwesomeIcon
                                      icon={faClock}
                                      className="mr-1.5"
                                    />
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
