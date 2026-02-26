import { type FC, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faClock,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { generateSlug } from '../utils/stringUtils';

const Asignaturas: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Extraer todas las asignaturas con información adicional
  const todasLasAsignaturas = useMemo(
    () =>
      data.modulos.flatMap((modulo) =>
        modulo.materias.flatMap((materia) =>
          materia.asignaturas.map((asignatura) => ({
            ...asignatura,
            modulo: modulo.nombre,
            materia: materia.nombre,
          })),
        ),
      ),
    [],
  );

  // Organizar asignaturas por curso
  const asignaturasOrganizadas = useMemo(() => {
    const filtradas = todasLasAsignaturas.filter((asignatura) =>
      asignatura.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const organizadas = new Map();
    for (let curso = 1; curso <= 4; curso++) {
      organizadas.set(curso, {
        semestre1: [],
        semestre2: [],
        anual: [],
      });
    }

    filtradas.forEach((asignatura) => {
      const cursoData = organizadas.get(Number(asignatura.curso));
      const semestre = String(asignatura.semestre);

      if (!cursoData) {
        return;
      }

      if (semestre === 'anual') {
        cursoData.anual.push(asignatura);
      } else {
        const semestreKey = `semestre${semestre}` as 'semestre1' | 'semestre2';
        if (semestreKey in cursoData) {
          cursoData[semestreKey].push(asignatura);
        }
      }
    });

    return organizadas;
  }, [todasLasAsignaturas, searchTerm]);

  const getSemestreBadge = (semestre: string) => {
    switch (semestre) {
      case 'anual':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            <FontAwesomeIcon icon={faClock} className="mr-1.5" />
            Anual
          </span>
        );
      case '1':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            <FontAwesomeIcon icon={faCalendar} className="mr-1.5" />
            1er Sem
          </span>
        );
      case '2':
        return (
          <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
            <FontAwesomeIcon icon={faCalendar} className="mr-1.5" />
            2º Sem
          </span>
        );
      default:
        return null;
    }
  };

  const renderAsignatura = (asignatura: {
    nombre: string;
    curso: number | string;
    semestre: string;
    ects: number;
    tipo?: string;
    modulo: string;
    materia: string;
  }) => {
    const courseColors: Record<string, string> = {
      '1': 'bg-gradient-to-br from-white to-blue-50',
      '2': 'bg-gradient-to-br from-white to-purple-50',
      '3': 'bg-gradient-to-br from-white to-green-50',
      '4': 'bg-gradient-to-br from-white to-amber-50',
    };

    return (
      <Link
        key={asignatura.nombre}
        to={`/asignaturas/${generateSlug(asignatura.nombre)}`}
        className={`group flex flex-col rounded-lg border border-gray-200 ${
          courseColors[asignatura.curso.toString()]
        } p-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg sm:p-4`}
      >
        <div className="mb-2 flex items-start gap-3 sm:mb-3 sm:gap-4">
          <div className="flex-grow">
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 sm:text-base">
              {asignatura.nombre}
            </h3>
            <div className="mt-0.5 text-xs text-gray-600 sm:mt-1 sm:text-sm">
              {asignatura.ects} ECTS
            </div>
          </div>
          <div className="flex-shrink-0">
            {getSemestreBadge(asignatura.semestre)}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-1.5 sm:gap-2">
          <Link
            to={`/plan-estudios/${generateSlug(asignatura.modulo)}`}
            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
            onClick={(e) => e.stopPropagation()}
          >
            {asignatura.modulo}
          </Link>
          <Link
            to={`/materias/${generateSlug(asignatura.materia)}`}
            className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100"
            onClick={(e) => e.stopPropagation()}
          >
            {asignatura.materia}
          </Link>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
        {/* Encabezado */}
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-4xl">
            Asignaturas del Grado
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-lg">
            Explore todas las asignaturas del Grado en Filosofía, Política y
            Economía. Acceda a la información detallada de cada asignatura
            haciendo clic en ella.
          </p>
        </div>

        {/* Barra de búsqueda y leyenda */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-700 sm:text-sm">
              Leyenda:
            </span>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  Módulo
                </span>
                <span className="text-xs text-gray-500">
                  Pulse en un módulo para ver el detalle
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                  Materia
                </span>
                <span className="text-xs text-gray-500">
                  Pulse en una materia para ver el detalle
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex-1 md:max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar asignatura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-10 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:py-3"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            ) : null}
          </div>
        </div>

        {/* Lista de asignaturas por curso */}
        {Array.from(asignaturasOrganizadas.entries()).map(([curso, data]) => {
          const todasLasAsignaturasCurso = [
            ...data.anual,
            ...data.semestre1,
            ...data.semestre2,
          ];

          if (todasLasAsignaturasCurso.length === 0) return null;

          return (
            <div key={curso} className="mb-6 sm:mb-8">
              <div className="mb-3 flex items-center sm:mb-4">
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                  {curso}º Curso
                </h2>
                <div className="ml-4 h-px flex-1 bg-gradient-to-r from-blue-200 to-transparent"></div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {[...data.anual, ...data.semestre1, ...data.semestre2]
                  .sort((a, b) => {
                    if (a.semestre === 'anual') return -1;
                    if (b.semestre === 'anual') return 1;
                    return Number(a.semestre) - Number(b.semestre);
                  })
                  .map(renderAsignatura)}
              </div>
            </div>
          );
        })}

        {/* Mensaje cuando no hay resultados */}
        {Array.from(asignaturasOrganizadas.values()).every(
          (data) =>
            data.semestre1.length === 0 &&
            data.semestre2.length === 0 &&
            data.anual.length === 0,
        ) && (
          <div className="mt-8 rounded-xl bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mb-3 text-3xl sm:mb-4 sm:text-4xl">🔍</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 sm:text-xl">
              No se encontraron asignaturas
            </h3>
            <p className="mx-auto max-w-md text-sm text-gray-600 sm:text-base">
              No hay asignaturas que coincidan con su búsqueda. Intente con otro
              término.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Asignaturas;
