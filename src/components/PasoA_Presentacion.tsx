import type React from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { ProcessedSubject } from '../lib/dataUtils';
import { useDegree } from '../context/DegreeContext';

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
  anioAcademico: string;
}

interface Props {
  value: PresentacionData;
  onChange: (value: PresentacionData) => void;
  onNext: () => void;
  onGuardarYSeguir?: () => void;
  asignatura: ProcessedSubject;
  labelSiguiente?: string;
}

const PasoA_Presentacion: React.FC<Props> = ({
  value,
  onChange,
  onNext,
  onGuardarYSeguir,
  asignatura,
  labelSiguiente = 'Siguiente',
}) => {
  const { degreeInfo } = useDegree();
  const [nuevoProfesor, setNuevoProfesor] = useState<Profesor>({
    nombre: '',
    email: '',
  });
  const [touched, setTouched] = useState(false);
  const [editandoIdioma, setEditandoIdioma] = useState(value.idioma === '');
  const [idiomaTemp, setIdiomaTemp] = useState(value.idioma);

  const camposObligatoriosCompletos =
    value.profesores.length > 0 &&
    value.idioma.trim() !== '' &&
    value.resumen.trim() !== '' &&
    value.resumen.replace(/<(.|\n)*?>/g, '').trim() !== '';

  const emailValido = /^\S+@\S+\.\S+$/.test(nuevoProfesor.email);

  const semLabel = () => {
    if (asignatura.semestre === 'annual') return 'Anual';
    return asignatura.semestre === 1 ? '1er Semestre' : '2º Semestre';
  };

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
    onChange({
      ...value,
      profesores: value.profesores.filter((_, i) => i !== index),
    });
  };

  const handleConfirmIdioma = () => {
    if (idiomaTemp.trim() !== '') {
      onChange({ ...value, idioma: idiomaTemp });
      setEditandoIdioma(false);
    }
  };

  const handleNext = () => {
    setTouched(true);
    if (camposObligatoriosCompletos) onNext();
  };

  const handleGuardarYSeguir = () => {
    setTouched(true);
    if (camposObligatoriosCompletos && onGuardarYSeguir) onGuardarYSeguir();
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
              {degreeInfo.name}
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
              Curso
            </span>
            <div className="rounded bg-gray-100 px-3 py-2 text-gray-700">
              {asignatura.curso}º
            </div>
          </div>
          <div className="mb-3">
            <span className="block text-xs font-semibold text-gray-500">
              Semestre
            </span>
            <div className="rounded bg-gray-100 px-3 py-2 text-gray-700">
              {semLabel()}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3">
            <label className="mb-1 block font-medium text-gray-700">
              Año académico
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Ej: 2026-2027"
              value={value.anioAcademico}
              onChange={(e) =>
                onChange({ ...value, anioAcademico: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block font-medium text-gray-700">
              Profesores encargados <span className="text-red-500">*</span>
            </label>
            <div className="mb-2 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Nombre del profesor"
                value={nuevoProfesor.nombre}
                onChange={(e) =>
                  setNuevoProfesor({ ...nuevoProfesor, nombre: e.target.value })
                }
              />
              <input
                type="email"
                className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Email"
                value={nuevoProfesor.email}
                onChange={(e) =>
                  setNuevoProfesor({ ...nuevoProfesor, email: e.target.value })
                }
              />
              <button
                type="button"
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
                onClick={handleAddProfesor}
                disabled={
                  !nuevoProfesor.nombre.trim() ||
                  !nuevoProfesor.email.trim() ||
                  !emailValido
                }
              >
                {value.profesores.length === 0 ? 'Confirmar' : 'Añadir otro'}
              </button>
            </div>
            {nuevoProfesor.email && !emailValido ? (
              <div className="mt-1 text-xs text-red-500">
                Introduce un email válido.
              </div>
            ) : null}
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
            {touched && value.profesores.length === 0 ? (
              <div className="mt-1 text-xs text-red-500">
                Debes añadir al menos un profesor.
              </div>
            ) : null}
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
                  Confirmar
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
            {touched && value.idioma.trim() === '' ? (
              <div className="mt-1 text-xs text-red-500">
                Campo obligatorio.
              </div>
            ) : null}
          </div>

          <div className="mb-3">
            <label className="mb-1 block font-medium text-gray-700">Aula</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Ejemplo: Aula M04 Edificio Amigos"
              value={value.aula}
              onChange={(e) => onChange({ ...value, aula: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block font-medium text-gray-700">
              Horario de clase
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Ejemplo: Lunes y miércoles, 10:00-12:00"
              value={value.horario}
              onChange={(e) => onChange({ ...value, horario: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-1 block font-medium text-gray-700">
          Breve descripción <span className="text-red-500">*</span>
        </label>
        <ReactQuill
          theme="snow"
          value={value.resumen}
          onChange={(resumen) => onChange({ ...value, resumen })}
          className="bg-white text-base"
          placeholder="[describa aquí brevemente la asignatura]"
        />
        {touched &&
        (value.resumen.trim() === '' ||
          value.resumen.replace(/<(.|\n)*?>/g, '').trim() === '') ? (
          <div className="mt-1 text-xs text-red-500">Campo obligatorio.</div>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {onGuardarYSeguir ? (
          <button
            type="button"
            className={`rounded-md border border-blue-300 bg-white px-6 py-2 font-semibold text-blue-700 hover:bg-blue-50 ${
              !camposObligatoriosCompletos
                ? 'cursor-not-allowed border-gray-300 text-gray-400 hover:bg-white'
                : ''
            }`}
            onClick={handleGuardarYSeguir}
            disabled={!camposObligatoriosCompletos}
          >
            Guardar y seguir desde aquí
          </button>
        ) : null}
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
          {labelSiguiente}
        </button>
      </div>
    </div>
  );
};

export default PasoA_Presentacion;
