import { RentType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface RentTypeSwitcherProps {
  activeType: RentType;
  onChange: (type: RentType) => void;
}

export const RentTypeSwitcher = ({ activeType, onChange }: RentTypeSwitcherProps) => {
  const { t } = useLanguage();

  return (
    <div style={{
      position: 'absolute',
      top: '24px',
      left: '24px',
      zIndex: 1000,
      background: 'white',
      borderRadius: '12px',
      padding: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      gap: '4px'
    }}>
      <button
        onClick={() => onChange('apartment')}
        style={{
          padding: '12px 20px',
          border: 'none',
          borderRadius: '8px',
          background: activeType === 'apartment' ? '#1976d2' : 'transparent',
          color: activeType === 'apartment' ? 'white' : '#666',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '18px' }}>🏠</span>
        {t('apartmentsBtn')}
      </button>
      <button
        onClick={() => onChange('wg')}
        style={{
          padding: '12px 20px',
          border: 'none',
          borderRadius: '8px',
          background: activeType === 'wg' ? '#1976d2' : 'transparent',
          color: activeType === 'wg' ? 'white' : '#666',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '18px' }}>👥</span>
        {t('wgRoomsBtn')}
      </button>
      <button
        onClick={() => onChange('dormitory')}
        style={{
          padding: '12px 20px',
          border: 'none',
          borderRadius: '8px',
          background: activeType === 'dormitory' ? '#1976d2' : 'transparent',
          color: activeType === 'dormitory' ? 'white' : '#666',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '18px' }}>🏫</span>
        {t('dormitoriesBtn')}
      </button>
    </div>
  );
};
