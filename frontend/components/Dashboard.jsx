import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../utils/axiosInstance';
import Navbar from './Navbar';
import NoteItem from './NoteItem';
import AddNoteButton from './AddNoteButton';
import { motion } from 'framer-motion';

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
  color: var(--color-text-secondary);
  font-size: 18px;
  margin-top: 50px;
`;

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [username, setUsername] = useState('');

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/notes');
      setNotes(response.data);
    } catch (err) {
      console.error('Error al obtener las notas', err);
    }
  };

  const fetchUser = () => {
    // Decodificar el access token para obtener el nombre de usuario
    const token = localStorage.getItem('access_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUsername(payload.sub);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchNotes();
  }, []);

  const handleAddNote = () => {
    // Implementar la funcionalidad para agregar una nueva nota
    // Puede ser abrir un modal con un formulario
    // Por ahora, puedes redirigir a una página de creación de nota o usar un alert
    alert('Funcionalidad de agregar nota aún no implementada');
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
        <AddNoteButton onClick={handleAddNote} />
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
