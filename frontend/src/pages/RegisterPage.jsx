import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/axiosInstance'
import logo from '../assets/logo.svg';
import { toast } from 'react-toastify';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${logo});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 300px;
`;

const LogoContainer = styled.div`
  margin-bottom: 20px;
`;

const RegisterForm = styled.form`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  text-align: center;
  color: #6C63FF;
  margin-bottom: 20px;
  font-size: 32px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  &:focus {
    border-color: #6C63FF;
    outline: none;
  }
`;

const RegisterButton = styled.button`
  background-color: #6C63FF;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #FF6584;
  }
`;

const LoginRedirect = styled.p`
  margin-top: 20px;
  color: #666;
  font-size: 14px;

  a {
    color: #FF6584;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    // Validar que los campos no estén vacíos
    if (!username || !password) {
      toast.error('Username and password are required.');
    return;
    }
    try {
      const response = await registerUser(username, password);
      // Para verificar si recibimos la respuesta correcta
      console.log(response); 
      
      if ((response.data.access_token && response.data.refresh_token)) {
        // Almacenar los tokens y establecer el usuario como nuevo
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('isNewUser', 'true'); // Marcar como nuevo usuario

        toast.success('Registration successful! Redirecting to the dashboard...');
        console.log("Navigating to dashboard...");
        // Redirigir al dashboard
        window.location.href = '/dashboard';
      } else {
        // Si no tenemos tokens, mostrar un mensaje de error
        toast.error('Registration successful, but no tokens returned. Please log in.');
        navigate('/login'); // Redirigir a login si no hay tokens
      }

    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Registration failed. Please check the data.');
      } else {
        console.error('Error during registration:', error);
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleRegister}>
      <LogoContainer>
          <img src={logo} alt="Logo" style={{ width: '100px', height: '100px' }} />
        </LogoContainer>
        <Title>Registration</Title>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <RegisterButton type="submit">Register</RegisterButton>
        <LoginRedirect>
          Already have an account? <a href="/login">Login here</a>
        </LoginRedirect>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default RegisterPage;


