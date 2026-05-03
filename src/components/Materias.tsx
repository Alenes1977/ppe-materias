import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { generateSlug } from '../utils/stringUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faBook,
  faChevronRight,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import { useDegree } from '../context/DegreeContext';
import { courseYearPillClass, ectsPillClass } from '../utils/courseBadgeStyles';

const Materias = () => {
  const { degreeId } = useParams<{ degreeId: string }>();
  const { degreePlan, degreeInfo } = useDegree();
  const base = `/${degreeId}`;

  const modulosInfo = useMemo(
    () =>
      degreePlan.modules.map((modulo) => ({
        name: modulo.name,
        ects: modulo.ects,
        materias: modulo.subjects.map((subj) => {
          const totalECTS = subj.courses.reduce((s, c) => s + c.ects, 0);
          const asignaturasPorCurso = subj.courses
            .reduce(
              (acc, c) => {
                const found = acc.find((x) => x.curso === c.year);
                if (found) {
                  found.asignaturas.push(c);
                } else {
                  acc.push({ curso: c.year, asignaturas: [c] });
                }
                return acc;
              },
              [] as { curso: number; asignaturas: typeof subj.courses }[],
            )
            .sort((a, b) => a.curso - b.curso);
          return { ...subj, totalECTS, asignaturasPorCurso };
        }),
      })),
    [degreePlan],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
            Materias del plan de estudios
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            Materias del Grado
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-lg">
            Explora todas las materias del {degreeInfo.name}, organizadas por
            módulos y con sus asignaturas correspondientes.
          </p>
        </div>

        {/* Módulos y materias */}
        <div className="space-y-8 sm:space-y-12">
          {modulosInfo.map((modulo) => (
            <div key={modulo.name}>
              <div className="mb-6 flex items-center sm:mb-8">
                <Link
                  to={`${base}/plan-estudios/${generateSlug(modulo.name)}`}
                  className="group flex items-center"
                >
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 sm:text-2xl">
                    {modulo.name}
                  </h2>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="ml-2 text-gray-400 group-hover:text-blue-600"
                  />
                </Link>
                <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent" />
                <span className="ml-4 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                  {modulo.ects} ECTS
                </span>
              </div>

              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {modulo.materias.map((materia) => (
                  <Link
                    key={materia.name}
                    to={`${base}/materias/${generateSlug(materia.name)}`}
                    className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-6"
                  >
                    <div className="mb-3 flex items-center justify-between sm:mb-4">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 sm:px-3 sm:text-sm">
                        {materia.totalECTS} ECTS
                      </span>
                      <span className="text-xs text-gray-500 sm:text-sm">
                        {materia.courses.length} asignaturas
                      </span>
                    </div>
                    <h3 className="mb-3 text-base font-bold text-gray-800 group-hover:text-blue-600 sm:mb-4 sm:text-lg">
                      {materia.name}
                    </h3>
                    <div className="space-y-3">
                      {materia.asignaturasPorCurso.map(
                        ({ curso, asignaturas }) => (
                          <div key={curso}>
                            <div className="mb-1.5 sm:mb-2">
                              <span className={courseYearPillClass(curso)}>
                                <FontAwesomeIcon
                                  icon={faGraduationCap}
                                  className="mr-1.5"
                                />
                                {curso}º Curso
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {asignaturas.map((asig) => (
                                <li key={asig.name}>
                                  <Link
                                    to={`${base}/asignaturas/${generateSlug(
                                      asig.name,
                                    )}`}
                                    className="flex items-center rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <FontAwesomeIcon
                                      icon={faBook}
                                      className="mr-2 shrink-0 text-blue-400"
                                    />
                                    <span className="min-w-0 break-words">
                                      {asig.name}
                                    </span>
                                    <span
                                      className={`ml-auto shrink-0 ${ectsPillClass()}`}
                                    >
                                      {asig.ects} ECTS
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ),
                      )}
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

export default Materias;
