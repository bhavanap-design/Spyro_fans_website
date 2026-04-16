import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  // Read persisted theme; default to light
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('spyro-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Apply class to <html> and persist on every change
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('spyro-theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Convenience hook */
export const useTheme = () => useContext(ThemeContext);
