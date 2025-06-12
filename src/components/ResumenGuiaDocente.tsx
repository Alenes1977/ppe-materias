import React from 'react';
import { GuiaDocenteData } from './AsistenteGuiaDocente';
import { AsignaturaProcesada } from '../lib/dataUtils';

interface Props {
  guia: GuiaDocenteData;
  asignatura: AsignaturaProcesada;
  onEdit: (paso: number) => void;
}

const ResumenGuiaDocente: React.FC<Props> = ({ guia, asignatura, onEdit }) => {
  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md">
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
            <li key={i}>{c}</li>
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
        <ul className="ml-6 list-decimal text-gray-700">
          {guia.programa.map((u, i) => (
            <li key={i}>
              <b>{u.titulo}</b>
              <div dangerouslySetInnerHTML={{ __html: u.descripcion }} />
            </li>
          ))}
        </ul>
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
        <ul className="ml-6 list-disc text-gray-700">
          {guia.actividades.map((a, i) => (
            <li key={i}>
              <b>{a.nombre}:</b>{' '}
              <span dangerouslySetInnerHTML={{ __html: a.descripcion }} />
            </li>
          ))}
        </ul>
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
        <ul className="ml-6 list-disc text-gray-700">
          {guia.evaluacion.map((e, i) => (
            <li key={i}>
              <b>
                {e.tipo} ({e.porcentaje}%)
              </b>
              : <span dangerouslySetInnerHTML={{ __html: e.descripcion }} />
            </li>
          ))}
        </ul>
        <div className="mt-2">
          <b>Convocatoria Extraordinaria:</b>{' '}
          <span dangerouslySetInnerHTML={{ __html: guia.convocatoriaExtra }} />
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
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: guia.bibliografia }}
        />
      </section>
      <div className="mt-8 flex justify-center">
        <button className="rounded bg-blue-600 px-8 py-3 text-lg font-bold text-white shadow transition-all hover:bg-blue-700">
          Descargar PDF (próximamente)
        </button>
      </div>
    </div>
  );
};

export default ResumenGuiaDocente;
