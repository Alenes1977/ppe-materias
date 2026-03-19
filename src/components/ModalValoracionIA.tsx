import type React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSpinner,
  faRobot,
  faStar,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import type { ValoracionIAResponse } from '../utils/valoracionIA';
import { generarPDFValoracionIA } from '../utils/pdfValoracionIA';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  valoracion: ValoracionIAResponse | null;
}

const ModalValoracionIA: React.FC<Props> = ({
  isOpen,
  onClose,
  isLoading,
  valoracion,
}) => {
  if (!isOpen) return null;

  // Función para procesar el formato del texto
  const procesarTexto = (texto: string) => {
    if (!texto) return '';

    // Convertir **texto** a <strong>texto</strong>
    let textoFormateado = texto.replace(
      /\*\*(.*?)\*\*/g,
      '<strong>$1</strong>',
    );

    // Convertir saltos de línea a <br>
    textoFormateado = textoFormateado.replace(/\n/g, '<br>');

    return textoFormateado;
  };

  const puedeDescargarPDF =
    valoracion?.success &&
    (valoracion.valoracion ||
      valoracion.puntuacion != null ||
      (valoracion.recomendaciones && valoracion.recomendaciones.length > 0));

  const handleDescargarPDF = () => {
    if (!valoracion?.success) {
      return;
    }
    generarPDFValoracionIA(valoracion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faRobot}
              className="text-2xl text-blue-600"
            />
            <h2 className="text-xl font-bold text-gray-900">
              Valoración con IA
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FontAwesomeIcon
                icon={faSpinner}
                className="mb-4 animate-spin text-4xl text-blue-600"
              />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Analizando tu guía docente...
              </h3>
              <p className="text-center text-gray-600">
                Nuestro asistente de IA está revisando el contenido, estructura
                y coherencia de tu guía docente.
              </p>
            </div>
          ) : valoracion?.success ? (
            <div className="space-y-6">
              {/* Puntuación */}
              {valoracion.puntuacion != null ? (
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-yellow-500"
                    />
                    <h3 className="font-semibold text-gray-900">
                      Puntuación General
                    </h3>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {valoracion.puntuacion}/10
                  </div>
                </div>
              ) : null}

              {/* Valoración */}
              {valoracion.valoracion ? (
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Valoración Detallada
                  </h3>
                  <div className="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
                    <div
                      className="prose prose-sm max-w-none leading-relaxed text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: procesarTexto(valoracion.valoracion),
                      }}
                    />
                  </div>
                </div>
              ) : null}

              {/* Recomendaciones */}
              {valoracion.recomendaciones &&
              valoracion.recomendaciones.length > 0 ? (
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Recomendaciones de Mejora
                  </h3>
                  <ul className="space-y-2">
                    {valoracion.recomendaciones.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 rounded-full bg-red-100 p-3">
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-2xl text-red-600"
                />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Error en la valoración
              </h3>
              <p className="text-center text-gray-600">
                {valoracion?.error ||
                  'Ha ocurrido un error inesperado. Inténtalo de nuevo.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && (
          <div className="flex flex-shrink-0 flex-col gap-3 border-t border-gray-200 p-6 sm:flex-row sm:justify-end">
            {puedeDescargarPDF ? (
              <button
                onClick={handleDescargarPDF}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-700 transition-colors hover:bg-red-100"
              >
                <FontAwesomeIcon icon={faFilePdf} />
                Descargar feedback (PDF)
              </button>
            ) : null}
            <button
              onClick={onClose}
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 sm:min-w-36"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalValoracionIA;
