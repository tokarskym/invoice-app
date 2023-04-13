import { createContext, useEffect, useState } from 'react';

const themes = {
  dark: {
    backgroundColor: 'black',
    color: 'white',
  },
  light: {
    backgroundColor: 'red',
    color: 'black',
  },
};

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? themes.dark : themes.light; // if isDarkMode === true, set theme for dark
  function toggleTheme() {
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
    setIsDarkMode(!isDarkMode);
  }
  useEffect(() => {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setIsDarkMode(isDarkMode);
  }, []);
  return <ThemeContext.Provider value={[{ theme, isDarkMode }, toggleTheme]}>{children}</ThemeContext.Provider>;
}
