import { type FC, useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PRIMARY_BLUE } from '../constants/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faChevronDown,
  faRightLeft,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from './Breadcrumb';
import { DegreeContext } from '../context/DegreeContext';
import { DEGREES } from '../data/degrees';

const LAST_DEGREE_KEY = 'lastDegreeId';

const Header: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // useParams no funciona fuera de una Route con :degreeId; lo extraemos del path directamente
  const degreeId = location.pathname.split('/')[1] || undefined;
  const ctx = useContext(DegreeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [gradoOpen, setGradoOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setGradoOpen(false);
  }, [location]);

  const handleNavigation = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
    window.scrollTo(0, 0);
  };

  const base = degreeId ? `/${degreeId}` : '';

  const isActive = (...paths: string[]) =>
    paths.some(
      (p) =>
        location.pathname === `${base}/${p}` ||
        location.pathname.startsWith(`${base}/${p}/`),
    );

  const navLinkClass = (active: boolean) =>
    `flex items-center rounded-md px-2 py-1 transition-all duration-300 ${
      active
        ? 'bg-blue-50 font-semibold shadow-sm'
        : 'border border-gray-200 bg-white hover:-translate-y-0.5 hover:transform hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm'
    }`;

  const navLinkStyle = (active: boolean): React.CSSProperties =>
    active ? { color: PRIMARY_BLUE } : { color: 'rgba(156, 163, 175, 1)' };

  const navLinkHandlers = (active: boolean) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!active) e.currentTarget.style.color = PRIMARY_BLUE;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!active) e.currentTarget.style.color = 'rgba(156, 163, 175, 1)';
    },
  });

  const activeDegree = degreeId ? DEGREES[degreeId] : null;
  const labelCompetencias = ctx
    ? ctx.labelLO.plural.charAt(0).toUpperCase() + ctx.labelLO.plural.slice(1)
    : 'Competencias';

  const handleGoToSelector = () => {
    localStorage.removeItem(LAST_DEGREE_KEY);
    setGradoOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow-md">
      {/* ── Fila 1: selector de grado + navegación ── */}
      <div
        className="relative z-10 mx-auto flex items-center justify-between px-4 py-2"
        style={{ maxWidth: '1400px' }}
      >
        {/* Selector de grado / logo */}
        <div className="flex items-center gap-2">
          {/* Botón menú móvil */}
          <button
            className="rounded-md p-1 hover:bg-gray-100 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú principal"
          >
            <FontAwesomeIcon
              icon={menuOpen ? faTimes : faBars}
              className="text-lg text-gray-600"
            />
          </button>

          {activeDegree ? (
            <div className="relative flex items-center gap-1">
              {/* Nombre del grado + desplegable de cambio rápido */}
              <button
                onClick={() => setGradoOpen(!gradoOpen)}
                className="flex items-center gap-1.5 rounded-l-md border border-gray-200 bg-white px-2.5 py-1.5 hover:bg-blue-50"
                title="Cambiar grado"
              >
                <span
                  className="font-poppins whitespace-nowrap text-sm font-bold"
                  style={{ color: PRIMARY_BLUE }}
                >
                  {activeDegree.meta.shortName}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-xs text-gray-400 transition-transform duration-150 ${
                    gradoOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Botón explícito "Cambiar" */}
              <button
                onClick={handleGoToSelector}
                className="flex items-center gap-1 rounded-r-md border border-l-0 border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-400 hover:bg-blue-50 hover:text-blue-700"
                title="Ver todos los grados"
              >
                <FontAwesomeIcon icon={faRightLeft} className="text-xs" />
                <span className="hidden sm:inline">Cambiar</span>
              </button>

              {/* Dropdown de cambio rápido */}
              {gradoOpen ? (
                <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="p-2">
                    <p className="mb-1 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Cambio rápido de grado
                    </p>
                    {Object.values(DEGREES).map((entry) => (
                      <button
                        key={entry.meta.id}
                        onClick={() => {
                          setGradoOpen(false);
                          navigate(`/${entry.meta.id}/inicio`);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50 ${
                          entry.meta.id === degreeId
                            ? 'font-semibold text-blue-700'
                            : 'text-gray-700'
                        }`}
                      >
                        {entry.meta.name}
                      </button>
                    ))}
                    <hr className="my-1" />
                    <button
                      onClick={handleGoToSelector}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    >
                      <FontAwesomeIcon icon={faRightLeft} />
                      Ver pantalla de selección de grado
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <a
              href="/"
              onClick={handleNavigation('/')}
              className="flex items-center"
            >
              <span
                className="font-poppins whitespace-nowrap text-sm font-bold md:text-base"
                style={{ color: PRIMARY_BLUE }}
              >
                UNAV | Portal de información académica y asistente para las
                guías docentes
              </span>
            </a>
          )}
        </div>

        {/* Navegación desktop */}
        <div className="hidden items-center gap-1 text-xs font-medium md:flex">
          {activeDegree ? (
            <>
              <a
                href={`${base}/asignaturas`}
                onClick={handleNavigation(`${base}/asignaturas`)}
                className={navLinkClass(isActive('asignaturas'))}
                style={navLinkStyle(isActive('asignaturas'))}
                {...navLinkHandlers(isActive('asignaturas'))}
              >
                Asignaturas
              </a>
              <span className="text-gray-200">|</span>
              <a
                href={`${base}/plan-estudios`}
                onClick={handleNavigation(`${base}/plan-estudios`)}
                className={navLinkClass(isActive('plan-estudios'))}
                style={navLinkStyle(isActive('plan-estudios'))}
                {...navLinkHandlers(isActive('plan-estudios'))}
              >
                Plan de Estudios
              </a>
              <span className="text-gray-200">|</span>
              <a
                href={`${base}/competencias`}
                onClick={handleNavigation(`${base}/competencias`)}
                className={navLinkClass(isActive('competencias'))}
                style={navLinkStyle(isActive('competencias'))}
                {...navLinkHandlers(isActive('competencias'))}
              >
                {labelCompetencias}
              </a>
              <span className="text-gray-200">|</span>
              <a
                href={`${base}/asistente-guia-docente`}
                onClick={handleNavigation(`${base}/asistente-guia-docente`)}
                className={`flex items-center rounded-md px-2 py-1 font-semibold transition-all duration-300 ${
                  isActive('asistente-guia-docente')
                    ? 'bg-emerald-100 text-emerald-800 shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-400 hover:-translate-y-0.5 hover:transform hover:border-emerald-200 hover:bg-emerald-50/70 hover:text-emerald-800 hover:shadow-sm'
                }`}
              >
                Asistente
              </a>
              <span className="text-gray-200">|</span>
            </>
          ) : null}

        </div>
      </div>

      {/* ── Fila 2: breadcrumb (desktop, solo dentro de un grado) ── */}
      {activeDegree ? (
        <div className="relative z-0 hidden border-t border-gray-100 bg-gray-50/80 md:block">
          <div className="mx-auto px-4 py-1.5" style={{ maxWidth: '1400px' }}>
            <Breadcrumb />
          </div>
        </div>
      ) : null}

      {/* ── Menú móvil ── */}
      {menuOpen ? (
        <div className="border-t bg-white py-2 shadow-inner md:hidden">
          <div className="px-4 py-2">
            <Breadcrumb isMobile className="mb-3" />
            {activeDegree ? (
              <div className="mt-2 flex flex-col space-y-2">
                <a
                  href={`${base}/asignaturas`}
                  onClick={handleNavigation(`${base}/asignaturas`)}
                  className={`rounded-md px-3 py-2 ${
                    isActive('asignaturas')
                      ? 'bg-blue-50 font-semibold'
                      : 'border border-gray-200'
                  }`}
                  style={{
                    color: isActive('asignaturas')
                      ? PRIMARY_BLUE
                      : 'rgba(156,163,175,1)',
                  }}
                >
                  Asignaturas
                </a>
                <a
                  href={`${base}/plan-estudios`}
                  onClick={handleNavigation(`${base}/plan-estudios`)}
                  className={`rounded-md px-3 py-2 ${
                    isActive('plan-estudios')
                      ? 'bg-blue-50 font-semibold'
                      : 'border border-gray-200'
                  }`}
                  style={{
                    color: isActive('plan-estudios')
                      ? PRIMARY_BLUE
                      : 'rgba(156,163,175,1)',
                  }}
                >
                  Plan de Estudios
                </a>
                <a
                  href={`${base}/competencias`}
                  onClick={handleNavigation(`${base}/competencias`)}
                  className={`rounded-md px-3 py-2 ${
                    isActive('competencias')
                      ? 'bg-blue-50 font-semibold'
                      : 'border border-gray-200'
                  }`}
                  style={{
                    color: isActive('competencias')
                      ? PRIMARY_BLUE
                      : 'rgba(156,163,175,1)',
                  }}
                >
                  {labelCompetencias}
                </a>
                <a
                  href={`${base}/asistente-guia-docente`}
                  onClick={handleNavigation(`${base}/asistente-guia-docente`)}
                  className={`rounded-md px-3 py-2 font-semibold ${
                    isActive('asistente-guia-docente')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'border border-gray-200 text-gray-400'
                  }`}
                >
                  Asistente Guía Docente
                </a>
                <hr />
                <button
                  onClick={handleGoToSelector}
                  className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-left text-xs text-gray-500"
                >
                  <FontAwesomeIcon icon={faRightLeft} />
                  Pantalla de selección de grado
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
