import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/ppe.json';

const Materias: React.FC = () => {
  const materiasInfo = useMemo(() => {
    return data.modulos.flatMap((modulo) =>
      modulo.materias.map((materia) => ({
        ...materia,
        modulo: modulo.nombre,
        asignaturasCount: materia.asignaturas.length,
      })),
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-14">
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Materias del Grado
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Explora todas las materias del Grado en Filosofía, Política y
            Economía, organizadas por módulos y con sus asignaturas
            correspondientes.
          </p>
        </div>

        {/* Grid de materias */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {materiasInfo.map((materia, index) => (
            <Link
              key={index}
              to={`/materias/${materia.nombre
                .replace(/\s+/g, '-')
                .toLowerCase()}`}
              className="group rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
            >
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {materia.modulo}
                </span>
              </div>
              <h2 className="mb-3 text-xl font-bold text-gray-800 group-hover:text-blue-600">
                {materia.nombre}
              </h2>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{materia.asignaturasCount} asignaturas</span>
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  Ver detalles →
                </span>
              </div>

              {/* Preview de asignaturas */}
              <div className="mt-4 space-y-2">
                {materia.asignaturas.slice(0, 2).map((asignatura, idx) => (
                  <div
                    key={idx}
                    className="text-sm text-gray-500 group-hover:text-gray-700"
                  >
                    • {asignatura.nombre}
                  </div>
                ))}
                {materia.asignaturas.length > 2 && (
                  <div className="text-sm text-blue-500">
                    Y {materia.asignaturas.length - 2} más...
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Materias;
