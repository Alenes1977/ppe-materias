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
      <div className="mb-6 space-y-2">
        {actividadesPosibles.map((id) => {
          const info = actDict[id];
          const nombreCompleto = info?.nombre ?? id;
          const checked = !!value.find((a) => a.nombre === nombreCompleto);
          const actividad = value.find((a) => a.nombre === nombreCompleto);
          return (
            <div key={id} className="mb-2">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggle(id)}
                  className="mt-0.5 accent-blue-600"
                />
                <span className="font-medium text-blue-900">
                  {nombreCompleto}
                </span>
                {info?.descripcion ? (
                  <span
                    title={info.descripcion}
                    className="mt-0.5 flex-shrink-0 cursor-help text-blue-400 hover:text-blue-600"
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
              </label>
              {checked && actividad ? (
                <div className="mt-2 rounded border border-blue-100 bg-blue-50 p-4">
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
                  {touched &&
                  (actividad.descripcion.trim() === '' ||
                    actividad.descripcion.replace(/<(.|\n)*?>/g, '').trim() ===
                      '') ? (
                    <div className="mt-1 text-xs text-red-500">
                      Debes describir esta actividad.
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
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
