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
      return parseInt(a.curso) - parseInt(b.curso);
    }

    // Si son del mismo curso, ordenar por semestre
    // Orden: anual -> primer semestre -> segundo semestre
    const ordenSemestre = (sem: string) => {
      if (sem === 'anual') return 0;
      return parseInt(sem);
    };

    return ordenSemestre(a.semestre) - ordenSemestre(b.semestre);
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
        <div className="container mx-auto px-4 pt-24">
          <div className="mb-6">
            <BackButton to="/plan-estudios" />
          </div>
          <div className="rounded-xl bg-white p-8 text-center shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-red-600">
              Módulo no encontrado
            </h1>
            <p className="text-gray-600">
              El módulo que buscas no existe o no está disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-14 pt-24">
        <div className="mb-8">
          <BackButton to="/plan-estudios" label="Volver al plan de estudios" />
        </div>

        {/* Cabecera del módulo */}
        <div className="mb-12 text-center">
          <div className="mb-8 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            Ficha de módulo
          </div>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            {modulo.nombre}
          </h1>
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
              <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
              {modulo.ects} ECTS totales
            </div>
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800">
              <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
              {modulo.materias.length} materias
            </div>
          </div>
        </div>

        {/* Lista de materias */}
        <div className="space-y-8">
          {modulo.materias.map((materia, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              {/* Cabecera de la materia */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Título de la materia */}
                  <div>
                    <div className="mb-2 inline-block rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800">
                      <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
                      Materia
                    </div>
                    <Link
                      to={`/materias/${generateSlug(materia.nombre)}`}
                      className="group"
                    >
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">
                        {materia.nombre}
                      </h2>
                    </Link>
                  </div>

                  {/* Información de créditos */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Créditos totales */}
                    <div className="rounded-lg bg-indigo-100 px-4 py-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-indigo-900">
                          {parseInt(materia['ECTS-basicos'] || '0') +
                            parseInt(materia['ECTS-obligatorios'] || '0') +
                            parseInt(materia['ECTS-optativos'] || '0')}
                        </span>
                        <span className="text-sm font-medium text-indigo-800">
                          ECTS totales
                        </span>
                      </div>
                    </div>

                    <div className="h-8 w-px bg-gray-200"></div>

                    {/* Distribución de créditos */}
                    <div className="flex gap-2">
                      <div className="rounded-lg bg-blue-50 px-3 py-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-semibold text-blue-800">
                            {materia['ECTS-basicos'] || '0'}
                          </span>
                          <span className="text-xs text-blue-600">básicos</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-green-50 px-3 py-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-semibold text-green-800">
                            {materia['ECTS-obligatorios'] || '0'}
                          </span>
                          <span className="text-xs text-green-600">
                            obligatorios
                          </span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-purple-50 px-3 py-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-semibold text-purple-800">
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
              <div className="divide-y divide-gray-100 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-700">
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    className="mr-2 text-blue-600"
                  />
                  Asignaturas de la materia
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {ordenarAsignaturas(materia.asignaturas).map(
                    (asignatura, idx) => (
                      <Link
                        key={idx}
                        to={`/asignaturas/${generateSlug(asignatura.nombre)}`}
                        className="group flex flex-col rounded-lg border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-4 transition-all hover:border-blue-300 hover:shadow-md"
                      >
                        <h4 className="mb-3 text-base font-semibold text-gray-800 group-hover:text-blue-600">
                          {asignatura.nombre}
                        </h4>
                        <div className="mt-auto flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                            <FontAwesomeIcon
                              icon={faChalkboardTeacher}
                              className="mr-1.5"
                            />
                            {asignatura.curso}º curso
                          </span>
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-800">
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="mr-1.5"
                            />
                            {asignatura.semestre === 'anual'
                              ? 'Anual'
                              : `${asignatura.semestre}º semestre`}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
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
