import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../utils/axiosInstance';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
  transition: transform 0.3s ease; /* Para el efecto de movimiento */
  
  &:hover {
    transform: translateY(-10px); /* Mueve hacia arriba cuando el mouse está sobre el modal */
  }
`;

const ModalTitle = styled.h2`
  color: #6C63FF;
  margin-bottom: 20px;
  font-size: 24px;
`;

const ModalLabel = styled.label`
  color: #6C63FF;
  margin-bottom: 20px;
  font-size: 20px;
`;

const CloseButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #c82333;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  &:focus {
    border-color: #6C63FF;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  &:focus {
    border-color: #6C63FF; /* Color de borde como el login */
    outline: none;
  }
`;
// Estilos para el selector y la etiqueta
const Label = styled.label`
  display: block;
  text-align: left;
  font-size: 14px;
  margin-bottom: 10px;
  color: #6C63FF; /* Color del texto */
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  background-color: white;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%204%205%27%3E%3Cpath%20fill%3D%27%23333%27%20d%3D%27M2%200L0%202h4L2%200zm0%205L0%203h4L2%205z%27/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 10px;
  cursor: pointer;
  &:focus {
    border-color: #6C63FF;
    outline: none;
  }
`;

const SaveButton = styled.button`
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
        <ModalTitle>*** Note ***</ModalTitle>
        <Input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Actualiza título
        />
        <TextArea
          placeholder="Note..."
          value={content}
          onChange={(e) => setContent(e.target.value)} // Actualiza contenido
        />
        {/* Selector de tipo de letra */}
        <ModalLabel htmlFor="fontStyle">*** Font Style ***</ModalLabel>
        <Select id="fontStyle" value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="italic">Italic</option>
          <option value="bold">Bold</option>
        </Select>
        <SaveButton onClick={handleSave}>Save</SaveButton> {/* Guarda la nota */}
      </ModalContent>
    </ModalContainer>
  );
};

export default AddNoteModal;

