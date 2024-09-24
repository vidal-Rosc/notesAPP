import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import NoteItem from '../components/NotesList';
import AddNoteModal from '../components/AddNoteModal';

const DashboardContainer = styled.div`
  padding: 20px 40px;
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666666;
  font-size: 18px;
  margin-top: 50px;
`;

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // Decodificar el access token para obtener el nombre de usuario
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.sub);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        if (error.response && error.response.status === 401) {
          // Token inválido o expirado
          toast.error('Your session has expired. Please log in again.');
          navigate('/login');
        } else {
          console.error('Error fetching user data:', error);
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
          <NotesGrid>
            {notes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </NotesGrid>
        ) : (
          <EmptyMessage>Aún no tienes notas. ¡Agrega una nueva!</EmptyMessage>
        )}
        <AddNoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onNoteAdded={handleNoteAdded}
        />
        <button onClick={handleAddNote}>+</button> {/* Estiliza este botón según tus necesidades */}
      </DashboardContainer>
    </>
  );
};

export default DashboardPage;
