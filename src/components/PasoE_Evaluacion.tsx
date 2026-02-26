import type React from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface EvaluacionSeleccionada {
  tipo: string;
  porcentaje: number;
  descripcion: string;
}

interface SistemaEvaluacion {
  tipo: string;
  'ponderacion-minima': string; // ej: "0%"
  'ponderacion-maxima': string; // ej: "70%"
}

interface Props {
  sistemasPosibles: SistemaEvaluacion[];
  value: EvaluacionSeleccionada[];
  onChange: (value: EvaluacionSeleccionada[]) => void;
  convocatoriaExtra: string;
  onChangeConvocatoria: (texto: string) => void;
  onNext: () => void;
}

const PasoE_Evaluacion: React.FC<Props> = ({
  sistemasPosibles,
  value,
  onChange,
  convocatoriaExtra,
  onChangeConvocatoria,
  onNext,
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
      <div className="mb-6">
        <div className="mb-2 font-semibold text-blue-700">
          Sistemas disponibles:
        </div>
        <ul className="mb-2 space-y-2">
          {sistemasPosibles.map((s) => (
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
              <span className="font-medium text-blue-900">{s.tipo}</span>
              <span className="text-xs text-gray-500">
                ({s['ponderacion-minima']} - {s['ponderacion-maxima']})
              </span>
            </li>
          ))}
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
              {ev.tipo}{' '}
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
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PasoE_Evaluacion;
