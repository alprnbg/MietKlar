import { MunichDistrict } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface DistrictDetailProps {
  district: MunichDistrict | null;
  onClose: () => void;
}

export const DistrictDetail = ({ district, onClose }: DistrictDetailProps) => {
  const { t } = useLanguage();

  if (!district) return null;

  const { rentData } = district.properties;
  const savings = rentData.averageRent - rentData.fairRent;
  const savingsPercent = ((savings / rentData.averageRent) * 100).toFixed(1);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '400px',
      height: '100vh',
      background: 'white',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      padding: '24px',
      overflowY: 'auto',
      zIndex: 2000
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#666'
        }}
      >
        ×
      </button>

      <h2 style={{ marginTop: 0, marginBottom: '8px', color: '#333' }}>
        {district.properties.name}
      </h2>

      <p style={{ color: '#666', fontSize: '14px', marginTop: 0 }}>
        {rentData.description}
      </p>

      <div style={{
        background: '#f5f5f5',
        padding: '16px',
        borderRadius: '8px',
        marginTop: '24px'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', color: '#333' }}>
          {t('rentOverview')}
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '12px', background: 'rgba(255, 204, 0, 0.1)', borderRadius: '6px', border: '2px solid #FFCC00' }}>
            <span style={{ color: '#333', fontWeight: '600' }}>{t('pricePerSqm')}</span>
            <strong style={{ color: '#000', fontSize: '20px' }}>€{rentData.pricePerSqm}/m²</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#666' }}>{t('averageRentLabel')}</span>
            <strong style={{ color: '#666' }}>€{rentData.averageRent}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#666' }}>{t('fairRentLabel')}</span>
            <strong style={{ color: '#1a9641' }}>€{rentData.fairRent}</strong>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #ddd',
          paddingTop: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#666' }}>{t('minRent')}</span>
            <span>€{rentData.minRent}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>{t('maxRent')}</span>
            <span>€{rentData.maxRent}</span>
          </div>
        </div>
      </div>

      <div style={{
        background: savings > 0 ? '#e8f5e9' : '#fff3e0',
        padding: '16px',
        borderRadius: '8px',
        marginTop: '16px',
        border: `2px solid ${savings > 0 ? '#4caf50' : '#ff9800'}`
      }}>
        <h3 style={{ marginTop: 0, fontSize: '16px', color: '#333' }}>
          {t('savingsPotential')}
        </h3>
        {savings > 0 ? (
          <>
            <p style={{ margin: '8px 0', fontSize: '14px' }}>
              {t('savingsText')}
            </p>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50' }}>
              €{savings}
            </div>
            <div style={{ fontSize: '18px', color: '#4caf50' }}>
              ({savingsPercent}%)
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
              {t('perMonth')}
            </p>
          </>
        ) : (
          <p style={{ margin: '8px 0', fontSize: '14px' }}>
            {t('alreadyFair')}
          </p>
        )}
      </div>

      {rentData.pressureIndex && (
        <div style={{
          background: '#fff8e1',
          padding: '16px',
          borderRadius: '8px',
          marginTop: '16px',
          border: '2px solid #ffc107'
        }}>
          <h3 style={{ marginTop: 0, fontSize: '16px', color: '#333', marginBottom: '16px' }}>
            {t('pressureIndex')}
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>{t('listingCount')}</span>
              <strong style={{ color: '#f57c00' }}>{rentData.pressureIndex.listingCount}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>{t('daysOnline')}</span>
              <strong style={{ color: '#f57c00' }}>{rentData.pressureIndex.daysOnline} {t('days')}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>{t('growthRate')}</span>
              <strong style={{ color: rentData.pressureIndex.growthRate >= 6 ? '#d32f2f' : '#f57c00' }}>
                {rentData.pressureIndex.growthRate}%
              </strong>
            </div>

            <div style={{
              borderTop: '1px solid #ffe082',
              paddingTop: '12px',
              marginTop: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>{t('studentRate')}</span>
                <strong>{rentData.pressureIndex.studentPercentage}%</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>{t('highIncomeRate')}</span>
                <strong>{rentData.pressureIndex.highIncomePercentage}%</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4 style={{ marginTop: 0, color: '#1976d2' }}>
          {t('whatIsFairRent')}
        </h4>
        <p style={{ margin: '8px 0 0', lineHeight: '1.6', color: '#555' }}>
          {t('fairRentExplanation')}
        </p>
      </div>
    </div>
  );
};
