import React, { useMemo } from 'react';
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
} from '@fortawesome/free-solid-svg-icons';
import BackButton from './BackButton';
import { generateSlug } from '../utils/stringUtils';

interface MateriaInfo {
  nombre: string;
  modulo: string;
  ECTS?: string;
  'ECTS-n'?: string;
  'ECTS-basicos': string;
  'ECTS-obligatorios': string;
  'ECTS-optativos': string;
  asignaturas: {
    nombre: string;
    curso: string;
    semestre: string;
    ects: number;
    competencias: string[];
  }[];
  'actividad-formativa': string[];
  evaluacion: {
    tipo: string;
    'ponderacion-minima': string;
    'ponderacion-maxima': string;
  }[];
}

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
              {materiaInfo['ECTS-n'] || materiaInfo.ECTS} ECTS totales (
              {materiaInfo['ECTS-basicos'] || '0'} básicos,{' '}
              {materiaInfo['ECTS-obligatorios'] || '0'} obligatorios,{' '}
              {materiaInfo['ECTS-optativos'] || '0'} optativos)
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Asignaturas de la materia */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 className="mb-4 flex items-center text-lg font-bold text-gray-800 sm:mb-6 sm:text-xl">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="mr-2 text-blue-600 sm:mr-3"
                />
                Asignaturas de la materia
              </h2>
              <div className="grid gap-3 sm:gap-4">
                {materiaInfo.asignaturas.map((asignatura) => (
                  <Link
                    key={asignatura.nombre}
                    to={`/asignaturas/${generateSlug(asignatura.nombre)}`}
                    className="group flex flex-col rounded-lg border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-3 transition-all hover:border-blue-300 hover:shadow-lg sm:p-4"
                  >
                    <h3 className="mb-2 text-base font-semibold text-gray-800 group-hover:text-blue-600 sm:mb-3 sm:text-lg">
                      {asignatura.nombre}
                    </h3>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 sm:px-2.5">
                        <FontAwesomeIcon
                          icon={faGraduationCap}
                          className="mr-1.5"
                        />
                        {asignatura.curso}º Curso
                      </span>
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 sm:px-2.5">
                        {asignatura.semestre === 'anual'
                          ? 'Anual'
                          : `${asignatura.semestre}º Semestre`}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 sm:px-2.5">
                        {asignatura.ects} ECTS
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar con información adicional */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-1">
            {/* Actividades formativas */}
            {materiaInfo['actividad-formativa'] && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-3 flex items-center text-lg font-bold text-gray-800 sm:mb-4 sm:text-xl">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-2 text-blue-600 sm:mr-3"
                  />
                  Actividades formativas
                </h2>
                <div className="grid gap-2">
                  {materiaInfo['actividad-formativa'].map(
                    (actividad, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs sm:text-sm"
                      >
                        <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></div>
                        <span className="text-gray-700">{actividad}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Evaluación */}
            {materiaInfo.evaluacion && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="mb-4 flex items-center text-lg font-bold text-gray-800 sm:mb-6 sm:text-xl">
                  <FontAwesomeIcon
                    icon={faChartBar}
                    className="mr-2 text-blue-600 sm:mr-3"
                  />
                  Sistema de evaluación
                </h2>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <th
                              scope="col"
                              className="px-3 py-2 text-left sm:px-4 sm:py-3"
                            >
                              <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                                Tipo
                              </span>
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-center sm:px-4 sm:py-3"
                            >
                              <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                                Mín
                              </span>
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-center sm:px-4 sm:py-3"
                            >
                              <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                                Máx
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {materiaInfo.evaluacion.map((evaluacion, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              }
                            >
                              <td className="whitespace-normal px-3 py-2 sm:px-4 sm:py-3">
                                <span className="text-xs font-medium text-gray-900 sm:text-sm">
                                  {evaluacion.tipo}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-2 text-center sm:px-4 sm:py-3">
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 sm:px-2.5">
                                  {evaluacion['ponderacion-minima']}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-2 text-center sm:px-4 sm:py-3">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 sm:px-2.5">
                                  {evaluacion['ponderacion-maxima']}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materia;
