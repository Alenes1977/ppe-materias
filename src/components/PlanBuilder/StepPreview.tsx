import type React from 'react';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faChevronDown,
  faChevronRight,
  faCheckCircle,
  faLayerGroup,
  faBook,
  faGraduationCap,
  faStar,
  faEye,
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import type {
  MetaFormState,
  LOEntry,
  CatalogItem,
  ModuleFormState,
} from './builderTypes';
import type { DegreeInfo, DegreePlan } from '../../types/degree';
import PlanPreview from './PlanPreview';

interface Props {
  meta: MetaFormState;
  learningOutcomes: LOEntry[];
  trainingActivities: CatalogItem[];
  noTeachingMethodologies: boolean;
  teachingMethodologies: CatalogItem[];
  evaluationSystems: CatalogItem[];
  modules: ModuleFormState[];
}

const buildMeta = (meta: MetaFormState): DegreeInfo => ({
  id: meta.id || 'nuevo-grado',
  name: meta.name,
  shortName: meta.shortName,
  university: meta.university,
  ...(meta.ructCode ? { ructCode: meta.ructCode } : {}),
  anecaVerified: meta.anecaVerified,
  ...(meta.verificationYear ? { verificationYear: meta.verificationYear } : {}),
  ...(meta.lastUpdated ? { lastUpdated: meta.lastUpdated } : {}),
  primaryColor: meta.primaryColor,
  logoSrc: meta.logoSrc,
  learningOutcomeLabel: {
    singular: meta.loSingular,
    plural: meta.loPlural,
    acronym: meta.loAcronym,
  },
});

const buildPlan = (
  learningOutcomes: LOEntry[],
  trainingActivities: CatalogItem[],
  noTeachingMethodologies: boolean,
  teachingMethodologies: CatalogItem[],
  evaluationSystems: CatalogItem[],
  modules: ModuleFormState[],
): DegreePlan => ({
  schemaVersion: 1,
  learningOutcomes: Object.fromEntries(
    learningOutcomes.map((lo) => [lo.id, lo.text]),
  ),
  trainingActivities: trainingActivities.map(({ id, name, description }) => ({
    id,
    name,
    description,
  })),
  teachingMethodologies: noTeachingMethodologies
    ? []
    : teachingMethodologies.map(({ id, name, description }) => ({
        id,
        name,
        description,
      })),
  evaluationSystems: evaluationSystems.map(({ id, name, description }) => ({
    id,
    name,
    description,
  })),
  modules: modules.map((mod) => ({
    name: mod.name,
    ects: mod.ects,
    subjects: mod.subjects.map((subj) => ({
      name: subj.name,
      ects: subj.ects,
      trainingActivities: subj.trainingActivities,
      evaluation: subj.evaluation.map(({ system, minWeight, maxWeight }) => ({
        system,
        minWeight,
        maxWeight,
      })),
      learningOutcomes: subj.learningOutcomes,
      courses: subj.courses.map((course) => ({
        name: course.name,
        type: course.type,
        year: course.year,
        semester:
          course.semester === 'annual'
            ? ('annual' as const)
            : (Number(course.semester) as 1 | 2),
        ects: course.ects,
        ...(course.hasOwnEval && course.evaluation.length > 0
          ? {
              evaluation: course.evaluation.map(
                ({ system, minWeight, maxWeight }) => ({
                  system,
                  minWeight,
                  maxWeight,
                }),
              ),
            }
          : {}),
        ...(course.hasOwnLO && course.learningOutcomes.length > 0
          ? { learningOutcomes: course.learningOutcomes }
          : {}),
      })),
    })),
  })),
});

const StepPreview: React.FC<Props> = ({
  meta,
  learningOutcomes,
  trainingActivities,
  noTeachingMethodologies,
  teachingMethodologies,
  evaluationSystems,
  modules,
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'preview'>(
    'download',
  );
  const [showMeta, setShowMeta] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  const metaJSON = buildMeta(meta);
  const planJSON = buildPlan(
    learningOutcomes,
    trainingActivities,
    noTeachingMethodologies,
    teachingMethodologies,
    evaluationSystems,
    modules,
  );

  const metaStr = JSON.stringify(metaJSON, null, 2);
  const planStr = JSON.stringify(planJSON, null, 2);

  const id = meta.id || 'nuevo-grado';

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], {
      type: 'application/json;charset=utf-8',
    });
    saveAs(blob, filename);
  };

  // Stats
  const totalModules = modules.length;
  const totalSubjects = modules.reduce((s, m) => s + m.subjects.length, 0);
  const totalCourses = modules.reduce(
    (s, m) => m.subjects.reduce((s2, subj) => s2 + subj.courses.length, s),
    0,
  );
  const totalEcts = modules.reduce((s, m) => s + (m.ects || 0), 0);

  const stats = [
    {
      label: 'Módulos',
      value: totalModules,
      icon: faLayerGroup,
      color: 'blue',
    },
    { label: 'Materias', value: totalSubjects, icon: faBook, color: 'teal' },
    {
      label: 'Asignaturas',
      value: totalCourses,
      icon: faGraduationCap,
      color: 'indigo',
    },
    { label: 'ECTS totales', value: totalEcts, icon: faStar, color: 'amber' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Selector de pestañas */}
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('download')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'download'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FontAwesomeIcon icon={faCode} />
          Descargar JSON
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'preview'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FontAwesomeIcon icon={faEye} />
          Vista previa
        </button>
      </div>

      {/* ── Pestaña: Vista previa ── */}
      {activeTab === 'preview' ? (
        <PlanPreview
          meta={meta}
          learningOutcomes={learningOutcomes}
          trainingActivities={trainingActivities}
          evaluationSystems={evaluationSystems}
          modules={modules}
        />
      ) : (
        <>
      {/* Banner de éxito */}
      <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-5">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="mt-0.5 text-xl text-green-600"
        />
        <div>
          <p className="font-semibold text-green-800">
            ¡Plan listo para descargar!
          </p>
          <p className="mt-1 text-sm text-green-700">
            Los archivos JSON generados están listos. Descárgalos y colócalos en
            la carpeta <code className="font-mono">src/data/</code> de la
            aplicación. Recuerda registrar el nuevo grado en{' '}
            <code className="font-mono">degrees.ts</code>.
          </p>
        </div>
      </div>

      {/* Resumen numérico */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value, icon, color }) => (
          <div
            key={label}
            className={`flex flex-col items-center gap-1 rounded-xl bg-${color}-50 p-4 text-center`}
          >
            <FontAwesomeIcon
              icon={icon}
              className={`text-xl text-${color}-500`}
            />
            <span className={`text-2xl font-bold text-${color}-700`}>
              {value}
            </span>
            <span className={`text-xs text-${color}-600`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Botones de descarga */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => downloadFile(metaStr, `${id}-meta.json`)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <FontAwesomeIcon icon={faDownload} />
          Descargar {id}-meta.json
        </button>
        <button
          type="button"
          onClick={() => downloadFile(planStr, `${id}-plan.json`)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faDownload} />
          Descargar {id}-plan.json
        </button>
      </div>

      {/* Previsualización JSON meta */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <button
          type="button"
          onClick={() => setShowMeta(!showMeta)}
          className="flex w-full items-center gap-3 bg-gray-50 px-4 py-3 text-left hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={showMeta ? faChevronDown : faChevronRight}
            className="w-3 text-gray-400"
          />
          <code className="text-sm font-bold text-gray-700">
            {id}-meta.json
          </code>
          <span className="ml-auto text-xs text-gray-400">
            {metaStr.split('\n').length} líneas
          </span>
        </button>
        {showMeta ? (
          <pre className="max-h-80 overflow-auto bg-gray-900 px-4 py-4 text-xs leading-relaxed text-green-300">
            {metaStr}
          </pre>
        ) : null}
      </div>

      {/* Previsualización JSON plan */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <button
          type="button"
          onClick={() => setShowPlan(!showPlan)}
          className="flex w-full items-center gap-3 bg-gray-50 px-4 py-3 text-left hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={showPlan ? faChevronDown : faChevronRight}
            className="w-3 text-gray-400"
          />
          <code className="text-sm font-bold text-gray-700">
            {id}-plan.json
          </code>
          <span className="ml-auto text-xs text-gray-400">
            {planStr.split('\n').length} líneas
          </span>
        </button>
        {showPlan ? (
          <pre className="max-h-96 overflow-auto bg-gray-900 px-4 py-4 text-xs leading-relaxed text-green-300">
            {planStr}
          </pre>
        ) : null}
      </div>

      {/* Instrucciones de uso */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-800">
        <p className="mb-2 font-semibold">Pasos para integrar el nuevo plan:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Copia <code className="font-mono">{id}-meta.json</code> y{' '}
            <code className="font-mono">{id}-plan.json</code> en{' '}
            <code className="font-mono">src/data/</code>.
          </li>
          <li>
            Abre <code className="font-mono">src/data/degrees.ts</code> y añade
            las importaciones y una entrada en{' '}
            <code className="font-mono">DEGREES</code>.
          </li>
          <li>
            Si el logo referenciado en{' '}
            <code className="font-mono">logoSrc</code> es nuevo, colócalo en{' '}
            <code className="font-mono">src/assets/</code>.
          </li>
        </ol>
      </div>
        </>
      )}
    </div>
  );
};

export default StepPreview;
