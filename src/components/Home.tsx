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
      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-24 md:px-8 lg:px-16">
        <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
          <div className="absolute right-10 top-12 h-40 w-40 animate-pulse rounded-full bg-blue-100 opacity-30"></div>
          <div className="absolute bottom-12 left-10 h-60 w-60 rounded-full bg-indigo-100 opacity-40"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-8 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
            Portal para profesores
          </div>

          <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl lg:text-6xl">
            <span className="mb-2 block">
              Grado en Filosofía, Política y Economía
            </span>
            <span className="block text-2xl font-medium text-blue-600 md:text-3xl lg:text-4xl">
              Información académica oficial del Título
            </span>
          </h1>

          <p className="mb-8 max-w-3xl text-base text-gray-600 md:text-lg">
            Información oficial del Grado en Filosofía, Política y Economía:
            consulta asignaturas, competencias y su integración en el plan de
            estudios.
          </p>

          {/* Búsqueda destacada */}
          <div className="mb-8 rounded-xl bg-white/20 p-6 shadow-lg transition-all hover:shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Buscar mi asignatura
            </h2>
            <p className="mb-6 text-gray-600">
              Acceda rápidamente a toda la información oficial de la asignatura
              que imparte: módulo y materia a los que pertenece, competencias,
              actividades formativas y sistemas de evaluación.
            </p>
            <Link
              to="/asignaturas"
              className="inline-flex transform items-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-medium text-white transition-all hover:scale-105 hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-3" />
              Buscar asignatura
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de accesos rápidos */}
      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8 lg:px-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">
          Accesos Directos
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Enlaces convertidos a estilo botón */}
          <Link
            to="/asignaturas"
            className="group rounded-md border border-gray-200 bg-white px-4 py-3 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/70 hover:text-blue-600 hover:shadow-sm"
          >
            <div className="mb-4 text-blue-600">
              <FontAwesomeIcon icon={faBookOpen} className="text-3xl" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Asignaturas</h3>
            <p className="mb-4 text-sm">
              Listado completo de asignaturas del grado con su información
              detallada
            </p>
          </Link>

          {/* Repetir el mismo patrón para los otros enlaces */}
          <Link
            to="/competencias"
            className="group rounded-md border border-gray-200 bg-white px-4 py-3 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-600 hover:shadow-sm"
          >
            <div className="mb-4 text-indigo-600">
              <FontAwesomeIcon icon={faListCheck} className="text-3xl" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Competencias</h3>
            <p className="mb-4 text-sm">
              Competencias y resultados de aprendizaje por asignatura
            </p>
          </Link>

          <Link
            to="/plan-estudios"
            className="group rounded-md border border-gray-200 bg-white px-4 py-3 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50/70 hover:text-teal-600 hover:shadow-sm"
          >
            <div className="mb-4 text-teal-600">
              <FontAwesomeIcon icon={faGraduationCap} className="text-3xl" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Plan de Estudios</h3>
            <p className="mb-4 text-sm">
              Estructura completa del grado: módulos, materias y asignaturas
            </p>
          </Link>

          <Link
            to="/materias"
            className="group rounded-md border border-gray-200 bg-white px-4 py-3 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-purple-50/70 hover:text-purple-600 hover:shadow-sm"
          >
            <div className="mb-4 text-purple-600">
              <FontAwesomeIcon icon={faUniversity} className="text-3xl" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Materias</h3>
            <p className="mb-4 text-sm">
              Distribución y contenido de las materias del Grado
            </p>
          </Link>
        </div>
      </section>

      {/* Sección de resumen del plan de estudios */}
      <section className="mx-auto max-w-7xl rounded-2xl bg-white/40 px-4 py-12 shadow-lg backdrop-blur-sm md:px-8 lg:px-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Estructura del Plan de Estudios
          </h2>
          <Link
            to="/plan-estudios"
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm"
          >
            Ver plan completo →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Módulo: Fundamentos humanísticos y filosóficos */}
          <div className="group flex flex-col rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
            <Link
              to="/plan-estudios/fundamentos-humanisticos-y-filosoficos"
              className="mb-4 transition-colors group-hover:text-blue-700"
            >
              <h3 className="mb-2 text-xl font-bold text-blue-800">
                Fundamentos humanísticos y filosóficos
              </h3>
              <p className="text-lg font-semibold text-blue-600">66 ECTS</p>
            </Link>
            <div className="mt-4 space-y-3">
              <Link
                to="/materias/core-curriculum"
                className="group/item block rounded-md border border-blue-100 bg-blue-50 p-3 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md"
              >
                <span className="block font-semibold text-blue-700 group-hover/item:text-blue-800">
                  Core curriculum
                </span>
                <span className="text-sm text-blue-600">18 ECTS</span>
              </Link>
              <Link
                to="/materias/fundamentos-de-filosofia"
                className="group/item block rounded-md border border-blue-100 bg-blue-50 p-3 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md"
              >
                <span className="block font-semibold text-blue-700 group-hover/item:text-blue-800">
                  Fundamentos de filosofía
                </span>
                <span className="text-sm text-blue-600">24 ECTS</span>
              </Link>
              <Link
                to="/materias/conocimiento-realidad-y-accion"
                className="group/item block rounded-md border border-blue-100 bg-blue-50 p-3 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md"
              >
                <span className="block font-semibold text-blue-700 group-hover/item:text-blue-800">
                  Conocimiento, realidad y acción
                </span>
                <span className="text-sm text-blue-600">24 ECTS</span>
              </Link>
            </div>
          </div>

          {/* Módulo: Política y sociedad */}
          <div className="group flex flex-col rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
            <Link
              to="/plan-estudios/politica-y-sociedad"
              className="mb-4 transition-colors group-hover:text-indigo-700"
            >
              <h3 className="mb-2 text-xl font-bold text-indigo-800">
                Política y sociedad
              </h3>
              <p className="text-lg font-semibold text-indigo-600">48 ECTS</p>
            </Link>
            <div className="mt-4 space-y-3">
              <Link
                to="/materias/teoria-politica-y-social"
                className="group/item block rounded-md border border-indigo-100 bg-indigo-50 p-3 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md"
              >
                <span className="block font-semibold text-indigo-700 group-hover/item:text-indigo-800">
                  Teoría política y social
                </span>
                <span className="text-sm text-indigo-600">18 ECTS</span>
              </Link>
              <Link
                to="/materias/sociedad-cultura-y-comunicacion"
                className="group/item block rounded-md border border-indigo-100 bg-indigo-50 p-3 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-100 hover:shadow-md"
              >
                <span className="block font-semibold text-indigo-700 group-hover/item:text-indigo-800">
                  Sociedad, cultura y comunicación
                </span>
                <span className="text-sm text-indigo-600">30 ECTS</span>
              </Link>
            </div>
          </div>

          {/* Módulo: Economía */}
          <div className="group flex flex-col rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
            <Link
              to="/plan-estudios/economia"
              className="mb-4 transition-colors group-hover:text-teal-700"
            >
              <h3 className="mb-2 text-xl font-bold text-teal-800">Economía</h3>
              <p className="text-lg font-semibold text-teal-600">45 ECTS</p>
            </Link>
            <div className="mt-4 space-y-3">
              <Link
                to="/materias/teoria-economica"
                className="group/item block rounded-md border border-teal-100 bg-teal-50 p-3 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-100 hover:shadow-md"
              >
                <span className="block font-semibold text-teal-700 group-hover/item:text-teal-800">
                  Teoría económica
                </span>
                <span className="text-sm text-teal-600">18 ECTS</span>
              </Link>
              <Link
                to="/materias/economia-aplicada"
                className="group/item block rounded-md border border-teal-100 bg-teal-50 p-3 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-100 hover:shadow-md"
              >
                <span className="block font-semibold text-teal-700 group-hover/item:text-teal-800">
                  Economía aplicada
                </span>
                <span className="text-sm text-teal-600">27 ECTS</span>
              </Link>
            </div>
          </div>

          {/* Módulo: Formación complementaria */}
          <div className="group flex flex-col rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
            <Link
              to="/plan-estudios/formacion-complementaria"
              className="mb-4 transition-colors group-hover:text-purple-700"
            >
              <h3 className="mb-2 text-xl font-bold text-purple-800">
                Formación complementaria
              </h3>
              <p className="text-lg font-semibold text-purple-600">60 ECTS</p>
            </Link>
            <div className="mt-4 space-y-3">
              <Link
                to="/materias/formacion-especifica-complementaria"
                className="group/item block rounded-md border border-purple-100 bg-purple-50 p-3 transition-all hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-100 hover:shadow-md"
              >
                <span className="block font-semibold text-purple-700 group-hover/item:text-purple-800">
                  Formación específica complementaria
                </span>
                <span className="text-sm text-purple-600">60 ECTS</span>
              </Link>
            </div>
          </div>

          {/* Módulo: Integración interdisciplinar */}
          <div className="group flex flex-col rounded-lg bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
            <Link
              to="/plan-estudios/integracion-interdisciplinar"
              className="mb-4 transition-colors group-hover:text-green-700"
            >
              <h3 className="mb-2 text-xl font-bold text-green-800">
                Integración interdisciplinar
              </h3>
              <p className="text-lg font-semibold text-green-600">21 ECTS</p>
            </Link>
            <div className="mt-4 space-y-3">
              <Link
                to="/materias/seminarios-interdisciplinares"
                className="group/item block rounded-md border border-green-100 bg-green-50 p-3 transition-all hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-100 hover:shadow-md"
              >
                <span className="block font-semibold text-green-700 group-hover/item:text-green-800">
                  Seminarios interdisciplinares
                </span>
                <span className="text-sm text-green-600">9 ECTS</span>
              </Link>
              <Link
                to="/materias/trabajo-fin-de-grado"
                className="group/item block rounded-md border border-green-100 bg-green-50 p-3 transition-all hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-100 hover:shadow-md"
              >
                <span className="block font-semibold text-green-700 group-hover/item:text-green-800">
                  Trabajo fin de grado
                </span>
                <span className="text-sm text-green-600">12 ECTS</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Banner de verificación ANECA */}
      <section className="mx-auto mt-12 max-w-7xl px-4 pb-10 md:px-8 lg:px-16">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
          <div className="px-6 py-12 text-white md:px-12 md:py-16">
            <h2 className="mb-4 text-3xl font-bold">
              Título oficial verificado por la ANECA
            </h2>
            <p className="mb-6 max-w-2xl text-gray-300">
              Toda la información académica disponible en este portal
              corresponde al plan de estudios oficial verificado por la Agencia
              Nacional de Evaluación de la Calidad y Acreditación.
            </p>
            <div className="flex items-center space-x-4">
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                Fecha aprobación del título: 2018
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
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
