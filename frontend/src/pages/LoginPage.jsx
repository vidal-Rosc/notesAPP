import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${logo});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 300px;
`;

const LoginForm = styled.form`
  background: rgba(255, 255, 255, 0.85);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 350px;
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  color: #6C63FF;
  margin-bottom: 30px;
  font-size: 32px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 10px;
  margin: 12px 0;
  border: 1px solid #666666;
  border-radius: 5px;
  font-size: 16px;
  &:focus {
    border-color: #6C63FF;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px 0;
  background-color: #6C63FF;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #FF6584;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const { access_token, refresh_token } = response.data;

      // Almacenar tokens en Local Storage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      // Redirigir al Dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Error en el inicio de sesión:', err);
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Notes</Title>
        <Input
          type="text"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Iniciar Sesión</Button>
      </LoginForm>
      <p>
        Not registered yet? <Link to="/register">Create an account</Link>
      </p>
    </LoginContainer>
  );
};

export default LoginPage;
