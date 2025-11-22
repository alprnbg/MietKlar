import { useState } from 'react';
import { UserRentData, RentType } from '../types';
import { munichDistrictsData } from '../data/munichDistricts_real';

interface RentEntryFormProps {
  onClose: () => void;
  onSubmit: (data: UserRentData) => void;
  existingData?: UserRentData;
  currentRentType: RentType;
}

export const RentEntryForm = ({ onClose, onSubmit, existingData, currentRentType }: RentEntryFormProps) => {
  const [formData, setFormData] = useState<Partial<UserRentData>>(existingData || {
    district: '',
    rentType: currentRentType,
    monthlyRent: 0,
    apartmentSize: 0,
    rooms: 1,
    yearBuilt: new Date().getFullYear(),
    hasBalcony: false,
    hasElevator: false,
    heatingIncluded: false,
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const districts = munichDistrictsData.features
    .map(f => f.properties.name)
    .sort();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.district) newErrors.district = 'Bitte wählen Sie einen Stadtbezirk';
    if (!formData.monthlyRent || formData.monthlyRent <= 0) newErrors.monthlyRent = 'Bitte geben Sie die Miete ein';
    if (!formData.apartmentSize || formData.apartmentSize <= 0) newErrors.apartmentSize = 'Bitte geben Sie die Wohnungsgröße ein';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userData: UserRentData = {
      district: formData.district!,
      rentType: currentRentType,
      monthlyRent: formData.monthlyRent!,
      apartmentSize: formData.apartmentSize!,
      rooms: formData.rooms || 1,
      yearBuilt: formData.yearBuilt || new Date().getFullYear(),
      hasBalcony: formData.hasBalcony || false,
      hasElevator: formData.hasElevator || false,
      heatingIncluded: formData.heatingIncluded || false,
      description: formData.description || '',
      dateEntered: new Date().toISOString()
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
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#1976d2' }}>
            {currentRentType === 'apartment' ? 'Ihre Wohnung eingeben' : 'Ihr WG-Zimmer eingeben'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#666',
              padding: 0,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Stadtbezirk *
            </label>
            <select
              value={formData.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: `1px solid ${errors.district ? '#d32f2f' : '#ddd'}`,
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">Bitte wählen...</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            {errors.district && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.district}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
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
                  fontSize: '14px'
                }}
                placeholder="z.B. 1200"
              />
              {errors.monthlyRent && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.monthlyRent}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
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
                  fontSize: '14px'
                }}
                placeholder="z.B. 65"
              />
              {errors.apartmentSize && <span style={{ color: '#d32f2f', fontSize: '12px' }}>{errors.apartmentSize}</span>}
            </div>
          </div>

          {formData.monthlyRent && formData.apartmentSize && (
            <div style={{
              background: '#e3f2fd',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#1976d2'
            }}>
              <strong>Preis pro m²: €{pricePerSqm}</strong>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
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
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
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
                  fontSize: '14px'
                }}
                placeholder={new Date().getFullYear().toString()}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', color: '#333' }}>
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
                <span style={{ fontSize: '14px' }}>Balkon/Terrasse</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.hasElevator || false}
                  onChange={(e) => handleChange('hasElevator', e.target.checked)}
                  style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px' }}>Aufzug vorhanden</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.heatingIncluded || false}
                  onChange={(e) => handleChange('heatingIncluded', e.target.checked)}
                  style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px' }}>Heizung inklusive</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
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
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                background: 'white',
                color: '#666',
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
                background: '#1976d2',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
