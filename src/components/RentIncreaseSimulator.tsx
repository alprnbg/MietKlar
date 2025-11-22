import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface RentIncreaseSimulatorProps {
  onClose: () => void;
  fairRent?: number;
}

export const RentIncreaseSimulator = ({ onClose, fairRent }: RentIncreaseSimulatorProps) => {
  const { t } = useLanguage();
  const [currentRent, setCurrentRent] = useState<string>('');
  const [newRent, setNewRent] = useState<string>('');
  const [yearsInContract, setYearsInContract] = useState<string>('1');
  const [showResults, setShowResults] = useState(false);

  // German legal limits
  const INFLATION_RATE = 3.8; // Estimated inflation rate for Germany 2024-2025
  const MAX_INCREASE_3_YEARS = 20; // Maximum 20% increase over 3 years
  const MAX_ABOVE_MIETSPIEGEL = 10; // Maximum 10% above reference rent (Mietpreisbremse)

  const calculateIncrease = () => {
    const current = parseFloat(currentRent);
    const proposed = parseFloat(newRent);
    const years = parseFloat(yearsInContract);

    if (!current || !proposed || !years) return null;

    const increaseAmount = proposed - current;
    const increasePercent = (increaseAmount / current) * 100;
    const annualizedIncrease = increasePercent / years;
    const maxLegalIncrease3Years = (current * MAX_INCREASE_3_YEARS) / 100;
    const maxLegalRent3Years = current + maxLegalIncrease3Years;

    // Calculate allowed increase based on inflation
    const inflationBasedIncrease = (current * INFLATION_RATE * years) / 100;
    const maxInflationRent = current + inflationBasedIncrease;

    // Check against fair rent if available
    let fairRentCheck = null;
    if (fairRent) {
      const maxAllowedRent = fairRent + (fairRent * MAX_ABOVE_MIETSPIEGEL) / 100;
      fairRentCheck = {
        maxAllowedRent,
        isAboveFairRent: proposed > maxAllowedRent,
        excessAmount: proposed - maxAllowedRent
      };
    }

    const isLegal =
      increasePercent <= MAX_INCREASE_3_YEARS &&
      (!fairRentCheck || !fairRentCheck.isAboveFairRent);

    return {
      current,
      proposed,
      increaseAmount,
      increasePercent,
      annualizedIncrease,
      maxLegalIncrease3Years,
      maxLegalRent3Years,
      maxInflationRent,
      inflationBasedIncrease,
      isLegal,
      fairRentCheck
    };
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const results = showResults ? calculateIncrease() : null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
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
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>{t('simulatorTitle')}</h2>
          <button
            onClick={onClose}
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

        <p style={{ color: '#666', marginBottom: '24px', lineHeight: '1.6' }}>
          {t('simulatorDescription')}
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            {t('currentRent')}
          </label>
          <input
            type="number"
            value={currentRent}
            onChange={(e) => setCurrentRent(e.target.value)}
            placeholder="1200"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            {t('proposedRent')}
          </label>
          <input
            type="number"
            value={newRent}
            onChange={(e) => setNewRent(e.target.value)}
            placeholder="1350"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            {t('yearsSinceIncrease')}
          </label>
          <input
            type="number"
            value={yearsInContract}
            onChange={(e) => setYearsInContract(e.target.value)}
            placeholder="1"
            min="1"
            max="10"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleCalculate}
          style={{
            width: '100%',
            padding: '14px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          {t('calculate')}
        </button>

        {results && (
          <div>
            <div style={{
              background: results.isLegal ? '#e8f5e9' : '#ffebee',
              padding: '20px',
              borderRadius: '8px',
              border: `2px solid ${results.isLegal ? '#4caf50' : '#f44336'}`,
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', color: results.isLegal ? '#2e7d32' : '#c62828' }}>
                {results.isLegal ? t('legal') : t('illegal')}
              </h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: results.isLegal ? '#2e7d32' : '#c62828' }}>
                {results.increasePercent.toFixed(1)}% {t('increase')}
              </div>
              <div style={{ marginTop: '8px', color: '#666' }}>
                €{results.increaseAmount.toFixed(2)} {t('monthlyIncrease')}
              </div>
            </div>

            <div style={{
              background: '#f5f5f5',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>{t('legalLimits')}</h4>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#666' }}>{t('maxIncrease3Years')}</span>
                  <strong>{MAX_INCREASE_3_YEARS}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                  <span>{t('maxRent3Years')}</span>
                  <span>€{results.maxLegalRent3Years.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ marginBottom: '12px', paddingTop: '12px', borderTop: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#666' }}>{t('estimatedInflation')}</span>
                  <strong>{INFLATION_RATE}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                  <span>{t('inflationBasedMax')}</span>
                  <span>€{results.maxInflationRent.toFixed(2)}</span>
                </div>
              </div>

              {results.fairRentCheck && (
                <div style={{ paddingTop: '12px', borderTop: '1px solid #ddd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#666' }}>{t('mietspiegelPlus')}</span>
                    <strong>€{results.fairRentCheck.maxAllowedRent.toFixed(2)}</strong>
                  </div>
                  {results.fairRentCheck.isAboveFairRent && (
                    <div style={{ fontSize: '14px', color: '#d32f2f', marginTop: '4px' }}>
                      ⚠ €{results.fairRentCheck.excessAmount.toFixed(2)} {t('excess')}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{
              background: '#e3f2fd',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              <strong style={{ color: '#1976d2' }}>{t('simulatorNote')}</strong>
              <p style={{ margin: '8px 0 0', color: '#555' }}>
                {t('simulatorNoteText')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
