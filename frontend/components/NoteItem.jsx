import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const NoteCard = styled(motion.div)`
  background-color: #f9f9f9;
  padding: 20px;
  border-left: 5px solid var(--color-primary);
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NoteTitle = styled.h3`
  margin: 0 0 10px 0;
  text-transform: capitalize;
  font-size: 22px;
  color: var(--color-primary);
`;

const NoteContent = styled.p`
  margin: 0;
  font-size: 16px;
  color: var(--color-text-secondary);
`;

const NoteItem = ({ note }) => {
  return (
    <NoteCard
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <NoteTitle>{note.title}</NoteTitle>
      <NoteContent>{note.content}</NoteContent>
    </NoteCard>
  );
};

export default NoteItem;
