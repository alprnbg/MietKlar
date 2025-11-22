import { RentType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface LegendProps {
  rentType: RentType;
}

export const Legend = ({ rentType }: LegendProps) => {
  const { t, language } = useLanguage();
  const { colors } = useTheme();
  const isGerman = language === 'de';

  // Unfairness-based legend (same for all rent types)
  const unfairnessLegendItems = [
    {
      color: '#66bd63',
      label: isGerman ? 'Sehr fair' : 'Very Fair',
      range: isGerman ? '< -5% unter fair' : '< -5% below fair'
    },
    {
      color: '#a6d96a',
      label: isGerman ? 'Fair' : 'Fair',
      range: isGerman ? '-5% bis 0%' : '-5% to 0%'
    },
    {
      color: '#d9ef8b',
      label: isGerman ? 'Leicht über fair' : 'Slightly Above',
      range: isGerman ? '0% bis +5%' : '0% to +5%'
    },
    {
      color: '#fee08b',
      label: isGerman ? 'Mäßig unfair' : 'Moderately Unfair',
      range: isGerman ? '+5% bis +10%' : '+5% to +10%'
    },
    {
      color: '#fdae61',
      label: isGerman ? 'Unfair' : 'Unfair',
      range: isGerman ? '+10% bis +15%' : '+10% to +15%'
    },
    {
      color: '#f46d43',
      label: isGerman ? 'Sehr unfair' : 'Highly Unfair',
      range: isGerman ? '+15% bis +20%' : '+15% to +20%'
    },
    {
      color: '#d7191c',
      label: isGerman ? 'Extrem unfair' : 'Very Unfair',
      range: isGerman ? '> +20%' : '> +20%'
    }
  ];

  const title = isGerman ? 'Mietpreis-Fairness' : 'Rent Fairness';

  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '24px',
      background: colors.cardBg,
      padding: '16px',
      borderRadius: '12px',
      boxShadow: `0 4px 12px ${colors.shadow}`,
      zIndex: 1000,
      border: `2px solid ${colors.primary}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <img
          src={colors.logo}
          alt="Munich Logo"
          style={{
            height: '40px',
            width: 'auto'
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: colors.text }}>
          {title}
        </h4>
      </div>
      {unfairnessLegendItems.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '12px'
          }}
        >
          <div style={{
            width: '20px',
            height: '20px',
            background: item.color,
            border: `1px solid ${colors.border}`,
            marginRight: '8px',
            borderRadius: '4px'
          }} />
          <span style={{ fontWeight: '500', minWidth: '90px', color: colors.text }}>{item.label}</span>
          <span style={{ color: colors.textSecondary, marginLeft: '4px', fontSize: '11px' }}>{item.range}</span>
        </div>
      ))}
    </div>
  );
};
