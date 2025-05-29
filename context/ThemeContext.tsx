import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadThemeColor, saveThemeColor } from '../storage';

type Theme = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

const ThemeContext = createContext<Theme>({
  primaryColor: '#1a4060',
  setPrimaryColor: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [primaryColor, setPrimaryColorState] = useState('#1a4060');

  useEffect(() => {
    (async () => {
      const storedColor = await loadThemeColor();
      if (storedColor) setPrimaryColorState(storedColor);
    })();
  }, []);

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    saveThemeColor(color);
  };
  
  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};