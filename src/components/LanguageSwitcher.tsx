import { useLanguage } from '../i18n/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div style={{
      position: 'absolute',
      top: '24px',
      right: '24px',
      zIndex: 1000,
      background: 'white',
      borderRadius: '8px',
      padding: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'flex',
      gap: '4px'
    }}>
      <button
        onClick={() => setLanguage('de')}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          background: language === 'de' ? '#1976d2' : 'transparent',
          color: language === 'de' ? 'white' : '#666',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        DE
      </button>
      <button
        onClick={() => setLanguage('en')}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          background: language === 'en' ? '#1976d2' : 'transparent',
          color: language === 'en' ? 'white' : '#666',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        EN
      </button>
    </div>
  );
};
