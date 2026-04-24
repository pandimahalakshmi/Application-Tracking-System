import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode]   = useState(() => localStorage.getItem('darkMode') === 'true');
  const [compact, setCompact]     = useState(() => localStorage.getItem('compact') === 'true');
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || '#6366F1');

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.body.style.background = darkMode ? '#0F172A' : '#F8FAFF';
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('compact', compact);
    document.documentElement.setAttribute('data-compact', compact ? 'true' : 'false');
  }, [compact]);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
    document.documentElement.style.setProperty('--primary', themeColor);
  }, [themeColor]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, compact, setCompact, themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  // fallback if used outside provider
  if (!ctx) return {
    darkMode: false, setDarkMode: () => {},
    compact: false, setCompact: () => {},
    themeColor: '#6366F1', setThemeColor: () => {},
  };
  return ctx;
};
