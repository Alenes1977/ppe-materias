import { type FC, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIMARY_BLUE } from '../constants/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from './Breadcrumb';

const Header: FC = () => {
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
        className="mx-auto grid grid-cols-12 items-center px-4 py-2"
        style={{ maxWidth: '1400px' }}
      >
        {/* Sección Izquierda: Breadcrumbs (visible solo en pantallas medianas y grandes) */}
        <div className="col-span-5 hidden justify-self-start md:block">
          <Breadcrumb />
        </div>

        {/* Botón de menú móvil (visible solo en pantallas pequeñas) */}
        <div className="col-span-2 justify-self-start md:hidden">
          <button
            className="rounded-md p-1 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú principal"
          >
            <FontAwesomeIcon
              icon={menuOpen ? faTimes : faBars}
              className="text-lg text-gray-600"
            />
          </button>
        </div>

        {/* Sección Central: Solo Título - siempre centrado en el grid */}
        <div className="col-span-5 justify-self-center md:col-span-2">
          <a
            href="/"
            onClick={handleNavigation('/')}
            className="flex items-center space-x-3"
          >
            <span
              className="text-primary-blue font-poppins self-center whitespace-nowrap text-sm font-bold md:text-lg"
              style={{ color: PRIMARY_BLUE }}
            >
              Grado en PPE
            </span>
          </a>
        </div>

        {/* Sección Derecha: Navegación Principal (visible solo en pantallas medianas y grandes) */}
        <div className="col-span-3 hidden justify-self-end md:col-span-4 md:block">
          <nav className="flex items-center space-x-2 text-xs font-medium">
            <a
              href="/asignaturas"
              onClick={handleNavigation('/asignaturas')}
              className={`flex items-center rounded-md px-2 py-1 transition-all duration-300 ${
                location.pathname === '/asignaturas' ||
                location.pathname.startsWith('/asignaturas/')
                  ? 'bg-blue-50 font-semibold shadow-sm'
                  : 'border border-gray-200 bg-white hover:-translate-y-0.5 hover:transform hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm'
              }`}
              style={
                location.pathname === '/asignaturas' ||
                location.pathname.startsWith('/asignaturas/')
                  ? { color: PRIMARY_BLUE }
                  : {
                      color: 'rgba(156, 163, 175, 1)', // Gris más claro
                    }
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

            {/* Separador visual */}
            <span className="text-gray-200">|</span>

            <a
              href="/plan-estudios"
              onClick={handleNavigation('/plan-estudios')}
              className={`flex items-center rounded-md px-2 py-1 transition-all duration-300 ${
                location.pathname === '/plan-estudios' ||
                location.pathname.startsWith('/plan-estudios/')
                  ? 'bg-blue-50 font-semibold shadow-sm'
                  : 'border border-gray-200 bg-white hover:-translate-y-0.5 hover:transform hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm'
              }`}
              style={
                location.pathname === '/plan-estudios' ||
                location.pathname.startsWith('/plan-estudios/')
                  ? { color: PRIMARY_BLUE }
                  : {
                      color: 'rgba(156, 163, 175, 1)', // Gris más claro
                    }
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

            {/* Separador visual */}
            <span className="text-gray-200">|</span>

            <a
              href="/competencias"
              onClick={handleNavigation('/competencias')}
              className={`flex items-center rounded-md px-2 py-1 transition-all duration-300 ${
                location.pathname === '/competencias'
                  ? 'bg-blue-50 font-semibold shadow-sm'
                  : 'border border-gray-200 bg-white hover:-translate-y-0.5 hover:transform hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm'
              }`}
              style={
                location.pathname === '/competencias'
                  ? { color: PRIMARY_BLUE }
                  : {
                      color: 'rgba(156, 163, 175, 1)', // Gris más claro
                    }
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

            {/* Separador visual */}
            <span className="text-gray-200">|</span>

            <a
              href="/asistente-guia-docente"
              onClick={handleNavigation('/asistente-guia-docente')}
              className={`flex items-center rounded-md px-2 py-1 font-semibold transition-all duration-300 ${
                location.pathname === '/asistente-guia-docente'
                  ? 'bg-emerald-100 text-emerald-800 shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-400 hover:-translate-y-0.5 hover:transform hover:border-emerald-200 hover:bg-emerald-50/70 hover:text-emerald-800 hover:shadow-sm'
              }`}
            >
              Asistente
            </a>
          </nav>
        </div>
      </div>

      {/* Menú móvil desplegable (visible solo cuando menuOpen es true) */}
      {menuOpen ? (
        <div className="mt-2 border-t bg-white py-2 shadow-inner md:hidden">
          <div className="px-4 py-2">
            {/* Breadcrumbs en versión móvil */}
            <Breadcrumb isMobile className="mb-3" />

            {/* Enlaces de navegación en versión móvil */}
            <div className="mt-4 flex flex-col space-y-2">
              <a
                href="/asignaturas"
                onClick={handleNavigation('/asignaturas')}
                className={`rounded-md px-3 py-2 ${
                  location.pathname === '/asignaturas' ||
                  location.pathname.startsWith('/asignaturas/')
                    ? 'bg-blue-50 font-semibold'
                    : 'border border-gray-200'
                }`}
                style={{
                  color:
                    location.pathname === '/asignaturas' ||
                    location.pathname.startsWith('/asignaturas/')
                      ? PRIMARY_BLUE
                      : 'rgba(156, 163, 175, 1)', // Gris más claro
                }}
              >
                Asignaturas
              </a>

              <a
                href="/plan-estudios"
                onClick={handleNavigation('/plan-estudios')}
                className={`rounded-md px-3 py-2 ${
                  location.pathname === '/plan-estudios' ||
                  location.pathname.startsWith('/plan-estudios/')
                    ? 'bg-blue-50 font-semibold'
                    : 'border border-gray-200'
                }`}
                style={{
                  color:
                    location.pathname === '/plan-estudios' ||
                    location.pathname.startsWith('/plan-estudios/')
                      ? PRIMARY_BLUE
                      : 'rgba(156, 163, 175, 1)', // Gris más claro
                }}
              >
                Plan de Estudios
              </a>

              <a
                href="/competencias"
                onClick={handleNavigation('/competencias')}
                className={`rounded-md px-3 py-2 ${
                  location.pathname === '/competencias'
                    ? 'bg-blue-50 font-semibold'
                    : 'border border-gray-200'
                }`}
                style={{
                  color:
                    location.pathname === '/competencias'
                      ? PRIMARY_BLUE
                      : 'rgba(156, 163, 175, 1)', // Gris más claro
                }}
              >
                Competencias
              </a>

              <a
                href="/asistente-guia-docente"
                onClick={handleNavigation('/asistente-guia-docente')}
                className={`rounded-md px-3 py-2 font-semibold ${
                  location.pathname === '/asistente-guia-docente'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'border border-gray-200 text-gray-400'
                }`}
              >
                Asistente Guía Docente
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
