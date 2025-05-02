import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-6 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="mb-4 md:mb-0">
            <img
              src="src/assets/LogoUnav.svg"
              alt="Logo Universidad de Navarra"
              className="h-10 brightness-0 invert filter"
            />
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              &copy; 2025 Universidad de Navarra. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
