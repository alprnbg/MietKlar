import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import { UserRentData } from '../types';

interface RentDistributionChartProps {
  entries: UserRentData[];
  userEntry?: UserRentData | null;
}

interface DistributionStats {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  mode: number;
}

// Calculate statistics
const calculateStats = (values: number[]): DistributionStats => {
  if (values.length === 0) {
    return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0, mode: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Median
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];

  // Standard deviation (handle single value case)
  let stdDev = 0;
  if (values.length > 1) {
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    stdDev = Math.sqrt(variance);
  }

  // Mode (most frequent value rounded to nearest 50)
  const rounded = values.map(v => Math.round(v / 50) * 50);
  const frequency: Record<number, number> = {};
  rounded.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  const mode = Number(Object.keys(frequency).reduce((a, b) =>
    frequency[Number(a)] > frequency[Number(b)] ? a : b
  ));

  return {
    mean,
    median,
    stdDev,
    min: Math.min(...values),
    max: Math.max(...values),
    mode
  };
};

// Generate Gaussian distribution (handle zero stdDev case)
const gaussianPDF = (x: number, mean: number, stdDev: number): number => {
  // If stdDev is 0 or very small, return 1 at mean, 0 elsewhere
  if (stdDev < 0.01) {
    return Math.abs(x - mean) < 0.01 ? 1 : 0;
  }
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
};

export const RentDistributionChart = ({ entries, userEntry }: RentDistributionChartProps) => {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const isGerman = language === 'de';

  const { chartData, stats, userPricePerSqm } = useMemo(() => {
    if (entries.length === 0) {
      return { chartData: [], stats: calculateStats([]), userPricePerSqm: null };
    }

    const pricesPerSqm = entries.map(e => e.pricePerSqm || (e.monthlyRent / e.apartmentSize));
    const stats = calculateStats(pricesPerSqm);

    // Handle edge case: only 1 entry
    if (entries.length === 1) {
      const singlePrice = pricesPerSqm[0];
      const userPricePerSqm = userEntry
        ? (userEntry.pricePerSqm || (userEntry.monthlyRent / userEntry.apartmentSize))
        : null;

      // Create simple chart data with just the single point
      const chartData = [
        { price: Math.max(0, singlePrice - 5), actual: 0, gaussian: 0 },
        { price: singlePrice, actual: 1, gaussian: 1 },
        { price: singlePrice + 5, actual: 0, gaussian: 0 }
      ];

      return { chartData, stats, userPricePerSqm };
    }

    // Generate chart data points
    const range = stats.max - stats.min;
    // Handle case where all values are the same
    const padding = range > 0 ? range * 0.2 : 5;
    const start = Math.max(0, stats.min - padding);
    const end = stats.max + padding;
    const step = Math.max(0.1, (end - start) / 50); // Prevent zero step

    // Create histogram bins
    const binSize = Math.max(0.5, range / 15); // Ensure minimum bin size
    const bins: Record<number, number> = {};

    pricesPerSqm.forEach(price => {
      const bin = Math.floor(price / binSize) * binSize;
      bins[bin] = (bins[bin] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(bins), 1); // Ensure at least 1

    // Generate smooth curve data
    const chartData = [];
    for (let x = start; x <= end; x += step) {
      const bin = Math.floor(x / binSize) * binSize;
      const actualCount = bins[bin] || 0;

      // Gaussian curve (normalized)
      const gaussianValue = gaussianPDF(x, stats.mean, stats.stdDev);
      const peakGaussian = gaussianPDF(stats.mean, stats.mean, stats.stdDev);
      const normalizedGaussian = peakGaussian > 0
        ? (gaussianValue / peakGaussian) * maxCount
        : (Math.abs(x - stats.mean) < 0.01 ? maxCount : 0);

      chartData.push({
        price: Number(x.toFixed(2)),
        actual: actualCount,
        gaussian: Number(normalizedGaussian.toFixed(2))
      });
    }

    const userPricePerSqm = userEntry
      ? (userEntry.pricePerSqm || (userEntry.monthlyRent / userEntry.apartmentSize))
      : null;

    return { chartData, stats, userPricePerSqm };
  }, [entries, userEntry]);

  if (entries.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: colors.textSecondary
      }}>
        {isGerman ? 'Keine Daten verfügbar' : 'No data available'}
      </div>
    );
  }

  return (
    <div>
      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: colors.surface,
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>
            {isGerman ? 'Mittelwert' : 'Mean'}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: colors.primary }}>
            €{stats.mean.toFixed(2)}
          </div>
        </div>

        <div style={{
          background: colors.surface,
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>
            {isGerman ? 'Median' : 'Median'}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: colors.primary }}>
            €{stats.median.toFixed(2)}
          </div>
        </div>

        <div style={{
          background: colors.surface,
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>
            {isGerman ? 'Std.-Abw.' : 'Std. Dev'}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: colors.secondary }}>
            €{stats.stdDev.toFixed(2)}
          </div>
        </div>

        <div style={{
          background: colors.surface,
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '11px', color: colors.textSecondary, marginBottom: '4px' }}>
            {isGerman ? 'Spanne' : 'Range'}
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: colors.text }}>
            €{stats.min.toFixed(0)}-{stats.max.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div style={{
        background: colors.surface,
        padding: '20px',
        borderRadius: '12px',
        border: `2px solid ${colors.primary}`
      }}>
        <h4 style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          fontWeight: '600',
          color: colors.text
        }}>
          {isGerman ? 'Preis-Verteilung (€/m²)' : 'Price Distribution (€/m²)'}
        </h4>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorGaussian" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#888888" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#888888" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis
              dataKey="price"
              stroke={colors.textSecondary}
              tick={{ fill: colors.textSecondary, fontSize: 12 }}
              label={{
                value: isGerman ? 'Preis pro m²' : 'Price per m²',
                position: 'insideBottom',
                offset: -5,
                fill: colors.text
              }}
            />
            <YAxis
              stroke={colors.textSecondary}
              tick={{ fill: colors.textSecondary, fontSize: 12 }}
              label={{
                value: isGerman ? 'Anzahl' : 'Count',
                angle: -90,
                position: 'insideLeft',
                fill: colors.text
              }}
            />
            <Tooltip
              contentStyle={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                color: colors.text
              }}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Legend
              wrapperStyle={{
                color: colors.text
              }}
            />

            {/* User's rent price line */}
            {userPricePerSqm && (
              <ReferenceLine
                x={userPricePerSqm}
                stroke="#FF6B00"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: isGerman ? 'Ihre Miete' : 'Your Rent',
                  fill: '#FF6B00',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}
              />
            )}

            {/* Mean line */}
            <ReferenceLine
              x={stats.mean}
              stroke={colors.primary}
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: isGerman ? 'Ø' : 'Mean',
                fill: colors.primary,
                fontSize: 12
              }}
            />

            <Area
              type="monotone"
              dataKey="actual"
              stroke={colors.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorActual)"
              name={isGerman ? 'Tatsächlich' : 'Actual'}
            />
            <Area
              type="monotone"
              dataKey="gaussian"
              stroke="#888888"
              strokeWidth={1}
              strokeDasharray="5 5"
              fillOpacity={1}
              fill="url(#colorGaussian)"
              name={isGerman ? 'Normal-Verteilung' : 'Normal Distribution'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
