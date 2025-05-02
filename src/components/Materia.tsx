import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import data from '../data/ppe.json';

const Materia: React.FC = () => {
  const { materiaSlug } = useParams<{ materiaSlug: string }>();

  const materiaInfo = useMemo(() => {
    // Encontrar la materia y su módulo correspondiente
    for (const modulo of data.modulos) {
      const materia = modulo.materias.find(
        (m) => m.nombre.replace(/\s+/g, '-').toLowerCase() === materiaSlug,
      );
      if (materia) {
        return {
          ...materia,
          modulo: modulo.nombre,
        };
      }
    }
    return null;
  }, [materiaSlug]);

  if (!materiaInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="rounded-xl bg-white p-8 text-center shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              Materia no encontrada
            </h1>
            <p className="mb-6 text-gray-600">
              La materia que buscas no existe o no está disponible.
            </p>
            <Link
              to="/asignaturas"
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Volver a asignaturas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="mb-12">
          <div className="mb-6">
            <Link
              to="/asignaturas"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              ← Volver a asignaturas
            </Link>
          </div>
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-6">
              <Link
                to={`/plan-estudios/${materiaInfo.modulo
                  .replace(/\s+/g, '-')
                  .toLowerCase()}`}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 hover:bg-blue-200"
              >
                {materiaInfo.modulo}
              </Link>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              {materiaInfo.nombre}
            </h1>
          </div>
        </div>

        {/* Contenido */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Información principal */}
          <div className="lg:col-span-2">
            <div className="mb-8 rounded-xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Asignaturas de la materia
              </h2>
              <div className="grid gap-4">
                {materiaInfo.asignaturas.map((asignatura) => (
                  <Link
                    key={asignatura.nombre}
                    to={`/asignaturas/${asignatura.nombre
                      .replace(/\s+/g, '-')
                      .toLowerCase()}`}
                    className="group rounded-lg border border-gray-100 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    <h3 className="mb-2 text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                      {asignatura.nombre}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {asignatura.curso}º Curso
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {asignatura.semestre === 'anual'
                          ? 'Anual'
                          : `${asignatura.semestre}º Semestre`}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar con información adicional */}
          <div className="lg:col-span-1">
            {/* Actividades formativas */}
            {materiaInfo['actividad-formativa'] && (
              <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  Actividades formativas
                </h2>
                <div className="space-y-3 text-gray-600">
                  {materiaInfo['actividad-formativa'].map(
                    (actividad, index) => (
                      <p key={index}>{actividad}</p>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Evaluación */}
            {materiaInfo.evaluacion && (
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                  Evaluación
                </h2>
                <div className="space-y-3 text-gray-600">
                  {materiaInfo.evaluacion.map((evaluacion, index) => (
                    <div key={index} className="space-y-1">
                      <p className="font-medium">{evaluacion.tipo}</p>
                      <p className="text-sm">
                        Ponderación: {evaluacion['ponderacion-minima']}% -{' '}
                        {evaluacion['ponderacion-maxima']}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materia;
