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
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Identificador y contador de asignaturas */}
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`rounded-lg ${color} px-3 py-1.5 text-sm font-bold text-white`}
        >
          {competencia.id}
        </div>
        <div
          className={`rounded-full ${colorClasses} border px-3 py-1 text-sm font-medium`}
        >
          {competencia.numAsignaturas} asignaturas
        </div>
      </div>

      {/* Descripción */}
      <p className="mb-6 flex-grow text-sm leading-relaxed text-gray-600">
        {competencia.descripcion}
      </p>

      {/* Barra de progreso */}
      <div className="mt-auto">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            Presencia en el plan de estudios
          </span>
          <span className={`font-medium ${color.replace('bg-', 'text-')}`}>
            {Math.round(porcentajeAsignaturas)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
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
      <div className="container mx-auto px-4 pb-14 pt-24">
        {/* Navegación */}
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        {/* Cabecera */}
        <div className="mb-12 text-center">
          <div className="mb-8 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            Competencias y resultados de aprendizaje
          </div>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            Competencias del Grado
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Explora las {stats.total} competencias que se desarrollan en el
            programa formativo, organizadas por categorías y vinculadas a las
            asignaturas del plan de estudios.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-2 flex items-center justify-between">
                <FontAwesomeIcon
                  icon={cat.icon}
                  className={`text-2xl ${cat.color.replace('bg-', 'text-')}`}
                />
                <span
                  className={`rounded-full ${cat.color} px-3 py-1 text-sm font-bold text-white`}
                >
                  {stats[cat.id]}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                {cat.nombre}
              </h3>
              <p className="text-sm text-gray-600">{cat.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Tabs de navegación */}
        <div className="mb-8">
          <div className="rounded-xl border border-gray-200 bg-white p-1">
            <nav className="flex space-x-1">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => setCategoriaActiva(categoria.id)}
                  className={`
                    flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all
                    ${
                      categoriaActiva === categoria.id
                        ? `${categoria.color} text-white shadow-sm`
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }
                  `}
                >
                  <FontAwesomeIcon icon={categoria.icon} />
                  {categoria.nombre}
                  <span
                    className={`rounded-full ${
                      categoriaActiva === categoria.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    } px-2.5 py-0.5 text-xs font-medium`}
                  >
                    {stats[categoria.id]}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Grid de competencias */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
