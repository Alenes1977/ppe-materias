import type React from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onGuardarYSeguir?: () => void;
  labelSiguiente?: string;
}

const PasoG_Bibliografia: React.FC<Props> = ({
  value,
  onChange,
  onNext,
  onGuardarYSeguir,
  labelSiguiente = 'Finalizar',
}) => {
  const [touched, setTouched] = useState(false);
  const valido =
    value.trim() !== '' && value.replace(/<(.|\n)*?>/g, '').trim() !== '';

  const handleNext = () => {
    setTouched(true);
    if (valido) onNext();
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
        Bibliografía y recursos
      </h3>
      <p className="mb-6 text-gray-600">
        Indique la bibliografía y los recursos recomendados para la asignatura.
      </p>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        className="mb-2 bg-white"
      />
      {touched && !valido ? (
        <div className="mb-2 text-xs text-red-500">
          Este campo es obligatorio.
        </div>
      ) : null}
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

export default PasoG_Bibliografia;
