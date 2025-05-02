import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/ppe.json';

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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="container mx-auto flex-grow px-4 py-8">
        {/* Filtros */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label
                htmlFor="curso-filter"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Filtrar por curso
              </label>
              <select
                id="curso-filter"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={cursoFilter}
                onChange={(e) => setCursoFilter(e.target.value)}
              >
                <option value="">Todos los cursos</option>
                <option value="1">1º Curso</option>
                <option value="2">2º Curso</option>
                <option value="3">3º Curso</option>
                <option value="4">4º Curso</option>
              </select>
            </div>

            <div className="ml-auto">
              <button
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => {
                  // Expandir o colapsar todos los módulos
                  const allExpanded = todosModulosExpandidos();

                  const newExpandedState: { [key: string]: boolean } = {};
                  data.modulos.forEach((modulo) => {
                    newExpandedState[modulo.nombre] = !allExpanded;
                  });

                  setExpandedModulos(newExpandedState);
                }}
              >
                {todosModulosExpandidos()
                  ? 'Colapsar todos los módulos'
                  : 'Expandir todos los módulos'}
              </button>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
            Resumen del Plan de Estudios
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Módulo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    ECTS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Materias
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Asignaturas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.modulos.map((modulo, index) => {
                  const numAsignaturas = modulo.materias.reduce(
                    (total, materia) => total + materia.asignaturas.length,
                    0,
                  );

                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600">
                        <Link
                          to={`/modulo/${modulo.nombre
                            .replace(/\s+/g, '-')
                            .toLowerCase()}`}
                        >
                          {modulo.nombre}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {modulo.ects}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {modulo.materias.length}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {numAsignaturas}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-100">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    TOTAL
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {data.modulos.reduce((sum, modulo) => sum + modulo.ects, 0)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {data.modulos.reduce(
                      (sum, modulo) => sum + modulo.materias.length,
                      0,
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {data.modulos.reduce(
                      (total, modulo) =>
                        total +
                        modulo.materias.reduce(
                          (subtotal, materia) =>
                            subtotal + materia.asignaturas.length,
                          0,
                        ),
                      0,
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Lista detallada de módulos, materias y asignaturas */}
        <div className="space-y-6">
          {data.modulos.map((modulo, moduloIndex) => (
            <div
              key={moduloIndex}
              className="overflow-hidden rounded-lg bg-white shadow-md"
            >
              {/* Cabecera del módulo */}
              <div
                className="flex cursor-pointer items-center justify-between bg-blue-600 p-4 text-white"
                onClick={() => toggleModulo(modulo.nombre)}
              >
                <div>
                  <h2 className="text-xl font-bold">{modulo.nombre}</h2>
                  <p className="text-sm text-blue-100">{modulo.ects} ECTS</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">
                    {expandedModulos[modulo.nombre] ? 'Colapsar' : 'Expandir'}
                  </span>
                  <svg
                    className={`h-5 w-5 transition-transform ${
                      expandedModulos[modulo.nombre]
                        ? 'rotate-180 transform'
                        : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Contenido del módulo */}
              {expandedModulos[modulo.nombre] && (
                <div className="p-4">
                  {/* Materias */}
                  <div className="space-y-4">
                    {modulo.materias.map((materia, materiaIndex) => {
                      // Solo mostrar materias con asignaturas que cumplan el filtro de curso
                      if (!materiaContieneAsignaturasCurso(materia))
                        return null;

                      const ects = obtenerECTSMateria(materia);
                      const ectsBasicos = materia['ECTS-basicos'] || '0';
                      const ectsObligatorios =
                        materia['ECTS-obligatorios'] || '0';
                      const ectsOptativos = materia['ECTS-optativos'] || '0';

                      return (
                        <div
                          key={materiaIndex}
                          className="overflow-hidden rounded-md border border-gray-200"
                        >
                          {/* Cabecera de la materia */}
                          <div
                            className="flex cursor-pointer items-center justify-between bg-gray-100 p-3"
                            onClick={() => toggleMateria(materia.nombre)}
                          >
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {materia.nombre}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {ects} ECTS (Básicos: {ectsBasicos},
                                Obligatorios: {ectsObligatorios}, Optativos:{' '}
                                {ectsOptativos})
                              </p>
                            </div>
                            <div>
                              <svg
                                className={`h-5 w-5 text-gray-500 transition-transform ${
                                  expandedMaterias[materia.nombre]
                                    ? 'rotate-180 transform'
                                    : ''
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Contenido de la materia */}
                          {expandedMaterias[materia.nombre] && (
                            <div className="p-4">
                              {/* Asignaturas */}
                              <h4 className="mb-2 font-medium text-gray-700">
                                Asignaturas
                              </h4>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                      >
                                        Asignatura
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                      >
                                        Curso
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                      >
                                        Semestre
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                      >
                                        Competencias
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {filtrarAsignaturasPorCurso(
                                      materia.asignaturas,
                                    ).map((asignatura, asignaturaIndex) => (
                                      <tr
                                        key={asignaturaIndex}
                                        className={
                                          asignaturaIndex % 2 === 0
                                            ? 'bg-white hover:bg-blue-50'
                                            : 'bg-gray-50 hover:bg-blue-50'
                                        }
                                      >
                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-blue-600">
                                          <Link
                                            to={`/asignatura/${asignatura.nombre
                                              .replace(/\s+/g, '-')
                                              .toLowerCase()}`}
                                          >
                                            {asignatura.nombre}
                                          </Link>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                          {asignatura.curso}º
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                          {asignatura.semestre === 'anual'
                                            ? 'Anual'
                                            : `${asignatura.semestre}º Semestre`}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                          <div className="flex flex-wrap gap-1">
                                            {asignatura.competencias.map(
                                              (competencia, index) => (
                                                <span
                                                  key={index}
                                                  className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                                                >
                                                  {competencia}
                                                </span>
                                              ),
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* Actividades formativas */}
                              <h4 className="mb-2 mt-6 font-medium text-gray-700">
                                Actividades formativas
                              </h4>
                              <ul className="list-inside list-disc space-y-1 pl-4 text-sm text-gray-600">
                                {materia['actividad-formativa'].map(
                                  (actividad, index) => (
                                    <li key={index}>{actividad}</li>
                                  ),
                                )}
                              </ul>

                              {/* Sistema de evaluación */}
                              <h4 className="mb-2 mt-6 font-medium text-gray-700">
                                Sistema de evaluación
                              </h4>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                      >
                                        Tipo de evaluación
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                      >
                                        Ponderación mínima
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                      >
                                        Ponderación máxima
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {materia.evaluacion.map(
                                      (item, evalIndex) => (
                                        <tr
                                          key={evalIndex}
                                          className={
                                            evalIndex % 2 === 0
                                              ? 'bg-white'
                                              : 'bg-gray-50'
                                          }
                                        >
                                          <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                                            {item.tipo}
                                          </td>
                                          <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                                            {item['ponderacion-minima']}
                                          </td>
                                          <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
                                            {item['ponderacion-maxima']}
                                          </td>
                                        </tr>
                                      ),
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PlanEstudios;
