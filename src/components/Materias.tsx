import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/ppe.json';
import { generateSlug } from '../utils/stringUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faBook,
  faChevronRight,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

const Materias: React.FC = () => {
  const modulosInfo = useMemo(() => {
    return data.modulos.map((modulo) => ({
      ...modulo,
      materias: modulo.materias.map((materia) => ({
        ...materia,
        totalECTS: materia.asignaturas.reduce(
          (sum, asig) => sum + asig.ects,
          0,
        ),
        asignaturasPorCurso: materia.asignaturas
          .reduce(
            (acc, asig) => {
              const curso = acc.find((c) => c.curso === asig.curso);
              if (curso) {
                curso.asignaturas.push(asig);
              } else {
                acc.push({ curso: asig.curso, asignaturas: [asig] });
              }
              return acc;
            },
            [] as { curso: string; asignaturas: typeof materia.asignaturas }[],
          )
          .sort((a, b) => Number(a.curso) - Number(b.curso)),
      })),
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
        {/* Encabezado */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
            Materias del plan de estudios
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            Materias del Grado
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-lg">
            Explora todas las materias del Grado en Filosofía, Política y
            Economía, organizadas por módulos y con sus asignaturas
            correspondientes.
          </p>
        </div>

        {/* Lista de módulos y sus materias */}
        {modulosInfo.map((modulo, index) => (
          <div key={index} className="mb-8 last:mb-0 sm:mb-12">
            <Link
              to={`/plan-estudios/${generateSlug(modulo.nombre)}`}
              className="group mb-4 inline-flex items-center sm:mb-6"
            >
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 sm:text-xl">
                {modulo.nombre}
              </h2>
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 sm:ml-3 sm:px-3">
                {modulo.ects} ECTS
              </span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="ml-2 transform text-blue-600 transition-transform group-hover:translate-x-1"
              />
            </Link>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {modulo.materias.map((materia, mIndex) => (
                <Link
                  key={mIndex}
                  to={`/materias/${generateSlug(materia.nombre)}`}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6"
                >
                  <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 sm:mb-4 sm:pb-4">
                    <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 sm:text-xl">
                      {materia.nombre}
                    </h3>
                    <span className="ml-2 shrink-0 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 sm:ml-4 sm:px-3">
                      {materia.totalECTS} ECTS
                    </span>
                  </div>

                  {/* Lista compacta de asignaturas por curso */}
                  <div className="flex-1 space-y-2 sm:space-y-3">
                    {materia.asignaturasPorCurso.map((curso, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-gray-50 p-2 sm:p-3"
                      >
                        <div className="mb-1.5 flex items-center text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-1.5 text-blue-500 sm:mr-2"
                          />
                          {curso.curso}º Curso
                        </div>
                        <div className="grid gap-1.5 sm:gap-2">
                          {curso.asignaturas.map((asignatura, aIdx) => (
                            <div
                              key={aIdx}
                              className="flex items-center justify-between text-xs sm:text-sm"
                            >
                              <div className="flex items-center text-gray-600">
                                <FontAwesomeIcon
                                  icon={faBook}
                                  className="mr-1.5 text-blue-400 sm:mr-2"
                                  style={{ fontSize: '0.75rem' }}
                                />
                                {asignatura.nombre}
                              </div>
                              <span className="ml-2 shrink-0 whitespace-nowrap text-xs text-gray-500">
                                {asignatura.ects} ECTS
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botón de ver más */}
                  <div className="mt-3 flex items-center justify-end border-t border-gray-100 pt-3 text-xs font-medium text-blue-600 sm:mt-4 sm:pt-4 sm:text-sm">
                    Ver detalle
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="ml-1.5 transform transition-transform group-hover:translate-x-1 sm:ml-2"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Materias;
