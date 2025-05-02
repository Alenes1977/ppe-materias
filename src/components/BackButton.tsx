import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface BackButtonProps {
  to: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  label = 'Volver al inicio',
}) => {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-900/5 transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="text-blue-500" />
      {label}
    </Link>
  );
};

export default BackButton;
