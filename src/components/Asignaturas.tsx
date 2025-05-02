import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/ppe.json';
import FiltrosAsignaturas from './FiltrosAsignaturas';

const Asignaturas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cursoFilter, setCursoFilter] = useState('');
  const [semestreFilter, setSemestreFilter] = useState('');

  // Extraer todas las asignaturas
  const todasLasAsignaturas = useMemo(
    () =>
      data.modulos.flatMap((modulo) =>
        modulo.materias.flatMap((materia) =>
          materia.asignaturas.map((asignatura) => ({
            ...asignatura,
            modulo: modulo.nombre,
            materia: materia.nombre,
            actividadesFormativas: materia['actividad-formativa'],
            evaluacion: materia.evaluacion,
          })),
        ),
      ),
    [],
  );

  // Organizar asignaturas por curso y semestre
  const asignaturasOrganizadas = useMemo(() => {
    const filtradas = todasLasAsignaturas.filter((asignatura) => {
      const matchesSearch = asignatura.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCurso =
        cursoFilter === '' || asignatura.curso === cursoFilter;
      const matchesSemestre =
        semestreFilter === '' || asignatura.semestre === semestreFilter;
      return matchesSearch && matchesCurso && matchesSemestre;
    });

    const organizadas = new Map();
    for (let curso = 1; curso <= 4; curso++) {
      organizadas.set(curso, {
        semestre1: [],
        semestre2: [],
        anual: [],
      });
    }

    filtradas.forEach((asignatura) => {
      const cursoData = organizadas.get(Number(asignatura.curso));
      if (asignatura.semestre === 'anual') {
        cursoData.anual.push(asignatura);
      } else {
        cursoData[`semestre${asignatura.semestre}`].push(asignatura);
      }
    });

    return organizadas;
  }, [todasLasAsignaturas, searchTerm, cursoFilter, semestreFilter]);

  const renderLeyenda = () => (
    <div className="mb-8 flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <span className="text-sm font-medium text-gray-700">Leyenda:</span>
      <Link
        to="/plan-estudios"
        className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200"
      >
        Módulo
      </Link>
      <Link
        to="/materias"
        className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 hover:bg-purple-200"
      >
        Materia
      </Link>
    </div>
  );

  const renderAsignatura = (asignatura: any) => (
    <Link
      key={asignatura.nombre}
      to={`/asignaturas/${asignatura.nombre
        .replace(/\s+/g, '-')
        .toLowerCase()}`}
      className="group block overflow-hidden rounded-xl border border-gray-100 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg"
    >
      <h3 className="mb-4 text-xl font-bold text-gray-800 group-hover:text-blue-600">
        {asignatura.nombre}
      </h3>
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/plan-estudios/${asignatura.modulo
            .replace(/\s+/g, '-')
            .toLowerCase()}`}
          className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200"
          onClick={(e) => e.stopPropagation()}
        >
          {asignatura.modulo}
        </Link>
        <Link
          to={`/materias/${asignatura.materia
            .replace(/\s+/g, '-')
            .toLowerCase()}`}
          className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 hover:bg-purple-200"
          onClick={(e) => e.stopPropagation()}
        >
          {asignatura.materia}
        </Link>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-14">
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Plan de Estudios
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explora todas las asignaturas del Grado en Filosofía, Política y
            Economía. Utiliza los filtros para encontrar la información que
            necesitas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Panel de filtros */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FiltrosAsignaturas
                searchTerm={searchTerm}
                cursoFilter={cursoFilter}
                semestreFilter={semestreFilter}
                onSearchChange={setSearchTerm}
                onCursoChange={setCursoFilter}
                onSemestreChange={setSemestreFilter}
                onClearFilters={() => {
                  setSearchTerm('');
                  setCursoFilter('');
                  setSemestreFilter('');
                }}
              />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            {/* Leyenda */}
            {renderLeyenda()}

            {Array.from(asignaturasOrganizadas.entries()).map(
              ([curso, data]) => {
                const hasAsignaturas =
                  data.semestre1.length > 0 ||
                  data.semestre2.length > 0 ||
                  data.anual.length > 0;

                if (
                  !hasAsignaturas &&
                  cursoFilter !== '' &&
                  cursoFilter !== String(curso)
                ) {
                  return null;
                }

                return (
                  <div key={curso} className="mb-12">
                    <div className="mb-6 flex items-center">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {curso}º Curso
                      </h2>
                      <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent"></div>
                    </div>

                    <div className="space-y-8">
                      {/* Asignaturas anuales */}
                      {data.anual.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-lg font-semibold text-blue-600">
                            Asignaturas Anuales
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {data.anual.map(renderAsignatura)}
                          </div>
                        </div>
                      )}

                      {/* Primer semestre */}
                      {data.semestre1.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-lg font-semibold text-blue-600">
                            Primer Semestre
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {data.semestre1.map(renderAsignatura)}
                          </div>
                        </div>
                      )}

                      {/* Segundo semestre */}
                      {data.semestre2.length > 0 && (
                        <div>
                          <h3 className="mb-4 text-lg font-semibold text-blue-600">
                            Segundo Semestre
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {data.semestre2.map(renderAsignatura)}
                          </div>
                        </div>
                      )}

                      {!hasAsignaturas && (
                        <div className="rounded-lg bg-gray-50 p-8 text-center">
                          <p className="text-gray-600">
                            No hay asignaturas que coincidan con los criterios
                            de búsqueda para este curso.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              },
            )}

            {/* Mensaje cuando no hay resultados */}
            {Array.from(asignaturasOrganizadas.values()).every(
              (data) =>
                data.semestre1.length === 0 &&
                data.semestre2.length === 0 &&
                data.anual.length === 0,
            ) && (
              <div className="mt-12 rounded-xl bg-white p-12 text-center shadow-sm">
                <div className="mb-4 text-5xl">🔍</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  No se encontraron resultados
                </h3>
                <p className="mx-auto max-w-md text-gray-600">
                  No hay asignaturas que coincidan con los criterios de búsqueda
                  seleccionados. Intenta ajustar los filtros.
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
