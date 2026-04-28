import type React from 'react';
import type { ProcessedSubject } from '../lib/dataUtils';
import { useDegree } from '../context/DegreeContext';

interface Props {
  asignatura: ProcessedSubject;
  onNext: () => void;
  onGuardarYSeguir?: () => void;
  labelSiguiente?: string;
}

const PasoB_Competencias: React.FC<Props> = ({
  asignatura,
  onNext,
  onGuardarYSeguir,
  labelSiguiente = 'Siguiente',
}) => {
  const { degreePlan, labelLO } = useDegree();
  const loDict = degreePlan.learningOutcomes;
  const codigos = asignatura.resultados_aprendizaje || [];

  const titleLabel =
    labelLO.plural.charAt(0).toUpperCase() + labelLO.plural.slice(1);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-bold text-blue-900">B. {titleLabel}</h3>
      {codigos.length === 0 ? (
        <p className="text-gray-500">
          No hay {labelLO.plural} asociadas a esta asignatura.
        </p>
      ) : (
        <ul className="mb-6 space-y-3">
          {codigos.map((codigo: string) => (
            <li
              key={codigo}
              className="rounded border border-blue-100 bg-blue-50 px-4 py-2"
            >
              <span className="mr-2 font-semibold text-blue-800">
                {codigo}:
              </span>
              <span className="text-gray-800">
                {loDict[codigo] || <em>Descripción no encontrada</em>}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap justify-end gap-3">
        {onGuardarYSeguir && (
          <button
            type="button"
            className="rounded-md border border-blue-300 bg-white px-6 py-2 font-semibold text-blue-700 hover:bg-blue-50"
            onClick={onGuardarYSeguir}
          >
            Guardar y seguir desde aquí
          </button>
        )}
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
