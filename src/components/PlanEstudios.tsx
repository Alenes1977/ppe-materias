import type React from 'react';
import { Link } from 'react-router-dom';
import data from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faChevronRight,
  faGraduationCap,
  faUniversity,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { generateSlug } from '../utils/stringUtils';

const PlanEstudios: React.FC = () => {
  const todasAsignaturas = data.modulos.flatMap((m) =>
    m.materias.flatMap((mat) => mat.asignaturas),
  );

  const ectsBasicas = todasAsignaturas
    .filter((a) => a.tipo === 'Básica')
    .reduce((sum, a) => sum + a.ects, 0);

  const ectsObligatorias = todasAsignaturas
    .filter((a) => a.tipo === 'Obligatoria')
    .reduce((sum, a) => sum + a.ects, 0);

  const ectsOptativas = todasAsignaturas
    .filter((a) => a.tipo === 'Optativa')
    .reduce((sum, a) => sum + a.ects, 0);

  const ectsTotal = ectsBasicas + ectsObligatorias + ectsOptativas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-16 sm:pb-14 sm:pt-20 md:pt-24">
        {/* Encabezado de la página */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            Plan de estudios oficial
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            Plan de Estudios
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-gray-600 sm:text-base md:text-lg">
            Explora la estructura completa del Grado en Filosofía, Política y
            Economía. Conoce los módulos, materias y asignaturas que componen
            este programa formativo.
          </p>
        </div>

        {/* Resumen del plan */}
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
                    Grado en Filosofía, Política y Economía
                  </span>
                </div>
              </li>
              <li className="flex items-center rounded-lg bg-gray-50 p-3 sm:p-4">
                <div>
                  <span className="block text-xs font-medium text-gray-500 sm:text-sm">
                    Duración
                  </span>
                  <span className="text-sm text-gray-900 sm:text-base">
                    4 años académicos
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
              Distribución de Créditos
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
                <span className="text-sm font-medium text-gray-700 sm:text-base">
                  Asignaturas Básicas
                </span>
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 sm:px-3 sm:text-sm">
                  {ectsBasicas} ECTS
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
                <span className="text-sm font-medium text-gray-700 sm:text-base">
                  Asignaturas Obligatorias
                </span>
                <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-800 sm:px-3 sm:text-sm">
                  {ectsObligatorias} ECTS
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
                <span className="text-sm font-medium text-gray-700 sm:text-base">
                  Asignaturas Optativas
                </span>
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 sm:px-3 sm:text-sm">
                  {ectsOptativas} ECTS
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 sm:p-4">
                <span className="text-sm font-medium text-gray-700 sm:text-base">
                  Trabajo Fin de Grado
                </span>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 sm:px-3 sm:text-sm">
                  12 ECTS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos del plan de estudios */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-6 flex items-center sm:mb-8">
            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Módulos del Plan de Estudios
            </h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.modulos.map((modulo, index) => (
              <Link
                key={index}
                to={`/plan-estudios/${generateSlug(modulo.nombre)}`}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6"
              >
                <div className="mb-3 sm:mb-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 sm:px-3 sm:text-sm">
                    {modulo.ects} ECTS
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-800 group-hover:text-blue-600 sm:mb-4 sm:text-xl">
                  {modulo.nombre}
                </h3>
                <div className="mt-auto space-y-2 sm:space-y-3">
                  <Link
                    to="/materias"
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 transition-all hover:bg-purple-50 hover:text-purple-700 sm:px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-gray-600 group-hover:text-purple-700 sm:text-sm">
                      Materias
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 group-hover:text-purple-700">
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
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 transition-all hover:bg-green-50 hover:text-green-700 sm:px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-gray-600 group-hover:text-green-700 sm:text-sm">
                      Asignaturas
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 group-hover:text-green-700">
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

        {/* Cursos y semestres */}
        <div>
          <div className="mb-6 flex items-center sm:mb-8">
            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Distribución por Cursos
            </h2>
            <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>

          {[1, 2, 3, 4].map((curso) => (
            <div key={curso} className="mb-6 last:mb-0 sm:mb-8">
              <h3 className="mb-3 inline-flex items-center rounded-lg bg-blue-100 px-3 py-1.5 text-base font-bold text-blue-800 sm:mb-4 sm:px-4 sm:py-2 sm:text-lg">
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                {curso}º Curso
              </h3>

              {/* Semestres */}
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {[1, 2].map((semestre) => {
                  const asignaturasFiltradas = data.modulos
                    .flatMap((modulo) =>
                      modulo.materias.flatMap((materia) =>
                        materia.asignaturas
                          .filter(
                            (asignatura) =>
                              asignatura.curso === curso &&
                              asignatura.semestre === semestre,
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
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
                    >
                      <h4 className="mb-3 text-base font-semibold text-gray-800 sm:mb-4 sm:text-lg">
                        {semestre === 1 ? 'Primer' : 'Segundo'} Semestre
                      </h4>
                      {asignaturasFiltradas.length > 0 ? (
                        <ul className="space-y-2 sm:space-y-3">
                          {asignaturasFiltradas.map((asignatura, idx) => (
                            <li key={idx}>
                              <Link
                                to={`/asignaturas/${generateSlug(
                                  asignatura.nombre,
                                )}`}
                                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50 sm:p-4"
                              >
                                <div className="flex min-w-0 items-center">
                                  <FontAwesomeIcon
                                    icon={faBook}
                                    className="mr-2 shrink-0 text-blue-500 sm:mr-3"
                                  />
                                  <span className="truncate text-sm font-medium text-gray-700 group-hover:text-blue-600 sm:text-base">
                                    {asignatura.nombre}
                                  </span>
                                </div>
                                <div className="ml-2 flex shrink-0 items-center gap-1.5 sm:gap-2">
                                  {asignatura.tipo ? (
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                        asignatura.tipo === 'Básica'
                                          ? 'bg-purple-100 text-purple-700'
                                          : asignatura.tipo === 'Optativa'
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-blue-100 text-blue-700'
                                      }`}
                                    >
                                      {asignatura.tipo}
                                    </span>
                                  ) : null}
                                  <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                                    {asignatura.ects} ECTS
                                  </span>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="rounded-lg bg-gray-50 p-3 text-center text-xs text-gray-500 sm:p-4 sm:text-sm">
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
