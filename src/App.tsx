import { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { DistrictDetail } from './components/DistrictDetail';
import { Legend } from './components/Legend';
import { RentEntryForm } from './components/RentEntryForm';
import { UserRentDisplay } from './components/UserRentDisplay';
import { RentTypeSwitcher } from './components/RentTypeSwitcher';
import { RentIncreaseSimulator } from './components/RentIncreaseSimulator';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { RentRadar } from './components/RentRadar';
import { TrustScore } from './components/TrustScore';
import { LegalAICheck } from './components/LegalAICheck';
import { MoveInHub } from './components/MoveInHub';
import { ScamPrevention } from './components/ScamPrevention';
import { MunichDistrict, UserRentData, RentType } from './types';
import { getDistrictsWithRentType } from './utils/rentDataUtils';
import { useLanguage } from './i18n/LanguageContext';
import './App.css';

type ViewMode = 'map' | 'rentRadar' | 'trustScore' | 'legalAI' | 'moveInHub' | 'scamPrevention';

const STORAGE_KEY = 'munich-rent-user-data';
const RENT_TYPE_KEY = 'munich-rent-type';

function App() {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedDistrict, setSelectedDistrict] = useState<MunichDistrict | null>(null);
  const [showRentForm, setShowRentForm] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [userRentData, setUserRentData] = useState<UserRentData | null>(null);
  const [rentType, setRentType] = useState<RentType>('apartment');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUserRentData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load user rent data', e);
      }
    }

    const storedRentType = localStorage.getItem(RENT_TYPE_KEY) as RentType;
    if (storedRentType === 'apartment' || storedRentType === 'wg' || storedRentType === 'dormitory') {
      setRentType(storedRentType);
    }
  }, []);

  const handleRentTypeChange = (newType: RentType) => {
    setRentType(newType);
    localStorage.setItem(RENT_TYPE_KEY, newType);
    setSelectedDistrict(null); // Close detail panel when switching
  };

  const districtsData = getDistrictsWithRentType(rentType);

  const handleSaveRent = (data: UserRentData) => {
    setUserRentData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setShowRentForm(false);
  };

  const handleDeleteRent = () => {
    if (confirm('Möchten Sie Ihre Mietdaten wirklich löschen?')) {
      setUserRentData(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const menuItems = [
    { id: 'map' as ViewMode, icon: '🗺️', label: language === 'de' ? 'Karte' : 'Map' },
    { id: 'rentRadar' as ViewMode, icon: '🎯', label: 'RentRadar' },
    { id: 'trustScore' as ViewMode, icon: '⭐', label: 'TrustScore' },
    { id: 'legalAI' as ViewMode, icon: '⚖️', label: 'LegalAI' },
    { id: 'moveInHub' as ViewMode, icon: '🏠', label: 'Move-in Hub' },
    { id: 'scamPrevention' as ViewMode, icon: '🛡️', label: 'Scam Guard' }
  ];

  return (
    <div className="app">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>{t('appTitle')}</h1>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
              {t('appSubtitle')} {viewMode === 'map' && `- ${
                rentType === 'apartment' ? t('apartments') :
                rentType === 'wg' ? t('wgRooms') :
                t('dormitories')
              }`}
            </p>
          </div>
          {viewMode === 'map' && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowSimulator(true)}
                style={{
                  padding: '12px 20px',
                  background: 'white',
                  color: '#1976d2',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '16px' }}>📊</span>
                {t('rentSimulator')}
              </button>
              <button
                onClick={() => setShowRentForm(true)}
                style={{
                  padding: '12px 20px',
                  background: 'white',
                  color: '#1976d2',
                  border: '2px solid white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '16px' }}>+</span>
                {userRentData ? t('editRent') : t('addRent')}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Menu */}
      <nav style={{
        background: '#2c3e50',
        padding: '0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflowX: 'auto'
      }}>
        <div style={{
          display: 'flex',
          maxWidth: '1400px',
          margin: '0 auto',
          gap: '4px',
          padding: '8px 24px'
        }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setViewMode(item.id)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: viewMode === item.id
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: 'white',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: viewMode === item.id
                  ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== item.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      {viewMode === 'map' ? (
        <div className="map-container">
          <RentTypeSwitcher activeType={rentType} onChange={handleRentTypeChange} />
          <LanguageSwitcher />
          <Map onDistrictClick={setSelectedDistrict} districtsData={districtsData} rentType={rentType} />
          <Legend rentType={rentType} />

          {userRentData && (
            <UserRentDisplay
              userData={userRentData}
              onEdit={() => setShowRentForm(true)}
              onDelete={handleDeleteRent}
            />
          )}

          <DistrictDetail
            district={selectedDistrict}
            onClose={() => setSelectedDistrict(null)}
          />
        </div>
      ) : (
        <div className="content-view">
          {viewMode === 'rentRadar' ? (
            <RentRadar />
          ) : viewMode === 'trustScore' ? (
            <TrustScore />
          ) : viewMode === 'legalAI' ? (
            <LegalAICheck />
          ) : viewMode === 'moveInHub' ? (
            <MoveInHub />
          ) : (
            <ScamPrevention />
          )}
        </div>
      )}

      {showRentForm && (
        <RentEntryForm
          onClose={() => setShowRentForm(false)}
          onSubmit={handleSaveRent}
          existingData={userRentData || undefined}
          currentRentType={rentType}
        />
      )}

      {showSimulator && (
        <RentIncreaseSimulator
          onClose={() => setShowSimulator(false)}
          fairRent={selectedDistrict?.properties.rentData.fairRent}
        />
      )}
    </div>
  );
}

export default App;
