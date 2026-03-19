import type React from 'react';
import { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import type { SingleValue } from 'react-select';
import { getAsignaturas } from '../lib/dataUtils';
import type { AsignaturaProcesada } from '../lib/dataUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChalkboardUser,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import PasoA_Presentacion from './PasoA_Presentacion';
import type { PresentacionData } from './PasoA_Presentacion';
import PasoB_Competencias from './PasoB_Competencias';
import PasoC_Programa from './PasoC_Programa';
import type { UnidadPrograma } from './PasoC_Programa';
import PasoD_Actividades from './PasoD_Actividades';
import type { ActividadSeleccionada } from './PasoD_Actividades';
import PasoE_Evaluacion from './PasoE_Evaluacion';
import type { EvaluacionSeleccionada } from './PasoE_Evaluacion';
import PasoF_HorarioAtencion from './PasoF_HorarioAtencion';
import type { HorarioAtencion } from './PasoF_HorarioAtencion';
import PasoG_Bibliografia from './PasoG_Bibliografia';
import ResumenGuiaDocente from './ResumenGuiaDocente';
import ModalBorradorGuia from './ModalBorradorGuia';
import NavegacionPasos from './NavegacionPasos';

// Tipo para las opciones de react-select
type AsignaturaOption = {
  value: string;
  label: string;
};

// Estado global de la guía docente (por ahora solo A, luego se añaden B-F)
const GUIA_VERSION = '3.0';

function computeAnioAcademico(): string {
  const now = new Date();
  const yr = now.getFullYear();
  return now.getMonth() >= 8 ? `${yr}-${yr + 1}` : `${yr - 1}-${yr}`;
}

export type GuiaDocenteData = {
  presentacion: PresentacionData;
  programa: UnidadPrograma[];
  actividades: ActividadSeleccionada[];
  evaluacion: EvaluacionSeleccionada[];
  convocatoriaExtra: string;
  horario: Record<string, HorarioAtencion[]>;
  bibliografia: string;
  version: string;
};

const pasos = [
  { key: 'presentacion', label: 'Presentación' },
  { key: 'competencias', label: 'Competencias' },
  { key: 'programa', label: 'Programa' },
  { key: 'actividades', label: 'Actividades formativas' },
  { key: 'evaluacion', label: 'Evaluación' },
  { key: 'horario', label: 'Horario de atención' },
  { key: 'bibliografia', label: 'Bibliografía y recursos' },
];

const AsistenteGuiaDocente: React.FC = () => {
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] =
    useState<AsignaturaProcesada | null>(null);
  const [pasoActual, setPasoActual] = useState(0);
  const [guia, setGuia] = useState<GuiaDocenteData>(() => {
    const saved = localStorage.getItem('guiaDocente');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.version === GUIA_VERSION) return parsed;
      } catch {}
      localStorage.removeItem('guiaDocente');
    }
    return {
      presentacion: {
        profesores: [],
        idioma: '',
        aula: '',
        horario: '',
        resumen: '',
        anioAcademico: computeAnioAcademico(),
      },
      programa: [],
      actividades: [],
      evaluacion: [],
      convocatoriaExtra: '',
      horario: {},
      bibliografia: '',
      version: GUIA_VERSION,
    };
  });

  const [pasoRetorno, setPasoRetorno] = useState<number | null>(null);
  const [modalBorradorOpen, setModalBorradorOpen] = useState(false);

  // Memoizamos la lista de asignaturas para no reprocesarla en cada render
  const opcionesAsignatura = useMemo((): AsignaturaOption[] => {
    return getAsignaturas().map((a) => ({
      value: a.id,
      label: `${a.nombre} (${a.curso}º Curso)`,
    }));
  }, []);

  // Guardado automático en localStorage
  useEffect(() => {
    localStorage.setItem(
      'guiaDocente',
      JSON.stringify({ ...guia, version: GUIA_VERSION }),
    );
  }, [guia]);

  const handleSelectChange = (opcion: SingleValue<AsignaturaOption>) => {
    if (opcion) {
      const asignatura = getAsignaturas().find((a) => a.id === opcion.value);
      setAsignaturaSeleccionada(asignatura || null);
      setPasoActual(0); // Reinicia el wizard si se cambia de asignatura
      setPasoRetorno(null);
    } else {
      setAsignaturaSeleccionada(null);
      setPasoActual(0);
      setPasoRetorno(null);
    }
  };

  const handleReiniciar = () => {
    localStorage.removeItem('guiaDocente');
    setAsignaturaSeleccionada(null);
    setPasoActual(0);
    setPasoRetorno(null);
    setGuia({
      presentacion: {
        profesores: [],
        idioma: '',
        aula: '',
        horario: '',
        resumen: '',
        anioAcademico: computeAnioAcademico(),
      },
      programa: [],
      actividades: [],
      evaluacion: [],
      convocatoriaExtra: '',
      horario: {},
      bibliografia: '',
      version: GUIA_VERSION,
    });
  };

  const handleEdit = (paso: number) => {
    setPasoRetorno(7);
    setPasoActual(paso);
  };

  const handleIrAPaso = (idx: number) => {
    if (idx >= pasoActual) {
      return;
    }

    setPasoRetorno((actual) => actual ?? pasoActual);
    setPasoActual(idx);
  };

  const handleStepNext = () => {
    if (pasoRetorno !== null) {
      setPasoActual(pasoRetorno);
      setPasoRetorno(null);
    } else {
      setPasoActual((p) => p + 1);
    }
  };

  const handleStepSeguirDesdeAqui = () => {
    setPasoRetorno(null);
    setPasoActual((p) => p + 1);
  };

  const labelSiguiente =
    pasoRetorno === null
      ? undefined
      : pasoRetorno === 7
        ? 'Guardar y volver al resumen'
        : `Guardar y volver a ${pasos[pasoRetorno].label}`;

  // Renderizado del wizard de pasos
  const renderPaso = () => {
    switch (pasoActual) {
      case 0:
        return (
          <PasoA_Presentacion
            value={guia.presentacion}
            onChange={(presentacion) =>
              setGuia((g) => ({ ...g, presentacion }))
            }
            onNext={handleStepNext}
            onGuardarYSeguir={
              pasoRetorno !== null ? handleStepSeguirDesdeAqui : undefined
            }
            asignatura={asignaturaSeleccionada!}
            labelSiguiente={labelSiguiente}
          />
        );
      case 1:
        return (
          <PasoB_Competencias
            asignatura={asignaturaSeleccionada!}
            onNext={handleStepNext}
            onGuardarYSeguir={
              pasoRetorno !== null ? handleStepSeguirDesdeAqui : undefined
            }
            labelSiguiente={labelSiguiente}
          />
        );
      case 2:
        return (
          <PasoC_Programa
            value={guia.programa}
            onChange={(programa) => setGuia((g) => ({ ...g, programa }))}
            onNext={handleStepNext}
            onGuardarYSeguir={
              pasoRetorno !== null ? handleStepSeguirDesdeAqui : undefined
            }
            labelSiguiente={labelSiguiente}
          />
        );
      case 3:
        return (
          <PasoD_Actividades
            actividadesPosibles={asignaturaSeleccionada!['actividad-formativa']}
            value={guia.actividades}
            onChange={(actividades) => setGuia((g) => ({ ...g, actividades }))}
            onNext={handleStepNext}
            onGuardarYSeguir={
              pasoRetorno !== null ? handleStepSeguirDesdeAqui : undefined
            }
            nombreAsignatura={asignaturaSeleccionada!.nombre}
            labelSiguiente={labelSiguiente}
          />
        );
      case 4:
        return (
          <PasoE_Evaluacion
            sistemasPosibles={asignaturaSeleccionada!.evaluacion}
            value={guia.evaluacion}
            onChange={(evaluacion) => setGuia((g) => ({ ...g, evaluacion }))}
            convocatoriaExtra={guia.convocatoriaExtra}
            onChangeConvocatoria={(convocatoriaExtra) =>
              setGuia((g) => ({ ...g, convocatoriaExtra }))
            }
            onNext={handleStepNext}
            onGuardarYSeguir={
              pasoRetorno !== null ? handleStepSeguirDesdeAqui : undefined
            }
            labelSiguiente={labelSiguiente}
          />
        );
      case 5:
        return (
          <PasoF_HorarioAtencion
            profesores={guia.presentacion.profesores}
            value={guia.horario}
            onChange={(horario) => setGuia((g) => ({ ...g, horario }))}
            onNext={handleStepNext}
            onGuardarYSeguir={
              pasoRetorno !== null ? handleStepSeguirDesdeAqui : undefined
            }
            labelSiguiente={labelSiguiente}
          />
        );
      case 6:
        return (
          <PasoG_Bibliografia
            value={guia.bibliografia}
            onChange={(bibliografia) =>
              setGuia((g) => ({ ...g, bibliografia }))
            }
            onNext={handleStepNext}
            onGuardarYSeguir={
              pasoRetorno !== null ? handleStepSeguirDesdeAqui : undefined
            }
            labelSiguiente={labelSiguiente}
          />
        );
      case 7:
        return (
          <ResumenGuiaDocente
            guia={guia}
            asignatura={asignaturaSeleccionada!}
            onEdit={handleEdit}
          />
        );
      default:
        return (
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <h3 className="mb-4 text-xl font-bold text-blue-900">
              (Próximamente: Paso {pasos[pasoActual].key})
            </h3>
            <button
              className="mt-4 rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
              onClick={() => setPasoActual((p) => p - 1)}
            >
              Volver
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {!asignaturaSeleccionada ? (
        <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
          <div className="rounded-lg bg-white p-6 text-center shadow-lg">
            <FontAwesomeIcon
              icon={faChalkboardUser}
              className="mb-4 text-5xl text-blue-500"
            />
            <h1 className="text-2xl font-bold tracking-tight text-gray-800 sm:text-3xl">
              Asistente de Guía Docente
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Para comenzar, selecciona la asignatura para la que deseas
              preparar la guía docente.
            </p>
            <div className="mx-auto mt-6 max-w-md">
              <Select<AsignaturaOption>
                options={opcionesAsignatura}
                onChange={handleSelectChange}
                placeholder="Busca o selecciona una asignatura..."
                isClearable
                isSearchable
                noOptionsMessage={() => 'No se encontraron asignaturas'}
                styles={{
                  control: (base) => ({
                    ...base,
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    borderColor: '#d1d5db',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#3b82f6',
                    },
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected
                      ? '#3b82f6'
                      : isFocused
                        ? '#eff6ff'
                        : base.backgroundColor,
                    color: isSelected ? 'white' : '#1f2937',
                  }),
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 pb-8 pt-20 sm:pb-14 sm:pt-24">
          <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Guía docente para:
                </p>
                <h2 className="text-2xl font-bold text-blue-900">
                  {asignaturaSeleccionada.nombre}
                </h2>
                <p className="text-sm text-blue-700">
                  {asignaturaSeleccionada.materia} /{' '}
                  {asignaturaSeleccionada.modulo}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setModalBorradorOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  title="Ver borrador de la guía docente"
                >
                  Ver borrador
                </button>
                <button
                  onClick={() => setAsignaturaSeleccionada(null)}
                  className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                  Cambiar asignatura
                </button>
              </div>
            </div>
          </div>
          {/* Barra de pasos mejorada y visual */}
          <NavegacionPasos
            pasos={pasos}
            pasoActual={pasoActual}
            onIrAPaso={handleIrAPaso}
            onReiniciar={handleReiniciar}
          />
          {/* Renderizado del paso actual */}
          {renderPaso()}
        </div>
      )}
      {asignaturaSeleccionada !== null && (
        <ModalBorradorGuia
          isOpen={modalBorradorOpen}
          onClose={() => setModalBorradorOpen(false)}
          guia={guia}
          asignatura={asignaturaSeleccionada}
        />
      )}
    </div>
  );
};

export default AsistenteGuiaDocente;
