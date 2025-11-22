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
import { StartPage } from './components/StartPage';
import { StadtviertelDetail } from './components/StadtviertelDetail';
import { ViertelSuggestionModal } from './components/ViertelSuggestionModal';
import { MunichDistrict, UserRentData, RentType } from './types';
import { getDistrictsWithRentType } from './utils/rentDataUtils';
import { useLanguage } from './i18n/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { getViertelCenter } from './utils/geoUtils';
import {
  saveUserRentEntry,
  getLatestUserRentEntry,
  clearAllUserRentEntries
} from './utils/userRentDatabase';
import './App.css';

type ViewMode = 'map' | 'rentRadar' | 'trustScore' | 'legalAI' | 'moveInHub' | 'scamPrevention';
type FlowMode = 'mietspiegel' | 'checkRent' | null;

const RENT_TYPE_KEY = 'munich-rent-type';
const FLOW_MODE_KEY = 'munich-flow-mode';

function App() {
  const { language } = useLanguage();
  const { colors } = useTheme();
  const [flowMode, setFlowMode] = useState<FlowMode>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedDistrict, setSelectedDistrict] = useState<MunichDistrict | null>(null);
  const [selectedViertel, setSelectedViertel] = useState<string | null>(null);
  const [showRentForm, setShowRentForm] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [userRentData, setUserRentData] = useState<UserRentData | null>(null);
  const [rentType, setRentType] = useState<RentType>('apartment');
  const [mapRefreshTrigger, setMapRefreshTrigger] = useState(0);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [highlightedViertel, setHighlightedViertel] = useState<string | null>(null);
  const [zoomToViertel, setZoomToViertel] = useState<string | null>(null);

  useEffect(() => {
    // Load the latest user rent entry for display
    const latestEntry = getLatestUserRentEntry();
    if (latestEntry) {
      setUserRentData(latestEntry);
    }

    const storedRentType = localStorage.getItem(RENT_TYPE_KEY) as RentType;
    if (storedRentType === 'apartment' || storedRentType === 'wg' || storedRentType === 'dormitory') {
      setRentType(storedRentType);
    }

    const storedFlowMode = localStorage.getItem(FLOW_MODE_KEY) as FlowMode;
    if (storedFlowMode === 'mietspiegel' || storedFlowMode === 'checkRent') {
      setFlowMode(storedFlowMode);
    }
  }, []);

  const handleSelectFlow = (flow: 'mietspiegel' | 'checkRent') => {
    setFlowMode(flow);
    localStorage.setItem(FLOW_MODE_KEY, flow);

    // If checkRent mode and no user data, show rent form immediately
    if (flow === 'checkRent' && !userRentData) {
      setShowRentForm(true);
    }
  };

  const handleResetFlow = () => {
    setFlowMode(null);
    localStorage.removeItem(FLOW_MODE_KEY);
    setViewMode('map');
  };

  const handleRentTypeChange = (newType: RentType) => {
    setRentType(newType);
    localStorage.setItem(RENT_TYPE_KEY, newType);
    setSelectedDistrict(null); // Close detail panel when switching
  };

  const districtsData = getDistrictsWithRentType(rentType);

  // Calculate initial map center and zoom for checkRent mode
  const getInitialMapSettings = (): { center: [number, number], zoom: number } => {
    if (flowMode === 'checkRent' && userRentData?.stadtviertel) {
      const viertelCenter = getViertelCenter(userRentData.stadtviertel);
      if (viertelCenter) {
        return { center: viertelCenter, zoom: 14 };
      }
    }
    return { center: [48.1351, 11.582], zoom: 11 };
  };

  const mapSettings = getInitialMapSettings();

  const handleSaveRent = (data: UserRentData) => {
    saveUserRentEntry(data);
    setUserRentData(data);
    setShowRentForm(false);
    // Trigger map refresh to show new data
    setMapRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteRent = () => {
    if (confirm('Möchten Sie alle Ihre Mietdaten wirklich löschen?')) {
      clearAllUserRentEntries();
      setUserRentData(null);
      // Trigger map refresh to remove user data
      setMapRefreshTrigger(prev => prev + 1);
    }
  };

  // Menu items for navigation (currently commented out in UI)
  // const menuItems = [
  //   { id: 'map' as ViewMode, icon: '🗺️', label: language === 'de' ? 'Karte' : 'Map' },
  //   { id: 'rentRadar' as ViewMode, icon: '🎯', label: 'RentRadar' },
  //   { id: 'trustScore' as ViewMode, icon: '⭐', label: 'TrustScore' },
  //   { id: 'legalAI' as ViewMode, icon: '⚖️', label: 'LegalAI' },
  //   { id: 'moveInHub' as ViewMode, icon: '🏠', label: 'Move-in Hub' },
  //   { id: 'scamPrevention' as ViewMode, icon: '🛡️', label: 'Scam Guard' }
  // ];

  // Show StartPage if no flow selected
  if (!flowMode) {
    return <StartPage onSelectFlow={handleSelectFlow} />;
  }

  return (
    <div className="app" style={{ background: colors.background, minHeight: '100vh' }}>
      <header className="header" style={{ background: colors.headerBg }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={colors.logo}
              alt="Munich Logo"
              style={{
                height: '50px',
                width: 'auto',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
              onError={(e) => {
                // Fallback if image doesn't load
                e.currentTarget.style.display = 'none';
              }}
            />
            <button
              onClick={handleResetFlow}
              style={{
                background: 'rgba(0,0,0,0.1)',
                border: `1px solid ${colors.primary}`,
                borderRadius: '6px',
                color: colors.headerText,
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500'
              }}
            >
              ← {language === 'de' ? 'Zurück' : 'Back'}
            </button>
            <div>
              <h1 style={{ fontSize: '28px', marginBottom: '4px', color: colors.headerText }}>
                {flowMode === 'mietspiegel'
                  ? (language === 'de' ? 'Mietspiegel' : 'Rent Index')
                  : (language === 'de' ? 'Mietpreis-Prüfung' : 'Rent Check')}
              </h1>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9, color: colors.headerText }}>
                {flowMode === 'mietspiegel'
                  ? (language === 'de' ? 'Übersicht der Mietpreise in München' : 'Overview of rent prices in Munich')
                  : (language === 'de' ? 'Prüfen Sie, ob Ihre Miete fair ist' : 'Check if your rent is fair')}
              </p>
            </div>
          </div>
          {viewMode === 'map' && flowMode === 'checkRent' && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {userRentData && (
                <button
                  onClick={() => setShowSuggestionModal(true)}
                  style={{
                    padding: '12px 20px',
                    background: 'rgba(255,255,255,0.2)',
                    color: colors.headerText,
                    border: `2px solid ${colors.primary}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.primary;
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = colors.headerText;
                  }}
                >
                  <span style={{ fontSize: '16px' }}>🏘️</span>
                  {language === 'de' ? 'Viertel finden' : 'Find Neighborhood'}
                </button>
              )}
              <button
                onClick={() => setShowRentForm(true)}
                style={{
                  padding: '12px 20px',
                  background: colors.primary,
                  color: '#000000',
                  border: `2px solid ${colors.primary}`,
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
                {userRentData ? (language === 'de' ? 'Bearbeiten' : 'Edit') : (language === 'de' ? 'Miete eingeben' : 'Enter Rent')}
              </button>
            </div>
          )}
        </div>
      </header>

      {/*
      Navigation Menu
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
      */}


      {/* Main Content */}
      {viewMode === 'map' ? (
        flowMode === 'checkRent' && !userRentData ? (
          // Show placeholder when no rent data in checkRent mode
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 120px)',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '80px', marginBottom: '24px' }}>📍</div>
            <h2 style={{ fontSize: '32px', color: colors.primary, marginBottom: '16px' }}>
              {language === 'de' ? 'Geben Sie Ihre Miete ein' : 'Enter Your Rent'}
            </h2>
            <p style={{ fontSize: '18px', color: colors.textSecondary, marginBottom: '32px', maxWidth: '600px' }}>
              {language === 'de'
                ? 'Um Ihre Mietpreise mit anderen zu vergleichen und faire Viertel zu finden, geben Sie bitte zuerst Ihre Mietdaten ein.'
                : 'To compare your rent prices with others and find fair neighborhoods, please enter your rent data first.'}
            </p>
            <button
              onClick={() => setShowRentForm(true)}
              style={{
                padding: '16px 32px',
                background: colors.primary,
                color: '#000000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 204, 0, 0.3)'
              }}
            >
              {language === 'de' ? '+ Miete eingeben' : '+ Enter Rent'}
            </button>
          </div>
        ) : (
        <div className="map-container">
          {/* Show rent type switcher for both modes */}
          <RentTypeSwitcher activeType={rentType} onChange={handleRentTypeChange} />
          {flowMode === 'mietspiegel' && (
            <LanguageSwitcher />
          )}
          <Map
            districtsData={districtsData}
            rentType={rentType}
            refreshTrigger={mapRefreshTrigger}
            highlightStadtviertel={
              highlightedViertel ||
              (flowMode === 'checkRent' && userRentData ? userRentData.stadtviertel : undefined)
            }
            onViertelClick={flowMode === 'checkRent' ? setSelectedViertel : undefined}
            initialCenter={mapSettings.center}
            initialZoom={mapSettings.zoom}
            zoomToViertel={zoomToViertel}
            onZoomComplete={() => setZoomToViertel(null)}
          />
          <Legend />

          {userRentData && flowMode === 'checkRent' && userRentData.rentType === rentType && (
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

          {flowMode === 'checkRent' && (
            <StadtviertelDetail
              viertelId={selectedViertel}
              onClose={() => setSelectedViertel(null)}
              userStadtviertel={userRentData?.stadtviertel}
              rentType={rentType}
            />
          )}
        </div>
        )
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

      <ViertelSuggestionModal
        isOpen={showSuggestionModal}
        onClose={() => {
          setShowSuggestionModal(false);
          setHighlightedViertel(null);
        }}
        onViertelClick={(viertelId) => {
          setSelectedViertel(viertelId);
          setViewMode('map');
          setZoomToViertel(viertelId);
        }}
        onHoverViertel={setHighlightedViertel}
      />
    </div>
  );
}

export default App;
