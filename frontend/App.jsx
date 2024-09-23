import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
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
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
          {/* Puedes agregar más rutas aquí */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
