import { type FC, useState } from 'react';
import type { GuiaDocenteData } from './AsistenteGuiaDocente';
import type { HorarioAtencion } from './PasoF_HorarioAtencion';
import type { AsignaturaProcesada } from '../lib/dataUtils';
import { generarPDFGuiaDocente } from '../utils/pdfGuiaDocente';
import ppeData from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileCode,
  faRobot,
  faEnvelope,
  faCopy,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { generarHTMLGuiaDocente } from '../utils/htmlGuiaDocente';
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
  const [copiado, setCopiado] = useState(false);
  const [modalEnvioOpen, setModalEnvioOpen] = useState(false);

  const handleDescargarPDF = () => {
    generarPDFGuiaDocente(guia, asignatura);
  };

  const handleGenerarHTML = () => {
    // Genera HTML elegante usando la utilidad
    const html = generarHTMLGuiaDocente(guia, asignatura);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guia-docente.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopiarPortapapeles = async () => {
    const html = generarHTMLGuiaDocente(guia, asignatura);
    // Extrae solo el contenido del <body> para que pegue limpio en Word / ADI
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyHtml = bodyMatch ? bodyMatch[1].trim() : html;
    const textoPlano = bodyHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    try {
      if (typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([bodyHtml], { type: 'text/html' }),
            'text/plain': new Blob([textoPlano], { type: 'text/plain' }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(textoPlano);
      }
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      alert(
        'No se pudo copiar al portapapeles. Prueba a descargar el HTML y abrirlo en el navegador.',
      );
    }
  };

  const handleValorarIA = async () => {
    setModalValoracionOpen(true);
    setIsLoadingValoracion(true);
    setValoracionResult(null);

    try {
      const resultado = await enviarGuiaParaValoracion(guia, asignatura);
      setValoracionResult(resultado);
    } catch (error) {
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

  const competenciasDict = (
    ppeData as { resultados_aprendizaje: Record<string, string> }
  ).resultados_aprendizaje;

  return (
    <div className="mx-auto max-w-5xl rounded-lg bg-white p-10 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-blue-900">
        Resumen de la Guía Docente
      </h2>
      {!modoPrevia && (
        <div className="mb-8 flex w-full flex-col items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-8 shadow-lg">
          <div className="mb-2 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <button
              className="group inline-flex items-center gap-3 rounded-xl border border-blue-300 bg-blue-50 px-6 py-4 text-lg font-bold text-blue-700 transition-all duration-200 hover:bg-blue-100 hover:shadow-lg"
              onClick={handleDescargarPDF}
            >
              <FontAwesomeIcon icon={faFilePdf} className="text-2xl" />{' '}
              Descargar PDF
            </button>
            <button
              className="group inline-flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 px-6 py-4 text-lg font-bold text-green-700 transition-all duration-200 hover:bg-green-100 hover:shadow-lg"
              onClick={handleGenerarHTML}
            >
              <FontAwesomeIcon icon={faFileCode} className="text-2xl" /> HTML
              (para ADI)
            </button>
            <button
              className={`group inline-flex items-center gap-3 rounded-xl border px-6 py-4 text-lg font-bold transition-all duration-200 hover:shadow-lg ${
                copiado
                  ? 'border-emerald-400 bg-emerald-100 text-emerald-700'
                  : 'border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100'
              }`}
              onClick={handleCopiarPortapapeles}
            >
              <FontAwesomeIcon
                icon={copiado ? faCheck : faCopy}
                className="text-2xl"
              />
              {copiado ? '¡Copiado!' : 'Copiar al portapapeles'}
            </button>
          </div>
          <div className="mt-2 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <button
              className="group inline-flex items-center gap-3 rounded-xl border border-gray-300 bg-gray-50 px-6 py-4 text-lg font-bold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:shadow-lg"
              onClick={handleValorarIA}
            >
              <FontAwesomeIcon icon={faRobot} className="text-2xl" /> Valorar
              Guía con IA
            </button>
            <button
              className="group inline-flex items-center gap-3 rounded-xl border border-indigo-300 bg-indigo-50 px-6 py-4 text-lg font-bold text-indigo-700 transition-all duration-200 hover:bg-indigo-100 hover:shadow-lg"
              onClick={() => setModalEnvioOpen(true)}
            >
              <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />{' '}
              Confirmar y recibir por correo-e
            </button>
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
      {/* Competencias */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-700">Competencias</h3>
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
                {competenciasDict[c] || <em>Descripción no encontrada</em>}
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
