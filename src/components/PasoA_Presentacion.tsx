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
  idioma: string[];
  aula: string;
  horario: string[];
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
  const [nuevoIdioma, setNuevoIdioma] = useState('');
  const [nuevoHorario, setNuevoHorario] = useState('');
  const [touched, setTouched] = useState(false);

  const camposObligatoriosCompletos =
    value.profesores.length > 0 &&
    value.idioma.length > 0 &&
    value.resumen.trim() !== '' &&
    value.resumen.replace(/<(.|\n)*?>/g, '').trim() !== '';

  const emailValido = /^\S+@\S+\.\S+$/.test(nuevoProfesor.email);
  const idiomaDuplicado = value.idioma.some(
    (idioma) => idioma.toLowerCase() === nuevoIdioma.trim().toLowerCase(),
  );
  const idiomaValido = nuevoIdioma.trim() !== '' && !idiomaDuplicado;
  const horarioDuplicado = value.horario.some(
    (horario) => horario.toLowerCase() === nuevoHorario.trim().toLowerCase(),
  );
  const horarioValido = nuevoHorario.trim() !== '' && !horarioDuplicado;

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

  const handleAddIdioma = () => {
    if (idiomaValido) {
      onChange({
        ...value,
        idioma: [...value.idioma, nuevoIdioma.trim()],
      });
      setNuevoIdioma('');
    }
  };

  const handleRemoveIdioma = (index: number) => {
    onChange({
      ...value,
      idioma: value.idioma.filter((_, i) => i !== index),
    });
  };

  const handleAddHorario = () => {
    if (horarioValido) {
      onChange({
        ...value,
        horario: [...value.horario, nuevoHorario.trim()],
      });
      setNuevoHorario('');
    }
  };

  const handleRemoveHorario = (index: number) => {
    onChange({
      ...value,
      horario: value.horario.filter((_, i) => i !== index),
    });
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
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="mb-6 text-xl font-bold text-blue-900">A. Presentación</h3>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
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
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Ej: 2026-2027"
              value={value.anioAcademico}
              onChange={(e) =>
                onChange({ ...value, anioAcademico: e.target.value })
              }
            />
          </div>

          <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-blue-900">
                Profesores encargados <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-blue-700">Añade uno o varios</span>
            </div>
            <div className="mb-2 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Nombre del profesor"
                value={nuevoProfesor.nombre}
                onChange={(e) =>
                  setNuevoProfesor({ ...nuevoProfesor, nombre: e.target.value })
                }
              />
              <input
                type="email"
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
                {value.profesores.length === 0
                  ? 'Añadir profesor'
                  : 'Añadir otro profesor'}
              </button>
            </div>
            {nuevoProfesor.email && !emailValido ? (
              <div className="mt-1 text-xs text-red-500">
                Introduce un email válido.
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {value.profesores.map((prof, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-blue-900"
                >
                  <span className="font-semibold">{prof.nombre}</span>
                  <span className="text-blue-700">({prof.email})</span>
                  <button
                    type="button"
                    className="ml-1 text-xs text-red-500 hover:underline"
                    onClick={() => handleRemoveProfesor(idx)}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
            {touched && value.profesores.length === 0 ? (
              <div className="mt-2 text-xs text-red-500">
                Debes añadir al menos un profesor.
              </div>
            ) : null}
          </div>

          <div className="mb-3 rounded-lg border border-indigo-100 bg-indigo-50/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-indigo-900">
                Idiomas <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-indigo-700">Uno o varios</span>
            </div>
            <div className="mb-2 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                placeholder="Ejemplo: Español, Inglés..."
                value={nuevoIdioma}
                onChange={(e) => setNuevoIdioma(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIdioma();
                  }
                }}
              />
              <button
                type="button"
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 sm:w-auto"
                onClick={handleAddIdioma}
                disabled={!idiomaValido}
              >
                {value.idioma.length === 0 ? 'Añadir idioma' : 'Añadir otro'}
              </button>
            </div>
            {!idiomaValido && nuevoIdioma.trim() !== '' ? (
              <div className="mt-1 text-xs text-red-500">
                Ese idioma ya está añadido.
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {value.idioma.map((idioma, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs text-indigo-900"
                >
                  <span className="font-semibold">{idioma}</span>
                  <button
                    type="button"
                    className="ml-1 text-xs text-red-500 hover:underline"
                    onClick={() => handleRemoveIdioma(idx)}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
            {touched && value.idioma.length === 0 ? (
              <div className="mt-2 text-xs text-red-500">
                Debes añadir al menos un idioma.
              </div>
            ) : null}
          </div>

          <div className="mb-3">
            <label className="mb-1 block font-medium text-gray-700">Aula</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Ejemplo: Aula M04 Edificio Amigos"
              value={value.aula}
              onChange={(e) => onChange({ ...value, aula: e.target.value })}
            />
          </div>

          <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-blue-900">
                Horario de clase
              </label>
              <span className="text-xs text-blue-700">Varias entradas</span>
            </div>
            <div className="mb-2 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Ejemplo: Lunes y miércoles, 10:00-12:00"
                value={nuevoHorario}
                onChange={(e) => setNuevoHorario(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHorario();
                  }
                }}
              />
              <button
                type="button"
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
                onClick={handleAddHorario}
                disabled={!horarioValido}
              >
                {value.horario.length === 0 ? 'Añadir horario' : 'Añadir otro'}
              </button>
            </div>
            {!horarioValido && nuevoHorario.trim() !== '' ? (
              <div className="mt-1 text-xs text-red-500">
                Ese horario ya está añadido.
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {value.horario.map((horario, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-blue-900"
                >
                  <span className="font-semibold">{horario}</span>
                  <button
                    type="button"
                    className="ml-1 text-xs text-red-500 hover:underline"
                    onClick={() => handleRemoveHorario(idx)}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
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
