import type React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faChevronDown,
  faChevronRight,
  faInfoCircle,
  faListUl,
} from '@fortawesome/free-solid-svg-icons';
import type { CatalogItem } from './builderTypes';

const uid = () => Math.random().toString(36).slice(2, 9);

interface Props {
  title: string;
  description: string;
  idPrefix: string;
  items: CatalogItem[];
  onChange: (items: CatalogItem[]) => void;
  optional?: boolean;
  noItemsToggle?: boolean;
  noItems?: boolean;
  onToggleNoItems?: (v: boolean) => void;
}

const StepCatalog: React.FC<Props> = ({
  title,
  description,
  idPrefix,
  items,
  onChange,
  optional = false,
  noItemsToggle = false,
  noItems = false,
  onToggleNoItems,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const addItem = () => {
    const key = uid();
    const nextNum = items.length + 1;
    const newItem: CatalogItem = {
      _key: key,
      id: `${idPrefix}${nextNum}`,
      name: '',
      description: '',
    };
    onChange([...items, newItem]);
    setExpandedKeys((prev) => new Set(prev).add(key));
  };

  const updateItem = <K extends keyof Omit<CatalogItem, '_key'>>(
    key: string,
    field: K,
    value: CatalogItem[K],
  ) =>
    onChange(
      items.map((item) =>
        item._key === key ? { ...item, [field]: value } : item,
      ),
    );

  const removeItem = (key: string) => {
    onChange(items.filter((item) => item._key !== key));
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5 shrink-0" />
        <span>{description}</span>
      </div>

      {noItemsToggle ? (
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={noItems}
              onChange={(e) => onToggleNoItems?.(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
          </label>
          <span className="text-sm text-gray-700">
            Este plan no define {title.toLowerCase()} (se dejará vacío){' '}
          </span>
        </div>
      ) : null}

      {!noItems && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {items.length === 0 ? (
                <span className="italic text-gray-400">
                  Sin {title.toLowerCase()} definidas todavía.
                  {optional ? ' (campo opcional)' : null}
                </span>
              ) : (
                <span>
                  <strong className="text-blue-700">{items.length}</strong>{' '}
                  {title.toLowerCase()}{' '}
                  {items.length === 1 ? 'definida' : 'definidas'}
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faPlus} />
              Añadir
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
              <FontAwesomeIcon
                icon={faListUl}
                className="text-3xl text-gray-300"
              />
              <p className="text-sm text-gray-400">
                Pulsa &ldquo;Añadir&rdquo; para agregar {title.toLowerCase()}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const expanded = expandedKeys.has(item._key);
                return (
                  <div
                    key={item._key}
                    className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                  >
                    <div
                      className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50"
                      onClick={() => toggleExpand(item._key)}
                    >
                      <FontAwesomeIcon
                        icon={expanded ? faChevronDown : faChevronRight}
                        className="w-3 text-gray-400"
                      />
                      <code className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                        {item.id || '—'}
                      </code>
                      <span className="flex-1 truncate text-sm text-gray-700">
                        {item.name || (
                          <em className="text-gray-400">Sin nombre</em>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item._key);
                        }}
                        className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        title="Eliminar"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      </button>
                    </div>

                    {expanded ? (
                      <div className="grid gap-3 border-t border-gray-100 px-4 py-4 sm:grid-cols-4">
                        <div>
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
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="mb-1 block text-xs font-medium text-gray-500">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(item._key, 'name', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label className="mb-1 block text-xs font-medium text-gray-500">
                            Descripción
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              updateItem(
                                item._key,
                                'description',
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            rows={3}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StepCatalog;
