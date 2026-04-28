import type React from 'react';
import { useLocation } from 'react-router-dom';
import { PRIMARY_BLUE } from '../constants/colors';
import logoUnavBlanco from '../assets/LogoUnav.svg';
import { DEGREES } from '../data/degrees';

const Footer: React.FC = () => {
  const location = useLocation();
  const degreeId = location.pathname.split('/')[1] || undefined;
  const activeDegree = degreeId ? DEGREES[degreeId] : null;
  const label = activeDegree
    ? activeDegree.meta.name
    : 'Portal de información académica y asistente para las guías docentes';

  return (
    <footer
      className="bg-primary-blue/90 fixed bottom-0 left-0 z-50 flex w-full items-center justify-between py-2 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md"
      style={{ backgroundColor: `${PRIMARY_BLUE}E6` }}
    >
      <div className="flex flex-col items-center md:items-start">
        <img
          src={logoUnavBlanco}
          alt="Logo Universidad de Navarra"
          className="ml-5 h-8 md:h-10"
        />
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex flex-col items-center md:items-end">
          <span className="flex h-8 items-center font-bold md:h-10">
            {label}
          </span>
        </div>
      </div>

      <div className="mr-5 text-xs">&copy; {new Date().getFullYear()}</div>
    </footer>
  );
};

export default Footer;
