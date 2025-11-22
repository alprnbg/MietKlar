import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { loadUserRentEntries, getAggregatedStatsByStadtviertel, getRealUserEntries } from '../utils/userRentDatabase';
import { getViertelCenter } from '../utils/geoUtils';
import { getUnfairnessColor } from '../utils/colorScales';
import { RentDistributionChart } from './RentDistributionChart';
import { stadtviertelData } from '../data/stadtviertel';

import { RentType, POIAvailability } from '../types';

interface StadtviertelDetailProps {
  viertelId: string | null;
  onClose: () => void;
  userStadtviertel?: string; // The user's own stadtviertel for comparison
  rentType: RentType; // Current rent type mode
}

export const StadtviertelDetail = ({ viertelId, onClose, userStadtviertel, rentType }: StadtviertelDetailProps) => {
  const { language } = useLanguage();
  const { colors } = useTheme();
  const isGerman = language === 'de';

  if (!viertelId) return null;

  const allEntries = loadUserRentEntries(rentType); // Includes synthetic + real for this type
  const realUserEntries = getRealUserEntries(); // Only real user entries
  let viertelEntries = allEntries.filter(entry => entry.stadtviertel === viertelId);
  const aggregatedStats = getAggregatedStatsByStadtviertel(rentType);
  const stats = aggregatedStats.get(viertelId);

  const isUserViertel = viertelId === userStadtviertel;
  // Find the real user's entry for this viertel (for highlighting and fairness check)
  const realUserEntry = isUserViertel
    ? realUserEntries.find(entry => entry.stadtviertel === userStadtviertel)
    : null;

  // Sort entries to show user's entry at the top
  if (realUserEntry) {
    viertelEntries = viertelEntries.sort((a, b) => {
      const aIsUser = a.monthlyRent === realUserEntry.monthlyRent &&
        a.apartmentSize === realUserEntry.apartmentSize &&
        a.stadtviertel === realUserEntry.stadtviertel &&
        a.dateEntered === realUserEntry.dateEntered;
      const bIsUser = b.monthlyRent === realUserEntry.monthlyRent &&
        b.apartmentSize === realUserEntry.apartmentSize &&
        b.stadtviertel === realUserEntry.stadtviertel &&
        b.dateEntered === realUserEntry.dateEntered;

      if (aIsUser && !bIsUser) return -1;
      if (!aIsUser && bIsUser) return 1;
      return 0;
    });
  }


  // Get viertel center for Google Maps link
  const viertelCenter = getViertelCenter(viertelId);
  const googleMapsLink = viertelCenter
    ? `https://www.google.com/maps/@${viertelCenter[0]},${viertelCenter[1]},15z`
    : null;
  const googleEarthLink = viertelCenter
    ? `https://earth.google.com/web/@${viertelCenter[0]},${viertelCenter[1]},500a,1000d,35y,0h,0t,0r`
    : null;

  // Calculate fairness if this is the user's viertel
  let fairnessInfo = null;
  if (isUserViertel && realUserEntry && stats) {
    const userPricePerSqm = realUserEntry.pricePerSqm || (realUserEntry.monthlyRent / realUserEntry.apartmentSize);
    const avgPricePerSqm = stats.avgPricePerSqm;
    const difference = userPricePerSqm - avgPricePerSqm;
    const percentDifference = ((difference / avgPricePerSqm) * 100).toFixed(1);

    let fairnessLevel: 'excellent' | 'good' | 'fair' | 'high' | 'very_high';
    let fairnessColor: string;
    let fairnessIcon: string;
    let fairnessText: string;

    if (difference <= -2) {
      fairnessLevel = 'excellent';
      fairnessColor = '#4caf50';
      fairnessIcon = '🎉';
      fairnessText = isGerman ? 'Ausgezeichnet! Sehr günstig' : 'Excellent! Very affordable';
    } else if (difference <= 0) {
      fairnessLevel = 'good';
      fairnessColor = '#8bc34a';
      fairnessIcon = '✅';
      fairnessText = isGerman ? 'Gut! Unter dem Durchschnitt' : 'Good! Below average';
    } else if (difference <= 2) {
      fairnessLevel = 'fair';
      fairnessColor = '#ff9800';
      fairnessIcon = '⚖️';
      fairnessText = isGerman ? 'Fair - Im Durchschnitt' : 'Fair - Average';
    } else if (difference <= 4) {
      fairnessLevel = 'high';
      fairnessColor = '#ff5722';
      fairnessIcon = '⚠️';
      fairnessText = isGerman ? 'Hoch - Über dem Durchschnitt' : 'High - Above average';
    } else {
      fairnessLevel = 'very_high';
      fairnessColor = '#d32f2f';
      fairnessIcon = '🚨';
      fairnessText = isGerman ? 'Sehr hoch - Deutlich überteuert' : 'Very high - Significantly overpriced';
    }

    fairnessInfo = {
      fairnessLevel,
      fairnessColor,
      fairnessIcon,
      fairnessText,
      percentDifference,
      userPricePerSqm,
      avgPricePerSqm,
      difference
    };
  }

  // Get POI availability for this viertel
  const viertelFeature = (stadtviertelData as any).features?.find(
    (f: any) => f.properties?.vi_nummer === viertelId
  );
  const poiAvailability: POIAvailability | null = viertelFeature?.properties ? {
    hasSubway: viertelFeature.properties.hasSubway || false,
    hasHealthcare: viertelFeature.properties.hasHealthcare || false,
    hasSchools: viertelFeature.properties.hasSchools || false,
    hasKindergartens: viertelFeature.properties.hasKindergartens || false,
    hasSupermarkets: viertelFeature.properties.hasSupermarkets || false,
    hasRestaurants: viertelFeature.properties.hasRestaurants || false,
    hasParks: viertelFeature.properties.hasParks || false
  } : null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '450px',
      background: colors.background,
      boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
      zIndex: 2000,
      overflowY: 'auto',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <div style={{
        position: 'sticky',
        top: 0,
        background: colors.headerBg,
        color: colors.headerText,
        padding: '24px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
              {isGerman ? 'Stadtviertel' : 'Neighborhood'}
            </h2>
            <p style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600', opacity: 0.95 }}>
              {viertelId}
            </p>
            {(googleMapsLink || googleEarthLink) && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {googleMapsLink && (
                  <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  >
                    📍 Google Maps
                  </a>
                )}
                {googleEarthLink && (
                  <a
                    href={googleEarthLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  >
                    🌍 Google Earth
                  </a>
                )}
              </div>
            )}
          </div>
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
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            ×
          </button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Fairness Comparison - Only for User's Viertel */}
        {isUserViertel && fairnessInfo && (
          <div style={{
            background: `linear-gradient(135deg, ${fairnessInfo.fairnessColor}15 0%, ${fairnessInfo.fairnessColor}05 100%)`,
            border: `2px solid ${fairnessInfo.fairnessColor}`,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#333' }}>
              {isGerman ? 'Fair-Preis-Vergleich' : 'Fair Price Comparison'}
            </h3>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                {fairnessInfo.fairnessIcon}
              </div>
              <h4 style={{ color: fairnessInfo.fairnessColor, fontSize: '18px', margin: '0 0 4px 0' }}>
                {fairnessInfo.fairnessText}
              </h4>
              <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                {fairnessInfo.difference > 0 ? '+' : ''}{fairnessInfo.percentDifference}% {isGerman ? 'vom Durchschnitt' : 'from average'}
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  {isGerman ? 'Ihre Miete' : 'Your Rent'}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: fairnessInfo.fairnessColor }}>
                  €{fairnessInfo.userPricePerSqm.toFixed(2)}/m²
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  {isGerman ? 'Durchschnitt' : 'Average'}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#666' }}>
                  €{fairnessInfo.avgPricePerSqm}/m²
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Distribution Chart & Statistics */}
        {stats && viertelEntries.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <RentDistributionChart
              entries={viertelEntries}
              userEntry={realUserEntry}
            />
          </div>
        )}

        {/* Quick Statistics Summary */}
        {stats && (
          <div style={{
            background: colors.surface,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: colors.text }}>
              {isGerman ? 'Schnellübersicht' : 'Quick Summary'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                  {isGerman ? 'Anzahl Einträge' : 'Number of Entries'}:
                </span>
                <strong style={{ fontSize: '14px', color: colors.text }}>{stats.entryCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                  {isGerman ? 'Durchschnittliche Miete' : 'Average Rent'}:
                </span>
                <strong style={{ fontSize: '14px', color: colors.text }}>€{stats.avgRent}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                  {isGerman ? 'Preisspanne' : 'Price Range'}:
                </span>
                <strong style={{ fontSize: '14px', color: colors.text }}>€{stats.minRent} - €{stats.maxRent}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                  {isGerman ? 'Durchschnittliche Größe' : 'Average Size'}:
                </span>
                <strong style={{ fontSize: '14px', color: colors.text }}>{stats.avgM2} m²</strong>
              </div>

              {/* Divider */}
              <div style={{ borderTop: `2px solid ${colors.border}`, margin: '8px 0' }} />

              {/* Price comparison section */}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                  {isGerman ? 'Preis pro m²' : 'Price per m²'}:
                </span>
                <strong style={{ fontSize: '14px', color: colors.text }}>€{stats.avgPricePerSqm}/m²</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                  {isGerman ? 'Fairer Preis pro m²' : 'Fair Price per m²'}:
                </span>
                <strong style={{ fontSize: '14px', color: '#66bd63' }}>€{stats.fairPricePerSqm.toFixed(2)}/m²</strong>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderRadius: '8px',
                background: `${getUnfairnessColor(stats.unfairnessPercentage)}20`,
                border: `2px solid ${getUnfairnessColor(stats.unfairnessPercentage)}`
              }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>
                  {isGerman ? 'Fairness' : 'Fairness'}:
                </span>
                <strong style={{
                  fontSize: '16px',
                  color: getUnfairnessColor(stats.unfairnessPercentage)
                }}>
                  {stats.unfairnessPercentage >= 0 ? '+' : ''}{stats.unfairnessPercentage.toFixed(1)}%
                </strong>
              </div>
              <div style={{ fontSize: '12px', color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center' }}>
                {stats.unfairnessPercentage >= 20
                  ? (isGerman ? 'Extrem unfair - weit über dem fairen Preis' : 'Very unfair - far above fair price')
                  : stats.unfairnessPercentage >= 15
                  ? (isGerman ? 'Sehr unfair - deutlich über dem fairen Preis' : 'Highly unfair - significantly above fair price')
                  : stats.unfairnessPercentage >= 10
                  ? (isGerman ? 'Unfair - über dem fairen Preis' : 'Unfair - above fair price')
                  : stats.unfairnessPercentage >= 5
                  ? (isGerman ? 'Mäßig unfair - etwas über dem fairen Preis' : 'Moderately unfair - somewhat above fair price')
                  : stats.unfairnessPercentage >= 0
                  ? (isGerman ? 'Leicht über fair - nahe am fairen Preis' : 'Slightly above fair - close to fair price')
                  : stats.unfairnessPercentage >= -5
                  ? (isGerman ? 'Fair - am oder unter dem fairen Preis' : 'Fair - at or below fair price')
                  : (isGerman ? 'Sehr fair - deutlich unter dem fairen Preis' : 'Very fair - well below fair price')
                }
              </div>
            </div>
          </div>
        )}

        {/* POI Availability */}
        {poiAvailability && (
          <div style={{
            background: colors.surface,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            border: `1px solid ${colors.border}`
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: colors.text }}>
              {isGerman ? 'Verfügbare Einrichtungen' : 'Available Amenities'}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {[
                { key: 'hasSubway', icon: '🚇', label: isGerman ? 'U-Bahn' : 'Subway' },
                { key: 'hasHealthcare', icon: '🏥', label: isGerman ? 'Gesundheit' : 'Healthcare' },
                { key: 'hasSchools', icon: '🏫', label: isGerman ? 'Schulen' : 'Schools' },
                { key: 'hasKindergartens', icon: '👶', label: isGerman ? 'Kindergärten' : 'Kindergartens' },
                { key: 'hasSupermarkets', icon: '🛒', label: isGerman ? 'Supermärkte' : 'Supermarkets' },
                { key: 'hasRestaurants', icon: '🍽️', label: isGerman ? 'Restaurants' : 'Restaurants' },
                { key: 'hasParks', icon: '🌳', label: isGerman ? 'Parks' : 'Parks' }
              ].map(({ key, icon, label }) => {
                const available = poiAvailability[key as keyof POIAvailability];
                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: available ? '#e8f5e9' : '#ffebee',
                      border: `1px solid ${available ? '#4caf50' : '#ef5350'}`,
                      opacity: available ? 1 : 0.5
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: available ? '#2e7d32' : '#c62828'
                      }}>
                        {label}
                      </div>
                    </div>
                    <span style={{ fontSize: '16px' }}>
                      {available ? '✓' : '✗'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Rent Entries List */}
        {viertelEntries.length > 0 && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: colors.text }}>
                {isGerman ? 'Alle Mieteinträge' : 'All Rent Entries'}
              </h3>
              <div style={{
                background: '#1976d2',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {viertelEntries.length} {isGerman ? 'Einträge' : 'entries'}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {viertelEntries.map((entry, viertelIndex) => {
                const pricePerSqm = entry.pricePerSqm || (entry.monthlyRent / entry.apartmentSize);
                // Check if this entry is the real user's entry by comparing with realUserEntry
                const isUserEntry = realUserEntry &&
                  entry.monthlyRent === realUserEntry.monthlyRent &&
                  entry.apartmentSize === realUserEntry.apartmentSize &&
                  entry.stadtviertel === realUserEntry.stadtviertel &&
                  entry.dateEntered === realUserEntry.dateEntered;

                return (
                  <div
                    key={viertelIndex}
                    style={{
                      background: isUserEntry ? `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.surface} 100%)` : colors.surface,
                      border: isUserEntry ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      padding: '16px',
                      position: 'relative',
                      transition: 'box-shadow 0.2s'
                    }}
                  >
                    {isUserEntry && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: colors.primary,
                        color: '#000000',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {isGerman ? 'Ihre Miete' : 'Your Rent'}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: isUserEntry ? colors.primary : colors.text }}>
                          €{entry.monthlyRent}
                        </div>
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          {isGerman ? 'pro Monat' : 'per month'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: isUserEntry ? '90px' : '0' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: colors.text }}>
                          €{pricePerSqm.toFixed(2)}/m²
                        </div>
                        <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                          {entry.apartmentSize} m²
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      fontSize: '13px',
                      color: colors.textSecondary,
                      paddingTop: '12px',
                      borderTop: `1px solid ${colors.border}`
                    }}>
                      <div>
                        <span style={{ opacity: 0.7 }}>{isGerman ? 'Zimmer' : 'Rooms'}:</span> <strong>{entry.rooms}</strong>
                      </div>
                      <div>
                        <span style={{ opacity: 0.7 }}>{isGerman ? 'Baujahr' : 'Built'}:</span> <strong>{entry.yearBuilt}</strong>
                      </div>
                      {entry.hasBalcony && (
                        <div style={{ gridColumn: '1 / -1', color: '#4caf50' }}>
                          ✓ {isGerman ? 'Balkon/Terrasse' : 'Balcony/Terrace'}
                        </div>
                      )}
                      {entry.hasElevator && (
                        <div style={{ gridColumn: '1 / -1', color: '#4caf50' }}>
                          ✓ {isGerman ? 'Aufzug' : 'Elevator'}
                        </div>
                      )}
                      {entry.recentlyRenovated && (
                        <div style={{ gridColumn: '1 / -1', color: '#4caf50' }}>
                          ✓ {isGerman ? 'Kürzlich renoviert' : 'Recently renovated'}
                        </div>
                      )}
                      {entry.ownerType && (
                        <div style={{ gridColumn: '1 / -1', color: '#666', fontSize: '12px' }}>
                          {isGerman ? 'Vermieter' : 'Owner'}: {entry.ownerType === 'company'
                            ? (entry.ownerCompanyName || (isGerman ? 'Unternehmen' : 'Company'))
                            : (isGerman ? 'Privatperson' : 'Private')}
                        </div>
                      )}
                      {entry.apartmentSource && (
                        <div style={{ gridColumn: '1 / -1', color: '#666', fontSize: '12px' }}>
                          {isGerman ? 'Gefunden über' : 'Found via'}: {
                            entry.apartmentSource === 'immobilienscout24' ? 'ImmobilienScout24' :
                            entry.apartmentSource === 'immowelt' ? 'Immowelt' :
                            entry.apartmentSource === 'wg-gesucht' ? 'WG-Gesucht' :
                            entry.apartmentSource === 'ebay-kleinanzeigen' ? 'eBay Kleinanzeigen' :
                            entry.apartmentSource === 'facebook' ? 'Facebook' :
                            entry.apartmentSource === 'friends' ? (isGerman ? 'Freunde/Familie' : 'Friends/Family') :
                            entry.apartmentSource === 'newspaper' ? (isGerman ? 'Zeitung' : 'Newspaper') :
                            (isGerman ? 'Andere' : 'Other')
                          }
                        </div>
                      )}
                    </div>
                    {entry.description && (
                      <div style={{
                        marginTop: '12px',
                        fontSize: '13px',
                        color: colors.textSecondary,
                        fontStyle: 'italic',
                        paddingTop: '12px',
                        borderTop: `1px solid ${colors.border}`
                      }}>
                        "{entry.description}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viertelEntries.length === 0 && !stats && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: colors.textSecondary
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <p style={{ margin: 0 }}>
              {isGerman
                ? 'Noch keine Daten für dieses Stadtviertel verfügbar.'
                : 'No data available for this neighborhood yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
