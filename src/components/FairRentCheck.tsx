import { UserRentData } from '../types';
import { getAggregatedStatsByStadtviertel } from '../utils/userRentDatabase';
import { useLanguage } from '../i18n/LanguageContext';

interface FairRentCheckProps {
  userData: UserRentData;
}

export const FairRentCheck = ({ userData }: FairRentCheckProps) => {
  const { language } = useLanguage();
  const isGerman = language === 'de';

  const aggregatedStats = getAggregatedStatsByStadtviertel();
  const viertelStats = userData.stadtviertel ? aggregatedStats.get(userData.stadtviertel) : null;

  if (!viertelStats) {
    return (
      <div style={{
        padding: '32px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#1976d2', marginBottom: '16px' }}>
          {isGerman ? 'Mietpreis-Analyse' : 'Rent Price Analysis'}
        </h2>
        <p style={{ color: '#666' }}>
          {isGerman
            ? 'Keine Vergleichsdaten für Ihr Stadtviertel verfügbar.'
            : 'No comparison data available for your neighborhood.'}
        </p>
      </div>
    );
  }

  const userPricePerSqm = userData.pricePerSqm || (userData.monthlyRent / userData.apartmentSize);
  const avgPricePerSqm = viertelStats.avgPricePerSqm;
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

  return (
    <div style={{
      padding: '32px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#1976d2', marginBottom: '24px', fontSize: '28px' }}>
        {isGerman ? 'Mietpreis-Analyse' : 'Rent Price Analysis'}
      </h2>

      {/* Fairness Indicator */}
      <div style={{
        background: `linear-gradient(135deg, ${fairnessColor}15 0%, ${fairnessColor}05 100%)`,
        border: `2px solid ${fairnessColor}`,
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>
          {fairnessIcon}
        </div>
        <h3 style={{ color: fairnessColor, fontSize: '24px', margin: '0 0 8px 0' }}>
          {fairnessText}
        </h3>
        <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
          {difference > 0 ? '+' : ''}{percentDifference}% {isGerman ? 'vom Durchschnitt' : 'from average'}
        </p>
      </div>

      {/* Comparison Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: '#f5f5f5',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            {isGerman ? 'Ihre Miete' : 'Your Rent'}
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1976d2' }}>
            €{userPricePerSqm.toFixed(2)}
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            {isGerman ? 'pro m²' : 'per m²'}
          </div>
        </div>

        <div style={{
          background: '#f5f5f5',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            {isGerman ? 'Durchschnitt in Ihrem Viertel' : 'Average in Your Area'}
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#666' }}>
            €{avgPricePerSqm}
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            {isGerman ? 'pro m²' : 'per m²'}
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div style={{
        borderTop: '1px solid #e0e0e0',
        paddingTop: '24px'
      }}>
        <h4 style={{ color: '#333', marginBottom: '16px', fontSize: '18px' }}>
          {isGerman ? 'Detaillierte Statistik für' : 'Detailed Statistics for'} {userData.stadtviertel}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#666' }}>{isGerman ? 'Anzahl Einträge' : 'Number of Entries'}:</span>
            <strong>{viertelStats.entryCount}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#666' }}>{isGerman ? 'Durchschnittliche Miete' : 'Average Rent'}:</span>
            <strong>€{viertelStats.avgRent}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#666' }}>{isGerman ? 'Preisspanne' : 'Price Range'}:</span>
            <strong>€{viertelStats.minRent} - €{viertelStats.maxRent}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#666' }}>{isGerman ? 'Durchschnittliche Größe' : 'Average Size'}:</span>
            <strong>{viertelStats.avgM2} m²</strong>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {fairnessLevel === 'high' || fairnessLevel === 'very_high' ? (
        <div style={{
          marginTop: '24px',
          background: '#fff3e0',
          border: '1px solid #ff9800',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h4 style={{ color: '#e65100', margin: '0 0 8px 0', fontSize: '16px' }}>
            💡 {isGerman ? 'Empfehlung' : 'Recommendation'}
          </h4>
          <p style={{ color: '#666', margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
            {isGerman
              ? 'Ihre Miete liegt über dem Durchschnitt. Prüfen Sie, ob Ihre Miete dem Mietspiegel entspricht oder ob eine Mietminderung möglich ist.'
              : 'Your rent is above average. Check if your rent complies with the rent index or if a rent reduction is possible.'}
          </p>
        </div>
      ) : null}
    </div>
  );
};
