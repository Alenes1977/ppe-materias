import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faChevronDown,
  faChevronUp,
  faBook,
  faGraduationCap,
  faLayerGroup,
  faBullseye,
} from '@fortawesome/free-solid-svg-icons';
import data from '../data/ppe.json';
import BackButton from './BackButton';

// Función para contar las asignaturas que tienen cada competencia
const contarAsignaturasConCompetencia = (competenciaId: string): number => {
  return data.modulos.flatMap((modulo) =>
    modulo.materias.flatMap((materia) =>
      materia.asignaturas.filter((asignatura) =>
        asignatura.competencias.includes(competenciaId),
      ),
    ),
  ).length;
};

// Transformar los datos del JSON al formato requerido
const transformarCompetencias = () => {
  const competencias = data.competencias;
  const competenciasFormateadas = {
    básicas: Object.entries(competencias)
      .filter(([id]) => id.startsWith('CB'))
      .map(([id, descripcion]) => ({
        id,
        descripcion,
        numAsignaturas: contarAsignaturasConCompetencia(id),
      })),
    generales: Object.entries(competencias)
      .filter(([id]) => id.startsWith('CG'))
      .map(([id, descripcion]) => ({
        id,
        descripcion,
        numAsignaturas: contarAsignaturasConCompetencia(id),
      })),
    específicas: Object.entries(competencias)
      .filter(([id]) => id.startsWith('CE'))
      .map(([id, descripcion]) => ({
        id,
        descripcion,
        numAsignaturas: contarAsignaturasConCompetencia(id),
      })),
    transversales: Object.entries(competencias)
      .filter(([id]) => id.startsWith('CT'))
      .map(([id, descripcion]) => ({
        id,
        descripcion,
        numAsignaturas: contarAsignaturasConCompetencia(id),
      })),
  };
  return competenciasFormateadas;
};

const CompetenciaCard: React.FC<{
  competencia: {
    id: string;
    descripcion: string;
    numAsignaturas: number;
  };
  color: string;
}> = ({ competencia, color }) => {
  const [expandida, setExpandida] = useState(false);
  const porcentajeAsignaturas = (competencia.numAsignaturas / 40) * 100; // 40 es aproximadamente el número total de asignaturas

  return (
    <div
      className={`overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 ${
        expandida ? 'row-span-2' : ''
      }`}
    >
      <div className={`h-2 ${color}`} />
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div
            className={`text-lg font-bold ${
              expandida ? 'mb-3 text-2xl' : ''
            } transition-all duration-300`}
          >
            {competencia.id}
          </div>
          <button
            onClick={() => setExpandida(!expandida)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon
              icon={expandida ? faChevronUp : faChevronDown}
              className="transition-transform duration-300"
            />
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandida ? 'max-h-96' : 'max-h-20'
          }`}
        >
          <p className="mb-4 text-gray-600">{competencia.descripcion}</p>

          {expandida && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center text-sm">
                <FontAwesomeIcon icon={faBook} className="mr-2 text-blue-500" />
                <span>
                  Presente en {competencia.numAsignaturas} asignaturas
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${color}`}
                  style={{ width: `${porcentajeAsignaturas}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Competencias: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const competenciasData = useMemo(() => transformarCompetencias(), []);

  // Estadísticas generales
  const stats = useMemo(() => {
    const total = Object.values(competenciasData).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    return {
      total,
      básicas: competenciasData.básicas.length,
      generales: competenciasData.generales.length,
      específicas: competenciasData.específicas.length,
      transversales: competenciasData.transversales.length,
    };
  }, [competenciasData]);

  const filtrarCompetencias = (busqueda: string) => {
    if (!busqueda.trim()) return competenciasData;

    const filtrado = {
      básicas: competenciasData.básicas.filter(
        (comp) =>
          comp.id.toLowerCase().includes(busqueda.toLowerCase()) ||
          comp.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
      ),
      generales: competenciasData.generales.filter(
        (comp) =>
          comp.id.toLowerCase().includes(busqueda.toLowerCase()) ||
          comp.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
      ),
      específicas: competenciasData.específicas.filter(
        (comp) =>
          comp.id.toLowerCase().includes(busqueda.toLowerCase()) ||
          comp.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
      ),
      transversales: competenciasData.transversales.filter(
        (comp) =>
          comp.id.toLowerCase().includes(busqueda.toLowerCase()) ||
          comp.descripcion.toLowerCase().includes(busqueda.toLowerCase()),
      ),
    };

    return filtrado;
  };

  const competenciasFiltradas = useMemo(
    () => filtrarCompetencias(searchTerm),
    [searchTerm],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 pb-8 pt-20">
        {/* Navegación */}
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        {/* Cabecera */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            Competencias del Grado
          </h1>
          <p className="mx-auto max-w-3xl text-gray-600">
            Explora las competencias que desarrollarás durante tu formación,
            organizadas por categorías y vinculadas a las asignaturas del plan
            de estudios.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Competencias</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="text-3xl text-blue-500"
              />
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Básicas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.básicas}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faLayerGroup}
                className="text-3xl text-indigo-500"
              />
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Específicas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.específicas}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faBullseye}
                className="text-3xl text-purple-500"
              />
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Transversales</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.transversales}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faBook}
                className="text-3xl text-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="mx-auto mb-10 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por código o descripción..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400"
            />
          </div>
        </div>

        {/* Grid de competencias */}
        <div className="space-y-8">
          {Object.entries(competenciasFiltradas).map(
            ([categoria, competencias]) =>
              competencias.length > 0 && (
                <div key={categoria}>
                  <h2 className="mb-4 text-2xl font-bold capitalize text-gray-800">
                    Competencias {categoria}
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {competencias.map((competencia) => (
                      <CompetenciaCard
                        key={competencia.id}
                        competencia={competencia}
                        color={
                          categoria === 'básicas'
                            ? 'bg-blue-500'
                            : categoria === 'generales'
                              ? 'bg-indigo-500'
                              : categoria === 'específicas'
                                ? 'bg-purple-500'
                                : 'bg-teal-500'
                        }
                      />
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {Object.values(competenciasFiltradas).every(
          (arr) => arr.length === 0,
        ) && (
          <div className="py-12 text-center">
            <div className="mb-4 text-5xl">😕</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              No se encontraron competencias
            </h3>
            <p className="text-gray-500">
              No hay competencias que coincidan con tu búsqueda. Intenta con
              otros términos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Competencias;
