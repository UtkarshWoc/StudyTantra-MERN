import React, { useEffect, useState } from 'react';
import { ThemeContext } from './theme';

const readSavedTheme = () => {
  try {
    return localStorage.getItem('app-theme') || 'system';
  } catch {
    return 'system';
  }
};

const applyTheme = (theme) => {
  const root = window.document.documentElement;
  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(readSavedTheme);

  // Apply theme to the document element and persist it
  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem('app-theme', theme);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit
    }
  }, [theme]);

  // Follow OS changes while set to "system"
  useEffect(() => {
    if (theme !== 'system') return undefined;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
