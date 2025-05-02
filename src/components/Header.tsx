import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="src/assets/LogoUnav.svg"
              alt="Logo Universidad de Navarra"
              className="h-12"
            />
            <h1 className="ml-4 text-2xl font-bold">Portal de Profesores</h1>
          </div>

          {/* Navegación principal */}
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              to="/asignaturas"
              className="font-medium text-white hover:underline"
            >
              Asignaturas
            </Link>
            <Link
              to="/plan-estudios"
              className="font-medium text-white hover:underline"
            >
              Plan de estudios
            </Link>
          </nav>

          {/* Menú móvil */}
          <div className="md:hidden">
            <button className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Migas de pan (opcional) - Se pueden pasar como props */}
        <nav className="mb-2 flex items-center space-x-1 text-sm">
          <Link to="/" className="hover:underline">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-blue-200">Navegación actual</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;
