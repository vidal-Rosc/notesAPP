import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;700&family=Roboto:wght@300;500&display=swap');

  body {
    font-family: 'Roboto', sans-serif;
  }

  .modal-content {
    font-family: 'Lora', serif;
  }

  .add-note-button {
    font-size: 2rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .add-note-button:hover {
    background-color: #45a049;
    transform: scale(1.1);
  }

  .add-note-button:active {
    background-color: #3e8e41;
    transform: scale(0.95);
  }
`;

export default GlobalStyles;
