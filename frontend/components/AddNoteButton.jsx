import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
`;

const Button = styled(motion.button)`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background-color: var(--color-secondary);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 36px;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  animation: ${bounce} 2s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #e04876;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }
`;

const AddNoteButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      +
    </Button>
  );
};

export default AddNoteButton;
