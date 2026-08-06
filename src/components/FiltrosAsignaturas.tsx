import type React from 'react';

interface FiltrosAsignaturasProps {
  searchTerm: string;
  cursoFilter: string;
  semestreFilter: string;
  onSearchChange: (value: string) => void;
  onCursoChange: (value: string) => void;
  onSemestreChange: (value: string) => void;
  onClearFilters: () => void;
}

const FiltrosAsignaturas: React.FC<FiltrosAsignaturasProps> = ({
  searchTerm,
  cursoFilter,
  semestreFilter,
  onSearchChange,
  onCursoChange,
  onSemestreChange,
  onClearFilters,
}) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
      <h2 className="mb-6 border-b pb-3 text-xl font-bold text-gray-800">
        Filtros de búsqueda
      </h2>

      <div className="space-y-6">
        {/* Búsqueda por nombre */}
        <div className="relative">
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Nombre de la asignatura
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              className="w-full rounded-lg border-gray-200 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Buscar asignatura..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Filtro por curso */}
        <div>
          <label
            htmlFor="curso"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Curso académico
          </label>
          <select
            id="curso"
            className="w-full rounded-lg border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-blue-500"
            value={cursoFilter}
            onChange={(e) => onCursoChange(e.target.value)}
          >
            <option value="">Todos los cursos</option>
            {[1, 2, 3, 4].map((curso) => (
              <option key={curso} value={curso.toString()}>
                {curso}º Curso
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por semestre */}
        <div>
          <label
            htmlFor="semestre"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Periodo lectivo
          </label>
          <select
            id="semestre"
            className="w-full rounded-lg border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-blue-500"
            value={semestreFilter}
            onChange={(e) => onSemestreChange(e.target.value)}
          >
            <option value="">Todos los periodos</option>
            <option value="1">1er Semestre</option>
            <option value="2">2º Semestre</option>
            <option value="anual">Anual</option>
          </select>
        </div>

        {/* Botón para limpiar filtros */}
        <button
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onClearFilters}
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default FiltrosAsignaturas;
