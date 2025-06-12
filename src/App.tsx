import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import AsignaturaDetalle from './components/AsignaturaDetalle';
import PlanEstudios from './components/PlanEstudios';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Asignaturas from './components/Asignaturas';
import Competencias from './components/Competencias';
import CompetenciaDetalle from './components/CompetenciaDetalle';
import Materia from './components/Materia';
import Materias from './components/Materias';
import Modulo from './components/Modulo';
import AsistenteGuiaDocente from './components/AsistenteGuiaDocente';
import { useEffect } from 'react';

// Componente para manejar el scroll al principio en cada navegación
const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

// Tipos para TypeScript
interface Asignatura {
  nombre: string;
  curso: string;
  semestre: string;
  competencias: string[];
}

interface Materia {
  nombre: string;
  asignaturas: Asignatura[];
  'actividad-formativa': string[];
  evaluacion: {
    tipo: string;
    'ponderacion-minima': string;
    'ponderacion-maxima': string;
  }[];
}

// Componente principal de la aplicación
const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow pb-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/asistente-guia-docente"
              element={<AsistenteGuiaDocente />}
            />
            <Route path="/asignaturas" element={<Asignaturas />} />
            <Route
              path="/asignaturas/:nombre"
              element={<AsignaturaDetalle />}
            />
            <Route path="/plan-estudios" element={<PlanEstudios />} />
            <Route path="/plan-estudios/:moduloSlug" element={<Modulo />} />
            <Route
              path="/modulos"
              element={<Navigate to="/plan-estudios" replace />}
            />
            <Route
              path="/modulos/:moduloSlug"
              element={<Navigate to="/plan-estudios/:moduloSlug" replace />}
            />
            <Route path="/materias" element={<Materias />} />
            <Route path="/materias/:materiaSlug" element={<Materia />} />
            <Route path="/competencias" element={<Competencias />} />
            <Route path="/competencias/:id" element={<CompetenciaDetalle />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
