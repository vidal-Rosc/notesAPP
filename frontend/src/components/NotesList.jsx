import React, { useState } from 'react';
import styled from 'styled-components';
import axios from '../utils/axiosInstance';


const NotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
    gap: 0.5rem;
  }
`;

const NoteCard = styled.div`
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.8rem;
  }
`;

const NoteContent = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;


const EditInput = styled.input`
  flex: 1;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1.2rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const EditButton = styled.button`
  background-color: #ffc107;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #e0a800;
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 0.3rem;
    font-size: 12px;
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #c82333;
  }
`;

const SaveButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #218838;
  }
`;

const NoNotesMessage = styled.p`
  font-size: 1.2rem;
  color: #666;
  text-align: center;
`;


const NotesList = ({ notes, fetchNotes }) => {
  const [editingNote, setEditingNote] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // Función para eliminar una nota
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/notes/${id}`);
      fetchNotes(); // Refresca la lista de notas
    } catch (error) {
      console.error('Error deleting note', error);
    }
  };

  // Función para editar una nota
  const handleEdit = (note) => {
    setEditingNote(note.id);
    setEditedContent(note.content);
  };

  // Función para guardar la edición de una nota
  const saveEdit = async (id) => {
    try {
      await axios.put(`/notes/${id}`, { content: editedContent });
      setEditingNote(null);
      fetchNotes(); // Refresca la lista de notas
    } catch (error) {
      console.error('Error updating note', error);
    }
  };

  return (
    <NotesContainer>
      {notes.length === 0 ? (
        <NoNotesMessage>No notes available.</NoNotesMessage>
      ) : (
        notes.map((note) => (
          <NoteCard key={note.id}>
            {editingNote === note.id ? (
              <EditInput
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            ) : (
              <NoteContent>
                {note.content.charAt(0).toUpperCase() + note.content.slice(1)}
              </NoteContent>
            )}
            <ButtonsContainer>
              {editingNote === note.id ? (
                <SaveButton onClick={() => saveEdit(note.id)}>Save</SaveButton>
              ) : (
                <EditButton onClick={() => handleEdit(note)}>Edit</EditButton>
              )}
              <DeleteButton onClick={() => handleDelete(note.id)}>
                Delete
              </DeleteButton>
            </ButtonsContainer>
          </NoteCard>
        ))
      )}
    </NotesContainer>
  );
};

export default NotesList;