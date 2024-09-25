import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import GlobalStyles from './styles/GlobalStyles';

const App = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // tiempo en segundos
      // Verifica si el token ha expirado
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return false;
      }
      return true;
    } catch (error) {
      // Si no se puede decodificar el token, eliminarlo y retornar false
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return false;
    }
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
            element={isAuthenticated() ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
           <Route
            path="/register"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" /> : <RegisterPage />
            }
          />
          <Route
            path="/dashboard"
            element={isAuthenticated() ? <DashboardPage /> : <Navigate to="/login" />}
          />
          {/* Agregar más rutas aquí en el futuro */}
        </Routes>
      </Router>
    </>
  );
};

export default App;

