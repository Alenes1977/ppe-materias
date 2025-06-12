import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AsignaturaProcesada } from '../lib/dataUtils';

export interface Profesor {
  nombre: string;
  email: string;
}

export interface PresentacionData {
  profesores: Profesor[];
  idioma: string;
  aula: string;
  horario: string;
  resumen: string;
}

interface Props {
  value: PresentacionData;
  onChange: (value: PresentacionData) => void;
  onNext: () => void;
  asignatura: AsignaturaProcesada;
}

const TITULACION = 'Grado en Filosofía, Política y Economía (PPE)';

const PasoA_Presentacion: React.FC<Props> = ({
  value,
  onChange,
  onNext,
  asignatura,
}) => {
  const [nuevoProfesor, setNuevoProfesor] = useState<Profesor>({
    nombre: '',
    email: '',
  });
  const [touched, setTouched] = useState(false);

  // Estados de edición para idioma, aula y horario
  const [editandoIdioma, setEditandoIdioma] = useState(value.idioma === '');
  const [idiomaTemp, setIdiomaTemp] = useState(value.idioma);
  const [editandoAula, setEditandoAula] = useState(value.aula === '');
  const [aulaTemp, setAulaTemp] = useState(value.aula);
  const [editandoHorario, setEditandoHorario] = useState(value.horario === '');
  const [horarioTemp, setHorarioTemp] = useState(value.horario);

  // Validación de campos obligatorios
  const camposObligatoriosCompletos =
    value.profesores.length > 0 &&
    value.idioma.trim() !== '' &&
    value.resumen.trim() !== '' &&
    value.resumen.replace(/<(.|\n)*?>/g, '').trim() !== '';

  const handleAddProfesor = () => {
    if (nuevoProfesor.nombre.trim() && nuevoProfesor.email.trim()) {
      onChange({
        ...value,
        profesores: [...value.profesores, { ...nuevoProfesor }],
      });
      setNuevoProfesor({ nombre: '', email: '' });
    }
  };

  const handleRemoveProfesor = (index: number) => {
    const nuevos = value.profesores.filter((_, i) => i !== index);
    onChange({ ...value, profesores: nuevos });
  };

  // Confirmar idioma
  const handleConfirmIdioma = () => {
    if (idiomaTemp.trim() !== '') {
      onChange({ ...value, idioma: idiomaTemp });
      setEditandoIdioma(false);
    }
  };
  // Confirmar aula
  const handleConfirmAula = () => {
    onChange({ ...value, aula: aulaTemp });
    setEditandoAula(false);
  };
  // Confirmar horario
  const handleConfirmHorario = () => {
    onChange({ ...value, horario: horarioTemp });
    setEditandoHorario(false);
  };

  const handleNext = () => {
    setTouched(true);
    if (camposObligatoriosCompletos) {
      onNext();
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-bold text-blue-900">A. Presentación</h3>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3">
            <span className="block text-xs font-semibold text-gray-500">
              Nombre de la Asignatura
            </span>
            <div className="rounded bg-gray-100 px-3 py-2 text-gray-700">
              {asignatura.nombre}
            </div>
          </div>
          <div className="mb-3">
            <span className="block text-xs font-semibold text-gray-500">
              Titulación
            </span>
            <div className="rounded bg-gray-100 px-3 py-2 text-gray-700">
              {TITULACION}
            </div>
          </div>
          <div className="mb-3">
            <span className="block text-xs font-semibold text-gray-500">
              Módulo / Materia
            </span>
            <div className="rounded bg-gray-100 px-3 py-2 text-gray-700">
              {asignatura.modulo} / {asignatura.materia}
            </div>
          </div>
          <div className="mb-3">
            <span className="block text-xs font-semibold text-gray-500">
              ECTS
            </span>
            <div className="rounded bg-gray-100 px-3 py-2 text-gray-700">
              {asignatura.ects}
            </div>
          </div>
          <div className="mb-3">
            <span className="block text-xs font-semibold text-gray-500">
              Curso / Semestre
            </span>
            <div className="rounded bg-gray-100 px-3 py-2 text-gray-700">
              {asignatura.curso} / {asignatura.semestre}
            </div>
          </div>
        </div>
        <div>
          <div className="mb-3">
            <label className="mb-1 block font-medium text-gray-700">
              Profesores encargados <span className="text-red-500">*</span>
            </label>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Nombre del profesor"
                value={nuevoProfesor.nombre}
                onChange={(e) =>
                  setNuevoProfesor({ ...nuevoProfesor, nombre: e.target.value })
                }
              />
              <input
                type="email"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Email"
                value={nuevoProfesor.email}
                onChange={(e) =>
                  setNuevoProfesor({ ...nuevoProfesor, email: e.target.value })
                }
              />
              <button
                type="button"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={handleAddProfesor}
                disabled={
                  !nuevoProfesor.nombre.trim() || !nuevoProfesor.email.trim()
                }
              >
                Añadir
              </button>
            </div>
            <ul className="space-y-1">
              {value.profesores.map((prof, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between rounded bg-blue-50 px-3 py-1 text-blue-900"
                >
                  <span>
                    {prof.nombre} ({prof.email})
                  </span>
                  <button
                    type="button"
                    className="ml-2 text-xs text-red-500 hover:underline"
                    onClick={() => handleRemoveProfesor(idx)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
            {touched && value.profesores.length === 0 && (
              <div className="mt-1 text-xs text-red-500">
                Debes añadir al menos un profesor.
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="mb-1 block font-medium text-gray-700">
              Idioma <span className="text-red-500">*</span>
            </label>
            {editandoIdioma ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Ejemplo: Español, Inglés..."
                  value={idiomaTemp}
                  onChange={(e) => setIdiomaTemp(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmIdioma();
                    }
                  }}
                />
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  onClick={handleConfirmIdioma}
                  disabled={idiomaTemp.trim() === ''}
                >
                  Añadir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded bg-blue-50 px-3 py-2 text-blue-900">
                  {value.idioma}
                </div>
                <button
                  type="button"
                  className="rounded-md bg-gray-200 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  onClick={() => {
                    setEditandoIdioma(true);
                    setIdiomaTemp(value.idioma);
                  }}
                >
                  Editar
                </button>
              </div>
            )}
            {touched && value.idioma.trim() === '' && (
              <div className="mt-1 text-xs text-red-500">
                Campo obligatorio.
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="mb-1 block font-medium text-gray-700">Aula</label>
            {editandoAula ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Ejemplo: Aula 101"
                  value={aulaTemp}
                  onChange={(e) => setAulaTemp(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmAula();
                    }
                  }}
                />
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  onClick={handleConfirmAula}
                >
                  Añadir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded bg-blue-50 px-3 py-2 text-blue-900">
                  {value.aula || (
                    <span className="text-gray-400">Sin especificar</span>
                  )}
                </div>
                <button
                  type="button"
                  className="rounded-md bg-gray-200 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  onClick={() => {
                    setEditandoAula(true);
                    setAulaTemp(value.aula);
                  }}
                >
                  Editar
                </button>
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="mb-1 block font-medium text-gray-700">
              Horario
            </label>
            {editandoHorario ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Ejemplo: Lunes y miércoles, 10:00-12:00"
                  value={horarioTemp}
                  onChange={(e) => setHorarioTemp(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmHorario();
                    }
                  }}
                />
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  onClick={handleConfirmHorario}
                >
                  Añadir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded bg-blue-50 px-3 py-2 text-blue-900">
                  {value.horario || (
                    <span className="text-gray-400">Sin especificar</span>
                  )}
                </div>
                <button
                  type="button"
                  className="rounded-md bg-gray-200 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  onClick={() => {
                    setEditandoHorario(true);
                    setHorarioTemp(value.horario);
                  }}
                >
                  Editar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-6">
        <label className="mb-1 block font-medium text-gray-700">
          Breve resumen <span className="text-red-500">*</span>
        </label>
        <ReactQuill
          theme="snow"
          value={value.resumen}
          onChange={(resumen) => onChange({ ...value, resumen })}
          className="bg-white"
        />
        {touched &&
          (value.resumen.trim() === '' ||
            value.resumen.replace(/<(.|\n)*?>/g, '').trim() === '') && (
            <div className="mt-1 text-xs text-red-500">Campo obligatorio.</div>
          )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className={`rounded-md px-6 py-2 font-semibold text-white ${
            camposObligatoriosCompletos
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300'
          }`}
          onClick={handleNext}
          disabled={!camposObligatoriosCompletos}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PasoA_Presentacion;
