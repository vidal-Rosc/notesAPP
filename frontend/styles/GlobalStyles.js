import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --color-primary: #6C63FF;        /* Púrpura Elegante */
    --color-secondary: #FF6584;      /* Rosa Vibrante */
    --color-background: #FFFFFF;     /* Blanco Puro */
    --color-text-primary: #333333;   /* Gris Oscuro */
    --color-text-secondary: #666666; /* Gris Medio */
  }

  body {
    margin: 0;
    padding: 0;
    background-color: var(--color-background);
    font-family: 'Arial', sans-serif;
    color: var(--color-text-primary);
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyles;
