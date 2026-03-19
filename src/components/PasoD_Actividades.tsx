import type React from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ppeData from '../data/ppe.json';

export interface ActividadSeleccionada {
  nombre: string;
  descripcion: string;
}

interface ActividadFormativaInfo {
  id: string;
  nombre: string;
  descripcion: string;
}

// Diccionario id -> { nombre, descripcion }
const actDict: Record<string, ActividadFormativaInfo> = Object.fromEntries(
  (
    ppeData as {
      actividades_formativas: ActividadFormativaInfo[];
    }
  ).actividades_formativas.map((a) => [a.id, a]),
);

interface Props {
  actividadesPosibles: string[];
  value: ActividadSeleccionada[];
  onChange: (value: ActividadSeleccionada[]) => void;
  onNext: () => void;
  nombreAsignatura: string;
  labelSiguiente?: string;
}

const PasoD_Actividades: React.FC<Props> = ({
  actividadesPosibles,
  value,
  onChange,
  onNext,
  nombreAsignatura,
  labelSiguiente = 'Siguiente',
}) => {
  const [touched, setTouched] = useState(false);

  const validas = value.length > 0;
  const seleccionadas = value.map((actividad) => actividad.nombre);

  // Usa el nombre completo como clave interna (útil en PDF/HTML)
  const handleToggle = (id: string) => {
    const nombreCompleto = actDict[id]?.nombre ?? id;
    if (value.find((a) => a.nombre === nombreCompleto)) {
      onChange(value.filter((a) => a.nombre !== nombreCompleto));
    } else {
      onChange([...value, { nombre: nombreCompleto, descripcion: '' }]);
    }
  };

  const handleDescripcion = (nombreCompleto: string, descripcion: string) => {
    onChange(
      value.map((a) =>
        a.nombre === nombreCompleto ? { ...a, descripcion } : a,
      ),
    );
  };

  const handleNext = () => {
    setTouched(true);
    if (validas) onNext();
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-bold text-blue-900">
        D. Actividades formativas
      </h3>
      <p className="mb-6 text-gray-600">
        Las actividades formativas posibles asociadas a esta asignatura de{' '}
        <span className="font-semibold text-blue-800">{nombreAsignatura}</span>{' '}
        se relacionan a continuación. Señale las que utilizará en su curso y
        opcionalmente describa cómo se desarrollará la actividad.
      </p>
      <div className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/80 to-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-blue-900">
            Selecciona una o varias actividades para esta asignatura.
          </p>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            {value.length} seleccionada{value.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="space-y-3">
          {actividadesPosibles.map((id) => {
            const info = actDict[id];
            const nombreCompleto = info?.nombre ?? id;
            const checked = !!value.find((a) => a.nombre === nombreCompleto);
            const actividad = value.find((a) => a.nombre === nombreCompleto);

            return (
              <div
                key={id}
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
                    onChange={() => handleToggle(id)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 accent-blue-600"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold text-blue-900">
                        {nombreCompleto}
                      </span>
                      {checked ? (
                        <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                          Seleccionada
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

                {checked && actividad ? (
                  <div className="border-t border-blue-100 bg-white/80 p-4 sm:p-5">
                    <div className="mb-2 font-semibold text-blue-700">
                      Describa esta actividad (opcional)
                    </div>
                    <ReactQuill
                      theme="snow"
                      value={actividad.descripcion}
                      onChange={(desc: string) =>
                        handleDescripcion(nombreCompleto, desc)
                      }
                      className="bg-white"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Este campo es opcional y sirve para concretar cómo se
                      aplicará la actividad en tu asignatura.
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {touched && !validas ? (
          <div className="mt-3 text-sm font-medium text-red-600">
            Debes seleccionar al menos una actividad formativa para continuar.
          </div>
        ) : null}

        {seleccionadas.length > 0 ? (
          <div className="mt-4 rounded-lg border border-blue-100 bg-white p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
              Selección actual
            </p>
            <div className="flex flex-wrap gap-2">
              {seleccionadas.map((nombre) => (
                <span
                  key={nombre}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
                >
                  {nombre}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className={`rounded-md px-6 py-2 font-semibold text-white ${
            validas
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300'
          }`}
          onClick={handleNext}
          disabled={!validas}
        >
          {labelSiguiente}
        </button>
      </div>
    </div>
  );
};

export default PasoD_Actividades;
