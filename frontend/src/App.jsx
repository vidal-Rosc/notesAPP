import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GlobalStyles from './styles/GlobalStyles';

const App = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
  };

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" /> : <LoginPage />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated() ? <DashboardPage /> : <Navigate to="/login" />
            }
          />
          {/* Agregar más rutas aquí en el futuro */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
