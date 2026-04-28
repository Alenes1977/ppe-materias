import { type FC, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faCircleCheck,
  faCircleXmark,
  faSpinner,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { GuiaDocenteData } from './AsistenteGuiaDocente';
import type { AsignaturaProcesada } from '../lib/dataUtils';
import { useDegree } from '../context/DegreeContext';
import { getGuiaDocentePDFBase64 } from '../utils/pdfGuiaDocente';
import { getGuiaDocenteWordBase64 } from '../utils/wordGuiaDocente';

const WEBHOOK_URL =
  'https://n8n.alejandronestor.eu/webhook/confirma-guia-docente';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  guia: GuiaDocenteData;
  asignatura: AsignaturaProcesada;
}

type Estado = 'idle' | 'loading' | 'success' | 'error';

const ModalConfirmarEnvio: FC<Props> = ({
  isOpen,
  onClose,
  guia,
  asignatura,
}) => {
  const { degreeInfo, degreePlan } = useDegree();
  const [estado, setEstado] = useState<Estado>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fuenteCorreo, setFuenteCorreo] = useState<'profesor' | 'alternativo'>(
    'profesor',
  );
  const [emailProfesorSeleccionado, setEmailProfesorSeleccionado] =
    useState('');
  const [emailAlternativo, setEmailAlternativo] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const emailsProfesores = useMemo(() => {
    const unicos = new Set<string>();

    guia.presentacion.profesores.forEach((prof) => {
      const email = prof.email.trim();
      if (EMAIL_REGEX.test(email)) {
        unicos.add(email);
      }
    });

    return Array.from(unicos);
  }, [guia.presentacion.profesores]);

  const emailDestino =
    fuenteCorreo === 'alternativo'
      ? emailAlternativo.trim()
      : emailProfesorSeleccionado.trim();

  const emailDestinoValido = EMAIL_REGEX.test(emailDestino);

  // Resetea el estado al abrir
  useEffect(() => {
    if (isOpen) {
      setEstado('idle');
      setErrorMsg('');
      setEmailTouched(false);

      const emailInicial = emailsProfesores[0] ?? '';
      if (emailInicial !== '') {
        setFuenteCorreo('profesor');
        setEmailProfesorSeleccionado(emailInicial);
        setEmailAlternativo('');
      } else {
        setFuenteCorreo('alternativo');
        setEmailProfesorSeleccionado('');
        setEmailAlternativo('');
      }
    }
  }, [isOpen, emailsProfesores]);

  // Cierra con Escape (solo en idle)
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && estado === 'idle') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, estado, onClose]);

  if (!isOpen) return null;

  const handleConfirmar = async () => {
    setEmailTouched(true);
    if (!emailDestinoValido) {
      return;
    }

    setEstado('loading');
    setErrorMsg('');

    try {
      const [pdfBase64, wordBase64] = await Promise.all([
        getGuiaDocentePDFBase64(guia, asignatura, degreeInfo, degreePlan),
        getGuiaDocenteWordBase64(guia, asignatura, degreeInfo, degreePlan),
      ]);

      const payload = {
        asignatura: {
          id: asignatura.id,
          nombre: asignatura.nombre,
          modulo: asignatura.modulo,
          materia: asignatura.materia,
          ects: asignatura.ects,
          curso: asignatura.curso,
          semestre: asignatura.semestre,
        },
        presentacion: {
          anioAcademico: guia.presentacion.anioAcademico,
          profesores: guia.presentacion.profesores,
          idioma: guia.presentacion.idioma,
          aula: guia.presentacion.aula,
          horario: guia.presentacion.horario,
          resumen: guia.presentacion.resumen,
        },
        competencias: asignatura.resultados_aprendizaje ?? [],
        programa: guia.programa,
        actividades: guia.actividades,
        evaluacion: guia.evaluacion,
        convocatoriaExtra: guia.convocatoriaExtra,
        horarioAtencion: guia.horario,
        bibliografia: guia.bibliografia,
        metadatos: {
          version: guia.version,
          fechaEnvio: new Date().toISOString(),
        },
        notificacion: {
          emailDestino,
          fuenteCorreo,
        },
        archivos: {
          pdf: {
            nombre: `guia-docente-${asignatura.id}-${guia.presentacion.anioAcademico}.pdf`,
            base64: pdfBase64,
          },
          word: {
            nombre: `guia-docente-${asignatura.id}-${guia.presentacion.anioAcademico}.docx`,
            base64: wordBase64,
          },
        },
      };

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
      }
      setEstado('success');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Error de red. Comprueba tu conexión e inténtalo de nuevo.',
      );
      setEstado('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && estado === 'idle') onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Cabecera */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-blue-900">
            Confirmar envío de la Guía Docente
          </h2>
          {estado !== 'loading' && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Cerrar"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          )}
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-6">
          {/* Estado: idle */}
          {estado === 'idle' && (
            <>
              <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="mb-3 text-sm font-semibold text-blue-900">
                  ¿A qué correo quieres recibir los archivos de la guía?
                </p>

                {emailsProfesores.length > 0 ? (
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="correo-destino"
                        checked={fuenteCorreo === 'profesor'}
                        onChange={() => setFuenteCorreo('profesor')}
                      />
                      Usar correo de profesor
                    </label>

                    {fuenteCorreo === 'profesor' ? (
                      emailsProfesores.length === 1 ? (
                        <div className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-900">
                          {emailsProfesores[0]}
                        </div>
                      ) : (
                        <select
                          className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-900 focus:border-blue-500 focus:outline-none"
                          value={emailProfesorSeleccionado}
                          onChange={(e) =>
                            setEmailProfesorSeleccionado(e.target.value)
                          }
                        >
                          {emailsProfesores.map((email) => (
                            <option key={email} value={email}>
                              {email}
                            </option>
                          ))}
                        </select>
                      )
                    ) : null}

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="correo-destino"
                        checked={fuenteCorreo === 'alternativo'}
                        onChange={() => setFuenteCorreo('alternativo')}
                      />
                      Usar otro correo
                    </label>

                    {fuenteCorreo === 'alternativo' ? (
                      <input
                        type="email"
                        className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-900 focus:border-blue-500 focus:outline-none"
                        placeholder="correo@ejemplo.com"
                        value={emailAlternativo}
                        onChange={(e) => setEmailAlternativo(e.target.value)}
                      />
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-amber-700">
                      No hay un correo de profesor válido en la presentación.
                      Indica un correo de destino.
                    </p>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-900 focus:border-blue-500 focus:outline-none"
                      placeholder="correo@ejemplo.com"
                      value={emailAlternativo}
                      onChange={(e) => setEmailAlternativo(e.target.value)}
                    />
                  </div>
                )}

                {emailTouched && !emailDestinoValido ? (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    Introduce un correo electrónico válido para continuar.
                  </p>
                ) : null}
              </div>

              <div className="mb-5 flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-indigo-800">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mt-0.5 shrink-0 text-xl text-indigo-500"
                />
                <div className="text-sm leading-relaxed">
                  <p className="mb-2 font-semibold">
                    Al confirmar, ocurrirá lo siguiente:
                  </p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>
                      Recibirás los archivos de la guía (
                      <strong>PDF y Word</strong>) en{' '}
                      <strong>{emailDestino || 'el correo indicado'}</strong>.
                    </li>
                    <li>
                      Además, la guía docente de{' '}
                      <strong>{asignatura.nombre}</strong> se enviará al{' '}
                      <strong>Coordinador de Curso</strong> para su revisión.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mb-6 text-sm text-gray-500">
                Asegúrate de haber completado todos los apartados antes de
                enviar. Siempre podrás volver a editar y reenviar la guía.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmar}
                  className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-bold text-white transition ${
                    emailDestinoValido
                      ? 'border-indigo-400 bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
                      : 'cursor-not-allowed border-gray-300 bg-gray-300 text-gray-100'
                  }`}
                  disabled={!emailDestinoValido}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  Confirmar y enviar
                </button>
              </div>
            </>
          )}

          {/* Estado: loading */}
          {estado === 'loading' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin text-4xl text-indigo-500"
              />
              <p className="text-center font-medium text-gray-600">
                Enviando la guía docente…
              </p>
            </div>
          )}

          {/* Estado: success */}
          {estado === 'success' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-5xl text-green-500"
              />
              <div>
                <p className="text-lg font-bold text-green-700">
                  ¡Guía enviada correctamente!
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  El Coordinador de Curso ha recibido la guía para su revisión.
                  En breve recibirás los archivos (PDF y Word)
                  {emailDestino ? (
                    <>
                      {' '}
                      en <strong>{emailDestino}</strong>
                    </>
                  ) : null}
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 rounded-lg border border-green-400 bg-green-50 px-6 py-2.5 text-sm font-bold text-green-700 transition hover:bg-green-100"
              >
                Cerrar
              </button>
            </div>
          )}

          {/* Estado: error */}
          {estado === 'error' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="text-5xl text-red-500"
              />
              <div>
                <p className="text-lg font-bold text-red-700">
                  No se pudo enviar la guía
                </p>
                <p className="mt-1 text-sm text-gray-600">{errorMsg}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmar}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-400 bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  Reintentar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarEnvio;
