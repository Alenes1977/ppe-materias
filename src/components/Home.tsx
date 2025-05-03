import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faListCheck,
  faSearch,
  faChalkboardTeacher,
  faUniversity,
  faBookOpen,
} from '@fortawesome/free-solid-svg-icons';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero section con enfoque en búsqueda de asignaturas */}
      <section className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:pb-12 sm:pt-20 md:px-8 md:pt-24 lg:px-16">
        <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
          <div className="absolute right-10 top-12 h-24 w-24 animate-pulse rounded-full bg-blue-100 opacity-30 sm:h-32 sm:w-32 md:h-40 md:w-40"></div>
          <div className="absolute bottom-12 left-10 h-32 w-32 rounded-full bg-indigo-100 opacity-40 sm:h-48 sm:w-48 md:h-60 md:w-60"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
            Portal para profesores
          </div>

          <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            <span className="mb-2 block">
              Grado en Filosofía, Política y Economía
            </span>
            <span className="block text-xl font-medium text-blue-600 sm:text-2xl md:text-3xl lg:text-4xl">
              Información académica oficial del Título
            </span>
          </h1>

          <p className="mb-6 max-w-3xl text-sm text-gray-600 sm:mb-8 sm:text-base md:text-lg">
            Información oficial del Grado en Filosofía, Política y Economía:
            consulta asignaturas, competencias y su integración en el plan de
            estudios.
          </p>

          {/* Búsqueda destacada */}
          <div className="mb-6 rounded-xl bg-white/20 p-4 shadow-lg transition-all hover:shadow-xl sm:mb-8 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-800 sm:mb-4 sm:text-xl">
              Buscar mi asignatura
            </h2>
            <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
              Acceda rápidamente a toda la información oficial de la asignatura
              que imparte: módulo y materia a los que pertenece, competencias,
              actividades formativas y sistemas de evaluación.
            </p>
            <Link
              to="/asignaturas"
              className="inline-flex transform items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-blue-700 sm:px-8 sm:py-4 sm:text-lg"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2 sm:mr-3" />
              Buscar asignatura
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de accesos rápidos */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:pb-12 md:px-8 lg:px-16">
        <h2 className="mb-6 text-xl font-bold text-gray-800 sm:mb-8 sm:text-2xl">
          Accesos Directos
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Enlaces convertidos a estilo botón */}
          <Link
            to="/asignaturas"
            className="group rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/70 hover:text-blue-600 hover:shadow-sm sm:px-4 sm:py-3"
          >
            <div className="mb-3 text-blue-600 sm:mb-4">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="text-2xl sm:text-3xl"
              />
            </div>
            <h3 className="mb-2 text-base font-semibold sm:text-lg">
              Asignaturas
            </h3>
            <p className="mb-3 text-xs sm:mb-4 sm:text-sm">
              Listado completo de asignaturas del grado con su información
              detallada
            </p>
          </Link>

          {/* Repetir el mismo patrón para los otros enlaces */}
          <Link
            to="/competencias"
            className="group rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-600 hover:shadow-sm sm:px-4 sm:py-3"
          >
            <div className="mb-3 text-indigo-600 sm:mb-4">
              <FontAwesomeIcon
                icon={faListCheck}
                className="text-2xl sm:text-3xl"
              />
            </div>
            <h3 className="mb-2 text-base font-semibold sm:text-lg">
              Competencias
            </h3>
            <p className="mb-3 text-xs sm:mb-4 sm:text-sm">
              Competencias y resultados de aprendizaje por asignatura
            </p>
          </Link>

          <Link
            to="/plan-estudios"
            className="group rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50/70 hover:text-teal-600 hover:shadow-sm sm:px-4 sm:py-3"
          >
            <div className="mb-3 text-teal-600 sm:mb-4">
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="text-2xl sm:text-3xl"
              />
            </div>
            <h3 className="mb-2 text-base font-semibold sm:text-lg">
              Plan de Estudios
            </h3>
            <p className="mb-3 text-xs sm:mb-4 sm:text-sm">
              Estructura completa del grado: módulos, materias y asignaturas
            </p>
          </Link>

          <Link
            to="/materias"
            className="group rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50/70 hover:text-purple-600 hover:shadow-sm sm:px-4 sm:py-3"
          >
            <div className="mb-3 text-purple-600 sm:mb-4">
              <FontAwesomeIcon
                icon={faUniversity}
                className="text-2xl sm:text-3xl"
              />
            </div>
            <h3 className="mb-2 text-base font-semibold sm:text-lg">
              Materias
            </h3>
            <p className="mb-3 text-xs sm:mb-4 sm:text-sm">
              Distribución y contenido de las materias del Grado
            </p>
          </Link>
        </div>
      </section>

      {/* Sección de resumen del plan de estudios */}
      <section className="mx-auto max-w-7xl rounded-2xl bg-white/40 px-4 py-8 shadow-lg backdrop-blur-sm sm:py-12 md:px-8 lg:px-16">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Estructura del Plan de Estudios
          </h2>
          <Link
            to="/plan-estudios"
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm sm:px-4 sm:py-2 sm:text-sm"
          >
            Ver plan completo →
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Módulo: Fundamentos humanísticos y filosóficos */}
          <div className="group flex flex-col rounded-lg bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl sm:p-6">
            <Link
              to="/plan-estudios/fundamentos-humanisticos-y-filosoficos"
              className="mb-3 transition-colors group-hover:text-blue-700 sm:mb-4"
            >
              <h3 className="mb-2 text-lg font-bold text-blue-800 sm:text-xl">
                Fundamentos humanísticos y filosóficos
              </h3>
              <p className="text-base font-semibold text-blue-600 sm:text-lg">
                66 ECTS
              </p>
            </Link>
            <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
              <Link
                to="/materias/core-curriculum"
                className="group/item block rounded-md border border-blue-100 bg-blue-50 p-2 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md sm:p-3"
              >
                <span className="block text-sm font-semibold text-blue-700 group-hover/item:text-blue-800 sm:text-base">
                  Core curriculum
                </span>
                <span className="text-xs text-blue-600 sm:text-sm">
                  18 ECTS
                </span>
              </Link>
              <Link
                to="/materias/fundamentos-de-filosofia"
                className="group/item block rounded-md border border-blue-100 bg-blue-50 p-2 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md sm:p-3"
              >
                <span className="block text-sm font-semibold text-blue-700 group-hover/item:text-blue-800 sm:text-base">
                  Fundamentos de filosofía
                </span>
                <span className="text-xs text-blue-600 sm:text-sm">
                  24 ECTS
                </span>
              </Link>
              <Link
                to="/materias/conocimiento-realidad-y-accion"
                className="group/item block rounded-md border border-blue-100 bg-blue-50 p-2 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md sm:p-3"
              >
                <span className="block text-sm font-semibold text-blue-700 group-hover/item:text-blue-800 sm:text-base">
                  Conocimiento, realidad y acción
                </span>
                <span className="text-xs text-blue-600 sm:text-sm">
                  24 ECTS
                </span>
              </Link>
            </div>
          </div>

          {/* Módulo: Política y sociedad */}
          <div className="group flex flex-col rounded-lg bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl sm:p-6">
            <Link
              to="/plan-estudios/politica-y-sociedad"
              className="mb-3 transition-colors group-hover:text-indigo-700 sm:mb-4"
            >
              <h3 className="mb-2 text-lg font-bold text-indigo-800 sm:text-xl">
                Política y sociedad
              </h3>
              <p className="text-base font-semibold text-indigo-600 sm:text-lg">
                48 ECTS
              </p>
            </Link>
            <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
              <Link
                to="/materias/teoria-politica-y-social"
                className="group/item block rounded-md border border-indigo-100 bg-indigo-50 p-2 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md sm:p-3"
              >
                <span className="block text-sm font-semibold text-indigo-700 group-hover/item:text-indigo-800 sm:text-base">
                  Teoría política y social
                </span>
                <span className="text-xs text-indigo-600 sm:text-sm">
                  18 ECTS
                </span>
              </Link>
              <Link
                to="/materias/sociedad-cultura-y-comunicacion"
                className="group/item block rounded-md border border-indigo-100 bg-indigo-50 p-2 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md sm:p-3"
              >
                <span className="block text-sm font-semibold text-indigo-700 group-hover/item:text-indigo-800 sm:text-base">
                  Sociedad, cultura y comunicación
                </span>
                <span className="text-xs text-indigo-600 sm:text-sm">
                  30 ECTS
                </span>
              </Link>
            </div>
          </div>

          {/* Módulo: Economía */}
          <div className="group flex flex-col rounded-lg bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl sm:p-6">
            <Link
              to="/plan-estudios/economia"
              className="mb-3 transition-colors group-hover:text-teal-700 sm:mb-4"
            >
              <h3 className="mb-2 text-lg font-bold text-teal-800 sm:text-xl">
                Economía
              </h3>
              <p className="text-base font-semibold text-teal-600 sm:text-lg">
                45 ECTS
              </p>
            </Link>
            <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
              <Link
                to="/materias/teoria-economica"
                className="group/item block rounded-md border border-teal-100 bg-teal-50 p-2 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-100 hover:shadow-md sm:p-3"
              >
                <span className="block text-sm font-semibold text-teal-700 group-hover/item:text-teal-800 sm:text-base">
                  Teoría económica
                </span>
                <span className="text-xs text-teal-600 sm:text-sm">
                  18 ECTS
                </span>
              </Link>
              <Link
                to="/materias/economia-aplicada"
                className="group/item block rounded-md border border-teal-100 bg-teal-50 p-2 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-100 hover:shadow-md sm:p-3"
              >
                <span className="block text-sm font-semibold text-teal-700 group-hover/item:text-teal-800 sm:text-base">
                  Economía aplicada
                </span>
                <span className="text-xs text-teal-600 sm:text-sm">
                  27 ECTS
                </span>
              </Link>
            </div>
          </div>

          {/* Módulo: Formación complementaria */}
          <div className="group flex flex-col rounded-lg bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl sm:p-6">
            <Link
              to="/plan-estudios/formacion-complementaria"
              className="mb-3 transition-colors group-hover:text-purple-700 sm:mb-4"
            >
              <h3 className="mb-2 text-lg font-bold text-purple-800 sm:text-xl">
                Formación complementaria
              </h3>
              <p className="text-base font-semibold text-purple-600 sm:text-lg">
                60 ECTS
              </p>
            </Link>
            <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
              <Link
                to="/materias/formacion-especifica-complementaria"
                className="group/item block rounded-md border border-purple-100 bg-purple-50 p-2 transition-all hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-100 hover:shadow-md sm:p-3"
              >
                <span className="block text-sm font-semibold text-purple-700 group-hover/item:text-purple-800 sm:text-base">
                  Formación específica complementaria
                </span>
                <span className="text-xs text-purple-600 sm:text-sm">
                  60 ECTS
                </span>
              </Link>
            </div>
          </div>

          {/* Módulo: Integración interdisciplinar */}
          <div className="group flex flex-col rounded-lg bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl sm:p-6">
            <Link
              to="/plan-estudios/integracion-interdisciplinar"
              className="mb-3 transition-colors group-hover:text-green-700 sm:mb-4"
            >
              <h3 className="mb-2 text-lg font-bold text-green-800 sm:text-xl">
                Integración interdisciplinar
              </h3>
              <p className="text-base font-semibold text-green-600 sm:text-lg">
                21 ECTS
              </p>
            </Link>
            <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
              <Link
                to="/materias/seminarios-interdisciplinares"
                className="group/item block rounded-md border border-green-100 bg-green-50 p-2 transition-all hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-100 hover:shadow-md sm:p-3"
              >
                <span className="block text-sm font-semibold text-green-700 group-hover/item:text-green-800 sm:text-base">
                  Seminarios interdisciplinares
                </span>
                <span className="text-xs text-green-600 sm:text-sm">
                  9 ECTS
                </span>
              </Link>
              <Link
                to="/materias/trabajo-fin-de-grado"
                className="group/item block rounded-md border border-green-100 bg-green-50 p-2 transition-all hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-100 hover:shadow-md sm:p-3"
              >
                <span className="block text-sm font-semibold text-green-700 group-hover/item:text-green-800 sm:text-base">
                  Trabajo fin de grado
                </span>
                <span className="text-xs text-green-600 sm:text-sm">
                  12 ECTS
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de verificación ANECA */}
      <section className="mx-auto mt-8 max-w-7xl px-4 pb-8 sm:mt-12 sm:pb-10 md:px-8 lg:px-16">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
          <div className="px-4 py-8 text-white sm:px-6 sm:py-12 md:px-12 md:py-16">
            <h2 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl md:text-3xl">
              Título oficial verificado por la ANECA
            </h2>
            <p className="mb-4 max-w-2xl text-sm text-gray-300 sm:mb-6 sm:text-base">
              Toda la información académica disponible en este portal
              corresponde al plan de estudios oficial verificado por la Agencia
              Nacional de Evaluación de la Calidad y Acreditación.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
                Fecha aprobación del título: 2018
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
                Código RUCT: 2503724
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
