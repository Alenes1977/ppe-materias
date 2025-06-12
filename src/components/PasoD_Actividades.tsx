import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface ActividadSeleccionada {
  nombre: string;
  descripcion: string;
}

interface Props {
  actividadesPosibles: string[];
  value: ActividadSeleccionada[];
  onChange: (value: ActividadSeleccionada[]) => void;
  onNext: () => void;
  nombreAsignatura: string;
}

const PasoD_Actividades: React.FC<Props> = ({
  actividadesPosibles,
  value,
  onChange,
  onNext,
  nombreAsignatura,
}) => {
  // Para saber si el usuario ha intentado avanzar sin completar
  const [touched, setTouched] = useState(false);

  // Devuelve true si todas las seleccionadas tienen descripción
  const validas =
    value.length > 0 &&
    value.every(
      (a) =>
        a.descripcion.trim() &&
        a.descripcion.replace(/<(.|\n)*?>/g, '').trim() !== '',
    );

  // Maneja el check/uncheck de una actividad
  const handleToggle = (nombre: string) => {
    if (value.find((a) => a.nombre === nombre)) {
      onChange(value.filter((a) => a.nombre !== nombre));
    } else {
      onChange([...value, { nombre, descripcion: '' }]);
    }
  };

  // Cambia la descripción de una actividad
  const handleDescripcion = (nombre: string, descripcion: string) => {
    onChange(
      value.map((a) => (a.nombre === nombre ? { ...a, descripcion } : a)),
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
        describa cómo se desarrollará la actividad.
      </p>
      <div className="mb-6 space-y-2">
        {actividadesPosibles.map((nombre) => {
          const checked = !!value.find((a) => a.nombre === nombre);
          const actividad = value.find((a) => a.nombre === nombre);
          return (
            <div key={nombre} className="mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggle(nombre)}
                  className="accent-blue-600"
                />
                <span className="font-medium text-blue-900">{nombre}</span>
              </label>
              {checked && actividad && (
                <div className="mt-2 rounded border border-blue-100 bg-blue-50 p-4">
                  <div className="mb-2 font-semibold text-blue-700">
                    Describe esta actividad
                  </div>
                  <ReactQuill
                    theme="snow"
                    value={actividad.descripcion}
                    onChange={(desc: string) => handleDescripcion(nombre, desc)}
                    className="bg-white"
                  />
                  {touched &&
                    (actividad.descripcion.trim() === '' ||
                      actividad.descripcion
                        .replace(/<(.|\n)*?>/g, '')
                        .trim() === '') && (
                      <div className="mt-1 text-xs text-red-500">
                        Debes describir esta actividad.
                      </div>
                    )}
                </div>
              )}
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
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PasoD_Actividades;
