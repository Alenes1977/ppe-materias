import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import data from './data/ppe.json';
import AsignaturaDetalle from './components/AsignaturaDetalle';
import PlanEstudios from './components/PlanEstudios';
import Header from './components/Header';
import Footer from './components/Footer';

// Tipos para TypeScript
interface Asignatura {
  nombre: string;
  curso: string;
  semestre: string;
  competencias: string[];
}

interface Materia {
  nombre: string;
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

// Componente para la página principal
const Home: React.FC = () => {
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
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Sección principal: Buscador de asignaturas */}
          <div className="rounded-lg bg-white p-6 shadow-md md:col-span-2">
            <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
              Buscador de asignaturas
            </h2>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Búsqueda por nombre */}
              <div className="col-span-3">
                <label
                  htmlFor="search"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Nombre de la asignatura
                </label>
                <input
                  type="text"
                  id="search"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Buscar asignatura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtro por curso */}
              <div>
                <label
                  htmlFor="curso"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Curso
                </label>
                <select
                  id="curso"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              <div>
                <label
                  htmlFor="semestre"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Semestre
                </label>
                <select
                  id="semestre"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  &nbsp;
                </label>
                <button
                  className="w-full rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-200"
                  onClick={() => {
                    setSearchTerm('');
                    setCursoFilter('');
                    setSemestreFilter('');
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            {/* Resultados de la búsqueda */}
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-800">
                Resultados ({asignaturasFiltradas.length})
              </h3>

              {asignaturasFiltradas.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {asignaturasFiltradas.map((asignatura, index) => (
                    <Link
                      key={index}
                      to={`/asignatura/${asignatura.nombre
                        .replace(/\s+/g, '-')
                        .toLowerCase()}`}
                      className="block rounded-md border border-gray-200 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-blue-600">
                            {asignatura.nombre}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {asignatura.materia}
                          </p>
                        </div>
                        <div className="flex space-x-2">
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
                <div className="py-8 text-center text-gray-500">
                  No se encontraron asignaturas con los criterios seleccionados
                </div>
              )}
            </div>
          </div>

          {/* Sección lateral: Accesos directos y Plan de estudios */}
          <div className="space-y-6">
            {/* Acceso al plan de estudios */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                Plan de estudios
              </h2>

              <p className="mb-4 text-gray-600">
                Consulta la estructura completa del plan de estudios del Grado
                en Filosofía, Política y Economía.
              </p>

              <Link
                to="/plan-estudios"
                className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700"
              >
                Ver plan completo
              </Link>
            </div>

            {/* Módulos del plan */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                Módulos
              </h2>

              <nav className="space-y-2">
                {data.modulos.map((modulo, index) => (
                  <Link
                    key={index}
                    to={`/modulo/${modulo.nombre
                      .replace(/\s+/g, '-')
                      .toLowerCase()}`}
                    className="block rounded-md p-2 text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    {modulo.nombre}{' '}
                    <span className="text-sm text-gray-500">
                      ({modulo.ects} ECTS)
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Información adicional */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                Competencias
              </h2>

              <p className="mb-4 text-gray-600">
                Consulta todas las competencias del grado clasificadas por
                categorías.
              </p>

              <Link
                to="/competencias"
                className="block w-full rounded-md bg-gray-100 px-4 py-2 text-center font-medium text-gray-800 transition-colors hover:bg-gray-200"
              >
                Ver competencias
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente para la página de competencias (como placeholder)
const Competencias: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-blue-600">Competencias</h2>
        <p className="mb-6 text-gray-600">
          Esta sección está en desarrollo. Pronto podrás consultar todas las
          competencias del grado.
        </p>
        <Link
          to="/"
          className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

// Componente para la página de módulo (como placeholder)
const ModuloDetalle: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-blue-600">
          Detalle de Módulo
        </h2>
        <p className="mb-6 text-gray-600">
          Esta sección está en desarrollo. Pronto podrás consultar el detalle de
          este módulo.
        </p>
        <Link
          to="/"
          className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

// Componente principal de la aplicación
const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan-estudios" element={<PlanEstudios />} />
            <Route path="/asignatura/:nombre" element={<AsignaturaDetalle />} />
            <Route path="/competencias" element={<Competencias />} />
            <Route path="/modulo/:nombre" element={<ModuloDetalle />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
