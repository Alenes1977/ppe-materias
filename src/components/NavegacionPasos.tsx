import type React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { PRIMARY_BLUE } from '../constants/colors';

interface Paso {
  key: string;
  label: string;
}

interface Props {
  pasos: Paso[];
  pasoActual: number;
  onIrAPaso: (idx: number) => void;
  onReiniciar: () => void;
}

const styles = `
  .asistente-pill {
    border-radius: 9999px;
    padding: 0.375rem 1.1rem 0.375rem 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: 1.5px solid ${PRIMARY_BLUE};
    background: white;
    color: ${PRIMARY_BLUE};
    transition: all 0.2s;
    box-shadow: 0 1px 2px 0 rgba(16,30,54,0.04);
    outline: none;
  }
  .asistente-pill:not(.disabled):hover {
    background: ${PRIMARY_BLUE} !important;
    color: white !important;
    border: 1.5px solid ${PRIMARY_BLUE} !important;
  }
  .asistente-pill.active {
    background: ${PRIMARY_BLUE} !important;
    color: white !important;
    border: 1.5px solid ${PRIMARY_BLUE} !important;
  }
  .asistente-pill.completed {
    background: #f0fdf4;
    color: ${PRIMARY_BLUE};
    border: 1.5px solid ${PRIMARY_BLUE};
  }
  .asistente-pill.disabled {
    border: 1.5px solid #e5e7eb;
    color: #bdbdbd;
    background: #f9fafb;
    cursor: not-allowed;
  }
  .asistente-pill .pill-num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    height: 1.5em;
    border-radius: 9999px;
    font-size: 1em;
    font-weight: bold;
    background: #e0e7ff;
    color: ${PRIMARY_BLUE};
    margin-right: 0.5em;
    transition: background 0.2s, color 0.2s;
  }
  .asistente-pill.active .pill-num,
  .asistente-pill:not(.disabled):hover .pill-num {
    background: white;
    color: ${PRIMARY_BLUE};
  }
  .asistente-pill.completed .pill-num {
    background: #bbf7d0;
    color: #059669;
  }
  .asistente-pill.disabled .pill-num {
    background: #f3f4f6;
    color: #bdbdbd;
  }
  .asistente-restart {
    border-radius: 9999px;
    padding: 0.25rem 1.1rem;
    font-size: 13px;
    font-weight: 500;
    border: 1.5px solid #ef4444;
    background: white;
    color: #ef4444;
    margin-bottom: 0.5rem;
    transition: all 0.2s;
    box-shadow: 0 1px 2px 0 rgba(16,30,54,0.04);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
  .asistente-restart:hover {
    background: #fee2e2 !important;
    color: #b91c1c !important;
    border: 1.5px solid #b91c1c !important;
  }
`;

const NavegacionPasos: React.FC<Props> = ({
  pasos,
  pasoActual,
  onIrAPaso,
  onReiniciar,
}) => {
  return (
    <>
      <style>{styles}</style>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          className="asistente-restart"
          onClick={onReiniciar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2m6-2a9 9 0 11-6.219-8.56"
            />
          </svg>
          Empezar de nuevo
        </button>
      </div>
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {pasos.map((paso, idx) => {
          const isCompleted = idx < pasoActual;
          const isCurrent = idx === pasoActual;
          const isDisabled = idx > pasoActual;
          return (
            <button
              key={paso.key}
              type="button"
              className={`asistente-pill${isCurrent ? ' active' : ''}${
                isCompleted ? ' completed' : ''
              }${isDisabled ? ' disabled' : ''}`}
              disabled={isDisabled}
              onClick={() => !isDisabled && onIrAPaso(idx)}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="pill-num">
                {isCompleted ? <FontAwesomeIcon icon={faCheck} /> : idx + 1}
              </span>
              <span>{paso.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default NavegacionPasos;
