import ppeData from '../data/ppe.json';
import { slugify } from '../lib/utils';

// Tipos para los datos procesados
export interface Evaluacion {
  tipo: string;
  'ponderacion-minima': string;
  'ponderacion-maxima': string;
}

export interface ActividadFormativa {
  nombre: string;
}

export interface AsignaturaProcesada {
  id: string;
  nombre: string;
  curso: number;
  semestre: number;
  ects: number;
  // Añadimos la información de la materia y el módulo para contexto
  materia: string;
  modulo: string;
  'actividad-formativa': string[];
  evaluacion: Evaluacion[];
  resultados_aprendizaje: string[];
}

let asignaturasProcesadas: AsignaturaProcesada[] | null = null;

/**
 * Procesa el JSON de ppe para extraer una lista plana de asignaturas,
 * enriqueciendo cada asignatura con los datos de su materia y módulo.
 * Cachea el resultado para evitar reprocesar en futuras llamadas.
 */
export const getAsignaturas = (): AsignaturaProcesada[] => {
  if (asignaturasProcesadas) {
    return asignaturasProcesadas;
  }

  const listaCompleta: AsignaturaProcesada[] = [];

  ppeData.modulos.forEach((modulo) => {
    modulo.materias.forEach((materia) => {
      // Ignoramos la materia de "Optativas" que no tiene asignaturas específicas
      if (materia.nombre === 'Optativas') return;

      materia.asignaturas.forEach((asignatura) => {
        // La materia 'Formación específica complementaria' tiene una entrada genérica "Optativas"
        // que no queremos como asignatura individual seleccionable.
        if (asignatura.nombre === 'Optativas') return;

        listaCompleta.push({
          id: slugify(asignatura.nombre),
          nombre: asignatura.nombre,
          curso: asignatura.curso,
          semestre: asignatura.semestre,
          ects: asignatura.ects,
          materia: materia.nombre,
          modulo: modulo.nombre,
          'actividad-formativa': materia['actividad-formativa'],
          evaluacion: asignatura.evaluacion ?? materia.evaluacion,
          resultados_aprendizaje: materia.resultados_aprendizaje || [],
        });
      });
    });
  });

  // Ordenamos alfabéticamente por nombre de asignatura
  listaCompleta.sort((a, b) => a.nombre.localeCompare(b.nombre));

  asignaturasProcesadas = listaCompleta;
  return asignaturasProcesadas;
};

/**
 * Devuelve una asignatura específica por su ID (slug).
 */
export const getAsignaturaById = (
  id: string,
): AsignaturaProcesada | undefined => {
  const asignaturas = getAsignaturas();
  return asignaturas.find((a) => a.id === id);
};
