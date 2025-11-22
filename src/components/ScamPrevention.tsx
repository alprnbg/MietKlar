import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface ListingCheck {
  id: string;
  title: string;
  address: string;
  rent: number;
  imageUrl: string;
  riskScore: number;
  warnings: Warning[];
  status: 'safe' | 'suspicious' | 'danger';
}

interface Warning {
  type: 'price' | 'image' | 'contact' | 'verification';
  severity: 'low' | 'medium' | 'high';
  message: string;
}

const mockListings: ListingCheck[] = [
  {
    id: '1',
    title: '2-Zimmer Wohnung in Schwabing',
    address: 'Leopoldstraße 45, 80802 München',
    rent: 1850,
    imageUrl: 'apartment1.jpg',
    riskScore: 15,
    status: 'safe',
    warnings: []
  },
  {
    id: '2',
    title: '3-Zimmer Luxuswohnung Altstadt',
    address: 'Marienplatz 12, 80331 München',
    rent: 800,
    imageUrl: 'apartment2.jpg',
    riskScore: 85,
    status: 'danger',
    warnings: [
      {
        type: 'price',
        severity: 'high',
        message: 'Preis ist 65% unter dem Marktdurchschnitt für diese Lage!'
      },
      {
        type: 'image',
        severity: 'high',
        message: 'Bilder wurden auf 15 anderen Websites gefunden (Stock-Fotos)'
      },
      {
        type: 'contact',
        severity: 'medium',
        message: 'Vermieter verlangt Vorauszahlung ohne Besichtigung'
      },
      {
        type: 'verification',
        severity: 'high',
        message: 'Kontakt nicht verifiziert - Profil vor 2 Tagen erstellt'
      }
    ]
  },
  {
    id: '3',
    title: 'WG-Zimmer Maxvorstadt',
    address: 'Schellingstraße 33, 80799 München',
    rent: 650,
    imageUrl: 'room1.jpg',
    riskScore: 45,
    status: 'suspicious',
    warnings: [
      {
        type: 'image',
        severity: 'medium',
        message: 'Einige Bilder wurden online gefunden'
      },
      {
        type: 'verification',
        severity: 'low',
        message: 'Vermieter hat keine Dokumente hochgeladen'
      }
    ]
  }
];

const scamTips = [
  {
    icon: '💰',
    title: 'Niemals Geld im Voraus überweisen',
    description: 'Seriöse Vermieter verlangen keine Miete vor der Besichtigung.'
  },
  {
    icon: '🏠',
    title: 'Immer persönlich besichtigen',
    description: 'Bestehen Sie auf einer persönlichen Besichtigung. "Nur Online" ist ein Warnsignal.'
  },
  {
    icon: '📸',
    title: 'Rückwärts-Bildersuche nutzen',
    description: 'Prüfen Sie Fotos mit Google Bildersuche auf Stock-Fotos.'
  },
  {
    icon: '📝',
    title: 'Vertrag vor Zahlung prüfen',
    description: 'Lesen Sie den Mietvertrag sorgfältig durch, bevor Sie bezahlen.'
  }
];

export const ScamPrevention = () => {
  const { language } = useLanguage();
  const [selectedListing, setSelectedListing] = useState<ListingCheck | null>(null);

  const getStatusConfig = (status: ListingCheck['status']) => {
    switch (status) {
      case 'safe':
        return {
          label: language === 'de' ? '✅ Sicher' : '✅ Safe',
          color: '#4caf50',
          bg: '#e8f5e9'
        };
      case 'suspicious':
        return {
          label: language === 'de' ? '⚠️ Verdächtig' : '⚠️ Suspicious',
          color: '#ff9800',
          bg: '#fff3e0'
        };
      default:
        return {
          label: language === 'de' ? '🚨 Gefahr' : '🚨 Danger',
          color: '#f44336',
          bg: '#ffebee'
        };
    }
  };

  const getSeverityIcon = (severity: Warning['severity']) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      default: return '🟢';
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          🛡️ Scam Prevention
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
          {language === 'de'
            ? 'AI-gestützte Scam-Erkennung schützt Sie vor betrügerischen Anzeigen. Bleiben Sie sicher!'
            : 'AI-powered scam detection protects you from fraudulent listings. Stay safe!'}
        </p>
      </div>

      {/* Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {language === 'de' ? 'Scams blockiert' : 'Scams Blocked'}
          </div>
          <div style={{ fontSize: '48px', fontWeight: 'bold' }}>247</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
            {language === 'de' ? 'Letzter Monat' : 'Last month'}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {language === 'de' ? 'Verdächtige Anzeigen' : 'Suspicious Listings'}
          </div>
          <div style={{ fontSize: '48px', fontWeight: 'bold' }}>89</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
            {language === 'de' ? 'In Prüfung' : 'Under review'}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
            {language === 'de' ? 'Verifizierte Anzeigen' : 'Verified Listings'}
          </div>
          <div style={{ fontSize: '48px', fontWeight: 'bold' }}>1,234</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
            {language === 'de' ? 'Gesamt' : 'Total'}
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
          💡 {language === 'de' ? 'Sicherheitstipps' : 'Safety Tips'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {scamTips.map((tip, index) => (
            <div
              key={index}
              style={{
                padding: '20px',
                background: '#f5f5f5',
                borderRadius: '12px',
                border: '2px solid #e0e0e0'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tip.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                {tip.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Listing Checks */}
      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
          🔍 {language === 'de' ? 'Geprüfte Anzeigen' : 'Checked Listings'}
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {mockListings.map(listing => {
            const config = getStatusConfig(listing.status);
            return (
              <div
                key={listing.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: `3px solid ${listing.status === 'danger' ? '#f44336' : listing.status === 'suspicious' ? '#ff9800' : '#4caf50'}`,
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedListing(listing)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                      {listing.title}
                    </h3>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      📍 {listing.address}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1976d2' }}>
                      €{listing.rent}/Monat
                    </div>
                  </div>
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: config.bg,
                    color: config.color,
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    {config.label}
                  </div>
                </div>

                {/* Risk Score Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                      {language === 'de' ? 'Risiko-Score' : 'Risk Score'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: config.color }}>
                      {listing.riskScore}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${listing.riskScore}%`,
                      height: '100%',
                      background: config.color,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                {/* Warnings */}
                {listing.warnings.length > 0 && (
                  <div style={{
                    background: '#fff8e1',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '2px solid #ffc107'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>
                      ⚠️ {listing.warnings.length} {language === 'de' ? 'Warnungen' : 'Warnings'}
                    </div>
                    {listing.warnings.slice(0, 2).map((warning, idx) => (
                      <div key={idx} style={{ fontSize: '13px', color: '#666', marginBottom: '6px', display: 'flex', gap: '8px' }}>
                        <span>{getSeverityIcon(warning.severity)}</span>
                        <span>{warning.message}</span>
                      </div>
                    ))}
                    {listing.warnings.length > 2 && (
                      <div style={{ fontSize: '13px', color: '#1976d2', marginTop: '8px', fontWeight: '600' }}>
                        +{listing.warnings.length - 2} {language === 'de' ? 'weitere...' : 'more...'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedListing && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            padding: '20px'
          }}
          onClick={() => setSelectedListing(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>{selectedListing.title}</h2>
              <button
                onClick={() => setSelectedListing(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>
                {language === 'de' ? 'Alle Warnungen' : 'All Warnings'}
              </h3>
              {selectedListing.warnings.map((warning, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fff8e1',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '2px solid #ffc107'
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{getSeverityIcon(warning.severity)}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                      {warning.type.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                    {warning.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
