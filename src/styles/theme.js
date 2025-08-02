import { createGlobalStyle } from 'styled-components';

// Theme configuration with the specified yellow and white color palette
export const theme = {
  colors: {
    primary: '#FFEB3B', // Bright yellow as specified
    secondary: '#FFF9C4', // Light yellow
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    mediumGray: '#E0E0E0',
    darkGray: '#757575',
    black: '#212121',
    error: '#FF5252',
    success: '#4CAF50',
  },
  fonts: {
    body: '"Poppins", sans-serif',
    heading: '"Poppins", sans-serif',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  },
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  transition: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
};

/* Global styles for the application */
// Import fonts in the head of the HTML document instead of using @import in styled-components
export const GlobalStyle = createGlobalStyle`

  
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  html, body {
    height: 100%;
    margin: 0;
  }
  
  body {
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.white};
    color: ${theme.colors.black};
    line-height: 1.5;
    min-height: 100vh;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 600;
    margin-bottom: ${theme.space.md};
  }
  
  a {
    text-decoration: none;
    color: inherit;
    transition: ${theme.transition.default};
  }
  
  button {
    font-family: ${theme.fonts.body};
    cursor: pointer;
    border: none;
    border-radius: ${theme.borderRadius.md};
    transition: ${theme.transition.default};
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${theme.colors.lightGray};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.darkGray};
    border-radius: ${theme.borderRadius.full};
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary};
  }
`;