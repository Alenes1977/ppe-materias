import { useContext } from 'react';
import type React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faListCheck,
  faSearch,
  faChalkboardTeacher,
  faUniversity,
  faBookOpen,
  faMagicWandSparkles,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { DegreeContext } from '../context/DegreeContext';
import { DEGREES } from '../data/degrees';
import { slugify } from '../lib/utils';

// ── Vista cuando hay grado activo ─────────────────────────────────────────────

const HomeWithDegree: React.FC = () => {
  const ctx = useContext(DegreeContext)!;
  const { degreeInfo, degreePlan } = ctx;
  const { degreeId } = useParams<{ degreeId: string }>();
  const base = `/${degreeId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:pb-12 sm:pt-20 md:px-8 md:pt-24 lg:px-16">
        <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
          <div className="absolute right-10 top-12 h-24 w-24 animate-pulse rounded-full bg-blue-100 opacity-30 sm:h-32 sm:w-32 md:h-40 md:w-40" />
          <div className="absolute bottom-12 left-10 h-32 w-32 rounded-full bg-indigo-100 opacity-40 sm:h-48 sm:w-48 md:h-60 md:w-60" />
        </div>

        <div className="relative z-10">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
            Portal para profesores
          </div>

          <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            <span className="mb-2 block">{degreeInfo.name}</span>
            <span className="block text-xl font-medium text-blue-600 sm:text-2xl md:text-3xl lg:text-4xl">
              Información académica oficial del Título
            </span>
          </h1>

          <p className="mb-6 max-w-3xl text-sm text-gray-600 sm:mb-8 sm:text-base md:text-lg">
            Información oficial del {degreeInfo.name}: consulta asignaturas,{' '}
            {degreeInfo.learningOutcomeLabel.plural} y su integración en el plan
            de estudios.
          </p>

          <div className="mb-6 rounded-xl bg-white/20 p-4 shadow-lg transition-all hover:shadow-xl sm:mb-8 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-800 sm:mb-4 sm:text-xl">
              Buscar mi asignatura
            </h2>
            <p className="mb-4 text-sm text-gray-600 sm:mb-6 sm:text-base">
              Acceda rápidamente a toda la información oficial de la asignatura
              que imparte: módulo y materia a los que pertenece,{' '}
              {degreeInfo.learningOutcomeLabel.plural}, actividades formativas y
              sistemas de evaluación.
            </p>
            <Link
              to={`${base}/asignaturas`}
              className="inline-flex transform items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-blue-700 sm:px-8 sm:py-4 sm:text-lg"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2 sm:mr-3" />
              Buscar asignatura
            </Link>
          </div>
        </div>
      </section>

      {/* Accesos directos */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:pb-12 md:px-8 lg:px-16">
        <h2 className="mb-6 text-xl font-bold text-gray-800 sm:mb-8 sm:text-2xl">
          Accesos Directos
        </h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to={`${base}/asignaturas`}
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

          <Link
            to={`${base}/competencias`}
            className="group rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-600 hover:shadow-sm sm:px-4 sm:py-3"
          >
            <div className="mb-3 text-indigo-600 sm:mb-4">
              <FontAwesomeIcon
                icon={faListCheck}
                className="text-2xl sm:text-3xl"
              />
            </div>
            <h3 className="mb-2 text-base font-semibold sm:text-lg">
              {degreeInfo.learningOutcomeLabel.plural.charAt(0).toUpperCase() +
                degreeInfo.learningOutcomeLabel.plural.slice(1)}
            </h3>
            <p className="mb-3 text-xs sm:mb-4 sm:text-sm">
              {degreeInfo.learningOutcomeLabel.plural.charAt(0).toUpperCase() +
                degreeInfo.learningOutcomeLabel.plural.slice(1)}{' '}
              por asignatura
            </p>
          </Link>

          <Link
            to={`${base}/plan-estudios`}
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
            to={`${base}/materias`}
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

          <Link
            to={`${base}/asistente-guia-docente`}
            className="group rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/70 hover:text-emerald-600 hover:shadow-sm sm:px-4 sm:py-3 md:col-span-1"
          >
            <div className="mb-3 text-emerald-600 sm:mb-4">
              <FontAwesomeIcon
                icon={faMagicWandSparkles}
                className="text-2xl sm:text-3xl"
              />
            </div>
            <h3 className="mb-2 text-base font-semibold sm:text-lg">
              Asistente Guía Docente
            </h3>
            <p className="mb-3 text-xs sm:mb-4 sm:text-sm">
              Crea la guía docente para tu asignatura de forma asistida y
              oficial.
            </p>
          </Link>
        </div>
      </section>

      {/* Estructura del plan (dinámica) */}
      <section className="mx-auto max-w-7xl rounded-2xl bg-white/40 px-4 py-8 shadow-lg backdrop-blur-sm sm:py-12 md:px-8 lg:px-16">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Estructura del Plan de Estudios
          </h2>
          <Link
            to={`${base}/plan-estudios`}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm sm:px-4 sm:py-2 sm:text-sm"
          >
            Ver plan completo →
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {degreePlan.modules.map((modulo) => (
            <div
              key={modulo.name}
              className="group flex flex-col rounded-lg bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl sm:p-6"
            >
              <Link
                to={`${base}/plan-estudios/${slugify(modulo.name)}`}
                className="mb-3 transition-colors group-hover:text-blue-700 sm:mb-4"
              >
                <h3 className="mb-2 text-lg font-bold text-blue-800 sm:text-xl">
                  {modulo.name}
                </h3>
                <p className="text-base font-semibold text-blue-600 sm:text-lg">
                  {modulo.ects} ECTS
                </p>
              </Link>
              <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                {modulo.subjects.map((materia) => (
                  <Link
                    key={materia.name}
                    to={`${base}/materias/${slugify(materia.name)}`}
                    className="group/item block rounded-md border border-blue-100 bg-blue-50 p-2 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:shadow-md sm:p-3"
                  >
                    <span className="block text-sm font-semibold text-blue-700 group-hover/item:text-blue-800 sm:text-base">
                      {materia.name}
                    </span>
                    <span className="text-xs text-blue-600 sm:text-sm">
                      {materia.ects} ECTS
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner ANECA dinámico */}
      {degreeInfo.anecaVerified && (
        <section className="mx-auto mt-8 max-w-7xl px-4 pb-8 sm:mt-12 sm:pb-10 md:px-8 lg:px-16">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
            <div className="px-4 py-8 text-white sm:px-6 sm:py-12 md:px-12 md:py-16">
              <h2 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl md:text-3xl">
                Título oficial verificado por la ANECA
              </h2>
              <p className="mb-4 max-w-2xl text-sm text-gray-300 sm:mb-6 sm:text-base">
                Toda la información académica disponible en este portal
                corresponde al plan de estudios oficial verificado por la
                Agencia Nacional de Evaluación de la Calidad y Acreditación.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4">
                {degreeInfo.verificationYear && (
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
                    Fecha aprobación del Título: {degreeInfo.verificationYear}
                  </span>
                )}
                {degreeInfo.lastUpdated && (
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
                    Última actualización del Plan: {degreeInfo.lastUpdated}
                  </span>
                )}
                {degreeInfo.ructCode && (
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
                    Código RUCT: {degreeInfo.ructCode}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// ── Vista selector de grado (sin degreeId en contexto) ────────────────────────

const HomeSelector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-16 md:px-8">
        <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:px-4 sm:py-2 sm:text-sm">
          <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" />
          Portal para profesores · Universidad de Navarra
        </div>

        <h1 className="mb-4 text-center text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl">
          Selecciona tu Grado
        </h1>
        <p className="mb-12 max-w-xl text-center text-sm text-gray-500 sm:text-base">
          Elige el grado sobre el que quieres consultar información académica o
          generar una guía docente.
        </p>

        <div className="grid w-full gap-6 sm:grid-cols-2">
          {Object.values(DEGREES).map((entry) => (
            <button
              key={entry.meta.id}
              onClick={() => navigate(`/${entry.meta.id}/inicio`)}
              className="group flex flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: entry.meta.primaryColor }}
              >
                <FontAwesomeIcon icon={faGraduationCap} className="text-xl" />
              </div>
              <h2 className="mb-1 text-lg font-bold text-gray-800 group-hover:text-blue-700">
                {entry.meta.name}
              </h2>
              <p className="mb-4 text-sm text-gray-500">
                {entry.meta.university}
              </p>
              <span
                className="mt-auto inline-flex items-center text-sm font-semibold"
                style={{ color: entry.meta.primaryColor }}
              >
                Ver información
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-xs" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────

const Home: React.FC = () => {
  const ctx = useContext(DegreeContext);
  return ctx ? <HomeWithDegree /> : <HomeSelector />;
};

export default Home;
