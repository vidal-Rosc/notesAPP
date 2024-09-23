import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Nav = styled.nav`
  width: 100%;
  background-color: var(--color-primary);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const WelcomeMessage = styled.span`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: var(--color-secondary);
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #e04876;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  /* Efecto de ripple */
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(255,255,255,0.3) 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: center;
    transform: scale(10,10);
    opacity: 0;
    transition: transform 0.5s, opacity 1s;
  }

  &:active:after {
    transform: scale(0,0);
    opacity: 1;
    transition: 0s;
  }
`;

const Navbar = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar tokens del Local Storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Redirigir al login
    navigate('/login');
  };

  return (
    <Nav>
      <WelcomeMessage>Bienvenido, {username}</WelcomeMessage>
      <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
    </Nav>
  );
};

export default Navbar;
