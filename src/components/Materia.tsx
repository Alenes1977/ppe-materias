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
      <div className="container mx-auto px-4 pb-14 pt-24">
        {/* Navegación de regreso */}
        <div className="mb-8">
          <BackButton to="/asignaturas" label="Volver a asignaturas" />
        </div>

        {/* Cabecera de la materia */}
        <div className="mb-12 text-center">
          <div className="mb-8 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
            Ficha de materia
          </div>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            {materiaInfo.nombre}
          </h1>
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-4">
            <Link
              to={`/plan-estudios/${generateSlug(materiaInfo.modulo)}`}
              className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 transition-all hover:bg-blue-200"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
              Módulo: {materiaInfo.modulo}
            </Link>
            <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
              <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
              {materiaInfo['ECTS-n'] || materiaInfo.ECTS} ECTS totales (
              {materiaInfo['ECTS-basicos'] || '0'} básicos,{' '}
              {materiaInfo['ECTS-obligatorios'] || '0'} obligatorios,{' '}
              {materiaInfo['ECTS-optativos'] || '0'} optativos)
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Asignaturas de la materia */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center text-xl font-bold text-gray-800">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="mr-3 text-blue-600"
                />
                Asignaturas de la materia
              </h2>
              <div className="grid gap-4">
                {materiaInfo.asignaturas.map((asignatura) => (
                  <Link
                    key={asignatura.nombre}
                    to={`/asignaturas/${generateSlug(asignatura.nombre)}`}
                    className="group flex flex-col rounded-lg border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-4 transition-all hover:border-blue-300 hover:shadow-lg"
                  >
                    <h3 className="mb-3 text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                      {asignatura.nombre}
                    </h3>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                        <FontAwesomeIcon
                          icon={faGraduationCap}
                          className="mr-1.5"
                        />
                        {asignatura.curso}º Curso
                      </span>
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-800">
                        {asignatura.semestre === 'anual'
                          ? 'Anual'
                          : `${asignatura.semestre}º Semestre`}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                        {asignatura.ects} ECTS
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar con información adicional */}
          <div className="space-y-8 lg:col-span-1">
            {/* Actividades formativas */}
            {materiaInfo['actividad-formativa'] && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center text-xl font-bold text-gray-800">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="mr-3 text-blue-600"
                  />
                  Actividades formativas
                </h2>
                <div className="grid gap-2">
                  {materiaInfo['actividad-formativa'].map(
                    (actividad, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
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
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 flex items-center text-xl font-bold text-gray-800">
                  <FontAwesomeIcon
                    icon={faChartBar}
                    className="mr-3 text-blue-600"
                  />
                  Sistema de evaluación
                </h2>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th scope="col" className="px-4 py-3 text-left">
                          <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                            Tipo
                          </span>
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
                          <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
                            Mín
                          </span>
                        </th>
                        <th scope="col" className="px-4 py-3 text-center">
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
                          <td className="whitespace-normal px-4 py-3">
                            <span className="text-sm font-medium text-gray-900">
                              {evaluacion.tipo}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-center">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                              {evaluacion['ponderacion-minima']}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-center">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                              {evaluacion['ponderacion-maxima']}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
