import type React from 'react';
import { useState } from 'react';
import type { Profesor } from './PasoA_Presentacion';

export interface HorarioAtencion {
  lugar: string;
  dia: string;
  hora: string;
}

interface Props {
  profesores: Profesor[];
  value: Record<string, HorarioAtencion[]>; // key: email del profesor
  onChange: (value: Record<string, HorarioAtencion[]>) => void;
  onNext: () => void;
  onGuardarYSeguir?: () => void;
  labelSiguiente?: string;
}

const PasoF_HorarioAtencion: React.FC<Props> = ({
  profesores,
  value,
  onChange,
  onNext,
  onGuardarYSeguir,
  labelSiguiente = 'Siguiente',
}) => {
  const [touched, setTouched] = useState(false);
  const [editando, setEditando] = useState<{
    email: string;
    idx: number | null;
  }>({ email: '', idx: null });
  const [nuevo, setNuevo] = useState<{
    email: string;
    lugar: string;
    dia: string;
    hora: string;
  }>({ email: '', lugar: '', dia: '', hora: '' });

  // Validación: todos los profesores deben tener al menos una franja y todos los campos deben estar completos
  const valido =
    profesores.length > 0 &&
    profesores.every(
      (p) =>
        value[p.email] &&
        value[p.email].length > 0 &&
        value[p.email].every((f) => f.lugar && f.dia && f.hora),
    );

  const handleAdd = (email: string) => {
    if (nuevo.lugar && nuevo.dia && nuevo.hora) {
      onChange({
        ...value,
        [email]: [
          ...(value[email] || []),
          { lugar: nuevo.lugar, dia: nuevo.dia, hora: nuevo.hora },
        ],
      });
      setNuevo({ email: '', lugar: '', dia: '', hora: '' });
    } else {
      setTouched(true);
    }
  };

  const handleRemove = (email: string, idx: number) => {
    onChange({
      ...value,
      [email]: value[email].filter((_, i) => i !== idx),
    });
  };

  const handleEdit = (email: string, idx: number) => {
    setEditando({ email, idx });
    setNuevo({ email, ...value[email][idx] });
  };

  const handleSaveEdit = (email: string, idx: number) => {
    if (nuevo.lugar && nuevo.dia && nuevo.hora) {
      onChange({
        ...value,
        [email]: value[email].map((f, i) =>
          i === idx
            ? { lugar: nuevo.lugar, dia: nuevo.dia, hora: nuevo.hora }
            : f,
        ),
      });
      setEditando({ email: '', idx: null });
      setNuevo({ email: '', lugar: '', dia: '', hora: '' });
    } else {
      setTouched(true);
    }
  };

  const handleNext = () => {
    setTouched(true);
    if (valido) {
      onNext();
    }
  };

  const handleGuardarYSeguir = () => {
    setTouched(true);
    if (valido && onGuardarYSeguir) {
      onGuardarYSeguir();
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-bold text-blue-900">
        Horario de atención
      </h3>
      <p className="mb-6 text-gray-600">
        Indique el lugar, día y hora de asesoría para cada profesor. Puede
        añadir varias franjas por profesor.
      </p>
      {profesores.map((prof) => (
        <div key={prof.email} className="mb-8">
          <div className="mb-2 font-semibold text-blue-700">
            {prof.nombre} ({prof.email})
          </div>
          <ul className="mb-2 space-y-2">
            {(value[prof.email] || []).map((franja, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 rounded bg-blue-50 px-3 py-2"
              >
                <span className="flex-1">
                  {franja.lugar} | {franja.dia} | {franja.hora}
                </span>
                <button
                  type="button"
                  className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-gray-300"
                  onClick={() => handleEdit(prof.email, idx)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                  onClick={() => handleRemove(prof.email, idx)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          {/* Añadir o editar franja */}
          {editando.email === prof.email && editando.idx !== null ? (
            <div className="mb-2 flex flex-col gap-2 rounded border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Lugar"
                  value={nuevo.lugar}
                  onChange={(e) =>
                    setNuevo({ ...nuevo, lugar: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Días de la semana"
                  value={nuevo.dia}
                  onChange={(e) => setNuevo({ ...nuevo, dia: e.target.value })}
                />
                <input
                  type="text"
                  className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Hora"
                  value={nuevo.hora}
                  onChange={(e) => setNuevo({ ...nuevo, hora: e.target.value })}
                />
              </div>
              {touched && (!nuevo.lugar || !nuevo.dia || !nuevo.hora) ? (
                <div className="text-xs text-red-500">
                  Todos los campos son obligatorios.
                </div>
              ) : null}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="rounded bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700"
                  onClick={() => handleSaveEdit(prof.email, editando.idx!)}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="rounded bg-gray-200 px-4 py-1 text-sm font-medium text-blue-700 hover:bg-gray-300"
                  onClick={() => {
                    setEditando({ email: '', idx: null });
                    setNuevo({ email: '', lugar: '', dia: '', hora: '' });
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Lugar"
                value={nuevo.email === prof.email ? nuevo.lugar : ''}
                onChange={(e) =>
                  setNuevo({
                    ...nuevo,
                    email: prof.email,
                    lugar: e.target.value,
                  })
                }
              />
              <input
                type="text"
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Día"
                value={nuevo.email === prof.email ? nuevo.dia : ''}
                onChange={(e) =>
                  setNuevo({ ...nuevo, email: prof.email, dia: e.target.value })
                }
              />
              <input
                type="text"
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Hora"
                value={nuevo.email === prof.email ? nuevo.hora : ''}
                onChange={(e) =>
                  setNuevo({
                    ...nuevo,
                    email: prof.email,
                    hora: e.target.value,
                  })
                }
              />
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={() => {
                  setNuevo({ ...nuevo, email: prof.email });
                  handleAdd(prof.email);
                }}
                disabled={
                  !(
                    nuevo.email === prof.email &&
                    nuevo.lugar &&
                    nuevo.dia &&
                    nuevo.hora
                  )
                }
              >
                Confirmar
              </button>
            </div>
          )}
        </div>
      ))}
      <div className="flex flex-wrap justify-end gap-3">
        {onGuardarYSeguir ? (
          <button
            type="button"
            className={`rounded-md border border-blue-300 bg-white px-6 py-2 font-semibold text-blue-700 hover:bg-blue-50 ${
              valido
                ? ''
                : 'cursor-not-allowed border-gray-300 text-gray-400 hover:bg-white'
            }`}
            onClick={handleGuardarYSeguir}
            disabled={!valido}
          >
            Guardar y seguir desde aquí
          </button>
        ) : null}
        <button
          type="button"
          className={`rounded-md px-6 py-2 font-semibold text-white ${
            valido
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300'
          }`}
          onClick={handleNext}
          disabled={!valido}
        >
          {labelSiguiente}
        </button>
      </div>
    </div>
  );
};

export default PasoF_HorarioAtencion;
