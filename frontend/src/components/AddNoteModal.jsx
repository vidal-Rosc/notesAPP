import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../utils/axiosInstance';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CloseButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;

  &:hover {
    color: #333;
  }
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  height: 100px;
`;

const SaveButton = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #45a049;
  }
`;

const AddNoteModal = ({ isOpen, onClose, onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [fontStyle, setFontStyle] = useState('normal'); // Selector de tipo de letra

  const handleSave = async () => {
    try {
      const newNote = { title, content, fontStyle }; // Asegúrate de enviar todos los datos necesarios
      const response = await axiosInstance.post('/notes', newNote);
      onNoteAdded(response.data); // Agregar la nueva nota a la lista en el dashboard
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error('Error al agregar la nota:', error);
    }
  };

  if (!isOpen) return null; // Si no está abierto, no mostrar nada

  return (
    <ModalContainer>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton> {/* Cerrar modal */}
        <h2>Add a new note</h2>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Actualizar título
        />
        <TextArea
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)} // Actualizar contenido
        />
        {/* Selector de tipo de letra */}
        <label htmlFor="fontStyle">Choose Font Style:</label>
        <select id="fontStyle" value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="bold">Bold</option>
        </select>
        <SaveButton onClick={handleSave}>Save</SaveButton> {/* Guardar nota */}
      </ModalContent>
    </ModalContainer>
  );
};

export default AddNoteModal;

