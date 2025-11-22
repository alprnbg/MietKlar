import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { munichDistrictsData } from '../data/munichDistricts_real';

interface SharedRent {
  id: string;
  district: string;
  monthlyRent: number;
  size: number;
  rooms: number;
  yearBuilt: number;
  pricePerSqm: number;
  isOutlier: boolean;
  outlierPercent?: number;
  submittedDate: string;
}

// Mock data for demo
const mockSharedRents: SharedRent[] = [
  { id: '1', district: 'Altstadt-Lehel', monthlyRent: 2100, size: 65, rooms: 2, yearBuilt: 2015, pricePerSqm: 32.3, isOutlier: true, outlierPercent: 27, submittedDate: '2025-01-15' },
  { id: '2', district: 'Schwabing-West', monthlyRent: 1650, size: 70, rooms: 2, yearBuilt: 1980, pricePerSqm: 23.6, isOutlier: false, submittedDate: '2025-01-14' },
  { id: '3', district: 'Maxvorstadt', monthlyRent: 1900, size: 75, rooms: 3, yearBuilt: 1995, pricePerSqm: 25.3, isOutlier: false, submittedDate: '2025-01-13' },
  { id: '4', district: 'Sendling', monthlyRent: 1200, size: 55, rooms: 2, yearBuilt: 1975, pricePerSqm: 21.8, isOutlier: false, submittedDate: '2025-01-12' },
  { id: '5', district: 'Pasing', monthlyRent: 1850, size: 60, rooms: 2, yearBuilt: 2010, pricePerSqm: 30.8, isOutlier: true, outlierPercent: 22, submittedDate: '2025-01-11' },
  { id: '6', district: 'Bogenhausen', monthlyRent: 2400, size: 85, rooms: 3, yearBuilt: 2018, pricePerSqm: 28.2, isOutlier: false, submittedDate: '2025-01-10' },
  { id: '7', district: 'Giesing', monthlyRent: 1100, size: 50, rooms: 1, yearBuilt: 1970, pricePerSqm: 22.0, isOutlier: false, submittedDate: '2025-01-09' },
  { id: '8', district: 'Neuhausen', monthlyRent: 1750, size: 68, rooms: 2, yearBuilt: 1990, pricePerSqm: 25.7, isOutlier: false, submittedDate: '2025-01-08' },
];

export const RentRadar = () => {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [showOutliersOnly, setShowOutliersOnly] = useState(false);

  const districts = ['all', ...munichDistrictsData.features.map(f => f.properties.name).sort()];

  const filteredRents = mockSharedRents.filter(rent => {
    if (selectedDistrict !== 'all' && rent.district !== selectedDistrict) return false;
    if (showOutliersOnly && !rent.isOutlier) return false;
    return true;
  });

  const outlierCount = mockSharedRents.filter(r => r.isOutlier).length;
  const avgRent = mockSharedRents.reduce((sum, r) => sum + r.monthlyRent, 0) / mockSharedRents.length;
  const avgPricePerSqm = mockSharedRents.reduce((sum, r) => sum + r.pricePerSqm, 0) / mockSharedRents.length;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          🎯 RentRadar
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
          {t('language') === 'de'
            ? 'Transparente Kira-Daten von echten Nutzern. AI-gestützte Outlier-Erkennung findet überhöhte Mieten.'
            : 'Transparent rent data from real users. AI-powered outlier detection finds overpriced rentals.'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '24px',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {t('language') === 'de' ? 'Geteilte Mieten' : 'Shared Rents'}
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{mockSharedRents.length}</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '24px',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {t('language') === 'de' ? '⚠️ Outliers Erkannt' : '⚠️ Outliers Detected'}
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{outlierCount}</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '24px',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {t('language') === 'de' ? 'Ø Miete' : 'Avg. Rent'}
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>€{Math.round(avgRent)}</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '24px',
          borderRadius: '12px',
          color: 'white'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {t('language') === 'de' ? 'Ø Preis/m²' : 'Avg. Price/sqm'}
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>€{avgPricePerSqm.toFixed(1)}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            {t('language') === 'de' ? 'Stadtbezirk filtern' : 'Filter by district'}
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            {districts.map(d => (
              <option key={d} value={d}>
                {d === 'all' ? (t('language') === 'de' ? 'Alle Bezirke' : 'All Districts') : d}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="outliers-only"
            checked={showOutliersOnly}
            onChange={(e) => setShowOutliersOnly(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="outliers-only" style={{ fontWeight: '600', color: '#d32f2f', cursor: 'pointer' }}>
            {t('language') === 'de' ? '⚠️ Nur Outliers anzeigen' : '⚠️ Show outliers only'}
          </label>
        </div>
      </div>

      {/* Rent List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredRents.map(rent => (
          <div
            key={rent.id}
            style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: rent.isOutlier ? '3px solid #d32f2f' : '1px solid #e0e0e0',
              position: 'relative'
            }}
          >
            {rent.isOutlier && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '24px',
                background: '#d32f2f',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)'
              }}>
                ⚠️ {rent.outlierPercent}% {t('language') === 'de' ? 'teurer als normal' : 'more expensive'}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                  {t('language') === 'de' ? 'Bezirk' : 'District'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                  📍 {rent.district}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                  {t('language') === 'de' ? 'Monatliche Miete' : 'Monthly Rent'}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: rent.isOutlier ? '#d32f2f' : '#1976d2' }}>
                  €{rent.monthlyRent}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                  {t('language') === 'de' ? 'Größe' : 'Size'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                  {rent.size}m² · {rent.rooms} {t('language') === 'de' ? 'Zimmer' : 'rooms'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                  {t('language') === 'de' ? 'Preis/m²' : 'Price/sqm'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                  €{rent.pricePerSqm.toFixed(2)}/m²
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                  {t('language') === 'de' ? 'Baujahr' : 'Year Built'}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                  🏗️ {rent.yearBuilt}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                  {t('language') === 'de' ? 'Eingereicht' : 'Submitted'}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {new Date(rent.submittedDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRents.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          color: '#999',
          background: 'white',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontSize: '18px' }}>
            {t('language') === 'de' ? 'Keine Ergebnisse gefunden' : 'No results found'}
          </div>
        </div>
      )}
    </div>
  );
};
