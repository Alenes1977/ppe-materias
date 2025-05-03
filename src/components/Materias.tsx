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
      <div className="container mx-auto px-4 pb-14 pt-24">
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <div className="mb-8 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
            Materias del plan de estudios
          </div>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            Materias del Grado
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explora todas las materias del Grado en Filosofía, Política y
            Economía, organizadas por módulos y con sus asignaturas
            correspondientes.
          </p>
        </div>

        {/* Lista de módulos y sus materias */}
        {modulosInfo.map((modulo, index) => (
          <div key={index} className="mb-12 last:mb-0">
            <Link
              to={`/plan-estudios/${generateSlug(modulo.nombre)}`}
              className="group mb-6 inline-flex items-center"
            >
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                {modulo.nombre}
              </h2>
              <span className="ml-3 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {modulo.ects} ECTS
              </span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="ml-2 transform text-blue-600 transition-transform group-hover:translate-x-1"
              />
            </Link>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modulo.materias.map((materia, mIndex) => (
                <Link
                  key={mIndex}
                  to={`/materias/${generateSlug(materia.nombre)}`}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                      {materia.nombre}
                    </h3>
                    <span className="ml-4 shrink-0 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                      {materia.totalECTS} ECTS
                    </span>
                  </div>

                  {/* Lista compacta de asignaturas por curso */}
                  <div className="flex-1 space-y-3">
                    {materia.asignaturasPorCurso.map((curso, idx) => (
                      <div key={idx} className="rounded-lg bg-gray-50 p-3">
                        <div className="mb-2 flex items-center text-sm font-medium text-gray-700">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-2 text-blue-500"
                          />
                          {curso.curso}º Curso
                        </div>
                        <div className="grid gap-2">
                          {curso.asignaturas.map((asignatura, aIdx) => (
                            <div
                              key={aIdx}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center text-gray-600">
                                <FontAwesomeIcon
                                  icon={faBook}
                                  className="mr-2 text-blue-400"
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
                  <div className="mt-4 flex items-center justify-end border-t border-gray-100 pt-4 text-sm font-medium text-blue-600">
                    Ver detalle
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="ml-2 transform transition-transform group-hover:translate-x-1"
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
