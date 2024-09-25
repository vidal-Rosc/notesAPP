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
  font-family: 'Lora', serif;
  font-size: 24px;
  font-weight: bold;
`;

const TextArea = styled.textarea`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SaveButton = styled.button`
  background-color: #007bff;
  color: #fff;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
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
        <CloseButton onClick={onClose}>&times;</CloseButton> {/* Cierra el modal */}
        <h2>Add a new note</h2>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Actualiza título
        />
        <TextArea
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)} // Actualiza contenido
        />
        {/* Selector de tipo de letra */}
        <label htmlFor="fontStyle">Choose Font Style:</label>
        <select id="fontStyle" value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="bold">Bold</option>
        </select>
        <SaveButton onClick={handleSave}>Save</SaveButton> {/* Guarda la nota */}
      </ModalContent>
    </ModalContainer>
  );
};

export default AddNoteModal;

