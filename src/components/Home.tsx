import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faGraduationCap,
  faListCheck,
  faChevronRight,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Sección de bienvenida/hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-32 md:px-8 lg:px-16">
        <div className="absolute left-0 top-0 h-full w-full">
          <div className="absolute right-10 top-12 h-40 w-40 rounded-full bg-blue-100 opacity-30"></div>
          <div className="absolute bottom-12 left-10 h-60 w-60 rounded-full bg-indigo-100 opacity-40"></div>
        </div>

        <div className="relative z-10">
          <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
            Grado en{' '}
            <span className="text-blue-600">
              Filosofía, Política y Economía
            </span>
          </h1>
          <p className="mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl">
            Explora todas las asignaturas, el plan de estudios y las
            competencias que desarrollarás durante tu formación académica.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/asignaturas"
              className="flex transform items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:scale-105 hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Buscar asignaturas
            </Link>
            <Link
              to="/plan-estudios"
              className="flex items-center rounded-lg border border-blue-200 bg-white px-6 py-3 font-medium text-blue-600 transition-all hover:bg-gray-50 hover:shadow-md"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
              Plan de estudios
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de tarjetas principales */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:px-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Tarjeta 1: Asignaturas */}
          <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl">
            <div className="bg-blue-600 p-4">
              <FontAwesomeIcon icon={faBook} className="text-4xl text-white" />
            </div>
            <div className="p-6">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                Asignaturas
              </h2>
              <p className="mb-4 text-gray-600">
                Accede a toda la información sobre las asignaturas: contenidos,
                evaluación y competencias asociadas.
              </p>
              <Link
                to="/asignaturas"
                className="group flex items-center font-medium text-blue-600"
              >
                Ver todas las asignaturas
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ml-2 transform transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Tarjeta 2: Plan de Estudios */}
          <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl">
            <div className="bg-indigo-600 p-4">
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="text-4xl text-white"
              />
            </div>
            <div className="p-6">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                Plan de Estudios
              </h2>
              <p className="mb-4 text-gray-600">
                Conoce la estructura completa de módulos y materias que componen
                el plan de estudios del grado.
              </p>
              <Link
                to="/plan-estudios"
                className="group flex items-center font-medium text-indigo-600"
              >
                Explorar plan completo
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ml-2 transform transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Tarjeta 3: Competencias */}
          <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl">
            <div className="bg-teal-600 p-4">
              <FontAwesomeIcon
                icon={faListCheck}
                className="text-4xl text-white"
              />
            </div>
            <div className="p-6">
              <h2 className="mb-3 text-xl font-bold text-gray-800">
                Competencias
              </h2>
              <p className="mb-4 text-gray-600">
                Descubre todas las competencias que desarrollarás durante tu
                formación, organizadas por categorías.
              </p>
              <Link
                to="/competencias"
                className="group flex items-center font-medium text-teal-600"
              >
                Ver competencias
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ml-2 transform transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de resumen de módulos */}
      <section className="mx-auto max-w-7xl rounded-2xl bg-white px-4 py-12 shadow-md md:px-8 lg:px-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">
          Estructura del Plan de Estudios
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Estos módulos son solo de ejemplo, deberían generarse dinámicamente según los datos */}
          <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50">
            <h3 className="mb-1 font-semibold text-blue-700">
              Fundamentos de Filosofía
            </h3>
            <p className="text-sm text-gray-600">30 ECTS</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50">
            <h3 className="mb-1 font-semibold text-blue-700">
              Fundamentos de Política
            </h3>
            <p className="text-sm text-gray-600">30 ECTS</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50">
            <h3 className="mb-1 font-semibold text-blue-700">
              Fundamentos de Economía
            </h3>
            <p className="text-sm text-gray-600">30 ECTS</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50">
            <h3 className="mb-1 font-semibold text-blue-700">
              Formación Complementaria
            </h3>
            <p className="text-sm text-gray-600">60 ECTS</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50">
            <h3 className="mb-1 font-semibold text-blue-700">
              Trabajo Fin de Grado
            </h3>
            <p className="text-sm text-gray-600">6 ECTS</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50">
            <h3 className="mb-1 font-semibold text-blue-700">
              Prácticas Externas
            </h3>
            <p className="text-sm text-gray-600">6 ECTS</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/plan-estudios"
            className="inline-flex items-center font-medium text-blue-600 hover:underline"
          >
            Ver plan de estudios completo
            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Banner para competencias */}
      <section className="mx-auto my-12 max-w-7xl px-4 md:px-8 lg:px-16">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg">
          <div className="px-6 py-12 text-white md:px-12 md:py-16">
            <h2 className="mb-4 text-3xl font-bold">Competencias del Grado</h2>
            <p className="mb-6 max-w-2xl">
              Conoce todas las habilidades y capacidades que desarrollarás
              durante el grado, organizadas por categorías.
            </p>
            <Link
              to="/competencias"
              className="inline-block rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Explorar competencias
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
