import React from 'react';
import { useParams, Link } from 'react-router-dom';
import data from '../data/ppe.json';
import { generateSlug } from '../utils/stringUtils';
import BackButton from './BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faLayerGroup,
  faBookOpen,
  faChalkboardTeacher,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

const Modulo: React.FC = () => {
  const { moduloSlug } = useParams<{ moduloSlug: string }>();

  // Encontrar el módulo correspondiente
  const modulo = data.modulos.find(
    (m) => generateSlug(m.nombre) === moduloSlug,
  );

  if (!modulo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 pt-24">
          <div className="mb-6">
            <BackButton to="/plan-estudios" />
          </div>
          <div className="rounded-xl bg-white p-8 text-center shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-red-600">
              Módulo no encontrado
            </h1>
            <p className="text-gray-600">
              El módulo que buscas no existe o no está disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-14 pt-24">
        <div className="mb-8">
          <BackButton to="/plan-estudios" label="Volver al plan de estudios" />
        </div>

        {/* Cabecera del módulo */}
        <div className="mb-12 text-center">
          <div className="mb-8 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
            <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
            Ficha de módulo
          </div>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            {modulo.nombre}
          </h1>
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
              <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
              {modulo.ects} ECTS totales
            </div>
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800">
              <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
              {modulo.materias.length} materias
            </div>
          </div>
        </div>

        {/* Lista de materias */}
        <div className="space-y-8">
          {modulo.materias.map((materia, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              {/* Cabecera de la materia */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6">
                <Link
                  to={`/materias/${generateSlug(materia.nombre)}`}
                  className="group"
                >
                  <h2 className="mb-4 text-xl font-bold text-gray-800 group-hover:text-blue-600">
                    {materia.nombre}
                  </h2>
                </Link>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-sm text-blue-600">ECTS Básicos</p>
                    <p className="text-lg font-semibold text-blue-800">
                      {materia['ECTS-basicos']}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-sm text-green-600">ECTS Obligatorios</p>
                    <p className="text-lg font-semibold text-green-800">
                      {materia['ECTS-obligatorios']}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-3">
                    <p className="text-sm text-purple-600">ECTS Optativos</p>
                    <p className="text-lg font-semibold text-purple-800">
                      {materia['ECTS-optativos']}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de asignaturas */}
              <div className="divide-y divide-gray-100 bg-white">
                {materia.asignaturas.map((asignatura, idx) => (
                  <Link
                    key={idx}
                    to={`/asignaturas/${generateSlug(asignatura.nombre)}`}
                    className="flex flex-col gap-2 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-medium text-gray-700">
                      {asignatura.nombre}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                        <FontAwesomeIcon
                          icon={faChalkboardTeacher}
                          className="mr-1.5"
                        />
                        {asignatura.curso}º curso
                      </span>
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-800">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="mr-1.5"
                        />
                        {asignatura.semestre === 'anual'
                          ? 'Anual'
                          : `${asignatura.semestre}º semestre`}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                        <FontAwesomeIcon
                          icon={faLayerGroup}
                          className="mr-1.5"
                        />
                        {asignatura.ects} ECTS
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modulo;
