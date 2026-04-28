import type React from 'react';
import { useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { PRIMARY_BLUE } from '../constants/colors';
import { generateSlug } from '../utils/stringUtils';
import { DegreeContext } from '../context/DegreeContext';

interface BreadcrumbItem {
  label: string;
  path: string | null;
}

interface BreadcrumbProps {
  className?: string;
  isMobile?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  className = '',
  isMobile = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { degreeId } = useParams<{ degreeId: string }>();
  const ctx = useContext(DegreeContext);
  const base = degreeId ? `/${degreeId}` : '';

  const findName = (
    slug: string,
    type: 'asignatura' | 'modulo' | 'materia',
  ): string => {
    if (!ctx) return slug.replace(/-/g, ' ');
    const { degreePlan } = ctx;

    for (const modulo of degreePlan.modules) {
      if (type === 'modulo' && generateSlug(modulo.name) === slug) {
        return modulo.name;
      }
      for (const materia of modulo.subjects) {
        if (type === 'materia' && generateSlug(materia.name) === slug) {
          return materia.name;
        }
        if (type === 'asignatura') {
          const course = materia.courses.find(
            (c) => generateSlug(c.name) === slug,
          );
          if (course) return course.name;
        }
      }
    }
    return slug.replace(/-/g, ' ');
  };

  const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: '', path: `${base}/inicio` }];

    // Extraer segmentos después del degreeId
    const segments = pathname
      .split('/')
      .filter(Boolean)
      .map(decodeURIComponent);
    // segments[0] = degreeId, segments[1] = sección, segments[2] = slug (opcional)
    const section = segments[1] ?? '';
    const slug = segments[2] ?? '';

    if (!section || section === 'inicio') {
      items[0].path = null;
    } else if (section === 'asignaturas') {
      if (slug) {
        items.push({ label: 'Asignaturas', path: `${base}/asignaturas` });
        items.push({ label: findName(slug, 'asignatura'), path: null });
      } else {
        items.push({ label: 'Asignaturas', path: null });
      }
    } else if (section === 'materias') {
      if (slug) {
        items.push({ label: 'Materias', path: `${base}/materias` });
        items.push({ label: findName(slug, 'materia'), path: null });
      } else {
        items.push({ label: 'Materias', path: null });
      }
    } else if (section === 'plan-estudios') {
      if (slug) {
        items.push({ label: 'Plan de Estudios', path: `${base}/plan-estudios` });
        items.push({ label: findName(slug, 'modulo'), path: null });
      } else {
        items.push({ label: 'Plan de Estudios', path: null });
      }
    } else if (section === 'competencias') {
      const labelPlural = ctx
        ? ctx.labelLO.plural.charAt(0).toUpperCase() + ctx.labelLO.plural.slice(1)
        : 'Competencias';
      if (slug) {
        items.push({ label: labelPlural, path: `${base}/competencias` });
        items.push({ label: slug.toUpperCase(), path: null });
      } else {
        items.push({ label: labelPlural, path: null });
      }
    } else if (section === 'asistente-guia-docente') {
      items.push({ label: 'Asistente Guía Docente', path: null });
    }

    return items;
  };

  const handleNavigation = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
    window.scrollTo(0, 0);
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  const renderItem = (crumb: BreadcrumbItem, index: number) => {
    const label =
      index === 0 ? (
        <>
          <FontAwesomeIcon icon={faHome} className="mr-1 h-2.5 w-2.5" />
          Inicio
        </>
      ) : (
        crumb.label
      );

    if (crumb.path) {
      return (
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
          {label}
        </a>
      );
    }
    return (
      <span
        className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 font-semibold"
        style={{ color: PRIMARY_BLUE }}
      >
        {label}
      </span>
    );
  };

  if (isMobile) {
    return (
      <nav aria-label="Breadcrumb" className={`mb-3 text-xs ${className}`}>
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
                      <FontAwesomeIcon icon={faHome} className="mr-2 h-3 w-3" />
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
                      <FontAwesomeIcon icon={faHome} className="mr-2 h-3 w-3" />
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
    );
  }

  return (
    <nav aria-label="Breadcrumb" className={`text-xs ${className}`}>
      <ol className="inline-flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <span className="mx-1 font-bold text-gray-400">•</span>
            )}
            {renderItem(crumb, index)}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
