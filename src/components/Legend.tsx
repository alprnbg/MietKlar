import { RentType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface LegendProps {
  rentType: RentType;
}

export const Legend = ({ rentType }: LegendProps) => {
  const { t } = useLanguage();

  const apartmentLegendItems = [
    { color: '#1a9641', labelKey: 'affordable' as const, range: '< €1200' },
    { color: '#a6d96a', labelKey: 'moderate' as const, range: '€1200-1350' },
    { color: '#ffffbf', labelKey: 'medium' as const, range: '€1350-1500' },
    { color: '#fdae61', labelKey: 'expensive' as const, range: '€1500-1700' },
    { color: '#d7191c', labelKey: 'veryExpensive' as const, range: '> €1700' }
  ];

  const wgLegendItems = [
    { color: '#1a9641', labelKey: 'affordable' as const, range: '< €510' },
    { color: '#a6d96a', labelKey: 'moderate' as const, range: '€510-570' },
    { color: '#ffffbf', labelKey: 'medium' as const, range: '€570-630' },
    { color: '#fdae61', labelKey: 'expensive' as const, range: '€630-700' },
    { color: '#d7191c', labelKey: 'veryExpensive' as const, range: '> €700' }
  ];

  const dormitoryLegendItems = [
    { color: '#1a9641', labelKey: 'affordable' as const, range: '< €310' },
    { color: '#a6d96a', labelKey: 'moderate' as const, range: '€310-340' },
    { color: '#ffffbf', labelKey: 'medium' as const, range: '€340-370' },
    { color: '#fdae61', labelKey: 'expensive' as const, range: '€370-400' },
    { color: '#d7191c', labelKey: 'veryExpensive' as const, range: '> €400' }
  ];

  const legendItems =
    rentType === 'apartment' ? apartmentLegendItems :
    rentType === 'wg' ? wgLegendItems :
    dormitoryLegendItems;

  const title =
    rentType === 'apartment' ? t('averageRent') :
    rentType === 'wg' ? t('avgWgRent') :
    t('avgDormRent');

  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '24px',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>
        {title}
      </h4>
      {legendItems.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            fontSize: '13px'
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            background: item.color,
            border: '1px solid #666',
            marginRight: '8px',
            borderRadius: '4px'
          }} />
          <span style={{ fontWeight: '500', minWidth: '100px' }}>{t(item.labelKey)}</span>
          <span style={{ color: '#666', marginLeft: '8px' }}>{item.range}</span>
        </div>
      ))}
    </div>
  );
};
