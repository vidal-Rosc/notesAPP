import React from 'react';
import styled from 'styled-components';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const Nav = styled.nav`
  width: 100%;
  background-color: #6C63FF;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
`;

const WelcomeMessage = styled.span`
  font-size: 18px;
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background-color: #FF6584;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #e04876;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Navbar = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout'); // Llama al backend para invalidar el refresh token
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error during logout')
    } finally {
      // Eliminar tokens y redirigir al login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    }
  };

  return (
    <Nav>
      <WelcomeMessage>Welcome, {username}</WelcomeMessage>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </Nav>
  );
};

export default Navbar;
