import type React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import type { MetaFormState } from './builderTypes';

interface Props {
  meta: MetaFormState;
  onChange: (meta: MetaFormState) => void;
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

const StepMeta: React.FC<Props> = ({ meta, onChange }) => {
  const set = <K extends keyof MetaFormState>(
    field: K,
    value: MetaFormState[K],
  ) => onChange({ ...meta, [field]: value });

  return (
    <div className="space-y-8">
      <div className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5 shrink-0" />
        <span>
          Introduce los datos de identificación del grado. Estos datos generarán
          el archivo{' '}
          <code className="rounded bg-blue-100 px-1 font-mono">
            [id]-meta.json
          </code>
          .
        </span>
      </div>

      {/* Identificación */}
      <section>
        <h3 className="mb-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-800">
          Identificación del grado
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>
              Identificador único (id) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              value={meta.id}
              onChange={(e) => set('id', e.target.value)}
              placeholder="ej. filosofia, derecho-2024"
            />
            <p className="mt-1 text-xs text-gray-500">
              Se usará como nombre de archivo:{' '}
              <code className="font-mono">[id]-meta.json</code>,{' '}
              <code className="font-mono">[id]-plan.json</code>
            </p>
          </div>
          <div>
            <label className={labelCls}>
              Nombre corto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              value={meta.shortName}
              onChange={(e) => set('shortName', e.target.value)}
              placeholder="ej. Derecho, PPE"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>
              Nombre completo del grado <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              value={meta.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="ej. Grado en Derecho"
            />
          </div>
          <div>
            <label className={labelCls}>
              Universidad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              value={meta.university}
              onChange={(e) => set('university', e.target.value)}
              placeholder="Universidad de Navarra"
            />
          </div>
          <div>
            <label className={labelCls}>Código RUCT (opcional)</label>
            <input
              type="text"
              className={inputCls}
              value={meta.ructCode}
              onChange={(e) => set('ructCode', e.target.value)}
              placeholder="ej. 2503724"
            />
          </div>
        </div>
      </section>

      {/* Verificación */}
      <section>
        <h3 className="mb-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-800">
          Verificación
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 sm:col-span-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={meta.anecaVerified}
                onChange={(e) => set('anecaVerified', e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full" />
            </label>
            <span className="text-sm font-medium text-gray-700">
              Título verificado por la ANECA
            </span>
          </div>
          <div>
            <label className={labelCls}>Año de verificación</label>
            <input
              type="text"
              className={inputCls}
              value={meta.verificationYear}
              onChange={(e) => set('verificationYear', e.target.value)}
              placeholder="ej. 2018"
            />
          </div>
          <div>
            <label className={labelCls}>Última actualización</label>
            <input
              type="text"
              className={inputCls}
              value={meta.lastUpdated}
              onChange={(e) => set('lastUpdated', e.target.value)}
              placeholder="ej. 30 octubre 2025"
            />
          </div>
        </div>
      </section>

      {/* Apariencia */}
      <section>
        <h3 className="mb-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-800">
          Apariencia
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Color principal</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={meta.primaryColor}
                onChange={(e) => set('primaryColor', e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border border-gray-300 p-1"
              />
              <input
                type="text"
                className={`${inputCls} flex-1`}
                value={meta.primaryColor}
                onChange={(e) => set('primaryColor', e.target.value)}
                placeholder="#1e3a8a"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Nombre del archivo de logo</label>
            <input
              type="text"
              className={inputCls}
              value={meta.logoSrc}
              onChange={(e) => set('logoSrc', e.target.value)}
              placeholder="ej. logo-unav.svg"
            />
          </div>
        </div>
      </section>

      {/* Etiqueta de resultados */}
      <section>
        <h3 className="mb-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-800">
          Etiqueta de resultados / competencias
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          Define cómo se llaman los resultados de aprendizaje en este plan (ej.
          &ldquo;resultado de aprendizaje&rdquo; o &ldquo;competencia&rdquo;).
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>
              Singular <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              value={meta.loSingular}
              onChange={(e) => set('loSingular', e.target.value)}
              placeholder="resultado de aprendizaje"
            />
          </div>
          <div>
            <label className={labelCls}>
              Plural <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputCls}
              value={meta.loPlural}
              onChange={(e) => set('loPlural', e.target.value)}
              placeholder="resultados de aprendizaje"
            />
          </div>
          <div>
            <label className={labelCls}>
              Acrónimo (para los IDs) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`${inputCls} uppercase`}
              value={meta.loAcronym}
              onChange={(e) => set('loAcronym', e.target.value.toUpperCase())}
              placeholder="RA"
            />
            <p className="mt-1 text-xs text-gray-500">
              Se usará para auto-generar IDs: RA1, RA2…
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StepMeta;
