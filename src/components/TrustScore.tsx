import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface UserProfile {
  id: string;
  name: string;
  type: 'tenant' | 'landlord';
  trustScore: number;
  totalReviews: number;
  verifications: {
    id: boolean;
    studentCard: boolean;
    workContract: boolean;
    previousRental: boolean;
  };
  reviews: Review[];
  memberSince: string;
  responseRate?: number;
  scamWarnings: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  category: 'cleanliness' | 'communication' | 'reliability' | 'overall';
  date: string;
  reviewerType: 'tenant' | 'landlord';
}

const mockProfiles: UserProfile[] = [
  {
    id: '1',
    name: 'Maria S.',
    type: 'tenant',
    trustScore: 4.8,
    totalReviews: 12,
    verifications: { id: true, studentCard: true, workContract: false, previousRental: true },
    memberSince: '2023-05-15',
    responseRate: 95,
    scamWarnings: 0,
    reviews: [
      { id: 'r1', rating: 5, comment: 'Sehr zuverlässige Mieterin, immer pünktlich mit der Miete!', category: 'reliability', date: '2024-12-10', reviewerType: 'landlord' },
      { id: 'r2', rating: 5, comment: 'Wohnung wurde sauber übergeben', category: 'cleanliness', date: '2024-11-20', reviewerType: 'landlord' },
    ]
  },
  {
    id: '2',
    name: 'Thomas M.',
    type: 'landlord',
    trustScore: 4.5,
    totalReviews: 28,
    verifications: { id: true, studentCard: false, workContract: false, previousRental: true },
    memberSince: '2022-03-20',
    responseRate: 88,
    scamWarnings: 0,
    reviews: [
      { id: 'r3', rating: 4, comment: 'Guter Vermieter, schnelle Reaktionszeit', category: 'communication', date: '2024-12-15', reviewerType: 'tenant' },
      { id: 'r4', rating: 5, comment: 'Faire Konditionen und transparente Kommunikation', category: 'overall', date: '2024-10-05', reviewerType: 'tenant' },
    ]
  },
  {
    id: '3',
    name: 'Anna K.',
    type: 'tenant',
    trustScore: 3.2,
    totalReviews: 5,
    verifications: { id: false, studentCard: false, workContract: false, previousRental: false },
    memberSince: '2025-01-01',
    responseRate: 45,
    scamWarnings: 2,
    reviews: [
      { id: 'r5', rating: 2, comment: 'Unzuverlässig bei Terminen', category: 'reliability', date: '2025-01-10', reviewerType: 'landlord' },
    ]
  },
];

export const TrustScore = () => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<'all' | 'tenant' | 'landlord'>('all');
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const filteredProfiles = mockProfiles.filter(p =>
    selectedType === 'all' || p.type === selectedType
  );

  const getTrustBadge = (score: number) => {
    if (score >= 4.5) return { label: '✅ Hoch Vertraut', color: '#4caf50', bg: '#e8f5e9' };
    if (score >= 3.5) return { label: '👍 Vertrauenswürdig', color: '#2196f3', bg: '#e3f2fd' };
    if (score >= 2.5) return { label: '⚠️ Vorsicht', color: '#ff9800', bg: '#fff3e0' };
    return { label: '🚫 Risiko', color: '#f44336', bg: '#ffebee' };
  };

  const getVerificationLabel = (key: keyof UserProfile['verifications']) => {
    const labels = {
      id: t('language') === 'de' ? 'Ausweis' : 'ID',
      studentCard: t('language') === 'de' ? 'Studentenausweis' : 'Student ID',
      workContract: t('language') === 'de' ? 'Arbeitsvertrag' : 'Work Contract',
      previousRental: t('language') === 'de' ? 'Miethistorie' : 'Rental History'
    };
    return labels[key];
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          ⭐ TrustScore
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
          {t('language') === 'de'
            ? 'Transparente Bewertungen von Mietern und Vermietern. Scam-Erkennung durch AI.'
            : 'Transparent reviews from tenants and landlords. AI-powered scam detection.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        {(['all', 'tenant', 'landlord'] as const).map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'transparent',
              borderBottom: selectedType === type ? '3px solid #1976d2' : '3px solid transparent',
              color: selectedType === type ? '#1976d2' : '#666',
              fontWeight: selectedType === type ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s'
            }}
          >
            {type === 'all' ? (t('language') === 'de' ? 'Alle' : 'All') :
              type === 'tenant' ? (t('language') === 'de' ? 'Mieter' : 'Tenants') :
                (t('language') === 'de' ? 'Vermieter' : 'Landlords')}
          </button>
        ))}
      </div>

      {/* Profiles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {filteredProfiles.map(profile => {
          const badge = getTrustBadge(profile.trustScore);
          return (
            <div
              key={profile.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: profile.scamWarnings > 0 ? '3px solid #f44336' : '1px solid #e0e0e0'
              }}
              onClick={() => setSelectedProfile(profile)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              {/* Profile Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                    {profile.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {profile.type === 'tenant' ? '🏠 ' : '🏢 '}
                    {profile.type === 'tenant' ? (t('language') === 'de' ? 'Mieter' : 'Tenant') : (t('language') === 'de' ? 'Vermieter' : 'Landlord')}
                  </div>
                </div>
                <div style={{
                  background: badge.bg,
                  color: badge.color,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}>
                  {badge.label}
                </div>
              </div>

              {/* Trust Score */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>
                    {profile.trustScore.toFixed(1)}
                  </div>
                  <div>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} style={{
                          fontSize: '20px',
                          color: star <= profile.trustScore ? '#ffc107' : '#e0e0e0'
                        }}>
                          ★
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {profile.totalReviews} {t('language') === 'de' ? 'Bewertungen' : 'reviews'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verifications */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                  {t('language') === 'de' ? 'Verifizierungen:' : 'Verifications:'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {Object.entries(profile.verifications).map(([key, verified]) => (
                    <div
                      key={key}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: verified ? '#e8f5e9' : '#f5f5f5',
                        color: verified ? '#2e7d32' : '#999',
                        border: `1px solid ${verified ? '#4caf50' : '#ddd'}`
                      }}
                    >
                      {verified ? '✓' : '✗'} {getVerificationLabel(key as keyof UserProfile['verifications'])}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e0e0e0'
              }}>
                {profile.responseRate && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {t('language') === 'de' ? 'Antwortrate' : 'Response Rate'}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                      {profile.responseRate}%
                    </div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {t('language') === 'de' ? 'Mitglied seit' : 'Member since'}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                    {new Date(profile.memberSince).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Scam Warning */}
              {profile.scamWarnings > 0 && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#ffebee',
                  borderRadius: '8px',
                  border: '2px solid #f44336'
                }}>
                  <div style={{ color: '#c62828', fontSize: '14px', fontWeight: 'bold' }}>
                    🚨 {profile.scamWarnings} {t('language') === 'de' ? 'Scam-Warnungen' : 'Scam Warnings'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
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
          onClick={() => setSelectedProfile(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '28px', color: '#333' }}>{selectedProfile.name}</h2>
              <button
                onClick={() => setSelectedProfile(null)}
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
                {t('language') === 'de' ? 'Bewertungen' : 'Reviews'}
              </h3>
              {selectedProfile.reviews.map(review => (
                <div
                  key={review.id}
                  style={{
                    background: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} style={{ fontSize: '16px', color: star <= review.rating ? '#ffc107' : '#e0e0e0' }}>
                          ★
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
                    {review.comment}
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
