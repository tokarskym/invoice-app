import { createContext, useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  h1, h2, h3, h4 {
    color: ${({ theme }) => theme.headingColor};
  }

  p {
    color: ${({ theme }) => theme.paragraphColor};
  }
`;

const themes = {
  dark: {
    headingColor: '#FFFF',
    paragraphColor: '#DFE3FA',
    invoiceItemColor: '#1E2139',
    draftColor: '#dfe3fa',
  },
  light: {
    headingColor: '#0C0E16',
    paragraphColor: '#888EB0',
    invoiceItemColor: '#FFFF',
    draftColor: '#373B53',
  },
};

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? themes.dark : themes.light;
  function toggleTheme() {
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
    setIsDarkMode(!isDarkMode);
  }
  useEffect(() => {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setIsDarkMode(isDarkMode);
  }, []);
  return (
    <ThemeContext.Provider value={[{ theme, isDarkMode }, toggleTheme]}>
      <GlobalStyle theme={theme} />
      {children}
    </ThemeContext.Provider>
  );
}
