import React from 'react';
import { useParams, Link } from 'react-router-dom';
import data from '../data/ppe.json';

// Tipos para TypeScript
interface EvaluacionItem {
  tipo: string;
  'ponderacion-minima': string;
  'ponderacion-maxima': string;
}

// Cambiar el tipo para adaptarse a React Router v6
interface Params {
  [key: string]: string | undefined;
}

const AsignaturaDetalle: React.FC = () => {
  // useParams en React Router v6 ya retorna un tipo de registro
  const { nombre } = useParams<Params>();

  // Normalizar el nombre de la URL para comparar
  const nombreNormalizado = nombre?.replace(/-/g, ' ').toLowerCase();

  // Buscar la asignatura en todos los módulos y materias
  const asignaturaInfo = React.useMemo(() => {
    for (const modulo of data.modulos) {
      for (const materia of modulo.materias) {
        const asignatura = materia.asignaturas.find(
          (a) => a.nombre.toLowerCase() === nombreNormalizado,
        );

        if (asignatura) {
          return {
            asignatura,
            materia,
            modulo,
          };
        }
      }
    }
    return null;
  }, [nombreNormalizado]);

  if (!asignaturaInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-red-600">
            Asignatura no encontrada
          </h2>
          <p className="mb-6 text-gray-600">
            No se ha encontrado ninguna asignatura con el nombre especificado.
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
  }

  const { asignatura, materia, modulo } = asignaturaInfo;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Información general */}
          <div className="space-y-6 lg:col-span-2">
            {/* Ficha básica */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                Información básica
              </h2>

              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Curso</h3>
                  <p className="text-lg">{asignatura.curso}º Curso</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Semestre
                  </h3>
                  <p className="text-lg">
                    {asignatura.semestre === 'anual'
                      ? 'Anual'
                      : `${asignatura.semestre}º Semestre`}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Módulo</h3>
                  <p className="text-lg">{modulo.nombre}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Materia</h3>
                  <p className="text-lg">{materia.nombre}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-500">
                  Competencias desarrolladas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {asignatura.competencias.map((competencia, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                    >
                      {competencia}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actividades formativas */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                Actividades formativas
              </h2>

              <ul className="space-y-2">
                {materia['actividad-formativa'].map((actividad, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-600"></span>
                    </div>
                    <span className="ml-3 text-gray-700">{actividad}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sistema de evaluación */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                Sistema de evaluación
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Tipo de evaluación
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Ponderación mínima
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Ponderación máxima
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {materia.evaluacion.map((item: EvaluacionItem, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {item.tipo}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {item['ponderacion-minima']}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {item['ponderacion-maxima']}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - Información complementaria */}
          <div className="space-y-6">
            {/* Navegación rápida */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                Accesos rápidos
              </h2>

              <nav className="space-y-2">
                <Link
                  to="/"
                  className="block rounded-md p-2 text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Volver al inicio
                </Link>
                <Link
                  to="/plan-estudios"
                  className="block rounded-md p-2 text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Ver plan completo
                </Link>
                <Link
                  to={`/modulo/${modulo.nombre
                    .replace(/\s+/g, '-')
                    .toLowerCase()}`}
                  className="block rounded-md p-2 text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Ver módulo: {modulo.nombre}
                </Link>
              </nav>
            </div>

            {/* Competencias - Vista detallada */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-4 border-b pb-2 text-xl font-semibold text-gray-800">
                Detalle de competencias
              </h2>

              <div className="space-y-4">
                {asignatura.competencias.map((competenciaCodigo, index) => {
                  const competenciaDesc =
                    data.competencias[
                      competenciaCodigo as keyof typeof data.competencias
                    ];
                  return (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 py-2 pl-3"
                    >
                      <h3 className="font-medium text-blue-700">
                        {competenciaCodigo}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {competenciaDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AsignaturaDetalle;
