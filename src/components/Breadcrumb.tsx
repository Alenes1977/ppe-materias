import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import data from '../data/ppe.json';
import { PRIMARY_BLUE } from '../constants/colors';
import { generateSlug } from '../utils/stringUtils';

interface BreadcrumbItem {
  label: string;
  path: string | null; // null para el último elemento no clicable
}

// Función para encontrar el nombre real de una asignatura
const findAsignaturaName = (urlName: string): string => {
  // Primero decodificamos la URL para manejar caracteres especiales
  const decodedUrlName = decodeURIComponent(urlName);

  for (const modulo of data.modulos) {
    for (const materia of modulo.materias) {
      const asignatura = materia.asignaturas.find(
        (a) => generateSlug(a.nombre) === decodedUrlName,
      );
      if (asignatura) {
        return asignatura.nombre;
      }
    }
  }
  // Si no encontramos la asignatura, devolvemos el nombre decodificado y formateado
  return decodedUrlName.replace(/-/g, ' ');
};

// Función para encontrar el nombre real de un módulo
const findModuloName = (urlName: string): string => {
  // Decodificamos la URL para manejar caracteres especiales
  const decodedUrlName = decodeURIComponent(urlName);

  const modulo = data.modulos.find(
    (m) => generateSlug(m.nombre) === decodedUrlName,
  );
  return modulo ? modulo.nombre : decodedUrlName.replace(/-/g, ' ');
};

// Función para encontrar el nombre real de una materia
const findMateriaName = (urlName: string): string => {
  // Decodificamos la URL para manejar caracteres especiales
  const decodedUrlName = decodeURIComponent(urlName);

  for (const modulo of data.modulos) {
    const materia = modulo.materias.find(
      (m) => generateSlug(m.nombre) === decodedUrlName,
    );
    if (materia) {
      return materia.nombre;
    }
  }
  // Si no encontramos la materia, devolvemos el nombre decodificado y formateado
  return decodedUrlName.replace(/-/g, ' ');
};

// Función para generar las migas de pan según la ruta actual
const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const paths: BreadcrumbItem[] = [
    // Siempre incluir Inicio como primer elemento clicable
    { label: '', path: '/' },
  ];
  const pathSegments = pathname
    .split('/')
    .filter(Boolean)
    .map(decodeURIComponent);

  if (pathname === '/') {
    // Si estamos en la raíz, marcar 'Inicio' como no clicable
    paths[0].path = null;
  } else if (pathname === '/asignaturas') {
    paths.push({ label: 'Asignaturas', path: null });
  } else if (pathname.startsWith('/asignaturas/')) {
    paths.push({ label: 'Asignaturas', path: '/asignaturas' });
    // El nombre de la asignatura específica
    if (pathSegments[1]) {
      const asignaturaName = findAsignaturaName(pathSegments[1]);
      paths.push({
        label: asignaturaName,
        path: null,
      });
    }
  } else if (pathname === '/materias') {
    paths.push({ label: 'Materias', path: null });
  } else if (pathname.startsWith('/materias/')) {
    paths.push({ label: 'Materias', path: '/materias' });
    // El nombre de la materia específica
    if (pathSegments[1]) {
      const materiaName = findMateriaName(pathSegments[1]);
      paths.push({
        label: materiaName,
        path: null,
      });
    }
  } else if (pathname === '/plan-estudios') {
    paths.push({ label: 'Plan de Estudios', path: null });
  } else if (pathname.startsWith('/plan-estudios/')) {
    paths.push({ label: 'Plan de Estudios', path: '/plan-estudios' });
    // El nombre del módulo específico
    if (pathSegments[1]) {
      const moduloName = findModuloName(pathSegments[1]);
      paths.push({
        label: moduloName,
        path: null,
      });
    }
  } else if (pathname === '/competencias') {
    paths.push({ label: 'Competencias', path: null });
  }

  return paths;
};

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
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Función para manejar la navegación con scroll al inicio
  const handleNavigation = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
    window.scrollTo(0, 0);
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
                  <FontAwesomeIcon icon={faHome} className="mr-1 h-2.5 w-2.5" />
                )}
                {index === 0 ? 'Inicio' : crumb.label}
              </a>
            ) : (
              <span
                className="text-primary-blue inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 font-semibold"
                style={{ color: PRIMARY_BLUE }}
              >
                {index === 0 && (
                  <FontAwesomeIcon icon={faHome} className="mr-1 h-2.5 w-2.5" />
                )}
                {index === 0 ? 'Inicio' : crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
