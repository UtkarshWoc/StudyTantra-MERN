import { createContext, useContext } from 'react';

export const ThemeContext = createContext({ theme: 'dark', setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);
