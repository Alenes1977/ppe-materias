import { type FC, useState } from 'react';
import type { GuiaDocenteData } from './AsistenteGuiaDocente';
import type { HorarioAtencion } from './PasoF_HorarioAtencion';
import type { AsignaturaProcesada } from '../lib/dataUtils';
import { generarPDFGuiaDocente } from '../utils/pdfGuiaDocente';
import { generarWordGuiaDocente } from '../utils/wordGuiaDocente';
import { useDegree } from '../context/DegreeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileWord,
  faRobot,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import type { ValoracionIAResponse } from '../utils/valoracionIA';
import { enviarGuiaParaValoracion } from '../utils/valoracionIA';
import ModalValoracionIA from './ModalValoracionIA';
import ModalConfirmarEnvio from './ModalConfirmarEnvio';

interface Props {
  guia: GuiaDocenteData;
  asignatura: AsignaturaProcesada;
  onEdit: (paso: number) => void;
  modoPrevia?: boolean;
}

const ResumenGuiaDocente: FC<Props> = ({
  guia,
  asignatura,
  onEdit,
  modoPrevia = false,
}) => {
  const [modalValoracionOpen, setModalValoracionOpen] = useState(false);
  const [isLoadingValoracion, setIsLoadingValoracion] = useState(false);
  const [valoracionResult, setValoracionResult] =
    useState<ValoracionIAResponse | null>(null);
  const [modalEnvioOpen, setModalEnvioOpen] = useState(false);
  const { degreeInfo, degreePlan, labelLO } = useDegree();

  const loDict = degreePlan.learningOutcomes;

  const handleDescargarPDF = () => {
    generarPDFGuiaDocente(guia, asignatura, degreeInfo, degreePlan);
  };

  const handleDescargarWord = () => {
    generarWordGuiaDocente(guia, asignatura, degreeInfo, degreePlan);
  };

  const handleValorarIA = async () => {
    setModalValoracionOpen(true);
    setIsLoadingValoracion(true);
    setValoracionResult(null);

    try {
      const resultado = await enviarGuiaParaValoracion(
        guia,
        asignatura,
        degreeInfo,
        degreePlan,
      );
      setValoracionResult(resultado);
    } catch {
      setValoracionResult({
        success: false,
        error: 'Error de conexión. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoadingValoracion(false);
    }
  };

  const handleCloseModal = () => {
    setModalValoracionOpen(false);
    setValoracionResult(null);
  };

  return (
    <div className="mx-auto max-w-5xl rounded-lg bg-white p-10 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-blue-900">
        Resumen de la Guía Docente
      </h2>
      {!modoPrevia && (
        <div className="mb-12 space-y-6">
          {/* Sección: Descargar Guía */}
          <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50 p-8 shadow-md">
            <h3 className="mb-4 text-xl font-bold text-blue-900">
              📥 Descargar Guía Docente
            </h3>
            <p className="mb-4 text-sm text-blue-700">
              Exporta tu guía en el formato que prefieras
            </p>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-start">
              <button
                className="group inline-flex flex-1 items-center justify-center gap-3 rounded-lg border-2 border-blue-300 bg-white px-6 py-3 font-bold text-blue-700 transition-all duration-200 hover:bg-blue-50 hover:shadow-md sm:flex-none"
                onClick={handleDescargarPDF}
              >
                <FontAwesomeIcon icon={faFilePdf} className="text-2xl" />
                <span>PDF</span>
              </button>
              <button
                className="group inline-flex flex-1 items-center justify-center gap-3 rounded-lg border-2 border-purple-300 bg-white px-6 py-3 font-bold text-purple-700 transition-all duration-200 hover:bg-purple-50 hover:shadow-md sm:flex-none"
                onClick={handleDescargarWord}
              >
                <FontAwesomeIcon icon={faFileWord} className="text-2xl" />
                <span>Word</span>
              </button>
            </div>
          </div>

          {/* Sección: Acciones Adicionales */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Card: Valorar con IA */}
            <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-100/50 p-6 shadow-md transition-all duration-200 hover:shadow-lg">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-amber-200 p-2">
                  <FontAwesomeIcon
                    icon={faRobot}
                    className="text-xl text-amber-700"
                  />
                </div>
                <h4 className="text-lg font-bold text-amber-900">
                  Valorar con IA
                </h4>
              </div>
              <p className="mb-4 text-sm text-amber-800">
                Obtén retroalimentación automática sobre la calidad de tu guía
                docente
              </p>
              <button
                className="w-full rounded-lg bg-amber-600 px-4 py-2 font-bold text-white transition-all duration-200 hover:bg-amber-700"
                onClick={handleValorarIA}
              >
                Iniciar valoración
              </button>
            </div>

            {/* Card: Enviar por correo */}
            <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-100/50 p-6 shadow-md transition-all duration-200 hover:shadow-lg">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-indigo-200 p-2">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-xl text-indigo-700"
                  />
                </div>
                <h4 className="text-lg font-bold text-indigo-900">
                  Enviar a tu correo-e
                </h4>
              </div>
              <p className="mb-4 text-sm text-indigo-800">
                Envío de la Guía docente (PDF y Word) a tu correo electrónico, y
                aviso al Coordinador para su revisión.
              </p>
              <button
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white transition-all duration-200 hover:bg-indigo-700"
                onClick={() => setModalEnvioOpen(true)}
              >
                Enviar Guía Docente
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Presentación */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-700">Presentación</h3>
          {!modoPrevia && (
            <button
              className="text-xs text-blue-600 underline"
              onClick={() => onEdit(0)}
            >
              Editar
            </button>
          )}
        </div>
        <div className="text-gray-700">
          <div>
            <b>Asignatura:</b> {asignatura.nombre}
          </div>
          <div>
            <b>Titulación:</b> Grado en Filosofía, Política y Economía (PPE)
          </div>
          <div>
            <b>Año académico:</b> {guia.presentacion.anioAcademico}
          </div>
          <div>
            <b>Módulo / Materia:</b> {asignatura.modulo} / {asignatura.materia}
          </div>
          <div>
            <b>ECTS:</b> {asignatura.ects}
          </div>
          <div>
            <b>Curso / Semestre:</b> {asignatura.curso} / {asignatura.semestre}
          </div>
          <div>
            <b>Profesores:</b>{' '}
            {guia.presentacion.profesores
              .map((p) => `${p.nombre} (${p.email})`)
              .join(', ')}
          </div>
          <div>
            <b>Idioma:</b> {guia.presentacion.idioma}
          </div>
          <div>
            <b>Aula:</b> {guia.presentacion.aula}
          </div>
          <div>
            <b>Horario:</b> {guia.presentacion.horario}
          </div>
          <div>
            <b>Breve resumen:</b>{' '}
            <span
              dangerouslySetInnerHTML={{ __html: guia.presentacion.resumen }}
            />
          </div>
        </div>
      </section>
      {/* Resultados de aprendizaje / Competencias */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-700 capitalize">
            {labelLO.plural}
          </h3>
          {!modoPrevia && (
            <button
              className="text-xs text-blue-600 underline"
              onClick={() => onEdit(1)}
            >
              Editar
            </button>
          )}
        </div>
        <ul className="ml-6 list-disc text-gray-700">
          {asignatura.resultados_aprendizaje?.map((c: string, i: number) => (
            <li key={i}>
              <span className="font-bold">{c}:</span>{' '}
              <span>
                {loDict[c] || <em>Descripción no encontrada</em>}
              </span>
            </li>
          ))}
        </ul>
      </section>
      {/* Programa */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-700">Programa</h3>
          {!modoPrevia && (
            <button
              className="text-xs text-blue-600 underline"
              onClick={() => onEdit(2)}
            >
              Editar
            </button>
          )}
        </div>
        <div className="ml-6 text-gray-700">
          {guia.programa.map((u, i) => (
            <div key={i} className="mb-4">
              <b>{u.titulo}</b>
              <div dangerouslySetInnerHTML={{ __html: u.descripcion }} />
            </div>
          ))}
        </div>
      </section>
      {/* Actividades formativas */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-700">
            Actividades formativas
          </h3>
          {!modoPrevia && (
            <button
              className="text-xs text-blue-600 underline"
              onClick={() => onEdit(3)}
            >
              Editar
            </button>
          )}
        </div>
        <div className="ml-6 text-gray-700">
          {guia.actividades.map((a, i) => (
            <div key={i} className="mb-4">
              <div className="font-bold">{a.nombre}</div>
              <div
                className="prose ml-6"
                dangerouslySetInnerHTML={{ __html: a.descripcion }}
              />
            </div>
          ))}
        </div>
      </section>
      {/* Evaluación */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-700">Evaluación</h3>
          {!modoPrevia && (
            <button
              className="text-xs text-blue-600 underline"
              onClick={() => onEdit(4)}
            >
              Editar
            </button>
          )}
        </div>
        <div className="ml-6 text-gray-700">
          {guia.evaluacion.map((e, i) => (
            <div key={i} className="mb-4">
              <div className="font-bold">
                {e.tipo} ({e.porcentaje}%)
              </div>
              <div
                className="prose ml-6"
                dangerouslySetInnerHTML={{ __html: e.descripcion }}
              />
            </div>
          ))}
        </div>
        <div className="ml-6 mt-2">
          <b>Convocatoria Extraordinaria:</b>
          <div
            className="prose ml-6"
            dangerouslySetInnerHTML={{ __html: guia.convocatoriaExtra }}
          />
        </div>
      </section>
      {/* Horario de atención */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-700">
            Horario de atención
          </h3>
          {!modoPrevia && (
            <button
              className="text-xs text-blue-600 underline"
              onClick={() => onEdit(5)}
            >
              Editar
            </button>
          )}
        </div>
        {Object.entries(guia.horario).map(
          ([email, franjas]: [string, HorarioAtencion[]]) => {
            const prof = guia.presentacion.profesores.find(
              (p) => p.email === email,
            );
            return (
              <div key={email} className="mb-2">
                <b>{prof ? `${prof.nombre} (${email})` : email}</b>:
                <ul className="ml-4 list-disc">
                  {franjas.map((f: HorarioAtencion, i: number) => (
                    <li key={i}>
                      {f.lugar} | {f.dia} | {f.hora}
                    </li>
                  ))}
                </ul>
              </div>
            );
          },
        )}
      </section>
      {/* Bibliografía y recursos */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-700">
            Bibliografía y recursos
          </h3>
          {!modoPrevia && (
            <button
              className="text-xs text-blue-600 underline"
              onClick={() => onEdit(6)}
            >
              Editar
            </button>
          )}
        </div>
        <div
          className="prose ml-6 text-gray-700"
          dangerouslySetInnerHTML={{ __html: guia.bibliografia }}
        />
      </section>
      <ModalValoracionIA
        isOpen={modalValoracionOpen}
        onClose={handleCloseModal}
        isLoading={isLoadingValoracion}
        valoracion={valoracionResult}
      />
      <ModalConfirmarEnvio
        isOpen={modalEnvioOpen}
        onClose={() => setModalEnvioOpen(false)}
        guia={guia}
        asignatura={asignatura}
      />
    </div>
  );
};

export default ResumenGuiaDocente;
