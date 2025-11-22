import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';

interface StartPageProps {
  onSelectFlow: (flow: 'mietspiegel' | 'checkRent') => void;
}

export const StartPage = ({ onSelectFlow }: StartPageProps) => {
  const { language } = useLanguage();
  const { colors } = useTheme();

  const isGerman = language === 'de';

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.headerBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      <ThemeSwitcher />
      <div style={{
        maxWidth: '900px',
        width: '100%'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <img
            src={colors.logo}
            alt="Munich Logo"
            style={{
              height: '120px',
              width: 'auto',
              marginBottom: '24px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            color: colors.headerText
          }}>
            MietKlar
          </h1>
          <p style={{
            fontSize: '20px',
            opacity: 0.95,
            fontWeight: '400',
            color: colors.headerText
          }}>
            {isGerman ? 'Münchner Mietpreise transparent und verständlich' : 'Munich rent prices - transparent and clear'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginTop: '40px'
        }}>
          {/* Option 1: View Mietspiegel */}
          <button
            onClick={() => onSelectFlow('mietspiegel')}
            style={{
              background: colors.cardBg,
              border: `3px solid ${colors.primary}`,
              borderRadius: '16px',
              padding: '40px 32px',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: `0 10px 40px ${colors.shadow}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 15px 50px ${colors.shadow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 10px 40px ${colors.shadow}`;
            }}
          >
            <div style={{
              fontSize: '56px',
              marginBottom: '8px'
            }}>
              🗺️
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: colors.primary,
              margin: '0 0 8px 0'
            }}>
              {isGerman ? 'Mietspiegel ansehen' : 'View Rent Index'}
            </h2>
            <p style={{
              fontSize: '15px',
              color: colors.textSecondary,
              margin: 0,
              lineHeight: '1.6'
            }}>
              {isGerman
                ? 'Erkunden Sie die Mietpreise in verschiedenen Münchner Stadtbezirken und verschaffen Sie sich einen Überblick über das Preisniveau.'
                : 'Explore rent prices across Munich districts and get an overview of price levels.'}
            </p>
          </button>

          {/* Option 2: Check Your Rent */}
          <button
            onClick={() => onSelectFlow('checkRent')}
            style={{
              background: colors.cardBg,
              border: `3px solid ${colors.primary}`,
              borderRadius: '16px',
              padding: '40px 32px',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: `0 10px 40px ${colors.shadow}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 15px 50px ${colors.shadow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 10px 40px ${colors.shadow}`;
            }}
          >
            <div style={{
              fontSize: '56px',
              marginBottom: '8px'
            }}>
              ✅
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: colors.primary,
              margin: '0 0 8px 0'
            }}>
              {isGerman ? 'Meine Miete prüfen' : 'Check My Rent'}
            </h2>
            <p style={{
              fontSize: '15px',
              color: colors.textSecondary,
              margin: 0,
              lineHeight: '1.6'
            }}>
              {isGerman
                ? 'Geben Sie Ihre Mietdaten ein und finden Sie heraus, ob Ihre Miete fair ist im Vergleich zu Ihrer Nachbarschaft.'
                : 'Enter your rent details and find out if your rent is fair compared to your neighborhood.'}
            </p>
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          color: colors.headerText,
          fontSize: '14px',
          opacity: 0.8
        }}>
          {isGerman
            ? 'Daten basierend auf Münchner Mietpreisen und Nutzerbeiträgen'
            : 'Data based on Munich rent prices and user contributions'}
        </div>
      </div>
    </div>
  );
};
