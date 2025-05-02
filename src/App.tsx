import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AsignaturaDetalle from './components/AsignaturaDetalle';
import PlanEstudios from './components/PlanEstudios';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Asignaturas from './components/Asignaturas';
import Competencias from './components/Competencias';
import Materia from './components/Materia';
import Materias from './components/Materias';

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
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/asignaturas" element={<Asignaturas />} />
            <Route
              path="/asignaturas/:nombre"
              element={<AsignaturaDetalle />}
            />
            <Route path="/plan-estudios" element={<PlanEstudios />} />
            <Route path="/materias" element={<Materias />} />
            <Route path="/materias/:materiaSlug" element={<Materia />} />
            <Route path="/competencias" element={<Competencias />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
