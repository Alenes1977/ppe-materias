import type React from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ppeData from '../data/ppe.json';

export interface EvaluacionSeleccionada {
  tipo: string;
  porcentaje: number;
  descripcion: string;
}

interface SistemaEvaluacion {
  tipo: string;
  'ponderacion-minima': string;
  'ponderacion-maxima': string;
}

interface SEInfo {
  id: string;
  nombre: string;
  descripcion: string;
}

// Diccionario id -> { nombre, descripcion }
const seDict: Record<string, SEInfo> = Object.fromEntries(
  (
    ppeData as {
      sistemas_evaluacion: SEInfo[];
    }
  ).sistemas_evaluacion.map((s) => [s.id, s]),
);

interface Props {
  sistemasPosibles: SistemaEvaluacion[];
  value: EvaluacionSeleccionada[];
  onChange: (value: EvaluacionSeleccionada[]) => void;
  convocatoriaExtra: string;
  onChangeConvocatoria: (texto: string) => void;
  onNext: () => void;
  labelSiguiente?: string;
}

const PasoE_Evaluacion: React.FC<Props> = ({
  sistemasPosibles,
  value,
  onChange,
  convocatoriaExtra,
  onChangeConvocatoria,
  onNext,
  labelSiguiente = 'Siguiente',
}) => {
  const [touched, setTouched] = useState(false);

  // Suma total de porcentajes
  const suma = value.reduce((acc, curr) => acc + (curr.porcentaje || 0), 0);

  // Validación de horquillas
  const fueraDeRango = value.some((ev) => {
    const sistema = sistemasPosibles.find((s) => s.tipo === ev.tipo);
    if (!sistema) return true;
    const min = parseInt(sistema['ponderacion-minima']);
    const max = parseInt(sistema['ponderacion-maxima']);
    return ev.porcentaje < min || ev.porcentaje > max;
  });

  // No hay duplicados
  const tiposUnicos = new Set(value.map((ev) => ev.tipo)).size === value.length;

  // Convocatoria extraordinaria completada
  const convocatoriaOk =
    convocatoriaExtra.trim() &&
    convocatoriaExtra.replace(/<(.|\n)*?>/g, '').trim() !== '';

  const puedeAvanzar =
    value.length > 0 &&
    suma === 100 &&
    !fueraDeRango &&
    tiposUnicos &&
    convocatoriaOk;

  // Añadir sistema
  const handleAdd = (tipo: string) => {
    if (!value.find((ev) => ev.tipo === tipo)) {
      onChange([...value, { tipo, porcentaje: 0, descripcion: '' }]);
    }
  };

  // Eliminar sistema
  const handleRemove = (tipo: string) => {
    onChange(value.filter((ev) => ev.tipo !== tipo));
  };

  // Cambiar porcentaje
  const handlePorcentaje = (tipo: string, porcentaje: number) => {
    onChange(
      value.map((ev) => (ev.tipo === tipo ? { ...ev, porcentaje } : ev)),
    );
  };

  // Cambiar descripción
  const handleDescripcion = (tipo: string, descripcion: string) => {
    onChange(
      value.map((ev) => (ev.tipo === tipo ? { ...ev, descripcion } : ev)),
    );
  };

  const handleNext = () => {
    setTouched(true);
    if (puedeAvanzar) onNext();
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-bold text-blue-900">E. Evaluación</h3>
      <p className="mb-6 text-gray-600">
        Selecciona los sistemas de evaluación previstos para esta asignatura,
        asigna el porcentaje (dentro de la horquilla permitida) y describe cómo
        se evaluará cada apartado. La suma debe ser exactamente 100%.
      </p>
      {/* Barra de progreso de porcentaje */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-1 flex items-center justify-between text-sm font-medium">
          <span className="text-gray-600">Porcentaje asignado</span>
          <span
            className={`font-bold ${
              suma === 100
                ? 'text-green-600'
                : suma > 100
                  ? 'text-red-600'
                  : 'text-blue-700'
            }`}
          >
            {suma}% / 100%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              suma === 100
                ? 'bg-green-500'
                : suma > 100
                  ? 'bg-red-500'
                  : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(suma, 100)}%` }}
          />
        </div>
        {suma === 100 && (
          <p className="mt-1 text-xs font-medium text-green-600">
            ✔ La suma es correcta
          </p>
        )}
        {suma > 100 && (
          <p className="mt-1 text-xs font-medium text-red-600">
            La suma supera el 100%. Revisa los porcentajes.
          </p>
        )}
      </div>
      <div className="mb-6">
        <div className="mb-2 font-semibold text-blue-700">
          Sistemas disponibles:
        </div>
        <ul className="mb-2 space-y-2">
          {sistemasPosibles.map((s) => {
            const info = seDict[s.tipo];
            return (
              <li key={s.tipo} className="flex items-center gap-2">
                <button
                  type="button"
                  className={`rounded border px-3 py-1 text-xs font-semibold ${
                    value.find((ev) => ev.tipo === s.tipo)
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-blue-300 bg-white text-blue-700 hover:bg-blue-50'
                  }`}
                  onClick={() =>
                    value.find((ev) => ev.tipo === s.tipo)
                      ? handleRemove(s.tipo)
                      : handleAdd(s.tipo)
                  }
                >
                  {value.find((ev) => ev.tipo === s.tipo) ? 'Quitar' : 'Añadir'}
                </button>
                <span className="font-medium text-blue-900">
                  {info?.nombre ?? s.tipo}
                </span>
                <span className="text-xs text-gray-500">
                  ({s['ponderacion-minima']} - {s['ponderacion-maxima']})
                </span>
                {info?.descripcion ? (
                  <span
                    title={info.descripcion}
                    className="flex-shrink-0 cursor-help text-blue-400 hover:text-blue-600"
                    aria-label={info.descripcion}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 7a1 1 0 112 0v.5a.5.5 0 01-.5.5H10a.5.5 0 010-1h.5V7zm.5 3.5a1 1 0 10-2 0V13a1 1 0 102 0v-2.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
      {value.map((ev) => {
        const sistema = sistemasPosibles.find((s) => s.tipo === ev.tipo);
        const min = sistema ? parseInt(sistema['ponderacion-minima']) : 0;
        const max = sistema ? parseInt(sistema['ponderacion-maxima']) : 100;
        return (
          <div
            key={ev.tipo}
            className="mb-6 rounded border border-blue-100 bg-blue-50 p-4"
          >
            <div className="mb-2 font-semibold text-blue-700">
              {seDict[ev.tipo]?.nombre ?? ev.tipo}{' '}
              <span className="text-xs text-gray-500">
                ({min}% - {max}%)
              </span>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Porcentaje:
              </label>
              <input
                type="number"
                min={min}
                max={max}
                value={ev.porcentaje}
                onChange={(e) =>
                  handlePorcentaje(ev.tipo, Number(e.target.value))
                }
                className="w-20 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              />
              <span className="text-xs text-gray-500">%</span>
            </div>
            {(ev.porcentaje < min || ev.porcentaje > max) && (
              <div className="mb-2 text-xs text-red-500">
                El porcentaje debe estar entre {min}% y {max}%
              </div>
            )}
            <div className="mb-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Detalles de la evaluación
              </label>
              <ReactQuill
                theme="snow"
                value={ev.descripcion}
                onChange={(desc: string) => handleDescripcion(ev.tipo, desc)}
                className="bg-white"
              />
            </div>
          </div>
        );
      })}
      <div className="mb-6">
        <div className="mb-1 text-lg font-bold text-blue-900">
          Convocatoria Extraordinaria <span className="text-red-500">*</span>
        </div>
        <div className="mb-2 text-xs text-blue-700">
          Detalle a continuación las instrucciones específicas para la
          evaluación en la convocatoria extraordinaria
        </div>
        <ReactQuill
          theme="snow"
          value={convocatoriaExtra}
          onChange={(desc: string) => onChangeConvocatoria(desc)}
          className="bg-white"
        />
        {touched &&
        (convocatoriaExtra.trim() === '' ||
          convocatoriaExtra.replace(/<(.|\n)*?>/g, '').trim() === '') ? (
          <div className="mt-1 text-xs text-red-500">Campo obligatorio.</div>
        ) : null}
      </div>
      <div className="mb-4 text-right font-semibold text-blue-700">
        Suma total:{' '}
        <span className={suma === 100 ? 'text-green-600' : 'text-red-600'}>
          {suma}%
        </span>
      </div>
      {touched && suma !== 100 ? (
        <div className="mb-2 text-xs text-red-500">
          La suma de los porcentajes debe ser exactamente 100%.
        </div>
      ) : null}
      <div className="flex justify-end">
        <button
          type="button"
          className={`rounded-md px-6 py-2 font-semibold text-white ${
            puedeAvanzar
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300'
          }`}
          onClick={handleNext}
          disabled={!puedeAvanzar}
        >
          {labelSiguiente}
        </button>
      </div>
    </div>
  );
};

export default PasoE_Evaluacion;
