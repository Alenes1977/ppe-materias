import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faArrowLeft,
  faArrowRight,
  faRotateLeft,
  faHouse,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';

import StepMeta from './StepMeta';
import StepLearningOutcomes from './StepLearningOutcomes';
import StepCatalog from './StepCatalog';
import StepModules from './StepModules';
import StepPreview from './StepPreview';

import type {
  MetaFormState,
  LOEntry,
  CatalogItem,
  ModuleFormState,
} from './builderTypes';

// ── Estado inicial ────────────────────────────────────────────────────────────

const defaultMeta: MetaFormState = {
  id: '',
  name: '',
  shortName: '',
  university: 'Universidad de Navarra',
  ructCode: '',
  anecaVerified: true,
  verificationYear: '',
  lastUpdated: '',
  primaryColor: '#1e3a8a',
  logoSrc: 'FaviconUnav_rojo.svg',
  loSingular: 'resultado de aprendizaje',
  loPlural: 'resultados de aprendizaje',
  loAcronym: 'RA',
};

// ── Definición de pasos ───────────────────────────────────────────────────────

const STEPS = [
  { key: 'meta', label: 'Metadatos' },
  { key: 'los', label: 'Resultados' },
  { key: 'af', label: 'Act. formativas' },
  { key: 'md', label: 'Metodologías' },
  { key: 'se', label: 'Evaluación' },
  { key: 'modules', label: 'Módulos' },
  { key: 'preview', label: 'Descargar' },
] as const;

// ── Componente principal ──────────────────────────────────────────────────────

const PlanBuilder: React.FC = () => {
  const [step, setStep] = useState(0);
  const [meta, setMeta] = useState<MetaFormState>(defaultMeta);
  const [learningOutcomes, setLearningOutcomes] = useState<LOEntry[]>([]);
  const [trainingActivities, setTrainingActivities] = useState<CatalogItem[]>(
    [],
  );
  const [noTeachingMethodologies, setNoTeachingMethodologies] = useState(false);
  const [teachingMethodologies, setTeachingMethodologies] = useState<
    CatalogItem[]
  >([]);
  const [evaluationSystems, setEvaluationSystems] = useState<CatalogItem[]>([]);
  const [modules, setModules] = useState<ModuleFormState[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isLast = step === STEPS.length - 1;

  const handleReset = () => {
    setStep(0);
    setMeta(defaultMeta);
    setLearningOutcomes([]);
    setTrainingActivities([]);
    setNoTeachingMethodologies(false);
    setTeachingMethodologies([]);
    setEvaluationSystems([]);
    setModules([]);
    setShowResetConfirm(false);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepMeta meta={meta} onChange={setMeta} />;
      case 1:
        return (
          <StepLearningOutcomes
            items={learningOutcomes}
            acronym={meta.loAcronym}
            loSingular={meta.loSingular}
            onChange={setLearningOutcomes}
          />
        );
      case 2:
        return (
          <StepCatalog
            title="Actividades formativas"
            description="Define las actividades formativas del grado (AF). Serán seleccionables al asignar a cada materia."
            idPrefix="AF"
            items={trainingActivities}
            onChange={setTrainingActivities}
          />
        );
      case 3:
        return (
          <StepCatalog
            title="Metodologías docentes"
            description="Define las metodologías docentes del plan (MD). Si el plan no las define formalmente, activa el interruptor."
            idPrefix="MD"
            items={teachingMethodologies}
            onChange={setTeachingMethodologies}
            optional
            noItemsToggle
            noItems={noTeachingMethodologies}
            onToggleNoItems={setNoTeachingMethodologies}
          />
        );
      case 4:
        return (
          <StepCatalog
            title="Sistemas de evaluación"
            description="Define los sistemas de evaluación del plan (SE). Serán seleccionables al definir la evaluación de cada materia y asignatura."
            idPrefix="SE"
            items={evaluationSystems}
            onChange={setEvaluationSystems}
          />
        );
      case 5:
        return (
          <StepModules
            modules={modules}
            onChange={setModules}
            trainingActivities={trainingActivities}
            evaluationSystems={evaluationSystems}
            learningOutcomes={learningOutcomes}
          />
        );
      case 6:
        return (
          <StepPreview
            meta={meta}
            learningOutcomes={learningOutcomes}
            trainingActivities={trainingActivities}
            noTeachingMethodologies={noTeachingMethodologies}
            teachingMethodologies={teachingMethodologies}
            evaluationSystems={evaluationSystems}
            modules={modules}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-14">
      {/* Cabecera */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 md:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faHouse} />
            <span className="hidden sm:inline">Inicio</span>
          </Link>
          <div className="h-5 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faWrench} className="text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">
              Constructor de planes de estudio
            </span>
          </div>
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <FontAwesomeIcon icon={faRotateLeft} />
              Empezar de nuevo
            </button>
          </div>
        </div>
      </header>

      {/* Modal confirmación reset */}
      {showResetConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold text-gray-800">
              ¿Empezar de nuevo?
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Se perderán todos los datos introducidos hasta ahora. Esta acción
              no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Sí, empezar de nuevo
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        {/* Stepper */}
        <nav className="mb-8 overflow-x-auto pb-2">
          <ol className="flex min-w-max items-center gap-1">
            {STEPS.map((s, idx) => {
              const isCompleted = idx < step;
              const isCurrent = idx === step;
              const isDisabled = idx > step;
              return (
                <li key={s.key} className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && setStep(idx)}
                    className={[
                      'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                      isCurrent
                        ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                        : isCompleted
                          ? 'cursor-pointer border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
                          : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold',
                        isCurrent
                          ? 'bg-white text-blue-600'
                          : isCompleted
                            ? 'bg-blue-200 text-blue-700'
                            : 'bg-gray-200 text-gray-400',
                      ].join(' ')}
                    >
                      {isCompleted ? (
                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-px w-4 ${
                        idx < step ? 'bg-blue-300' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Panel del paso actual */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-500">
              Paso {step + 1} de {STEPS.length}
            </div>
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              {STEPS[step].label === 'Act. formativas'
                ? 'Actividades formativas'
                : STEPS[step].label === 'Resultados'
                  ? `Resultados de aprendizaje / ${
                      meta.loPlural || 'competencias'
                    }`
                  : STEPS[step].label}
            </h1>
          </div>

          {renderStep()}
        </div>

        {/* Navegación */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Anterior
          </button>

          <span className="text-sm text-gray-400">
            {step + 1} / {STEPS.length}
          </span>

          {!isLast ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Siguiente
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-5 py-2.5 text-sm font-medium text-green-700">
              <FontAwesomeIcon icon={faCheck} />
              Descarga lista
            </span>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlanBuilder;
