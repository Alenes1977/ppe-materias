import type React from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface UnidadPrograma {
  titulo: string;
  descripcion: string;
}

interface Props {
  value: UnidadPrograma[];
  onChange: (value: UnidadPrograma[]) => void;
  onNext: () => void;
  onGuardarYSeguir?: () => void;
  labelSiguiente?: string;
}

const PasoC_Programa: React.FC<Props> = ({
  value,
  onChange,
  onNext,
  onGuardarYSeguir,
  labelSiguiente = 'Siguiente',
}) => {
  const [editando, setEditando] = useState<number | null>(null);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [touched, setTouched] = useState(false);

  const unidadesValidas = value.filter((u) => u.titulo.trim() !== '');
  const puedeAvanzar = unidadesValidas.length > 0;

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...value];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === value.length - 1) return;
    const arr = [...value];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onChange(arr);
  };

  const handleAdd = () => {
    if (nuevoTitulo.trim() !== '') {
      onChange([
        ...value,
        { titulo: nuevoTitulo.trim(), descripcion: nuevaDescripcion },
      ]);
      setNuevoTitulo('');
      setNuevaDescripcion('');
      setTouched(false);
    } else {
      setTouched(true);
    }
  };

  const handleEdit = (idx: number) => {
    setEditando(idx);
    setNuevoTitulo(value[idx].titulo);
    setNuevaDescripcion(value[idx].descripcion);
  };

  const handleSaveEdit = (idx: number) => {
    if (nuevoTitulo.trim() !== '') {
      const nuevas = value.map((u, i) =>
        i === idx
          ? { titulo: nuevoTitulo.trim(), descripcion: nuevaDescripcion }
          : u,
      );
      onChange(nuevas);
      setEditando(null);
      setNuevoTitulo('');
      setNuevaDescripcion('');
      setTouched(false);
    } else {
      setTouched(true);
    }
  };

  const handleDelete = (idx: number) => {
    const nuevas = value.filter((_, i) => i !== idx);
    onChange(nuevas);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-bold text-blue-900">
        C. Programa de la asignatura
      </h3>
      <p className="mb-6 text-gray-600">
        Añade las unidades, temas o bloques que estructuran el programa de la
        asignatura.
      </p>
      <ul className="mb-8 space-y-4">
        {value.map((unidad, idx) => (
          <li
            key={idx}
            className="rounded border border-blue-100 bg-blue-50 px-4 py-3"
          >
            {editando === idx ? (
              <div>
                <input
                  type="text"
                  className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Título de la unidad o tema"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                />
                <ReactQuill
                  theme="snow"
                  value={
                    nuevaDescripcion === '<p><br></p>' ? '' : nuevaDescripcion
                  }
                  onChange={(desc: string) => setNuevaDescripcion(desc)}
                  className="mb-2 bg-white"
                  placeholder="[Opcionalmente, describa aquí brevemente la unidad o tema]"
                />
                {touched && nuevoTitulo.trim() === '' ? (
                  <div className="mb-2 text-xs text-red-500">
                    El título es obligatorio.
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={() => handleSaveEdit(idx)}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="rounded bg-gray-200 px-4 py-1 text-sm font-medium text-blue-700 hover:bg-gray-300"
                    onClick={() => setEditando(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-800">
                    {unidad.titulo}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      title="Subir"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === value.length - 1}
                      title="Bajar"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      className="rounded bg-gray-200 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-gray-300"
                      onClick={() => handleEdit(idx)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
                      onClick={() => handleDelete(idx)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                {unidad.descripcion ? (
                  <div
                    className="mt-2 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: unidad.descripcion }}
                  />
                ) : null}
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* Añadir nueva unidad */}
      {editando === null && (
        <div className="mb-8 rounded border border-blue-200 bg-blue-50 px-4 py-4">
          <h4 className="mb-2 font-semibold text-blue-700">
            Nueva unidad/tema
          </h4>
          <input
            type="text"
            className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Título de la unidad o tema"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
          />
          <ReactQuill
            theme="snow"
            value={nuevaDescripcion === '<p><br></p>' ? '' : nuevaDescripcion}
            onChange={(desc: string) => setNuevaDescripcion(desc)}
            className="mb-2 bg-white"
            placeholder="[Opcionalmente, describa aquí brevemente la unidad o tema]"
          />
          {touched && nuevoTitulo.trim() === '' ? (
            <div className="mb-2 text-xs text-red-500">
              El título es obligatorio.
            </div>
          ) : null}
          <button
            type="button"
            className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
            onClick={handleAdd}
          >
            Añadir unidad
          </button>
        </div>
      )}
      <div className="flex flex-wrap justify-end gap-3">
        {onGuardarYSeguir ? (
          <button
            type="button"
            className={`rounded-md border border-blue-300 bg-white px-6 py-2 font-semibold text-blue-700 hover:bg-blue-50 ${
              puedeAvanzar
                ? ''
                : 'cursor-not-allowed border-gray-300 text-gray-400 hover:bg-white'
            }`}
            onClick={onGuardarYSeguir}
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
          onClick={onNext}
          disabled={!puedeAvanzar}
        >
          {labelSiguiente ?? 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default PasoC_Programa;
