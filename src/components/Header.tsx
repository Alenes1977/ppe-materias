import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIMARY_BLUE } from '../constants/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from './Breadcrumb';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Función para manejar la navegación con scroll al inicio
  const handleNavigation = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
    window.scrollTo(0, 0);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow-md">
      {/* Contenedor grid para las tres secciones */}
      <div
        className="mx-auto grid grid-cols-12 items-center gap-4 px-4 py-3 sm:px-6 lg:px-8"
        style={{ maxWidth: '1400px' }}
      >
        {/* Sección Izquierda: Breadcrumbs (visible solo en pantallas medianas y grandes) */}
        <div className="col-span-5 hidden justify-self-start lg:block">
          <Breadcrumb />
        </div>

        {/* Botón de menú móvil (visible solo en pantallas pequeñas) */}
        <div className="col-span-3 justify-self-start lg:hidden">
          <button
            className="rounded-md p-2 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú principal"
          >
            <FontAwesomeIcon
              icon={menuOpen ? faTimes : faBars}
              className="text-xl text-gray-600"
            />
          </button>
        </div>

        {/* Sección Central: Título - adaptativo según tamaño */}
        <div className="col-span-6 justify-self-center text-center lg:col-span-2">
          <a
            href="/"
            onClick={handleNavigation('/')}
            className="inline-flex items-center space-x-2"
          >
            <span
              className="font-poppins whitespace-nowrap text-base font-bold sm:text-lg"
              style={{ color: PRIMARY_BLUE }}
            >
              Grado en PPE
            </span>
          </a>
        </div>

        {/* Sección Derecha: Navegación Principal (visible solo en pantallas medianas y grandes) */}
        <div className="col-span-3 hidden justify-self-end lg:col-span-5 lg:block">
          <nav className="flex items-center justify-end space-x-4 text-sm font-medium">
            <a
              href="/asignaturas"
              onClick={handleNavigation('/asignaturas')}
              className={`flex items-center rounded-md px-3 py-2 transition-all duration-300 ${
                location.pathname === '/asignaturas' ||
                location.pathname.startsWith('/asignaturas/')
                  ? 'bg-blue-50 font-semibold shadow-sm'
                  : 'border border-gray-200 bg-white hover:-translate-y-0.5 hover:transform hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm'
              }`}
              style={
                location.pathname === '/asignaturas' ||
                location.pathname.startsWith('/asignaturas/')
                  ? { color: PRIMARY_BLUE }
                  : { color: 'rgba(156, 163, 175, 1)' }
              }
              onMouseEnter={(e) => {
                if (
                  !(
                    location.pathname === '/asignaturas' ||
                    location.pathname.startsWith('/asignaturas/')
                  )
                ) {
                  e.currentTarget.style.color = PRIMARY_BLUE;
                }
              }}
              onMouseLeave={(e) => {
                if (
                  !(
                    location.pathname === '/asignaturas' ||
                    location.pathname.startsWith('/asignaturas/')
                  )
                ) {
                  e.currentTarget.style.color = 'rgba(156, 163, 175, 1)';
                }
              }}
            >
              Asignaturas
            </a>

            <a
              href="/plan-estudios"
              onClick={handleNavigation('/plan-estudios')}
              className={`flex items-center rounded-md px-3 py-2 transition-all duration-300 ${
                location.pathname === '/plan-estudios' ||
                location.pathname.startsWith('/plan-estudios/')
                  ? 'bg-blue-50 font-semibold shadow-sm'
                  : 'border border-gray-200 bg-white hover:-translate-y-0.5 hover:transform hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm'
              }`}
              style={
                location.pathname === '/plan-estudios' ||
                location.pathname.startsWith('/plan-estudios/')
                  ? { color: PRIMARY_BLUE }
                  : { color: 'rgba(156, 163, 175, 1)' }
              }
              onMouseEnter={(e) => {
                if (
                  !(
                    location.pathname === '/plan-estudios' ||
                    location.pathname.startsWith('/plan-estudios/')
                  )
                ) {
                  e.currentTarget.style.color = PRIMARY_BLUE;
                }
              }}
              onMouseLeave={(e) => {
                if (
                  !(
                    location.pathname === '/plan-estudios' ||
                    location.pathname.startsWith('/plan-estudios/')
                  )
                ) {
                  e.currentTarget.style.color = 'rgba(156, 163, 175, 1)';
                }
              }}
            >
              Plan de Estudios
            </a>

            <a
              href="/competencias"
              onClick={handleNavigation('/competencias')}
              className={`flex items-center rounded-md px-3 py-2 transition-all duration-300 ${
                location.pathname === '/competencias'
                  ? 'bg-blue-50 font-semibold shadow-sm'
                  : 'border border-gray-200 bg-white hover:-translate-y-0.5 hover:transform hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm'
              }`}
              style={
                location.pathname === '/competencias'
                  ? { color: PRIMARY_BLUE }
                  : { color: 'rgba(156, 163, 175, 1)' }
              }
              onMouseEnter={(e) => {
                if (!(location.pathname === '/competencias')) {
                  e.currentTarget.style.color = PRIMARY_BLUE;
                }
              }}
              onMouseLeave={(e) => {
                if (!(location.pathname === '/competencias')) {
                  e.currentTarget.style.color = 'rgba(156, 163, 175, 1)';
                }
              }}
            >
              Competencias
            </a>
          </nav>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="border-t bg-white shadow-lg lg:hidden">
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
            {/* Breadcrumbs en versión móvil */}
            <Breadcrumb isMobile />

            {/* Enlaces de navegación en versión móvil */}
            <nav className="mt-4 flex flex-col space-y-2">
              <a
                href="/asignaturas"
                onClick={handleNavigation('/asignaturas')}
                className={`w-full rounded-md px-4 py-3 text-center transition-colors ${
                  location.pathname === '/asignaturas' ||
                  location.pathname.startsWith('/asignaturas/')
                    ? 'bg-blue-50 font-semibold'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
                style={{
                  color:
                    location.pathname === '/asignaturas' ||
                    location.pathname.startsWith('/asignaturas/')
                      ? PRIMARY_BLUE
                      : 'rgba(75, 85, 99, 1)',
                }}
              >
                Asignaturas
              </a>

              <a
                href="/plan-estudios"
                onClick={handleNavigation('/plan-estudios')}
                className={`w-full rounded-md px-4 py-3 text-center transition-colors ${
                  location.pathname === '/plan-estudios' ||
                  location.pathname.startsWith('/plan-estudios/')
                    ? 'bg-blue-50 font-semibold'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
                style={{
                  color:
                    location.pathname === '/plan-estudios' ||
                    location.pathname.startsWith('/plan-estudios/')
                      ? PRIMARY_BLUE
                      : 'rgba(75, 85, 99, 1)',
                }}
              >
                Plan de Estudios
              </a>

              <a
                href="/competencias"
                onClick={handleNavigation('/competencias')}
                className={`w-full rounded-md px-4 py-3 text-center transition-colors ${
                  location.pathname === '/competencias'
                    ? 'bg-blue-50 font-semibold'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
                style={{
                  color:
                    location.pathname === '/competencias'
                      ? PRIMARY_BLUE
                      : 'rgba(75, 85, 99, 1)',
                }}
              >
                Competencias
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
