import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const PasoG_Bibliografia: React.FC<Props> = ({ value, onChange, onNext }) => {
  const [touched, setTouched] = useState(false);
  const valido =
    value.trim() !== '' && value.replace(/<(.|\n)*?>/g, '').trim() !== '';

  const handleNext = () => {
    setTouched(true);
    if (valido) onNext();
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
      {touched && !valido && (
        <div className="mb-2 text-xs text-red-500">
          Este campo es obligatorio.
        </div>
      )}
      <div className="flex justify-end">
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
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default PasoG_Bibliografia;
