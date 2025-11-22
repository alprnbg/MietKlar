import { UserRentData } from '../types';
import { munichDistrictsData } from '../data/munichDistricts_real';

interface UserRentDisplayProps {
  userData: UserRentData;
  onEdit: () => void;
  onDelete: () => void;
}

export const UserRentDisplay = ({ userData, onEdit, onDelete }: UserRentDisplayProps) => {
  const district = munichDistrictsData.features.find(
    f => f.properties.name === userData.district
  );

  const userPricePerSqm = userData.monthlyRent / userData.apartmentSize;
  const districtAvgRent = district?.properties.rentData.averageRent || 0;
  const districtFairRent = district?.properties.rentData.fairRent || 0;
  const districtPricePerSqm = district?.properties.rentData.pricePerSqm || 0;

  const diffFromAvg = userData.monthlyRent - districtAvgRent;
  const diffFromFair = userData.monthlyRent - districtFairRent;
  const diffPerSqm = userPricePerSqm - districtPricePerSqm;

  const getComparisonColor = (diff: number) => {
    if (diff < -100) return '#4caf50';
    if (diff < 0) return '#8bc34a';
    if (diff < 100) return '#ff9800';
    return '#d32f2f';
  };

  const getComparisonText = (diff: number) => {
    if (diff < 0) return `€${Math.abs(diff).toFixed(0)} günstiger`;
    return `€${diff.toFixed(0)} teurer`;
  };

  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      right: '24px',
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      width: '320px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Ihre Miete</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onEdit}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#1976d2',
              padding: '4px'
            }}
            title="Bearbeiten"
          >
            ✎
          </button>
          <button
            onClick={onDelete}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#d32f2f',
              padding: '4px'
            }}
            title="Löschen"
          >
            🗑
          </button>
        </div>
      </div>

      <div style={{
        background: '#f5f5f5',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
          {userData.district}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1976d2', marginBottom: '8px' }}>
          €{userData.monthlyRent}
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {userData.apartmentSize}m² • {userData.rooms} Zimmer • €{userPricePerSqm.toFixed(2)}/m²
        </div>
      </div>

      {district && (
        <>
          <div style={{
            background: getComparisonColor(diffFromAvg),
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '12px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: '500' }}>vs. Durchschnittsmiete</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>
              {getComparisonText(diffFromAvg)}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px' }}>
              Durchschnitt: €{districtAvgRent}
            </div>
          </div>

          <div style={{
            background: getComparisonColor(diffFromFair),
            color: 'white',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '12px',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: '500' }}>vs. Faire Miete</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>
              {getComparisonText(diffFromFair)}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px' }}>
              Fair: €{districtFairRent}
            </div>
          </div>

          <div style={{
            border: '1px solid #ddd',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '13px'
          }}>
            <div style={{ color: '#666', marginBottom: '4px' }}>Preis pro m²</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500' }}>Ihre: €{userPricePerSqm.toFixed(2)}</span>
              <span style={{ color: diffPerSqm > 0 ? '#d32f2f' : '#4caf50' }}>
                {diffPerSqm > 0 ? '+' : ''}€{diffPerSqm.toFixed(2)}
              </span>
            </div>
            <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
              Durchschnitt: €{districtPricePerSqm}
            </div>
          </div>
        </>
      )}

      {userData.description && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: '#f9f9f9',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#666'
        }}>
          <div style={{ fontWeight: '500', marginBottom: '4px', color: '#333' }}>Beschreibung:</div>
          {userData.description}
        </div>
      )}

      <div style={{
        marginTop: '12px',
        fontSize: '11px',
        color: '#999',
        textAlign: 'center'
      }}>
        Eingegeben am {new Date(userData.dateEntered).toLocaleDateString('de-DE')}
      </div>
    </div>
  );
};
