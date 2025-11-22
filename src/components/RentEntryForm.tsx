import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { UserRentData, RentType, OwnerType, ApartmentSource } from '../types';
import { findStadtviertel } from '../utils/geoUtils';
import { useTheme } from '../contexts/ThemeContext';
import 'leaflet/dist/leaflet.css';

interface RentEntryFormProps {
  onClose: () => void;
  onSubmit: (data: UserRentData) => void;
  existingData?: UserRentData;
  currentRentType: RentType;
}

// Map click handler component
function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const RentEntryForm = ({ onClose, onSubmit, existingData, currentRentType }: RentEntryFormProps) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState<Partial<UserRentData>>(existingData ? existingData : {
    district: '',
    rentType: currentRentType,
    monthlyRent: 0,
    apartmentSize: 0,
    rooms: 1,
    yearBuilt: new Date().getFullYear(),
    hasBalcony: false,
    hasElevator: false,
    recentlyRenovated: false,
    ownerType: 'private' as OwnerType,
    ownerCompanyName: '',
    apartmentSource: 'immobilienscout24' as ApartmentSource,
    description: '',
    coordinates: undefined,
    stadtviertel: undefined
  });

  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    existingData?.coordinates
      ? new LatLng(existingData.coordinates.lat, existingData.coordinates.lng)
      : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [contractPhoto, setContractPhoto] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'form' | 'upload'>('form');

  // Handle map click to select location
  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    const viertel = findStadtviertel(lng, lat);
    setSelectedLocation(new LatLng(lat, lng));
    setFormData(prev => ({
      ...prev,
      coordinates: { lat, lng },
      stadtviertel: viertel || undefined,
      district: viertel || '' // Use stadtviertel as district for compatibility
    }));
    // Clear location error if it exists
    if (errors.coordinates) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.coordinates;
        return newErrors;
      });
    }
  }, [errors.coordinates]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.coordinates) newErrors.coordinates = 'Bitte wählen Sie einen Standort auf der Karte';
    if (!formData.monthlyRent || formData.monthlyRent <= 0) newErrors.monthlyRent = 'Bitte geben Sie die Miete ein';
    if (!formData.apartmentSize || formData.apartmentSize <= 0) newErrors.apartmentSize = 'Bitte geben Sie die Wohnungsgröße ein';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Move to upload step
    setCurrentStep('upload');
  };

  const handleFinalSubmit = () => {
    if (!contractPhoto) {
      return;
    }

    const userData: UserRentData = {
      district: formData.stadtviertel || formData.district || 'Unknown',
      rentType: currentRentType,
      monthlyRent: formData.monthlyRent!,
      apartmentSize: formData.apartmentSize!,
      rooms: formData.rooms || 1,
      yearBuilt: formData.yearBuilt || new Date().getFullYear(),
      hasBalcony: formData.hasBalcony || false,
      hasElevator: formData.hasElevator || false,
      recentlyRenovated: formData.recentlyRenovated || false,
      ownerType: formData.ownerType || 'private',
      ownerCompanyName: formData.ownerType === 'company' ? formData.ownerCompanyName : undefined,
      apartmentSource: formData.apartmentSource || 'immobilienscout24',
      description: formData.description || '',
      dateEntered: new Date().toISOString(),
      coordinates: formData.coordinates,
      stadtviertel: formData.stadtviertel,
      pricePerSqm: formData.monthlyRent! / formData.apartmentSize!
    };

    onSubmit(userData);
  };

  const handleChange = (field: keyof UserRentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContractPhoto(file);
      setIsValidating(true);
      setValidationProgress(0);

      // Simulate validation process with progress
      const interval = setInterval(() => {
        setValidationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsValidating(false);
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const pricePerSqm = formData.monthlyRent && formData.apartmentSize
    ? (formData.monthlyRent / formData.apartmentSize).toFixed(2)
    : '0';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      padding: '20px'
    }}>
      <div style={{
        background: colors.background,
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        border: `2px solid ${colors.border}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentStep === 'upload' && (
              <button
                onClick={() => setCurrentStep('form')}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: colors.textSecondary,
                  padding: 0,
                  lineHeight: 1
                }}
              >
                ←
              </button>
            )}
            <h2 style={{ margin: 0, color: colors.primary }}>
              {currentStep === 'form'
                ? (currentRentType === 'apartment' ? 'Ihre Wohnung eingeben' : 'Ihr WG-Zimmer eingeben')
                : 'Mietvertrag hochladen'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: colors.textSecondary,
              padding: 0,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          justifyContent: 'center'
        }}>
          <div style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            background: colors.primary
          }} />
          <div style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            background: currentStep === 'upload' ? colors.primary : colors.border
          }} />
        </div>

        {currentStep === 'form' ? (
        <form onSubmit={handleFormSubmit}>
          {/* Map Location Picker */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: colors.text }}>
              Standort auf Karte wählen *
            </label>
            <div style={{
              width: '100%',
              height: '300px',
              border: `2px solid ${errors.coordinates ? '#d32f2f' : '#ddd'}`,
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <MapContainer
                center={[48.1351, 11.582]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onLocationSelect={handleLocationSelect} />
                {selectedLocation && (
                  <Marker position={selectedLocation} />
                )}
              </MapContainer>
            </div>
            {selectedLocation && formData.stadtviertel && (
              <div style={{
                background: '#e8f5e9',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#2e7d32',
                marginBottom: '8px'
              }}>
                ✓ Stadtviertel: <strong>{formData.stadtviertel}</strong>
              </div>
            )}
            {selectedLocation && !formData.stadtviertel && (
              <div style={{
                background: colors.surfaceHover,
                padding: '10px',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#e65100',
                marginBottom: '8px'
              }}>
                ⚠ Gewählter Standort liegt außerhalb der bekannten Stadtviertel
              </div>
            )}
            {errors.coordinates && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.coordinates}</span>}
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '8px 0 0 0' }}>
              Klicken Sie auf die Karte, um Ihren Standort zu markieren
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: colors.text }}>
                Monatliche Miete (€) *
              </label>
              <input
                type="number"
                value={formData.monthlyRent || ''}
                onChange={(e) => handleChange('monthlyRent', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.monthlyRent ? '#d32f2f' : '#ddd'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#FFFFFF',
                  color: '#000000'
                }}
                placeholder="z.B. 1200"
              />
              {errors.monthlyRent && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.monthlyRent}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: colors.text }}>
                Wohnungsgröße (m²) *
              </label>
              <input
                type="number"
                value={formData.apartmentSize || ''}
                onChange={(e) => handleChange('apartmentSize', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: `1px solid ${errors.apartmentSize ? '#d32f2f' : '#ddd'}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#FFFFFF',
                  color: '#000000'
                }}
                placeholder="z.B. 65"
              />
              {errors.apartmentSize && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.apartmentSize}</span>}
            </div>
          </div>

          {formData.monthlyRent && formData.apartmentSize && (
            <div style={{
              background: colors.surfaceHover,
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              color: colors.primary,
              border: `1px solid ${colors.border}`
            }}>
              <strong>Preis pro m²: €{pricePerSqm}</strong>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: colors.text }}>
                Anzahl Zimmer
              </label>
              <input
                type="number"
                value={formData.rooms || 1}
                onChange={(e) => handleChange('rooms', parseFloat(e.target.value))}
                min="1"
                step="0.5"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#FFFFFF',
                  color: '#000000'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: colors.text }}>
                Baujahr
              </label>
              <input
                type="number"
                value={formData.yearBuilt || ''}
                onChange={(e) => handleChange('yearBuilt', parseInt(e.target.value))}
                min="1800"
                max={new Date().getFullYear()}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#FFFFFF',
                  color: '#000000'
                }}
                placeholder={new Date().getFullYear().toString()}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', color: colors.text }}>
              Ausstattung
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.hasBalcony || false}
                  onChange={(e) => handleChange('hasBalcony', e.target.checked)}
                  style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: colors.text }}>Balkon/Terrasse</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.hasElevator || false}
                  onChange={(e) => handleChange('hasElevator', e.target.checked)}
                  style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: colors.text }}>Aufzug vorhanden</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.recentlyRenovated || false}
                  onChange={(e) => handleChange('recentlyRenovated', e.target.checked)}
                  style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: colors.text }}>Kürzlich renoviert</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', color: colors.text }}>
              Vermieter
            </label>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="ownerType"
                  value="private"
                  checked={formData.ownerType === 'private'}
                  onChange={(e) => handleChange('ownerType', e.target.value as OwnerType)}
                  style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: colors.text }}>Privatperson</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="ownerType"
                  value="company"
                  checked={formData.ownerType === 'company'}
                  onChange={(e) => handleChange('ownerType', e.target.value as OwnerType)}
                  style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: colors.text }}>Unternehmen</span>
              </label>
            </div>
            {formData.ownerType === 'company' && (
              <input
                type="text"
                value={formData.ownerCompanyName || ''}
                onChange={(e) => handleChange('ownerCompanyName', e.target.value)}
                placeholder="Name des Unternehmens"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#FFFFFF',
                  color: '#000000'
                }}
              />
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: colors.text }}>
              Wo haben Sie die Wohnung gefunden?
            </label>
            <select
              value={formData.apartmentSource || 'immobilienscout24'}
              onChange={(e) => handleChange('apartmentSource', e.target.value as ApartmentSource)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                background: '#FFFFFF',
                color: '#000000'
              }}
            >
              <option value="immobilienscout24">ImmobilienScout24</option>
              <option value="immowelt">Immowelt</option>
              <option value="wg-gesucht">WG-Gesucht</option>
              <option value="ebay-kleinanzeigen">eBay Kleinanzeigen</option>
              <option value="facebook">Facebook</option>
              <option value="friends">Freunde/Familie</option>
              <option value="newspaper">Zeitung</option>
              <option value="other">Andere</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: colors.text }}>
              Zusätzliche Beschreibung
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="z.B. Lage, Zustand, Besonderheiten..."
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                background: '#FFFFFF',
                color: '#000000'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                border: `2px solid ${colors.border}`,
                borderRadius: '6px',
                background: colors.surface,
                color: colors.text,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                background: colors.primary,
                color: '#000000',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Weiter →
            </button>
          </div>
        </form>
        ) : (
          /* Upload Step */
          <div>
            <div style={{
              textAlign: 'center',
              marginBottom: '32px',
              padding: '24px',
              background: colors.surface,
              borderRadius: '12px',
              border: `2px solid ${colors.border}`
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: colors.text }}>
                Mietvertrag bestätigen
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: colors.textSecondary }}>
                Bitte laden Sie ein Foto Ihres Mietvertrags hoch, um den Mietbetrag zu bestätigen
              </p>
            </div>

            {/* Contract Photo Upload */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                border: `2px dashed ${contractPhoto ? colors.primary : colors.border}`,
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                background: contractPhoto ? `${colors.primary}10` : colors.surface,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleContractUpload}
                  style={{ display: 'none' }}
                  id="contract-upload"
                />
                <label htmlFor="contract-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  {contractPhoto ? (
                    <div>
                      <div style={{ fontSize: '64px', marginBottom: '12px' }}>✓</div>
                      <div style={{ color: colors.text, fontWeight: '700', marginBottom: '8px', fontSize: '16px' }}>
                        {contractPhoto.name}
                      </div>
                      <div style={{ fontSize: '13px', color: colors.textSecondary }}>
                        Klicken Sie, um ein anderes Foto hochzuladen
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '64px', marginBottom: '12px' }}>📸</div>
                      <div style={{ color: colors.text, fontWeight: '700', marginBottom: '8px', fontSize: '16px' }}>
                        Vertragsfoto hochladen
                      </div>
                      <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '16px' }}>
                        Klicken oder ziehen Sie eine Datei hierher
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        background: colors.primary,
                        color: '#000000',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        Datei auswählen
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Validation Progress Bar */}
              {isValidating && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '15px', color: colors.text, fontWeight: '600' }}>
                      🔍 Vertrag wird validiert...
                    </span>
                    <span style={{ fontSize: '15px', color: colors.primary, fontWeight: '700' }}>
                      {validationProgress}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: colors.surface,
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: `2px solid ${colors.border}`
                  }}>
                    <div style={{
                      width: `${validationProgress}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                      transition: 'width 0.2s ease-out',
                      boxShadow: `0 0 15px ${colors.primary}60`
                    }} />
                  </div>
                  <div style={{
                    textAlign: 'center',
                    marginTop: '12px',
                    fontSize: '13px',
                    color: colors.textSecondary,
                    fontStyle: 'italic'
                  }}>
                    Prüfung der Vertragsdaten läuft...
                  </div>
                </div>
              )}

              {contractPhoto && !isValidating && (
                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: '#e8f5e9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '2px solid #4caf50'
                }}>
                  <span style={{ fontSize: '28px' }}>✓</span>
                  <div>
                    <div style={{ color: '#2e7d32', fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                      Vertrag erfolgreich validiert
                    </div>
                    <div style={{ color: '#2e7d32', fontSize: '12px' }}>
                      Die Mietdaten wurden bestätigt
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setCurrentStep('form')}
                style={{
                  padding: '12px 24px',
                  border: `2px solid ${colors.border}`,
                  borderRadius: '6px',
                  background: colors.surface,
                  color: colors.text,
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ← Zurück
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!contractPhoto || isValidating}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '6px',
                  background: (!contractPhoto || isValidating) ? colors.border : colors.primary,
                  color: (!contractPhoto || isValidating) ? colors.textSecondary : '#000000',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: (!contractPhoto || isValidating) ? 'not-allowed' : 'pointer',
                  opacity: (!contractPhoto || isValidating) ? 0.5 : 1
                }}
              >
                Speichern
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
