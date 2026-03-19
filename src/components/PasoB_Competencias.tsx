import type React from 'react';
import type { AsignaturaProcesada } from '../lib/dataUtils';
import ppeData from '../data/ppe.json';

interface Props {
  asignatura: AsignaturaProcesada;
  onNext: () => void;
  onGuardarYSeguir?: () => void;
  labelSiguiente?: string;
}

// Extrae el diccionario de competencias del JSON
const competenciasDict: Record<string, string> = ppeData.resultados_aprendizaje;

const PasoB_Competencias: React.FC<Props> = ({
  asignatura,
  onNext,
  onGuardarYSeguir,
  labelSiguiente = 'Siguiente',
}) => {
  // Las competencias de la asignatura son un array de códigos
  // (ej: ["CB1", "CG2", ...])
  const competencias = asignatura.resultados_aprendizaje || [];

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-bold text-blue-900">
        B. Competencias y resultados de aprendizaje
      </h3>
      {competencias.length === 0 ? (
        <p className="text-gray-500">
          No hay competencias asociadas a esta asignatura.
        </p>
      ) : (
        <ul className="mb-6 space-y-3">
          {competencias.map((codigo: string) => (
            <li
              key={codigo}
              className="rounded border border-blue-100 bg-blue-50 px-4 py-2"
            >
              <span className="mr-2 font-semibold text-blue-800">
                {codigo}:
              </span>
              <span className="text-gray-800">
                {competenciasDict[codigo] || <em>Descripción no encontrada</em>}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap justify-end gap-3">
        {onGuardarYSeguir ? (
          <button
            type="button"
            className="rounded-md border border-blue-300 bg-white px-6 py-2 font-semibold text-blue-700 hover:bg-blue-50"
            onClick={onGuardarYSeguir}
          >
            Guardar y seguir desde aquí
          </button>
        ) : null}
        <button
          type="button"
          className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
          onClick={onNext}
        >
          {labelSiguiente}
        </button>
      </div>
    </div>
  );
};

export default PasoB_Competencias;
