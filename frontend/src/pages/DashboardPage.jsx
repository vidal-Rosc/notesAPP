import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import NotesList from '../components/NotesList';
import AddNoteModal from '../components/AddNoteModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const WelcomeModal = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  text-align: center;
`;

const CloseButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c82333;
  }
`;

const DashboardContainer = styled.div`
  padding: 20px 40px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666666;
  font-size: 18px;
  margin-top: 50px;
`;

const AddNoteButton = styled.button`
  font-size: 2rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #45a049;
    transform: scale(1.1);
  }
`;

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true); // Estado para el modal de bienvenida
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get('/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error al obtener las notas:', error);
      toast.error('An error occurred while fetching notes. Please try again.');
    }
  };

  const fetchUser = () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.sub);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        if (error.response && error.response.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          navigate('/login');
        } else {
          toast.error('An error occurred while fetching user data.');
        }
      }
    }
  };

  useEffect(() => {
    fetchUser();
    fetchNotes();

    // Mostrar el modal de bienvenida solo si se trata de un nuevo registro
    const isNewUser = localStorage.getItem('isNewUser');

    // Mostrar el modal de bienvenida solo si se trata de un nuevo registro
    if (isNewUser) {
      setShowWelcomeModal(true);

      // Remover la bandera después de mostrar el modal
      localStorage.removeItem('isNewUser');

      // Cerrar el modal automáticamente después de 10 segundos
    const timer = setTimeout(() => {
        setShowWelcomeModal(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAddNote = () => {
    setIsModalOpen(true);
  };

  const handleNoteAdded = (newNote) => {
    setNotes([newNote, ...notes]); // Agrega la nueva nota al inicio de la lista
    setIsModalOpen(false); // Cierra el modal después de agregar la nota
  };

  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
    localStorage.removeItem('isNewUser'); // Borrar el flag manualmente si el usuario cierra el modal
  };

  return (
    <>
      <Navbar username={username} />
      <DashboardContainer>
        {showWelcomeModal && (
          <WelcomeModal>
            <h2>Welcome, {username}!</h2>
            <p>Thank you for registering. Tell me your Thoughts!</p>
            <CloseButton onClick={() => setShowWelcomeModal(false)}>X</CloseButton>
          </WelcomeModal>
        )}

        {notes.length > 0 ? (
          <NotesList notes={notes} fetchNotes={fetchNotes} /> 
        ) : (
          <EmptyMessage>No yet Notes. ¡Add a new one!</EmptyMessage>
        )}

        <AddNoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onNoteAdded={handleNoteAdded}
        />

        <AddNoteButton onClick={handleAddNote}>+</AddNoteButton>
      </DashboardContainer>
    </>
  );
};

export default DashboardPage;


