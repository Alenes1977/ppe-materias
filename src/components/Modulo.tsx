import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateSlug } from '../utils/stringUtils';
import BackButton from './BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faLayerGroup,
  faBookOpen,
  faChalkboardTeacher,
  faCalendarAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { useDegree } from '../context/DegreeContext';
import type { Semester } from '../types/degree';

const Modulo: FC = () => {
  const { moduloSlug, degreeId } = useParams<{ moduloSlug: string; degreeId: string }>();
  const { degreePlan } = useDegree();
  const base = `/${degreeId}`;

  const modulo = degreePlan.modules.find(
    (m) => generateSlug(m.name) === moduloSlug,
  );

  if (!modulo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24">
          <div className="mb-6">
            <BackButton to={`${base}/plan-estudios`} />
          </div>
          <div className="rounded-xl bg-white p-6 text-center shadow-lg sm:p-8">
            <h1 className="mb-4 text-xl font-bold text-red-600 sm:text-2xl">
              Módulo no encontrado
            </h1>
            <p className="text-sm text-gray-600 sm:text-base">
              El módulo que buscas no existe o no está disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const semLabel = (s: Semester) => {
    if (s === 'annual') return 'Anual';
    return `${s}er Sem.`;
  };

  const ordenar = (courses: (typeof modulo.subjects)[0]['courses']) =>
    [...courses].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const sa = a.semester === 'annual' ? 0 : (a.semester as number);
      const sb = b.semester === 'annual' ? 0 : (b.semester as number);
      return sa - sb;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-16 sm:pb-14 sm:pt-20 md:pt-24">
        <div className="mb-6">
          <BackButton to={`${base}/plan-estudios`} />
        </div>

        {/* Cabecera */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
            Módulo
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            {modulo.name}
          </h1>
          <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800">
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
              {modulo.ects} ECTS
            </span>
            <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-800">
              <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
              {modulo.subjects.length} materias
            </span>
          </div>
        </div>

        {/* Materias */}
        <div className="space-y-6 sm:space-y-8">
          {modulo.subjects.map((materia) => (
            <div
              key={materia.name}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-b border-gray-100 bg-gray-50 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    to={`${base}/materias/${generateSlug(materia.name)}`}
                    className="group"
                  >
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 sm:text-2xl">
                      {materia.name}
                    </h2>
                  </Link>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 sm:px-4 sm:text-sm">
                      <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
                      {materia.ects} ECTS
                    </span>
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800 sm:px-4 sm:text-sm">
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
                      {materia.courses.length} asignaturas
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  {ordenar(materia.courses).map((course) => (
                    <Link
                      key={course.name}
                      to={`${base}/asignaturas/${generateSlug(course.name)}`}
                      className="group flex flex-col rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-blue-300 hover:bg-blue-50 sm:p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">
                          {course.name}
                        </h3>
                        {course.type === 'Básica' && (
                          <FontAwesomeIcon
                            icon={faStar}
                            className="ml-1 mt-0.5 shrink-0 text-amber-400"
                          />
                        )}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                          {course.year}º curso
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                          {semLabel(course.semester)}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                          {course.ects} ECTS
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modulo;
