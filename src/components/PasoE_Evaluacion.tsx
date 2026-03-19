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
  onGuardarYSeguir?: () => void;
  labelSiguiente?: string;
}

const PasoE_Evaluacion: React.FC<Props> = ({
  sistemasPosibles,
  value,
  onChange,
  convocatoriaExtra,
  onChangeConvocatoria,
  onNext,
  onGuardarYSeguir,
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
  const convocatoriaTextoPlano = convocatoriaExtra
    .replace(/<(.|\n)*?>/g, '')
    .trim();
  const convocatoriaOk = convocatoriaTextoPlano !== '';

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

  const handleGuardarYSeguir = () => {
    setTouched(true);
    if (puedeAvanzar && onGuardarYSeguir) {
      onGuardarYSeguir();
    }
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
      <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/80 to-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-blue-900">
            Selecciona los sistemas de evaluación que utilizarás.
          </p>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            {value.length} sistema{value.length === 1 ? '' : 's'} seleccionado
            {value.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="space-y-3">
          {sistemasPosibles.map((s) => {
            const info = seDict[s.tipo];
            const evaluacionSeleccionada = value.find(
              (ev) => ev.tipo === s.tipo,
            );
            const checked = !!evaluacionSeleccionada;
            const min = parseInt(s['ponderacion-minima']);
            const max = parseInt(s['ponderacion-maxima']);

            return (
              <div
                key={s.tipo}
                className={`overflow-hidden rounded-xl border transition-all ${
                  checked
                    ? 'border-blue-300 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3 p-4 sm:p-5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      checked ? handleRemove(s.tipo) : handleAdd(s.tipo)
                    }
                    className="mt-1 h-5 w-5 rounded border-gray-300 accent-blue-600"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-blue-900">
                        {info?.nombre ?? s.tipo}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                        {min}% - {max}%
                      </span>
                      {checked ? (
                        <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                          Seleccionado
                        </span>
                      ) : null}
                    </div>

                    {info?.descripcion ? (
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        {info.descripcion}
                      </p>
                    ) : null}
                  </div>
                </label>

                {checked && evaluacionSeleccionada ? (
                  <div className="border-t border-blue-100 bg-white/80 p-4 sm:p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <label className="text-sm font-medium text-gray-700">
                        Porcentaje:
                      </label>
                      <input
                        type="number"
                        min={min}
                        max={max}
                        value={evaluacionSeleccionada.porcentaje}
                        onChange={(e) =>
                          handlePorcentaje(s.tipo, Number(e.target.value))
                        }
                        className="w-24 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <span className="text-xs text-gray-600">%</span>
                      <span className="text-xs text-gray-500">
                        Rango permitido: {min}% - {max}%
                      </span>
                    </div>

                    {(evaluacionSeleccionada.porcentaje < min ||
                      evaluacionSeleccionada.porcentaje > max) && (
                      <div className="mb-3 text-sm font-medium text-red-600">
                        El porcentaje debe estar entre {min}% y {max}%.
                      </div>
                    )}

                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Detalles de la evaluación (opcional)
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={evaluacionSeleccionada.descripcion}
                      onChange={(desc: string) =>
                        handleDescripcion(s.tipo, desc)
                      }
                      className="bg-white"
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {touched && value.length === 0 ? (
          <div className="mt-3 text-sm font-medium text-red-600">
            Debes seleccionar al menos un sistema de evaluación.
          </div>
        ) : null}
      </div>

      <div
        className={`mb-6 rounded-xl border-2 p-4 sm:p-5 ${
          convocatoriaOk
            ? 'border-emerald-200 bg-emerald-50/60'
            : 'border-amber-300 bg-amber-50'
        }`}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h4 className="text-lg font-bold text-blue-900">
            Convocatoria extraordinaria <span className="text-red-500">*</span>
          </h4>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              convocatoriaOk
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            Obligatoria
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-700">
          Este apartado debe estar cumplimentado para poder avanzar al paso
          siguiente. Indica aquí las instrucciones de evaluación para la
          convocatoria extraordinaria.
        </p>
        <ReactQuill
          theme="snow"
          value={convocatoriaExtra}
          onChange={(desc: string) => onChangeConvocatoria(desc)}
          className="bg-white"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            Incluye criterios, pruebas y condiciones específicas.
          </p>
          <span
            className={`text-xs font-semibold ${
              convocatoriaOk ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {convocatoriaOk ? 'Completada' : 'Pendiente'}
          </span>
        </div>
        {touched && !convocatoriaOk ? (
          <div className="mt-2 text-sm font-medium text-red-600">
            Campo obligatorio: completa la convocatoria extraordinaria.
          </div>
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
      <div className="flex flex-wrap justify-end gap-3">
        {onGuardarYSeguir ? (
          <button
            type="button"
            className={`rounded-md border border-blue-300 bg-white px-6 py-2 font-semibold text-blue-700 hover:bg-blue-50 ${
              puedeAvanzar
                ? ''
                : 'cursor-not-allowed border-gray-300 text-gray-400 hover:bg-white'
            }`}
            onClick={handleGuardarYSeguir}
            disabled={!puedeAvanzar}
          >
            Guardar y seguir desde aquí
          </button>
        ) : null}
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
