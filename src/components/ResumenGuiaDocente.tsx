import React from 'react';
import { GuiaDocenteData } from './AsistenteGuiaDocente';
import { AsignaturaProcesada } from '../lib/dataUtils';
// @ts-expect-error: No existen declaraciones de tipo para pdfmake en build
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-expect-error: No existen declaraciones de tipo para vfs_fonts en build
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { generarPDFGuiaDocente } from '../utils/pdfGuiaDocente';
import ppeData from '../data/ppe.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileCode,
  faRobot,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { generarHTMLGuiaDocente } from '../utils/htmlGuiaDocente';

interface Props {
  guia: GuiaDocenteData;
  asignatura: AsignaturaProcesada;
  onEdit: (paso: number) => void;
}

const ResumenGuiaDocente: React.FC<Props> = ({ guia, asignatura, onEdit }) => {
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
    a.download = `guia-docente.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleValorarIA = () => {
    // De momento sin funcionalidad
    alert('Próximamente: valoración automática con IA');
  };

  const competenciasDict: Record<string, string> = (ppeData as any)
    .competencias;

  return (
    <div className="mx-auto max-w-5xl rounded-lg bg-white p-10 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-blue-900">
        Resumen de la Guía Docente
      </h2>
      {/* Presentación */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-700">Presentación</h3>
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => onEdit(0)}
          >
            Editar
          </button>
        </div>
        <div className="text-gray-700">
          <div>
            <b>Asignatura:</b> {asignatura.nombre}
          </div>
          <div>
            <b>Titulación:</b> Grado en Filosofía, Política y Economía (PPE)
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
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => onEdit(1)}
          >
            Editar
          </button>
        </div>
        <ul className="ml-6 list-disc text-gray-700">
          {asignatura.competencias?.map((c: string, i: number) => (
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
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => onEdit(2)}
          >
            Editar
          </button>
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
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => onEdit(3)}
          >
            Editar
          </button>
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
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => onEdit(4)}
          >
            Editar
          </button>
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
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => onEdit(5)}
          >
            Editar
          </button>
        </div>
        {Object.entries(guia.horario).map(([email, franjas]: any) => (
          <div key={email} className="mb-2">
            <b>{email}</b>:
            <ul className="ml-4 list-disc">
              {franjas.map((f: any, i: number) => (
                <li key={i}>
                  {f.lugar} | {f.dia} | {f.hora}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      {/* Bibliografía y recursos */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-blue-700">
            Bibliografía y recursos
          </h3>
          <button
            className="text-xs text-blue-600 underline"
            onClick={() => onEdit(6)}
          >
            Editar
          </button>
        </div>
        <div
          className="prose ml-6 text-gray-700"
          dangerouslySetInnerHTML={{ __html: guia.bibliografia }}
        />
      </section>
      <div className="mt-12 flex w-full flex-col items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-8 shadow-lg">
        <div className="mb-2 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <button
            className="group inline-flex items-center gap-3 rounded-xl border border-blue-300 bg-blue-50 px-6 py-4 text-lg font-bold text-blue-700 transition-all duration-200 hover:bg-blue-100 hover:shadow-lg"
            onClick={handleDescargarPDF}
          >
            <FontAwesomeIcon icon={faFilePdf} className="text-2xl" /> Descargar
            PDF
          </button>
          <button
            className="group inline-flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 px-6 py-4 text-lg font-bold text-green-700 transition-all duration-200 hover:bg-green-100 hover:shadow-lg"
            onClick={handleGenerarHTML}
          >
            <FontAwesomeIcon icon={faFileCode} className="text-2xl" /> HTML
            (para ADI)
          </button>
        </div>
        <div className="mt-2 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <button
            className="group inline-flex items-center gap-3 rounded-xl border border-gray-300 bg-gray-50 px-6 py-4 text-lg font-bold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:shadow-lg"
            onClick={handleValorarIA}
          >
            <FontAwesomeIcon icon={faRobot} className="text-2xl" /> Valorar Guía
            con IA
          </button>
          <button
            className="group inline-flex items-center gap-3 rounded-xl border border-indigo-300 bg-indigo-50 px-6 py-4 text-lg font-bold text-indigo-700 transition-all duration-200 hover:bg-indigo-100 hover:shadow-lg"
            onClick={() =>
              alert('Funcionalidad de envío por correo próximamente')
            }
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-2xl" /> Enviar
            archivos al correo-e del profesor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumenGuiaDocente;
