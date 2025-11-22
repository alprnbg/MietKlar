import { useTheme } from '../contexts/ThemeContext';

export const ThemeSwitcher = () => {
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 1000,
        background: colors.surface,
        border: `2px solid ${colors.primary}`,
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        boxShadow: `0 4px 12px ${colors.shadow}`,
        transition: 'all 0.3s ease',
        color: colors.text
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.surfaceHover;
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.surface;
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};
