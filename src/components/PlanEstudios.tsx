import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Tipos para TypeScript
interface Asignatura {
  nombre: string;
  curso: string;
  semestre: string;
  competencias: string[];
}

interface Materia {
  nombre: string;
  ECTS?: string;
  'ECTS-n'?: string;
  'ECTS-basicos'?: string;
  'ECTS-obligatorios'?: string;
  'ECTS-optativos'?: string;
  asignaturas: Asignatura[];
  'actividad-formativa': string[];
  evaluacion: {
    tipo: string;
    'ponderacion-minima': string;
    'ponderacion-maxima': string;
  }[];
}

interface Modulo {
  nombre: string;
  ects: number;
  materias: Materia[];
}

const PlanEstudios: React.FC = () => {
  const [cursoFilter, setCursoFilter] = useState<string>('');
  // Inicializar con un objeto vacío para evitar errores al verificar propiedades
  const [expandedModulos, setExpandedModulos] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedMaterias, setExpandedMaterias] = useState<{
    [key: string]: boolean;
  }>({});

  // Función para alternar la expansión de un módulo
  const toggleModulo = (moduloNombre: string) => {
    setExpandedModulos((prev) => ({
      ...prev,
      [moduloNombre]: !prev[moduloNombre],
    }));
  };

  // Función para alternar la expansión de una materia
  const toggleMateria = (materiaNombre: string) => {
    setExpandedMaterias((prev) => ({
      ...prev,
      [materiaNombre]: !prev[materiaNombre],
    }));
  };

  // Filtra asignaturas por curso seleccionado
  const filtrarAsignaturasPorCurso = (asignaturas: Asignatura[]) => {
    if (!cursoFilter) return asignaturas;
    return asignaturas.filter((asignatura) => asignatura.curso === cursoFilter);
  };

  // Verificar si una materia tiene asignaturas para el curso seleccionado
  const materiaContieneAsignaturasCurso = (materia: Materia) => {
    if (!cursoFilter) return true;
    return materia.asignaturas.some(
      (asignatura) => asignatura.curso === cursoFilter,
    );
  };

  // Función para verificar si todos los módulos están expandidos
  const todosModulosExpandidos = () => {
    // Si no hay módulos expandidos, devolver false
    if (Object.keys(expandedModulos).length === 0) return false;

    // Verificar si todos los módulos están expandidos
    return data.modulos.every((modulo) => expandedModulos[modulo.nombre]);
  };

  // Función para obtener el número de ECTS de una materia, considerando diferentes formatos
  const obtenerECTSMateria = (materia: Materia): string => {
    return materia.ECTS || materia['ECTS-n'] || '0';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado de la página */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
            Plan de Estudios
          </h1>
          <p className="mx-auto max-w-3xl text-gray-600">
            Explora la estructura completa del Grado en Filosofía, Política y
            Economía. Conoce los módulos, materias y asignaturas que componen
            este programa formativo.
          </p>
        </div>

        {/* Resumen del plan */}
        <div className="mb-12 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Estructura General
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Información Básica
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                  <span className="font-medium">Titulación:</span>
                  <span className="ml-2">
                    Grado en Filosofía, Política y Economía
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                  <span className="font-medium">Créditos ECTS totales:</span>
                  <span className="ml-2">240</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                  <span className="font-medium">Duración:</span>
                  <span className="ml-2">4 años académicos</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                  <span className="font-medium">Modalidad:</span>
                  <span className="ml-2">Presencial</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Distribución de Créditos
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                  <span className="font-medium">Formación Básica:</span>
                  <span className="ml-2">60 ECTS</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                  <span className="font-medium">Obligatorias:</span>
                  <span className="ml-2">120 ECTS</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                  <span className="font-medium">Optativas:</span>
                  <span className="ml-2">48 ECTS</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
                  <span className="font-medium">Trabajo Fin de Grado:</span>
                  <span className="ml-2">12 ECTS</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Módulos del plan de estudios */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Módulos del Plan de Estudios
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.modulos.map((modulo, index) => (
              <Link
                key={index}
                to={`/plan-estudios/${modulo.nombre
                  .replace(/\s+/g, '-')
                  .toLowerCase()}`}
                className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                  <h3 className="text-xl font-bold">{modulo.nombre}</h3>
                  <div className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm">
                    {modulo.ects} ECTS
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold uppercase text-gray-500">
                      Materias
                    </h4>
                    <p className="text-gray-700">
                      {modulo.materias.length} materias en este módulo
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase text-gray-500">
                      Asignaturas
                    </h4>
                    <p className="text-gray-700">
                      {modulo.materias.reduce(
                        (total, materia) => total + materia.asignaturas.length,
                        0,
                      )}{' '}
                      asignaturas en total
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:underline">
                    Ver detalle del módulo
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="ml-2 transform transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Cursos y semestres */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Distribución por Cursos
          </h2>

          {[1, 2, 3, 4].map((curso) => (
            <div key={curso} className="mb-8 last:mb-0">
              <h3 className="mb-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-lg font-bold text-white">
                {curso}º Curso
              </h3>

              {/* Semestres */}
              <div className="grid gap-6 md:grid-cols-2">
                {['1', '2'].map((semestre) => {
                  // Filtrar asignaturas por curso y semestre
                  const asignaturasFiltradas = data.modulos
                    .flatMap((modulo) =>
                      modulo.materias.flatMap((materia) =>
                        materia.asignaturas
                          .filter(
                            (asignatura) =>
                              asignatura.curso === curso.toString() &&
                              (asignatura.semestre === semestre ||
                                asignatura.semestre === 'anual'),
                          )
                          .map((asignatura) => ({
                            ...asignatura,
                            modulo: modulo.nombre,
                            materia: materia.nombre,
                          })),
                      ),
                    )
                    .sort((a, b) => a.nombre.localeCompare(b.nombre));

                  return (
                    <div
                      key={semestre}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <h4 className="mb-3 text-lg font-semibold text-gray-800">
                        {semestre === '1' ? 'Primer' : 'Segundo'} Semestre
                      </h4>
                      {asignaturasFiltradas.length > 0 ? (
                        <ul className="space-y-2">
                          {asignaturasFiltradas.map((asignatura, idx) => (
                            <li key={idx}>
                              <Link
                                to={`/asignaturas/${asignatura.nombre
                                  .replace(/\s+/g, '-')
                                  .toLowerCase()}`}
                                className="flex items-center rounded-md p-2 text-gray-700 transition-colors hover:bg-blue-50"
                              >
                                <FontAwesomeIcon
                                  icon={faBook}
                                  className="mr-2 text-blue-500"
                                />
                                <span>{asignatura.nombre}</span>
                                {asignatura.semestre === 'anual' && (
                                  <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                                    Anual
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="py-2 text-center text-gray-500">
                          No hay asignaturas para este semestre
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanEstudios;
