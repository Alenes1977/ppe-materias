import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faGraduationCap,
  faLayerGroup,
  faBullseye,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import data from '../data/ppe.json';
import BackButton from './BackButton';
import { Link } from 'react-router-dom';

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
  const porcentajeAsignaturas = (competencia.numAsignaturas / 40) * 100;
  const colorClasses =
    {
      'bg-blue-500': 'bg-blue-50 text-blue-700 border-blue-200',
      'bg-indigo-500': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'bg-purple-500': 'bg-purple-50 text-purple-700 border-purple-200',
      'bg-teal-500': 'bg-teal-50 text-teal-700 border-teal-200',
    }[color] || 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <Link
      to={`/competencias/${competencia.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6"
    >
      {/* Identificador y contador de asignaturas */}
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <div
          className={`rounded-lg ${color} px-2 py-1 text-xs font-bold text-white sm:px-3 sm:py-1.5 sm:text-sm`}
        >
          {competencia.id}
        </div>
        <div
          className={`rounded-full ${colorClasses} border px-2 py-1 text-xs font-medium sm:px-3`}
        >
          {competencia.numAsignaturas} asignaturas
        </div>
      </div>

      {/* Descripción */}
      <p className="mb-4 flex-grow text-xs leading-relaxed text-gray-600 sm:mb-6 sm:text-sm">
        {competencia.descripcion}
      </p>

      {/* Barra de progreso */}
      <div className="mt-auto">
        <div className="mb-1.5 flex items-center justify-between text-xs sm:mb-2 sm:text-sm">
          <span className="font-medium text-gray-700">
            Presencia en el plan de estudios
          </span>
          <span className={`font-medium ${color.replace('bg-', 'text-')}`}>
            {Math.round(porcentajeAsignaturas)}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 sm:h-2">
          <div
            className={`h-full ${color} transition-all duration-300`}
            style={{ width: `${porcentajeAsignaturas}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

type CategoriaCompetencia =
  | 'básicas'
  | 'generales'
  | 'específicas'
  | 'transversales';

const Competencias: React.FC = () => {
  const [categoriaActiva, setCategoriaActiva] =
    useState<CategoriaCompetencia>('básicas');
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

  const categorias: {
    id: CategoriaCompetencia;
    nombre: string;
    color: string;
    icon: any;
    descripcion: string;
  }[] = [
    {
      id: 'básicas',
      nombre: 'Básicas',
      color: 'bg-blue-600',
      icon: faLayerGroup,
      descripcion:
        'Competencias fundamentales comunes a todos los grados universitarios',
    },
    {
      id: 'generales',
      nombre: 'Generales',
      color: 'bg-indigo-600',
      icon: faGraduationCap,
      descripcion:
        'Habilidades generales desarrolladas específicamente en este grado',
    },
    {
      id: 'específicas',
      nombre: 'Específicas',
      color: 'bg-purple-600',
      icon: faBullseye,
      descripcion: 'Competencias propias de la disciplina y ámbito de estudio',
    },
    {
      id: 'transversales',
      nombre: 'Transversales',
      color: 'bg-teal-600',
      icon: faBook,
      descripcion:
        'Habilidades interdisciplinares aplicables en diversos contextos',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
        {/* Navegación */}
        <div className="mb-4 sm:mb-6">
          <BackButton to="/" />
        </div>

        {/* Cabecera */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="mb-6 inline-block rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800 sm:mb-8 sm:px-4 sm:py-2 sm:text-sm">
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            Competencias y resultados de aprendizaje
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            Competencias del Grado
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-gray-600 sm:text-lg">
            Explora las {stats.total} competencias que se desarrollan en el
            programa formativo, organizadas por categorías y vinculadas a las
            asignaturas del plan de estudios.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6"
            >
              <div className="mb-2 flex items-center justify-between">
                <FontAwesomeIcon
                  icon={cat.icon}
                  className={`text-xl ${cat.color.replace(
                    'bg-',
                    'text-',
                  )} sm:text-2xl`}
                />
                <span
                  className={`rounded-full ${cat.color} px-2 py-1 text-xs font-bold text-white sm:px-3`}
                >
                  {stats[cat.id]}
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-800 sm:text-lg">
                {cat.nombre}
              </h3>
              <p className="text-xs text-gray-600 sm:text-sm">
                {cat.descripcion}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs de navegación */}
        <div className="mb-6 sm:mb-8">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-1">
            <nav className="flex min-w-max space-x-1">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => setCategoriaActiva(categoria.id)}
                  className={`
                    flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:flex-1 sm:gap-2 sm:px-4 sm:py-3 sm:text-sm
                    ${
                      categoriaActiva === categoria.id
                        ? `${categoria.color} text-white shadow-sm`
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }
                  `}
                >
                  <FontAwesomeIcon icon={categoria.icon} />
                  <span className="hidden sm:inline">{categoria.nombre}</span>
                  <span className="inline sm:hidden">
                    {categoria.nombre.slice(0, 3)}
                  </span>
                  <span
                    className={`rounded-full ${
                      categoriaActiva === categoria.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    } px-1.5 py-0.5 text-xs font-medium sm:px-2.5`}
                  >
                    {stats[categoria.id]}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Grid de competencias */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {competenciasData[categoriaActiva].map((competencia) => (
            <CompetenciaCard
              key={competencia.id}
              competencia={competencia}
              color={
                categorias.find((cat) => cat.id === categoriaActiva)?.color ||
                'bg-blue-500'
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Competencias;
