import React from 'react';
import { useParams, Link } from 'react-router-dom';
import data from '../data/ppe.json';
import { generateSlug } from '../utils/stringUtils';
import BackButton from './BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faLayerGroup,
  faBookOpen,
  faChalkboardTeacher,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

// Función para ordenar asignaturas por curso y semestre
const ordenarAsignaturas = (asignaturas: any[]) => {
  return [...asignaturas].sort((a, b) => {
    // Primero ordenar por curso
    if (a.curso !== b.curso) {
      return a.curso - b.curso;
    }

    // Si son del mismo curso, ordenar por semestre
    return a.semestre - b.semestre;
  });
};

const Modulo: React.FC = () => {
  const { moduloSlug } = useParams<{ moduloSlug: string }>();

  // Encontrar el módulo correspondiente
  const modulo = data.modulos.find(
    (m) => generateSlug(m.nombre) === moduloSlug,
  );

  if (!modulo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24">
          <div className="mb-6">
            <BackButton to="/plan-estudios" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-16 sm:pb-14 sm:pt-20 md:pt-24">
        <div className="mb-6 sm:mb-8">
          <BackButton to="/plan-estudios" label="Volver al plan de estudios" />
        </div>

        {/* Cabecera del módulo */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            Ficha de módulo
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            {modulo.nombre}
          </h1>
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-4">
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 sm:px-4 sm:py-2 sm:text-sm">
              <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
              {modulo.ects} ECTS totales
            </div>
            <div className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-800 sm:px-4 sm:py-2 sm:text-sm">
              <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
              {modulo.materias.length} materias
            </div>
          </div>
        </div>

        {/* Lista de materias */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {modulo.materias.map((materia, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              {/* Cabecera de la materia */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Título de la materia */}
                  <div>
                    <div className="mb-2 inline-block rounded-full bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-800 sm:px-4 sm:py-2 sm:text-sm">
                      <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
                      Materia
                    </div>
                    <Link
                      to={`/materias/${generateSlug(materia.nombre)}`}
                      className="group"
                    >
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 sm:text-xl">
                        {materia.nombre}
                      </h2>
                    </Link>
                  </div>

                  {/* Información de créditos */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* Créditos totales */}
                    <div className="rounded-lg bg-indigo-100 px-3 py-1.5 sm:px-4 sm:py-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-indigo-900 sm:text-2xl">
                          {parseInt(materia['ECTS-basicos'] || '0') +
                            parseInt(materia['ECTS-obligatorios'] || '0') +
                            parseInt(materia['ECTS-optativos'] || '0')}
                        </span>
                        <span className="text-xs font-medium text-indigo-800 sm:text-sm">
                          ECTS totales
                        </span>
                      </div>
                    </div>

                    <div className="hidden h-8 w-px bg-gray-200 sm:block"></div>

                    {/* Distribución de créditos */}
                    <div className="flex flex-wrap gap-2">
                      <div className="rounded-lg bg-blue-50 px-2 py-1.5 sm:px-3 sm:py-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-semibold text-blue-800 sm:text-lg">
                            {materia['ECTS-basicos'] || '0'}
                          </span>
                          <span className="text-xs text-blue-600">básicos</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-green-50 px-2 py-1.5 sm:px-3 sm:py-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-semibold text-green-800 sm:text-lg">
                            {materia['ECTS-obligatorios'] || '0'}
                          </span>
                          <span className="text-xs text-green-600">
                            obligatorios
                          </span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-purple-50 px-2 py-1.5 sm:px-3 sm:py-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-semibold text-purple-800 sm:text-lg">
                            {materia['ECTS-optativos'] || '0'}
                          </span>
                          <span className="text-xs text-purple-600">
                            optativos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de asignaturas */}
              <div className="divide-y divide-gray-100 bg-white p-4 sm:p-6">
                <h3 className="mb-4 text-base font-semibold text-gray-700 sm:text-lg">
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    className="mr-2 text-blue-600"
                  />
                  Asignaturas de la materia
                </h3>
                <div className="grid gap-3 pt-4 sm:grid-cols-2 sm:gap-4">
                  {ordenarAsignaturas(materia.asignaturas).map(
                    (asignatura, idx) => (
                      <Link
                        key={idx}
                        to={`/asignaturas/${generateSlug(asignatura.nombre)}`}
                        className="group flex flex-col rounded-lg border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-3 transition-all hover:border-blue-300 hover:shadow-md sm:p-4"
                      >
                        <h4 className="mb-2 text-sm font-semibold text-gray-800 group-hover:text-blue-600 sm:mb-3 sm:text-base">
                          {asignatura.nombre}
                        </h4>
                        <div className="mt-auto flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 sm:px-2.5">
                            <FontAwesomeIcon
                              icon={faChalkboardTeacher}
                              className="mr-1.5"
                            />
                            {asignatura.curso}º curso
                          </span>
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 sm:px-2.5">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="mr-1.5"
                            />
                            {`${asignatura.semestre}º semestre`}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 sm:px-2.5">
                            <FontAwesomeIcon
                              icon={faLayerGroup}
                              className="mr-1.5"
                            />
                            {asignatura.ects} ECTS
                          </span>
                        </div>
                      </Link>
                    ),
                  )}
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
