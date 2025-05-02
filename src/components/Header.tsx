import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIMARY_BLUE } from '../constants/colors';
// Importar FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

interface BreadcrumbItem {
  label: string;
  path: string | null; // null para el último elemento no clicable
}

// Función para generar las migas de pan según la ruta actual
const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const paths: BreadcrumbItem[] = [
    // Siempre incluir Inicio como primer elemento clicable
    { label: '', path: '/' },
  ];
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathname === '/') {
    // Si estamos en la raíz, marcar 'Inicio' como no clicable
    paths[0].path = null;
  } else if (pathname === '/asignaturas') {
    paths.push({ label: 'Asignaturas', path: null });
  } else if (pathname.startsWith('/asignaturas/')) {
    paths.push({ label: 'Asignaturas', path: '/asignaturas' });
    // El nombre de la asignatura específica
    if (pathSegments[1]) {
      const asignaturaName = pathSegments[1].replace(/-/g, ' ');
      paths.push({
        label: asignaturaName.charAt(0).toUpperCase() + asignaturaName.slice(1),
        path: null,
      });
    }
  } else if (pathname === '/plan-estudios') {
    paths.push({ label: 'Plan de Estudios', path: null });
  } else if (pathname.startsWith('/plan-estudios/')) {
    paths.push({ label: 'Plan de Estudios', path: '/plan-estudios' });
    // El nombre del módulo específico
    if (pathSegments[1]) {
      const moduloName = pathSegments[1].replace(/-/g, ' ');
      paths.push({
        label: moduloName.charAt(0).toUpperCase() + moduloName.slice(1),
        path: null,
      });
    }
  } else if (pathname === '/competencias') {
    paths.push({ label: 'Competencias', path: null });
  }

  return paths;
};

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = getBreadcrumbs(location.pathname);
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
    <header className="fixed left-0 top-0 z-50 w-full bg-white px-4 py-2 shadow-md">
      {/* Contenedor grid para las tres secciones */}
      <div
        className="mx-auto grid grid-cols-3 items-center"
        style={{ maxWidth: '1400px' }}
      >
        {/* Sección Izquierda: Breadcrumbs (visible solo en pantallas medianas y grandes) */}
        <div className="hidden justify-self-start md:block">
          <nav aria-label="Breadcrumb" className="text-xs">
            <ol className="inline-flex items-center space-x-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="inline-flex items-center">
                  {index > 0 && (
                    <span className="mx-1 font-bold text-gray-400">•</span> // Separador
                  )}
                  {crumb.path ? (
                    <a
                      href={crumb.path}
                      onClick={handleNavigation(crumb.path)}
                      className="inline-flex items-center rounded-md px-1.5 py-0.5 font-medium transition-all duration-200 hover:bg-blue-50/80 hover:shadow-sm"
                      style={{ color: PRIMARY_BLUE }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {index === 0 && (
                        <FontAwesomeIcon
                          icon={faHome}
                          className="mr-1 h-2.5 w-2.5"
                        />
                      )}
                      {index === 0 ? 'Inicio' : crumb.label}
                    </a>
                  ) : (
                    // Último elemento o no clicable - estilo cápsula
                    <span
                      className="text-primary-blue inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 font-semibold"
                      style={{ color: PRIMARY_BLUE }}
                    >
                      {index === 0 && (
                        <FontAwesomeIcon
                          icon={faHome}
                          className="mr-1 h-2.5 w-2.5"
                        />
                      )}
                      {index === 0 ? 'Inicio' : crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Botón de menú móvil (visible solo en pantallas pequeñas) */}
        <div className="justify-self-start md:hidden">
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
        <div className="justify-self-center">
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
        <div className="hidden justify-self-end md:block">
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
          </nav>
        </div>
      </div>

      {/* Menú móvil desplegable (visible solo cuando menuOpen es true) */}
      {menuOpen && (
        <div className="mt-2 border-t bg-white py-2 shadow-inner md:hidden">
          <div className="px-4 py-2">
            {/* Breadcrumbs en versión móvil */}
            <nav aria-label="Breadcrumb" className="mb-3 text-xs">
              <ol className="flex flex-col space-y-2">
                {breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {crumb.path ? (
                      <a
                        href={crumb.path}
                        onClick={handleNavigation(crumb.path)}
                        className="inline-flex w-full items-center rounded-md px-1.5 py-1 font-medium"
                        style={{ color: PRIMARY_BLUE }}
                      >
                        {index === 0 ? (
                          <>
                            <FontAwesomeIcon
                              icon={faHome}
                              className="mr-2 h-3 w-3"
                            />
                            Inicio
                          </>
                        ) : (
                          crumb.label
                        )}
                      </a>
                    ) : (
                      <span
                        className="inline-flex w-full items-center rounded-full bg-gray-100 px-2 py-1 font-semibold"
                        style={{ color: PRIMARY_BLUE }}
                      >
                        {index === 0 ? (
                          <>
                            <FontAwesomeIcon
                              icon={faHome}
                              className="mr-2 h-3 w-3"
                            />
                            Inicio
                          </>
                        ) : (
                          crumb.label
                        )}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

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
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
