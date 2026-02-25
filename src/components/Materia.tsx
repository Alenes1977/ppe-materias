import type React from 'react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import data from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faGraduationCap,
  faBookOpen,
  faClipboardList,
  faChartBar,
  faLayerGroup,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import BackButton from './BackButton';
import { generateSlug } from '../utils/stringUtils';

interface MateriaInfo {
  nombre: string;
  modulo: string;
  ECTS?: number;
  'ECTS-n'?: number;
  'ECTS-basicos': number;
  'ECTS-obligatorios': number;
  'ECTS-optativos': number;
  asignaturas: {
    nombre: string;
    curso: number;
    semestre: number | string;
    ects: number;
    tipo?: string;
    resultados_aprendizaje?: string[];
  }[];
  'actividad-formativa': string[];
  evaluacion: {
    tipo: string;
    'ponderacion-minima': string;
    'ponderacion-maxima': string;
  }[];
}

const actividadNombre: Record<string, string> = Object.fromEntries(
  data.actividades_formativas.map((af) => [af.id, af.nombre]),
);
const evaluacionNombre: Record<string, string> = Object.fromEntries(
  data.sistemas_evaluacion.map((se) => [se.id, se.nombre]),
);

const Materia: React.FC = () => {
  const { materiaSlug } = useParams<{ materiaSlug: string }>();

  const materiaInfo = useMemo(() => {
    // Encontrar la materia y su módulo correspondiente
    for (const modulo of data.modulos) {
      const materia = modulo.materias.find(
        (m) => generateSlug(m.nombre) === materiaSlug,
      );
      if (materia) {
        return {
          ...materia,
          modulo: modulo.nombre,
        } as MateriaInfo;
      }
    }
    return null;
  }, [materiaSlug]);

  if (!materiaInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 pb-14 pt-24">
          <div className="rounded-xl bg-white p-8 text-center shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              Materia no encontrada
            </h1>
            <p className="mb-6 text-gray-600">
              La materia que buscas no existe o no está disponible.
            </p>
            <Link
              to="/asignaturas"
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700 hover:shadow-md"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Volver a asignaturas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
        {/* Navegación de regreso */}
        <div className="mb-6 sm:mb-8">
          <BackButton to="/asignaturas" label="Volver a asignaturas" />
        </div>

        {/* Cabecera de la materia */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
            Ficha de materia
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            {materiaInfo.nombre}
          </h1>
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-4">
            <Link
              to={`/plan-estudios/${generateSlug(materiaInfo.modulo)}`}
              className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 transition-all hover:bg-blue-200 sm:px-4 sm:py-2 sm:text-sm"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
              Módulo: {materiaInfo.modulo}
            </Link>
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 sm:px-4 sm:py-2 sm:text-sm">
              <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
              {materiaInfo['ECTS-n'] ?? materiaInfo.ECTS} ECTS totales (
              {materiaInfo['ECTS-basicos'] ?? 0} básicos,{' '}
              {materiaInfo['ECTS-obligatorios'] ?? 0} obligatorios,{' '}
              {materiaInfo['ECTS-optativos'] ?? 0} optativos)
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="space-y-6 sm:space-y-8">
          {/* Asignaturas de la materia — ancho completo */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center text-lg font-bold text-gray-800 sm:mb-6 sm:text-xl">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="mr-2 text-blue-600 sm:mr-3"
              />
              Asignaturas de la materia
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {materiaInfo.asignaturas.map((asignatura) => (
                <Link
                  key={asignatura.nombre}
                  to={`/asignaturas/${generateSlug(asignatura.nombre)}`}
                  className="group flex flex-col rounded-lg border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-3 transition-all hover:border-blue-300 hover:shadow-lg sm:p-4"
                >
                  <h3 className="mb-3 text-base font-semibold text-gray-800 group-hover:text-blue-600">
                    {asignatura.nombre}
                  </h3>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {asignatura.tipo === 'Básica' && (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                        <FontAwesomeIcon icon={faStar} className="mr-1.5" />
                        Básica
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      <FontAwesomeIcon
                        icon={faGraduationCap}
                        className="mr-1.5"
                      />
                      {asignatura.curso}º Curso
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      {asignatura.semestre === 'anual'
                        ? 'Anual'
                        : `${asignatura.semestre}º Semestre`}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      {asignatura.ects} ECTS
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Actividades formativas y Evaluación — dos columnas */}
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            {/* Actividades formativas */}
            {materiaInfo['actividad-formativa'] ? (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 flex items-center text-lg font-bold text-gray-800 sm:text-xl">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-2 text-blue-600 sm:mr-3"
                  />
                  Actividades formativas
                </h2>
                <div className="space-y-2">
                  {materiaInfo['actividad-formativa'].map(
                    (actividad, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                      >
                        <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700">
                          {actividadNombre[actividad] ?? actividad}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : null}

            {/* Evaluación */}
            {materiaInfo.evaluacion ? (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 flex items-center text-lg font-bold text-gray-800 sm:text-xl">
                  <FontAwesomeIcon
                    icon={faChartBar}
                    className="mr-2 text-blue-600 sm:mr-3"
                  />
                  Sistema de evaluación
                </h2>
                <div className="space-y-3">
                  {materiaInfo.evaluacion.map((evaluacion, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                      <p className="mb-2 text-sm font-medium text-gray-900">
                        {evaluacionNombre[evaluacion.tipo] ?? evaluacion.tipo}
                      </p>
                      <div className="flex gap-4">
                        <span className="text-xs text-gray-500">
                          Mín:{' '}
                          <span className="font-semibold text-blue-700">
                            {evaluacion['ponderacion-minima']}
                          </span>
                        </span>
                        <span className="text-xs text-gray-500">
                          Máx:{' '}
                          <span className="font-semibold text-green-700">
                            {evaluacion['ponderacion-maxima']}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materia;
