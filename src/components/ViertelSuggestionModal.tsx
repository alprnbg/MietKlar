import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { RentType, POIAvailability } from '../types';
import { stadtviertelData } from '../data/stadtviertel';
import { getAggregatedStatsByStadtviertel } from '../utils/userRentDatabase';

interface ViertelSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViertelClick: (viertelId: string) => void;
  onHoverViertel?: (viertelId: string | null) => void;
}

interface ViertelWithData {
  viertelId: string;
  avgPricePerSqm: number;
  avgRent: number;
  entryCount: number;
  poi: POIAvailability;
}

export const ViertelSuggestionModal = ({ isOpen, onClose, onViertelClick, onHoverViertel }: ViertelSuggestionModalProps) => {
  const { language } = useLanguage();
  const { colors } = useTheme();
  const isGerman = language === 'de';

  // User preferences
  const [rentType, setRentType] = useState<RentType>('apartment');
  const [selectedPOIs, setSelectedPOIs] = useState<Set<keyof POIAvailability>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [hoveredViertel, setHoveredViertel] = useState<string | null>(null);

  // POI options
  const poiOptions: { key: keyof POIAvailability; icon: string; label: string; labelDE: string }[] = [
    { key: 'hasSubway', icon: '🚇', label: 'Subway', labelDE: 'U-Bahn' },
    { key: 'hasHealthcare', icon: '🏥', label: 'Healthcare', labelDE: 'Gesundheit' },
    { key: 'hasSchools', icon: '🏫', label: 'Schools', labelDE: 'Schulen' },
    { key: 'hasKindergartens', icon: '👶', label: 'Kindergartens', labelDE: 'Kindergärten' },
    { key: 'hasSupermarkets', icon: '🛒', label: 'Supermarkets', labelDE: 'Supermärkte' },
    { key: 'hasRestaurants', icon: '🍽️', label: 'Restaurants', labelDE: 'Restaurants' },
    { key: 'hasParks', icon: '🌳', label: 'Parks', labelDE: 'Parks' }
  ];

  const togglePOI = (key: keyof POIAvailability) => {
    const newSet = new Set(selectedPOIs);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setSelectedPOIs(newSet);
  };

  // Get matching viertels
  const matchingViertels = useMemo(() => {
    if (!showResults) return [];

    const rentStats = getAggregatedStatsByStadtviertel(rentType);
    const results: ViertelWithData[] = [];

    // Iterate through all stadtviertel features
    (stadtviertelData as any).features?.forEach((feature: any) => {
      const viertelId = feature.properties?.vi_nummer;
      if (!viertelId) return;

      // Get POI availability
      const poi: POIAvailability = {
        hasSubway: feature.properties?.hasSubway || false,
        hasHealthcare: feature.properties?.hasHealthcare || false,
        hasSchools: feature.properties?.hasSchools || false,
        hasKindergartens: feature.properties?.hasKindergartens || false,
        hasSupermarkets: feature.properties?.hasSupermarkets || false,
        hasRestaurants: feature.properties?.hasRestaurants || false,
        hasParks: feature.properties?.hasParks || false
      };

      // Check if viertel has all selected POIs
      const hasAllSelectedPOIs = Array.from(selectedPOIs).every(poiKey => poi[poiKey]);

      if (hasAllSelectedPOIs) {
        const stats = rentStats.get(viertelId);
        if (stats && stats.entryCount > 0) {
          results.push({
            viertelId,
            avgPricePerSqm: stats.avgPricePerSqm,
            avgRent: stats.avgRent,
            entryCount: stats.entryCount,
            poi
          });
        }
      }
    });

    // Sort by price per sqm (cheapest first)
    return results.sort((a, b) => a.avgPricePerSqm - b.avgPricePerSqm);
  }, [showResults, rentType, selectedPOIs]);

  const handleSearch = () => {
    if (selectedPOIs.size === 0) {
      alert(isGerman ? 'Bitte wählen Sie mindestens eine Einrichtung aus' : 'Please select at least one amenity');
      return;
    }
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedPOIs(new Set());
    setShowResults(false);
    setHoveredViertel(null);
  };

  const handleViertelItemClick = (viertelId: string) => {
    onViertelClick(viertelId);
    // Don't close the panel - let user explore multiple viertels
  };

  const handleViertelHover = (viertelId: string | null) => {
    setHoveredViertel(viertelId);
    if (onHoverViertel) {
      onHoverViertel(viertelId);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: showResults ? '900px' : '500px',
      background: colors.background,
      boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
      zIndex: 2500,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease-out',
      overflowY: 'auto'
    }}>
        {/* Header */}
        <div style={{
          background: colors.headerBg,
          color: colors.headerText,
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
            {isGerman ? '🏘️ Stadtviertel Vorschläge' : '🏘️ Neighborhood Suggestions'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              fontSize: '24px',
              cursor: 'pointer',
              color: colors.headerText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          flex: 1
        }}>
          {!showResults ? (
            // Preference Selection Form
            <div>
              <p style={{ color: colors.text, marginBottom: '24px', fontSize: '16px' }}>
                {isGerman
                  ? 'Wählen Sie Ihre gewünschten Einrichtungen und wir zeigen Ihnen die günstigsten Stadtviertel!'
                  : 'Select your preferred amenities and we\'ll show you the most affordable neighborhoods!'}
              </p>

              {/* Rent Type Selection */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: colors.text, fontSize: '16px', marginBottom: '12px' }}>
                  {isGerman ? 'Wohnungstyp' : 'Rent Type'}
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { value: 'apartment' as RentType, label: isGerman ? 'Wohnung' : 'Apartment', icon: '🏠' },
                    { value: 'wg' as RentType, label: 'WG', icon: '👥' },
                    { value: 'dormitory' as RentType, label: isGerman ? 'Wohnheim' : 'Dormitory', icon: '🏢' }
                  ].map(({ value, label, icon }) => (
                    <button
                      key={value}
                      onClick={() => setRentType(value)}
                      style={{
                        flex: 1,
                        padding: '16px',
                        border: rentType === value ? `3px solid ${colors.primary}` : `2px solid ${colors.border}`,
                        borderRadius: '12px',
                        background: rentType === value ? `${colors.primary}15` : colors.surface,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '16px',
                        fontWeight: rentType === value ? '700' : '500',
                        color: colors.text
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* POI Selection */}
              <div>
                <h3 style={{ color: colors.text, fontSize: '16px', marginBottom: '12px' }}>
                  {isGerman ? 'Gewünschte Einrichtungen' : 'Desired Amenities'}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  {poiOptions.map(({ key, icon, label, labelDE }) => (
                    <label
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        border: selectedPOIs.has(key) ? `3px solid ${colors.primary}` : `2px solid ${colors.border}`,
                        borderRadius: '12px',
                        background: selectedPOIs.has(key) ? `${colors.primary}15` : colors.surface,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        userSelect: 'none'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPOIs.has(key)}
                        onChange={() => togglePOI(key)}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: colors.primary
                        }}
                      />
                      <span style={{ fontSize: '24px' }}>{icon}</span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: selectedPOIs.has(key) ? '700' : '500',
                        color: colors.text,
                        flex: 1
                      }}>
                        {isGerman ? labelDE : label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '32px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '14px 28px',
                    border: `2px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: colors.surface,
                    color: colors.text,
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {isGerman ? 'Abbrechen' : 'Cancel'}
                </button>
                <button
                  onClick={handleSearch}
                  disabled={selectedPOIs.size === 0}
                  style={{
                    padding: '14px 28px',
                    border: 'none',
                    borderRadius: '8px',
                    background: selectedPOIs.size === 0 ? '#ccc' : colors.primary,
                    color: selectedPOIs.size === 0 ? '#666' : '#000',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: selectedPOIs.size === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {isGerman ? '🔍 Suchen' : '🔍 Search'}
                </button>
              </div>
            </div>
          ) : (
            // Results View (List + Map)
            <div>
              {/* Results Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '16px',
                background: colors.surface,
                borderRadius: '12px',
                border: `2px solid ${colors.primary}`
              }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: colors.text }}>
                    {isGerman ? 'Gefundene Stadtviertel' : 'Found Neighborhoods'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: colors.textSecondary }}>
                    {matchingViertels.length} {isGerman ? 'Ergebnisse' : 'results'} • {isGerman ? 'Sortiert nach Preis/m²' : 'Sorted by price/m²'}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '10px 20px',
                    border: `2px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: colors.surface,
                    color: colors.text,
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {isGerman ? '← Neue Suche' : '← New Search'}
                </button>
              </div>

              {matchingViertels.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: colors.textSecondary
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>😕</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px', color: colors.text }}>
                    {isGerman ? 'Keine Stadtviertel gefunden' : 'No neighborhoods found'}
                  </h3>
                  <p style={{ fontSize: '14px' }}>
                    {isGerman
                      ? 'Versuchen Sie es mit weniger Einrichtungen oder einem anderen Wohnungstyp.'
                      : 'Try selecting fewer amenities or a different rent type.'}
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {matchingViertels.map((viertel, index) => (
                    <div
                      key={viertel.viertelId}
                      onClick={() => handleViertelItemClick(viertel.viertelId)}
                      onMouseEnter={() => handleViertelHover(viertel.viertelId)}
                      onMouseLeave={() => handleViertelHover(null)}
                      style={{
                        padding: '16px',
                        background: hoveredViertel === viertel.viertelId ? colors.surfaceHover : colors.surface,
                        border: `2px solid ${hoveredViertel === viertel.viertelId ? colors.primary : colors.border}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '12px', color: colors.primary, fontWeight: '700', marginBottom: '4px' }}>
                            #{index + 1}
                          </div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: colors.text, fontWeight: '700' }}>
                            {viertel.viertelId}
                          </h4>
                          <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                            {viertel.entryCount} {isGerman ? 'Einträge' : 'entries'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '20px', fontWeight: '700', color: colors.primary }}>
                            €{viertel.avgPricePerSqm.toFixed(2)}/m²
                          </div>
                          <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                            Ø €{viertel.avgRent}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: `1px solid ${colors.border}`
                      }}>
                        {poiOptions.map(({ key, icon }) => viertel.poi[key] && (
                          <span
                            key={key}
                            style={{
                              fontSize: '16px',
                              padding: '4px 8px',
                              background: colors.surfaceHover,
                              borderRadius: '6px',
                              border: `1px solid ${colors.primary}40`
                            }}
                          >
                            {icon}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
    </div>
  );
};
