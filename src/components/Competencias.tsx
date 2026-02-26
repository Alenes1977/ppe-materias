import { type FC, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faClipboardList,
  faChartLine,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import data from '../data/ppe.json';
import BackButton from './BackButton';
import { Link } from 'react-router-dom';

const TOTAL_ASIGNATURAS = data.modulos.flatMap((modulo) =>
  modulo.materias.flatMap((materia) => materia.asignaturas),
).length;

const contarAsignaturasConRA = (resultadoId: string): number => {
  return data.modulos.flatMap((modulo) =>
    modulo.materias.flatMap((materia) =>
      materia.resultados_aprendizaje.includes(resultadoId)
        ? materia.asignaturas
        : [],
    ),
  ).length;
};

const transformarResultados = () => {
  return Object.entries(data.resultados_aprendizaje)
    .map(([id, descripcion]) => ({
      id,
      descripcion,
      numAsignaturas: contarAsignaturasConRA(id),
    }))
    .sort((a, b) => {
      const numA = Number.parseInt(a.id.replace(/\D/g, ''), 10);
      const numB = Number.parseInt(b.id.replace(/\D/g, ''), 10);
      return numA - numB;
    });
};

const CompetenciaCard: FC<{
  competencia: {
    id: string;
    descripcion: string;
    numAsignaturas: number;
  };
  color: string;
}> = ({ competencia, color }) => {
  const porcentajeAsignaturas =
    TOTAL_ASIGNATURAS > 0
      ? (competencia.numAsignaturas / TOTAL_ASIGNATURAS) * 100
      : 0;
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

const Competencias: FC = () => {
  const resultadosData = useMemo(() => transformarResultados(), []);

  const stats = useMemo(() => {
    const totalResultados = resultadosData.length;
    const totalPresencias = resultadosData.reduce(
      (sum, resultado) => sum + resultado.numAsignaturas,
      0,
    );
    const mediaAsignaturasPorRA =
      totalResultados > 0 ? totalPresencias / totalResultados : 0;

    return {
      totalResultados,
      totalAsignaturas: TOTAL_ASIGNATURAS,
      mediaAsignaturasPorRA,
    };
  }, [resultadosData]);

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
            Resultados de aprendizaje
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl">
            Resultados de aprendizaje (Competencias)
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-gray-600 sm:text-lg">
            Explora los {stats.totalResultados} resultados de aprendizaje del
            grado, y su presencia en las asignaturas del plan de estudios.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-2 flex items-center justify-between">
              <FontAwesomeIcon
                icon={faClipboardList}
                className="text-xl text-blue-600 sm:text-2xl"
              />
              <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white sm:px-3">
                {stats.totalResultados}
              </span>
            </div>
            <h3 className="mb-2 text-base font-semibold text-gray-800 sm:text-lg">
              Resultados de aprendizaje
            </h3>
            <p className="text-xs text-gray-600 sm:text-sm">
              Total de RA definidos en `ppe.json`.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-2 flex items-center justify-between">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="text-xl text-indigo-600 sm:text-2xl"
              />
              <span className="rounded-full bg-indigo-600 px-2 py-1 text-xs font-bold text-white sm:px-3">
                {stats.totalAsignaturas}
              </span>
            </div>
            <h3 className="mb-2 text-base font-semibold text-gray-800 sm:text-lg">
              Asignaturas del plan
            </h3>
            <p className="text-xs text-gray-600 sm:text-sm">
              Asignaturas totales consideradas para el cálculo de presencia.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-2 flex items-center justify-between">
              <FontAwesomeIcon
                icon={faLayerGroup}
                className="text-xl text-teal-600 sm:text-2xl"
              />
              <span className="rounded-full bg-teal-600 px-2 py-1 text-xs font-bold text-white sm:px-3">
                {stats.mediaAsignaturasPorRA.toFixed(1)}
              </span>
            </div>
            <h3 className="mb-2 text-base font-semibold text-gray-800 sm:text-lg">
              Media de presencia
            </h3>
            <p className="text-xs text-gray-600 sm:text-sm">
              Número medio de asignaturas por RA.
            </p>
          </div>
        </div>

        {/* Grid de resultados */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {resultadosData.map((competencia) => (
            <CompetenciaCard
              key={competencia.id}
              competencia={competencia}
              color="bg-blue-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Competencias;
