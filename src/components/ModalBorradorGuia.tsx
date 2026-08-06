import { type FC, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { GuiaDocenteData } from './AsistenteGuiaDocente';
import type { AsignaturaProcesada } from '../lib/dataUtils';
import { generarPDFGuiaDocente } from '../utils/pdfGuiaDocente';
import ResumenGuiaDocente from './ResumenGuiaDocente';
import { useDegree } from '../context/DegreeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  guia: GuiaDocenteData;
  asignatura: AsignaturaProcesada;
}

const ModalBorradorGuia: FC<Props> = ({
  isOpen,
  onClose,
  guia,
  asignatura,
}) => {
  const { degreeInfo, degreePlan } = useDegree();
  // Cierra con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Bloquea el scroll del body mientras el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative my-8 w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
        {/* Cabecera fija del modal */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-blue-900">
            Vista previa del borrador —{' '}
            <span className="font-normal text-blue-700">
              {asignatura.nombre}
            </span>
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                generarPDFGuiaDocente(guia, asignatura, degreeInfo, degreePlan)
              }
              className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 transition-all hover:bg-blue-100 hover:shadow"
            >
              <FontAwesomeIcon icon={faFilePdf} />
              Descargar PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
              aria-label="Cerrar vista previa"
            >
              <FontAwesomeIcon icon={faXmark} />
              Cerrar
            </button>
          </div>
        </div>

        {/* Contenido desplazable */}
        <div className="p-4">
          <ResumenGuiaDocente
            guia={guia}
            asignatura={asignatura}
            onEdit={() => {}}
            modoPrevia
          />
        </div>
      </div>
    </div>
  );
};

export default ModalBorradorGuia;
