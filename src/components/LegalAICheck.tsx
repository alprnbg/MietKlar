import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface ContractIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'deposit' | 'termination' | 'unfair_clause' | 'maintenance' | 'subletting';
  title: string;
  description: string;
  legalReference: string;
  recommendation: string;
}

const mockAnalysisResults: ContractIssue[] = [
  {
    id: '1',
    severity: 'critical',
    category: 'deposit',
    title: 'Excessive Deposit Demand',
    description: 'Der Vertrag verlangt eine Kaution von 5 Monatsmieten. Dies überschreitet die gesetzliche Grenze.',
    legalReference: 'BGB §551 Abs. 1: Die Mietsicherheit darf höchstens das Dreifache der auf einen Monat entfallenden Miete betragen.',
    recommendation: 'Verlangen Sie eine Reduzierung der Kaution auf maximal 3 Monatsmieten. Dies ist Ihr gesetzliches Recht.'
  },
  {
    id: '2',
    severity: 'critical',
    category: 'unfair_clause',
    title: 'Illegal Clause - Complete Renovation Required',
    description: 'Klausel verlangt vollständige Renovierung bei Auszug unabhängig vom Zustand.',
    legalReference: 'BGH: Unrenoviert-Klauseln sind grundsätzlich unwirksam (BGH VIII ZR 242/12)',
    recommendation: 'Diese Klausel ist unwirksam und kann ignoriert werden. Dokumentieren Sie den Zustand bei Einzug.'
  },
  {
    id: '3',
    severity: 'warning',
    category: 'termination',
    title: 'Unclear Termination Notice Period',
    description: 'Die Kündigungsfrist ist nicht klar definiert.',
    legalReference: 'BGB §573c: Gesetzliche Kündigungsfrist beträgt 3 Monate zum Monatsende.',
    recommendation: 'Fordern Sie eine klare Formulierung der Kündigungsfrist gemäß gesetzlicher Vorgabe.'
  },
  {
    id: '4',
    severity: 'warning',
    category: 'subletting',
    title: 'Subletting Completely Prohibited',
    description: 'Untervermietung ist komplett verboten.',
    legalReference: 'BGB §553: Mieter hat Anspruch auf Erlaubnis zur Untervermietung bei berechtigtem Interesse.',
    recommendation: 'Diese Klausel kann eingeschränkt werden. Sie haben Anspruch auf Untervermietung bei berechtigtem Interesse.'
  },
  {
    id: '5',
    severity: 'info',
    category: 'maintenance',
    title: 'Tenant Responsible for Small Repairs',
    description: 'Kleinreparaturen bis 100€ müssen vom Mieter getragen werden.',
    legalReference: 'BGH: Kleinreparaturklausel ist zulässig bei Begrenzung auf 100-120€ pro Reparatur und max. 6-8% der Jahresmiete.',
    recommendation: 'Diese Klausel ist rechtlich zulässig, aber prüfen Sie die Jahresgrenze.'
  }
];

export const LegalAICheck = () => {
  const { language } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setAnalyzing(true);
      // Simulate AI analysis
      setTimeout(() => {
        setAnalyzing(false);
        setShowResults(true);
      }, 3000);
    }
  };

  const getSeverityConfig = (severity: ContractIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          icon: '🚨',
          label: language === 'de' ? 'Kritisch' : 'Critical',
          color: '#d32f2f',
          bg: '#ffebee'
        };
      case 'warning':
        return {
          icon: '⚠️',
          label: language === 'de' ? 'Warnung' : 'Warning',
          color: '#ed6c02',
          bg: '#fff4e6'
        };
      default:
        return {
          icon: 'ℹ️',
          label: language === 'de' ? 'Info' : 'Info',
          color: '#0288d1',
          bg: '#e1f5fe'
        };
    }
  };

  const criticalCount = mockAnalysisResults.filter(i => i.severity === 'critical').length;
  const warningCount = mockAnalysisResults.filter(i => i.severity === 'warning').length;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          ⚖️ LegalAI Check
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
          {language === 'de'
            ? 'Laden Sie Ihren Mietvertrag hoch und lassen Sie ihn von unserer AI auf unfaire und illegale Klauseln prüfen.'
            : 'Upload your rental contract and have it checked by our AI for unfair and illegal clauses.'}
        </p>
      </div>

      {!showResults ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {!analyzing ? (
            <>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>📄</div>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
                {language === 'de'
                  ? 'Mietvertrag hochladen'
                  : 'Upload Rental Contract'}
              </h2>
              <p style={{ color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
                {language === 'de'
                  ? 'Unterstützte Formate: PDF, DOC, DOCX (max. 10MB)'
                  : 'Supported formats: PDF, DOC, DOCX (max. 10MB)'}
              </p>
              <label
                htmlFor="contract-upload"
                style={{
                  display: 'inline-block',
                  padding: '16px 48px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {language === 'de' ? '📤 Datei auswählen' : '📤 Select File'}
              </label>
              <input
                id="contract-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              {fileName && (
                <div style={{ marginTop: '16px', color: '#666', fontSize: '14px' }}>
                  {language === 'de' ? 'Ausgewählt:' : 'Selected:'} {fileName}
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>
                <span style={{ display: 'inline-block', animation: 'spin 2s linear infinite' }}>🔄</span>
              </div>
              <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
                {language === 'de'
                  ? 'AI analysiert Ihren Vertrag...'
                  : 'AI is analyzing your contract...'}
              </h2>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
                marginTop: '24px'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  animation: 'progress 3s ease-in-out'
                }} />
              </div>
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes progress {
                  from { width: 0%; }
                  to { width: 100%; }
                }
              `}</style>
            </>
          )}
        </div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                {language === 'de' ? 'Kritische Probleme' : 'Critical Issues'}
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{criticalCount}</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                {language === 'de' ? 'Warnungen' : 'Warnings'}
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{warningCount}</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                {language === 'de' ? 'Vertrags-Score' : 'Contract Score'}
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>C+</div>
            </div>
          </div>

          {/* Issues List */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#333' }}>
              {language === 'de' ? 'Gefundene Probleme' : 'Found Issues'}
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {mockAnalysisResults.map(issue => {
                const config = getSeverityConfig(issue.severity);
                return (
                  <div
                    key={issue.id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderLeft: `6px solid ${config.color}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '24px' }}>{config.icon}</span>
                          <span style={{
                            background: config.bg,
                            color: config.color,
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {config.label}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '8px' }}>
                          {issue.title}
                        </h3>
                        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '12px' }}>
                          {issue.description}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      background: '#f5f5f5',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
                        ⚖️ {language === 'de' ? 'Rechtliche Grundlage:' : 'Legal Reference:'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
                        {issue.legalReference}
                      </div>
                    </div>

                    <div style={{
                      background: '#e3f2fd',
                      padding: '16px',
                      borderRadius: '8px',
                      borderLeft: '4px solid #2196f3'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1976d2', marginBottom: '8px' }}>
                        💡 {language === 'de' ? 'Empfehlung:' : 'Recommendation:'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.6' }}>
                        {issue.recommendation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            paddingTop: '24px',
            borderTop: '2px solid #e0e0e0'
          }}>
            <button
              onClick={() => setShowResults(false)}
              style={{
                padding: '14px 32px',
                background: 'white',
                color: '#1976d2',
                border: '2px solid #1976d2',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {language === 'de' ? 'Neuen Vertrag prüfen' : 'Check New Contract'}
            </button>
            <button
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {language === 'de' ? '📥 Bericht herunterladen' : '📥 Download Report'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
