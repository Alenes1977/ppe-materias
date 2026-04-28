import { type FC, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { DegreeLayout, getLastDegreeId } from './context/DegreeContext';
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
import PlanBuilder from './components/PlanBuilder';

const ScrollToTop: FC = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
};

/**
 * Redirige desde / al último grado visitado, o muestra el selector de grado.
 * El selector de grado está implementado en Home.tsx cuando no hay degreeId.
 */
const RootRedirect: FC = () => {
  const lastId = getLastDegreeId();
  return lastId ? <Navigate to={`/${lastId}`} replace /> : <Home />;
};

const App: FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow pb-14">
          <Routes>
            {/* Pantalla raíz: selector de grado o redirección al último */}
            <Route path="/" element={<RootRedirect />} />

            {/* Herramienta de construcción de planes (sin DegreeLayout) */}
            <Route path="/plan-builder" element={<PlanBuilder />} />

            {/* Layout por grado: provee DegreeContext a todas las subrutas */}
            <Route
              path="/:degreeId"
              element={
                <DegreeLayout>
                  <Navigate to="inicio" replace />
                </DegreeLayout>
              }
            />
            <Route
              path="/:degreeId/*"
              element={
                <DegreeLayout>
                  <Routes>
                    <Route path="inicio" element={<Home />} />
                    <Route path="asignaturas" element={<Asignaturas />} />
                    <Route
                      path="asignaturas/:nombre"
                      element={<AsignaturaDetalle />}
                    />
                    <Route path="plan-estudios" element={<PlanEstudios />} />
                    <Route
                      path="plan-estudios/:moduloSlug"
                      element={<Modulo />}
                    />
                    <Route path="materias" element={<Materias />} />
                    <Route path="materias/:materiaSlug" element={<Materia />} />
                    <Route path="competencias" element={<Competencias />} />
                    <Route
                      path="competencias/:id"
                      element={<CompetenciaDetalle />}
                    />
                    <Route
                      path="asistente-guia-docente"
                      element={<AsistenteGuiaDocente />}
                    />
                    {/* Compatibilidad con rutas antiguas sin prefijo de grado */}
                    <Route
                      path="modulos"
                      element={<Navigate to="../plan-estudios" replace />}
                    />
                    <Route
                      path="modulos/:moduloSlug"
                      element={
                        <Navigate to="../plan-estudios/:moduloSlug" replace />
                      }
                    />
                  </Routes>
                </DegreeLayout>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
