import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/ppe.json';

const Asignaturas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cursoFilter, setCursoFilter] = useState('');
  const [semestreFilter, setSemestreFilter] = useState('');

  // Extraer todas las asignaturas de los módulos y materias
  const todasLasAsignaturas = data.modulos.flatMap((modulo) =>
    modulo.materias.flatMap((materia) =>
      materia.asignaturas.map((asignatura) => ({
        ...asignatura,
        modulo: modulo.nombre,
        materia: materia.nombre,
        actividadesFormativas: materia['actividad-formativa'],
        evaluacion: materia.evaluacion,
      })),
    ),
  );

  // Filtrar asignaturas según los criterios
  const asignaturasFiltradas = todasLasAsignaturas.filter((asignatura) => {
    const matchesSearch = asignatura.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCurso = cursoFilter === '' || asignatura.curso === cursoFilter;
    const matchesSemestre =
      semestreFilter === '' || asignatura.semestre === semestreFilter;
    return matchesSearch && matchesCurso && matchesSemestre;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado de la página */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Asignaturas</h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            Explora todas las asignaturas del Grado en Filosofía, Política y
            Economía. Utiliza los filtros para encontrar la información que
            necesitas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Filtros (panel lateral) */}
          <div className="sticky top-24 self-start rounded-xl bg-white p-6 shadow-md md:col-span-1">
            <h2 className="mb-4 border-b pb-2 text-xl font-bold text-gray-800">
              Filtros
            </h2>

            {/* Búsqueda por nombre */}
            <div className="mb-4">
              <label
                htmlFor="search"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Nombre de la asignatura
              </label>
              <input
                type="text"
                id="search"
                className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Buscar asignatura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por curso */}
            <div className="mb-4">
              <label
                htmlFor="curso"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Curso
              </label>
              <select
                id="curso"
                className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

            {/* Filtro por semestre */}
            <div className="mb-6">
              <label
                htmlFor="semestre"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Semestre
              </label>
              <select
                id="semestre"
                className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={semestreFilter}
                onChange={(e) => setSemestreFilter(e.target.value)}
              >
                <option value="">Todos los semestres</option>
                <option value="1">1er Semestre</option>
                <option value="2">2º Semestre</option>
                <option value="anual">Anual</option>
              </select>
            </div>

            {/* Botón para limpiar filtros */}
            <button
              className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
              onClick={() => {
                setSearchTerm('');
                setCursoFilter('');
                setSemestreFilter('');
              }}
            >
              Limpiar filtros
            </button>
          </div>

          {/* Resultados de la búsqueda */}
          <div className="rounded-xl bg-white p-6 shadow-md md:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Resultados{' '}
                <span className="text-blue-600">
                  ({asignaturasFiltradas.length})
                </span>
              </h2>

              <div className="text-sm text-gray-500">
                Mostrando {asignaturasFiltradas.length} de{' '}
                {todasLasAsignaturas.length} asignaturas
              </div>
            </div>

            {asignaturasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {asignaturasFiltradas.map((asignatura, index) => (
                  <Link
                    key={index}
                    to={`/asignaturas/${asignatura.nombre
                      .replace(/\s+/g, '-')
                      .toLowerCase()}`}
                    className="block rounded-xl border border-gray-200 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600">
                          {asignatura.nombre}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <span>{asignatura.modulo}</span>
                          <span>•</span>
                          <span>{asignatura.materia}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 md:mt-0">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {asignatura.curso}º Curso
                        </span>
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                          {asignatura.semestre === 'anual'
                            ? 'Anual'
                            : `${asignatura.semestre}º Semestre`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="mb-4 text-5xl text-gray-400">😕</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                  No se encontraron resultados
                </h3>
                <p className="mx-auto max-w-md text-gray-500">
                  No hay asignaturas que coincidan con los criterios de búsqueda
                  seleccionados. Intenta con otros filtros.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asignaturas;
