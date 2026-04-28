import type { GuiaDocenteData } from '../components/AsistenteGuiaDocente';
import type { AsignaturaProcesada } from '../lib/dataUtils';
import type { DegreeInfo, DegreePlan } from '../types/degree';
import logoSVG from '../assets/marca-unav-negro.svg?raw';

export function generarHTMLGuiaDocente(
  guia: GuiaDocenteData,
  asignatura: AsignaturaProcesada,
  degreeInfo: DegreeInfo,
  degreePlan: DegreePlan,
): string {
  const loDict = degreePlan.learningOutcomes;
  const loLabel = degreeInfo.learningOutcomeLabel;
  const loSectionTitle =
    loLabel.plural.charAt(0).toUpperCase() + loLabel.plural.slice(1);
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guía docente - ${asignatura.nombre}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(120deg,#f8fafc 0%,#e0e7ef 100%); color: #222; margin: 0; padding: 0; }
    .container { max-width: 900px; margin: 40px auto; background: #fff; border-radius: 18px; box-shadow: 0 4px 32px #0002; padding: 0 0 40px 0; overflow: hidden; }
    .header { background: linear-gradient(90deg,#1e3a8a 60%,#2563eb 100%); padding: 36px 32px 24px 32px; display: flex; align-items: center; gap: 32px; }
    .logo { width: 90px; min-width: 70px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 10px; }
    .header-content { flex: 1; }
    .titulo { color: #fff; font-size: 2.5em; font-weight: 800; margin: 0; letter-spacing: 1px; text-shadow: 0 2px 8px #0003; }
    .subtitulo { color: #e0e7ef; font-size: 1.2em; font-weight: 400; margin-top: 0.2em; margin-bottom: 0.5em; }
    .linea { width: 120px; height: 4px; background: linear-gradient(90deg,#fff 60%,#2563eb 100%); border-radius: 2px; margin: 1.2em 0 0 0; }
    .card { background: #f8fafc; border-radius: 14px; box-shadow: 0 2px 12px #1e3a8a11; padding: 32px 28px; margin: 32px 32px 0 32px; }
    .card h2 { color: #1e3a8a; font-size: 1.5em; font-weight: 700; margin-bottom: 0.7em; border-left: 5px solid #2563eb; padding-left: 0.5em; letter-spacing: 0.5px; }
    .datos { display: flex; flex-wrap: wrap; gap: 1.5em 2.5em; margin-bottom: 1.5em; }
    .dato { min-width: 180px; font-size: 1.08em; }
    .dato-label { color: #2563eb; font-weight: 600; margin-right: 0.3em; }
    .resumen { background: #e0e7ef; border-radius: 8px; padding: 1em 1.2em; margin-bottom: 1.5em; font-size: 1.08em; }
    .competencias-lista { display: flex; flex-direction: column; gap: 0.7em; margin: 0.5em 0 0 0; }
    .competencia { display: flex; align-items: flex-start; gap: 0.7em; background: #fff; border-radius: 8px; box-shadow: 0 1px 4px #2563eb11; padding: 0.7em 1em; }
    .competencia-id { font-weight: bold; color: #1e3a8a; min-width: 55px; }
    .competencia-icon { color: #2563eb; font-size: 1.2em; margin-top: 0.1em; }
    .section-lista { display: flex; flex-direction: column; gap: 1.2em; }
    .item-lista { background: #fff; border-radius: 8px; box-shadow: 0 1px 4px #1e3a8a11; padding: 0.7em 1em; }
    .item-titulo { font-weight: bold; color: #1e3a8a; font-size: 1.08em; margin-bottom: 0.2em; }
    .item-desc { margin-left: 0.2em; color: #222; }
    .evaluacion-porcentaje { color: #2563eb; font-weight: bold; margin-left: 0.5em; }
    .convocatoria { background: #f1f5f9; border-radius: 8px; padding: 1em 1.2em; margin-top: 1.2em; }
    .horario-prof { display: flex; align-items: center; gap: 1em; margin-bottom: 0.7em; }
    .avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg,#1e3a8a 60%,#2563eb 100%); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3em; font-weight: bold; box-shadow: 0 2px 8px #1e3a8a22; }
    .franja { margin-left: 2.5em; color: #222; font-size: 1em; margin-bottom: 0.2em; }
    .email { margin-left: 2.5em; color: #2563eb; font-size: 0.97em; margin-bottom: 0.7em; }
    .biblio { background: linear-gradient(90deg,#f8fafc 60%,#e0e7ef 100%); border-radius: 10px; padding: 1.2em 1.5em; font-size: 1.08em; }
    @media (max-width: 700px) {
      .container { padding: 0 0 24px 0; }
      .header { flex-direction: column; align-items: flex-start; gap: 18px; padding: 28px 12px 18px 12px; }
      .card { margin: 24px 8px 0 8px; padding: 20px 10px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${logoSVG}</div>
      <div class="header-content">
        <div class="titulo">Guía docente ${
          guia.presentacion.anioAcademico
        }</div>
        <div class="subtitulo">${asignatura.nombre}</div>
        <div class="linea"></div>
      </div>
    </div>
    <div class="card">
      <h2>Presentación</h2>
      <div class="datos">
        <div class="dato"><span class="dato-label">Titulación:</span> ${degreeInfo.name}</div>
        <div class="dato"><span class="dato-label">Módulo / Materia:</span> ${
          asignatura.modulo
        } / ${asignatura.materia}</div>
        <div class="dato"><span class="dato-label">ECTS:</span> ${
          asignatura.ects
        }</div>
        <div class="dato"><span class="dato-label">Curso / Semestre:</span> ${
          asignatura.curso
        } / ${asignatura.semestre}</div>
        <div class="dato"><span class="dato-label">Profesores:</span> ${guia.presentacion.profesores
          .map((p) => `${p.nombre} (${p.email})`)
          .join(', ')}</div>
        <div class="dato"><span class="dato-label">Idioma:</span> ${
          guia.presentacion.idioma
        }</div>
        <div class="dato"><span class="dato-label">Aula:</span> ${
          guia.presentacion.aula
        }</div>
        <div class="dato"><span class="dato-label">Horario:</span> ${
          guia.presentacion.horario
        }</div>
      </div>
      <div class="resumen"><span class="dato-label">Breve resumen:</span><br>${
        guia.presentacion.resumen
      }</div>
    </div>
    <div class="card">
      <h2>${loSectionTitle}</h2>
      <div class="competencias-lista">
        ${(asignatura.resultados_aprendizaje || [])
          .map(
            (id: string) =>
              `<div class="competencia"><span class="competencia-icon">&#10003;</span><span class="competencia-id">${id}:</span> ${
                loDict[id] ?? 'Descripción no encontrada'
              }</div>`,
          )
          .join('')}
      </div>
    </div>
    <div class="card">
      <h2>Programa</h2>
      <div class="section-lista">
        ${guia.programa
          .map(
            (u) =>
              `<div class="item-lista"><div class="item-titulo">${u.titulo}</div><div class="item-desc">${u.descripcion}</div></div>`,
          )
          .join('')}
      </div>
    </div>
    <div class="card">
      <h2>Actividades formativas</h2>
      <div class="section-lista">
        ${guia.actividades
          .map(
            (a) =>
              `<div class="item-lista"><div class="item-titulo">${a.nombre}</div><div class="item-desc">${a.descripcion}</div></div>`,
          )
          .join('')}
      </div>
    </div>
    <div class="card">
      <h2>Evaluación</h2>
      <div class="section-lista">
        ${guia.evaluacion
          .map(
            (e) =>
              `<div class="item-lista"><div class="item-titulo">${e.tipo} <span class="evaluacion-porcentaje">(${e.porcentaje}%)</span></div><div class="item-desc">${e.descripcion}</div></div>`,
          )
          .join('')}
      </div>
      <div class="convocatoria"><b>Convocatoria Extraordinaria:</b><div>${
        guia.convocatoriaExtra
      }</div></div>
    </div>
    <div class="card">
      <h2>Horario de atención</h2>
      ${Object.entries(guia.horario)
        .map(
          ([email, franjas]: [
            string,
            { lugar: string; dia: string; hora: string }[],
          ]) => {
            const prof = guia.presentacion.profesores.find(
              (p) => p.email === email,
            );
            const inicial = prof
              ? prof.nombre.trim()[0].toUpperCase()
              : email[0].toUpperCase();
            return (
              `<div class="horario-prof"><div class="avatar">${inicial}</div><div><div class="item-titulo">${
                prof ? prof.nombre : email
              }</div></div></div>` +
              franjas
                .map(
                  (f) =>
                    `<div class="franja">${f.lugar} | ${f.dia} | ${f.hora}</div>`,
                )
                .join('') +
              `<div class="email">${email}</div>`
            );
          },
        )
        .join('')}
    </div>
    <div class="card">
      <h2>Bibliografía y recursos</h2>
      <div class="biblio">${guia.bibliografia}</div>
    </div>
  </div>
</body>
</html>`;
}
