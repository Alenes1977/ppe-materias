import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSearch,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

// Datos de ejemplo para competencias (en un proyecto real vendrían de una API o archivo JSON)
const competenciasData = {
  básicas: [
    {
      id: 'CB1',
      descripcion:
        'Que los estudiantes hayan demostrado poseer y comprender conocimientos en un área de estudio que parte de la base de la educación secundaria general, y se suele encontrar a un nivel que, si bien se apoya en libros de texto avanzados, incluye también algunos aspectos que implican conocimientos procedentes de la vanguardia de su campo de estudio.',
    },
    {
      id: 'CB2',
      descripcion:
        'Que los estudiantes sepan aplicar sus conocimientos a su trabajo o vocación de una forma profesional y posean las competencias que suelen demostrarse por medio de la elaboración y defensa de argumentos y la resolución de problemas dentro de su área de estudio.',
    },
    {
      id: 'CB3',
      descripcion:
        'Que los estudiantes tengan la capacidad de reunir e interpretar datos relevantes (normalmente dentro de su área de estudio) para emitir juicios que incluyan una reflexión sobre temas relevantes de índole social, científica o ética.',
    },
    {
      id: 'CB4',
      descripcion:
        'Que los estudiantes puedan transmitir información, ideas, problemas y soluciones a un público tanto especializado como no especializado.',
    },
    {
      id: 'CB5',
      descripcion:
        'Que los estudiantes hayan desarrollado aquellas habilidades de aprendizaje necesarias para emprender estudios posteriores con un alto grado de autonomía.',
    },
  ],
  generales: [
    {
      id: 'CG1',
      descripcion:
        'Capacidad para analizar críticamente las ideas y argumentaciones en el ámbito filosófico, político y económico.',
    },
    {
      id: 'CG2',
      descripcion:
        'Capacidad para sintetizar e integrar conocimientos de diferentes disciplinas para desarrollar perspectivas holísticas.',
    },
    {
      id: 'CG3',
      descripcion:
        'Habilidad para comunicar argumentos filosóficos, políticos y económicos complejos de manera clara y persuasiva.',
    },
    {
      id: 'CG4',
      descripcion:
        'Capacidad para aplicar la reflexión crítica a problemas contemporáneos combinando perspectivas filosóficas, políticas y económicas.',
    },
  ],
  específicas: [
    {
      id: 'CE1',
      descripcion:
        'Comprender los principios fundamentales del pensamiento filosófico occidental y su evolución histórica.',
    },
    {
      id: 'CE2',
      descripcion:
        'Analizar las estructuras y procesos políticos nacionales e internacionales desde una perspectiva comparada.',
    },
    {
      id: 'CE3',
      descripcion:
        'Evaluar modelos económicos y sus implicaciones éticas, sociales y políticas.',
    },
    {
      id: 'CE4',
      descripcion:
        'Aplicar metodologías interdisciplinares para el análisis de problemas complejos en la intersección de filosofía, política y economía.',
    },
    {
      id: 'CE5',
      descripcion:
        'Desarrollar proyectos de investigación integrando perspectivas múltiples y utilizando diversas metodologías.',
    },
    {
      id: 'CE6',
      descripcion:
        'Interpretar textos clásicos y contemporáneos en el ámbito de la filosofía, política y economía.',
    },
  ],
  transversales: [
    {
      id: 'CT1',
      descripcion:
        'Capacidad para trabajar en equipos interdisciplinares y multiculturales.',
    },
    {
      id: 'CT2',
      descripcion:
        'Habilidades de gestión de la información y capacidad de organización y planificación.',
    },
    {
      id: 'CT3',
      descripcion:
        'Compromiso ético y sensibilidad hacia la diversidad y multiculturalidad.',
    },
    {
      id: 'CT4',
      descripcion:
        'Capacidad para adaptarse a nuevas situaciones y resolver problemas con creatividad.',
    },
  ],
};

// Componente para cada categoría de competencias
const CategoriaCompetencias: React.FC<{
  titulo: string;
  competencias: { id: string; descripcion: string }[];
  color: string;
}> = ({ titulo, competencias, color }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-xl border-t-4 bg-white shadow-md ${color}`}
    >
      <div
        className="flex cursor-pointer items-center justify-between p-5"
        onClick={() => setExpandido(!expandido)}
      >
        <h2 className="text-xl font-bold text-gray-800">
          Competencias {titulo}
        </h2>
        <FontAwesomeIcon
          icon={expandido ? faChevronUp : faChevronDown}
          className="text-gray-500"
        />
      </div>

      {expandido && (
        <div className="border-t border-gray-100 p-5 pt-0">
          <ul className="space-y-4">
            {competencias.map((competencia) => (
              <li key={competencia.id} className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-start">
                  <span
                    className={`mr-3 inline-block rounded-md px-2 py-1 text-sm font-bold text-white ${color.replace(
                      'border',
                      'bg',
                    )}`}
                  >
                    {competencia.id}
                  </span>
                  <p className="text-gray-700">{competencia.descripcion}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Competencias: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar competencias según criterio de búsqueda
  const filtrarCompetencias = (competencias: typeof competenciasData) => {
    if (!searchTerm.trim()) return competenciasData;

    const filtrado: typeof competenciasData = {
      básicas: [],
      generales: [],
      específicas: [],
      transversales: [],
    };

    // Filtrar cada categoría
    for (const categoria in competenciasData) {
      const key = categoria as keyof typeof competenciasData;
      filtrado[key] = competenciasData[key].filter(
        (comp) =>
          comp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comp.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtrado;
  };

  const competenciasFiltradas = filtrarCompetencias(competenciasData);

  // Calcular el total de competencias
  const totalCompetencias = Object.values(competenciasData).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  // Calcular el total de competencias filtradas
  const totalFiltradas = Object.values(competenciasFiltradas).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navegación de regreso */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center font-medium text-blue-600 hover:underline"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Volver al inicio
          </Link>
        </div>

        {/* Cabecera de la página */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
            Competencias del Grado
          </h1>
          <p className="mx-auto max-w-3xl text-gray-600">
            Explora todas las competencias que desarrollarás durante tu
            formación en el Grado de Filosofía, Política y Economía,
            clasificadas por categorías.
          </p>
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

          {searchTerm && (
            <div className="mt-2 text-right text-sm text-gray-500">
              Mostrando {totalFiltradas} de {totalCompetencias} competencias
            </div>
          )}
        </div>

        {/* Categorías de competencias */}
        <div className="space-y-6">
          {totalFiltradas === 0 && (
            <div className="rounded-xl bg-white py-12 text-center shadow-md">
              <div className="mb-4 text-5xl text-gray-400">😕</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-700">
                No se encontraron competencias
              </h3>
              <p className="mx-auto max-w-md text-gray-500">
                No hay competencias que coincidan con tu búsqueda. Intenta con
                otros términos.
              </p>
            </div>
          )}

          {competenciasFiltradas.básicas.length > 0 && (
            <CategoriaCompetencias
              titulo="Básicas"
              competencias={competenciasFiltradas.básicas}
              color="border-blue-500"
            />
          )}

          {competenciasFiltradas.generales.length > 0 && (
            <CategoriaCompetencias
              titulo="Generales"
              competencias={competenciasFiltradas.generales}
              color="border-indigo-500"
            />
          )}

          {competenciasFiltradas.específicas.length > 0 && (
            <CategoriaCompetencias
              titulo="Específicas"
              competencias={competenciasFiltradas.específicas}
              color="border-purple-500"
            />
          )}

          {competenciasFiltradas.transversales.length > 0 && (
            <CategoriaCompetencias
              titulo="Transversales"
              competencias={competenciasFiltradas.transversales}
              color="border-teal-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Competencias;
