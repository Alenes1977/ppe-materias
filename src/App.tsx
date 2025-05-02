import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import data from './data/ppe.json';
import AsignaturaDetalle from './components/AsignaturaDetalle';
import PlanEstudios from './components/PlanEstudios';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Asignaturas from './components/Asignaturas';
import ModuloDetalle from './components/ModuloDetalle';
import Competencias from './components/Competencias';

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

interface Modulo {
  nombre: string;
  ects: number;
  materias: Materia[];
}

// Componente principal de la aplicación
const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-grow pt-16">
          {' '}
          {/* Añadido pt-16 para dar espacio al header fijo */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/asignaturas" element={<Asignaturas />} />
            <Route
              path="/asignaturas/:nombre"
              element={<AsignaturaDetalle />}
            />
            <Route path="/plan-estudios" element={<PlanEstudios />} />
            <Route path="/plan-estudios/:nombre" element={<ModuloDetalle />} />
            <Route path="/competencias" element={<Competencias />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
