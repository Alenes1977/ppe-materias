import React from 'react';
import { useParams, Link } from 'react-router-dom';
import data from '../data/ppe.json';
import { generateSlug } from '../utils/stringUtils';
import BackButton from './BackButton';

const Modulo: React.FC = () => {
  const { moduloSlug } = useParams<{ moduloSlug: string }>();

  // Encontrar el módulo correspondiente
  const modulo = data.modulos.find(
    (m) => generateSlug(m.nombre) === moduloSlug,
  );

  if (!modulo) {
    return (
      <div className="container mx-auto px-4 pt-20">
        <div className="mb-6">
          <BackButton to="/plan-estudios" />
        </div>
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Módulo no encontrado
          </h1>
          <p className="text-gray-600">
            El módulo que buscas no existe o no está disponible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 pt-20">
        <div className="mb-6">
          <BackButton to="/plan-estudios" />
        </div>

        {/* Cabecera del módulo */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            {modulo.nombre}
          </h1>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800">
              {modulo.ects} ECTS
            </span>
          </div>
        </div>

        {/* Lista de materias */}
        <div className="space-y-6">
          {modulo.materias.map((materia, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
            >
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                {materia.nombre}
              </h2>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm text-gray-500">ECTS Básicos</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {materia['ECTS-basicos']}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm text-gray-500">ECTS Obligatorios</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {materia['ECTS-obligatorios']}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm text-gray-500">ECTS Optativos</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {materia['ECTS-optativos']}
                  </p>
                </div>
              </div>

              {/* Lista de asignaturas */}
              <div className="mt-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  Asignaturas
                </h3>
                <div className="grid gap-2">
                  {materia.asignaturas.map((asignatura, idx) => (
                    <Link
                      key={idx}
                      to={`/asignaturas/${generateSlug(asignatura.nombre)}`}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                    >
                      <span className="font-medium text-gray-700">
                        {asignatura.nombre}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {asignatura.curso}º curso
                        </span>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          {asignatura.semestre === 'anual'
                            ? 'Anual'
                            : `${asignatura.semestre}º semestre`}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modulo;
