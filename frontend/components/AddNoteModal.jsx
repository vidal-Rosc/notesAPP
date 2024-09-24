import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #6C63FF;
  color: #fff;
  border: none;
  border-radius: 5px;
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

const AddNoteModal = ({ onClose, onNoteAdded }) => {
  const [noteContent, setNoteContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return; // Evitar notas vacías

    try {
      // Envía una solicitud POST al backend con el contenido de la nueva nota
      const response = await axiosInstance.post('/notes', { content: noteContent });
      toast.success('Note added successfully!');
      onNoteAdded(response.data);  // Actualiza la lista de notas tras la creación
      setNoteContent('');          // Limpiar el contenido del textarea
      onClose();                   // Cierra el modal tras agregar la nota
    } catch (error) {
      console.error('Error al agregar nota:', error);
      console.error('Error adding note:', error);
      toast.error('An error occurred while adding the note. Please try again.');
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton className="add-note-button" onClick={onClose}>×</CloseButton>
        <h2>Add</h2>
        <form onSubmit={handleSubmit}>
          <TextArea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Write your note here"
            required
          />
          <SubmitButton type="submit">Add</SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddNoteModal;
