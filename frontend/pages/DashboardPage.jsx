import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import NoteList from '../components/NoteList'; // Cambiamos a NoteList
import AddNoteModal from '../components/AddNoteModal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
  }, []);

  const handleAddNote = () => {
    setIsModalOpen(true);
  };

  const handleNoteAdded = (newNote) => {
    setNotes([newNote, ...notes]); // Agrega la nueva nota al inicio de la lista
  };

  return (
    <>
      <Navbar username={username} />
      <DashboardContainer>
        {notes.length > 0 ? (
          <NoteList notes={notes} fetchNotes={fetchNotes} />
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

