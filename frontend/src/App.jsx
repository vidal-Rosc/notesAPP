import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GlobalStyles from './styles/GlobalStyles';

const App = () => {

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
          {/* Agregar más rutas aquí en el futuro */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
