import { createContext, useContext } from 'react';

export const ThemeContext = createContext({ theme: 'system', setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);
