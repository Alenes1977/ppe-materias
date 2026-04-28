import type React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faInfoCircle,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import type { LOEntry } from './builderTypes';

const uid = () => Math.random().toString(36).slice(2, 9);

interface Props {
  items: LOEntry[];
  acronym: string;
  loSingular: string;
  onChange: (items: LOEntry[]) => void;
}

const StepLearningOutcomes: React.FC<Props> = ({
  items,
  acronym,
  loSingular,
  onChange,
}) => {
  const addItem = () => {
    const nextNum = items.length + 1;
    onChange([
      ...items,
      { _key: uid(), id: `${acronym || 'RA'}${nextNum}`, text: '' },
    ]);
  };

  const updateItem = (key: string, field: 'id' | 'text', value: string) =>
    onChange(
      items.map((item) =>
        item._key === key ? { ...item, [field]: value } : item,
      ),
    );

  const removeItem = (key: string) =>
    onChange(items.filter((item) => item._key !== key));

  const label = loSingular || 'resultado de aprendizaje';
  const labelPlural =
    items.length === 1
      ? label
      : `${label
          .replace(/^(resultado)/, 'resultados')
          .replace(/^(competencia)$/, 'competencias')}`;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5 shrink-0" />
        <span>
          Define los {label}s / competencias del grado. Cada uno tiene un
          identificador único (ej.{' '}
          <code className="rounded bg-blue-100 px-1 font-mono">
            {acronym || 'RA'}1
          </code>
          ) y un texto descriptivo.
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {items.length === 0 ? (
            <span className="italic text-gray-400">
              Sin {labelPlural} definidos todavía.
            </span>
          ) : (
            <span>
              <strong className="text-blue-700">{items.length}</strong>{' '}
              {labelPlural} definido{items.length !== 1 ? 's' : ''}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faPlus} />
          Añadir {acronym || 'RA'}
        </button>
      </div>

      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item._key}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {idx + 1}
              </div>
              <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                <div className="w-full shrink-0 sm:w-28">
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    ID
                  </label>
                  <input
                    type="text"
                    value={item.id}
                    onChange={(e) =>
                      updateItem(item._key, 'id', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-2 py-1.5 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={`${acronym || 'RA'}1`}
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Descripción
                  </label>
                  <textarea
                    value={item.text}
                    onChange={(e) =>
                      updateItem(item._key, 'text', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    placeholder={`Descripción del ${label}…`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item._key)}
                className="mt-1 rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                title="Eliminar"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
          <FontAwesomeIcon
            icon={faGraduationCap}
            className="text-3xl text-gray-300"
          />
          <p className="text-sm text-gray-400">
            Pulsa &ldquo;Añadir {acronym || 'RA'}&rdquo; para comenzar a definir
            los {labelPlural}
          </p>
        </div>
      )}
    </div>
  );
};

export default StepLearningOutcomes;
