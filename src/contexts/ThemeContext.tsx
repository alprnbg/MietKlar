import { createContext, useContext, useEffect, ReactNode } from 'react';

export type ThemeMode = 'dark';

interface ThemeColors {
  // Munich city colors - Dark mode only
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  border: string;
  headerBg: string;
  headerText: string;
  cardBg: string;
  shadow: string;
  logo: string;
}

const darkTheme: ThemeColors = {
  primary: '#FFCC00', // Munich yellow
  secondary: '#FFD700',
  background: '#000000',
  surface: '#1A1A1A',
  surfaceHover: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  border: '#333333',
  headerBg: 'linear-gradient(135deg, #000000 0%, #1A1A1A 100%)',
  headerText: '#FFCC00',
  cardBg: '#1A1A1A',
  shadow: 'rgba(255, 204, 0, 0.1)',
  logo: '/images/munich-logo-dark.jpeg'
};

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Apply dark theme to document body
    document.body.style.backgroundColor = darkTheme.background;
    document.body.style.color = darkTheme.text;
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', colors: darkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
