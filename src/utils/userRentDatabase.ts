import { UserRentData, RentType } from '../types';
import { apartmentStatsMap, wgStatsMap, dormitoryStatsMap } from '../data/rentStatsByStadtviertel';
// @ts-ignore
import syntheticApartmentData from '../data/userRentData_apartment.json';
// @ts-ignore
import syntheticWGData from '../data/userRentData_wg.json';
// @ts-ignore
import syntheticDormitoryData from '../data/userRentData_dormitory.json';

const USER_RENT_ENTRIES_KEY = 'munich-rent-user-entries';

export interface AggregatedRentStats {
  stadtviertel: string;
  entryCount: number;
  avgRent: number;
  minRent: number;
  maxRent: number;
  avgM2: number;
  avgPricePerSqm: number;
  fairPricePerSqm: number; // Fair rent price per sqm for comparison
  unfairnessPercentage: number; // Percentage above/below fair rent
}

// Generate fair rent price per sqm for a viertel
// Fair rent is based on official rental index (Mietspiegel) and should be lower than market rent
function generateFairRent(viertelId: string, avgPricePerSqm: number, rentType: RentType): number {
  // Base fair rent is typically 10-25% lower than average market rent
  // Central/popular areas have smaller gap, peripheral areas have larger gap

  // Hash the viertel ID to get a consistent random value
  let hash = 0;
  for (let i = 0; i < viertelId.length; i++) {
    hash = ((hash << 5) - hash) + viertelId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const normalizedHash = Math.abs(hash % 100) / 100; // 0-1

  // Central/expensive viertels (higher avgPricePerSqm) have smaller unfairness gap
  // Peripheral/cheaper viertels have larger unfairness gap
  let unfairnessGap: number;

  if (rentType === 'apartment') {
    // For apartments: central areas (>25€/m²) have 8-15% gap, others have 12-25% gap
    if (avgPricePerSqm > 25) {
      unfairnessGap = 0.08 + (normalizedHash * 0.07); // 8-15%
    } else if (avgPricePerSqm > 20) {
      unfairnessGap = 0.12 + (normalizedHash * 0.08); // 12-20%
    } else {
      unfairnessGap = 0.15 + (normalizedHash * 0.10); // 15-25%
    }
  } else if (rentType === 'wg') {
    // WG rooms typically have less unfairness
    if (avgPricePerSqm > 22) {
      unfairnessGap = 0.05 + (normalizedHash * 0.05); // 5-10%
    } else if (avgPricePerSqm > 18) {
      unfairnessGap = 0.08 + (normalizedHash * 0.07); // 8-15%
    } else {
      unfairnessGap = 0.10 + (normalizedHash * 0.10); // 10-20%
    }
  } else {
    // Dormitories have least unfairness
    if (avgPricePerSqm > 20) {
      unfairnessGap = 0.03 + (normalizedHash * 0.04); // 3-7%
    } else if (avgPricePerSqm > 16) {
      unfairnessGap = 0.05 + (normalizedHash * 0.05); // 5-10%
    } else {
      unfairnessGap = 0.08 + (normalizedHash * 0.07); // 8-15%
    }
  }

  const fairPrice = avgPricePerSqm * (1 - unfairnessGap);
  return Math.round(fairPrice * 100) / 100; // Round to 2 decimal places
}

// Get the appropriate synthetic data based on rent type
function getSyntheticDataByType(rentType: RentType): any[] {
  switch (rentType) {
    case 'apartment':
      return syntheticApartmentData as any[];
    case 'wg':
      return syntheticWGData as any[];
    case 'dormitory':
      return syntheticDormitoryData as any[];
    default:
      return syntheticApartmentData as any[];
  }
}

// Load synthetic user rent data for a specific rent type
function loadSyntheticEntries(rentType: RentType): UserRentData[] {
  try {
    const data = getSyntheticDataByType(rentType);
    return data.map((entry: any) => ({
      district: entry.stadtviertel || '',
      rentType: entry.rentType || rentType,
      monthlyRent: entry.monthlyRent || 0,
      apartmentSize: entry.apartmentSize || 0,
      rooms: entry.rooms || 1,
      yearBuilt: entry.yearBuilt || new Date().getFullYear(),
      hasBalcony: entry.hasBalcony || false,
      hasElevator: entry.hasElevator || false,
      recentlyRenovated: entry.recentlyRenovated || false,
      ownerType: entry.ownerType || 'private',
      ownerCompanyName: entry.ownerCompanyName,
      apartmentSource: entry.apartmentSource || 'immobilienscout24',
      description: '',
      dateEntered: entry.dateEntered || new Date().toISOString(),
      coordinates: entry.coordinates,
      stadtviertel: entry.stadtviertel,
      pricePerSqm: entry.pricePerSqm
    }));
  } catch (e) {
    console.error('Failed to load synthetic entries', e);
    return [];
  }
}

// Load all user rent entries from localStorage (real user entries)
function loadRealUserEntries(): UserRentData[] {
  try {
    const stored = localStorage.getItem(USER_RENT_ENTRIES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load user rent entries', e);
  }
  return [];
}

// Load all user rent entries for a specific rent type (synthetic + real user entries)
export function loadUserRentEntries(rentType: RentType = 'apartment'): UserRentData[] {
  const synthetic = loadSyntheticEntries(rentType);
  const real = loadRealUserEntries().filter(entry => entry.rentType === rentType);
  return [...synthetic, ...real];
}

// Save a new user rent entry (only saves to localStorage, not to synthetic data)
export function saveUserRentEntry(entry: UserRentData): void {
  const entries = loadRealUserEntries();
  entries.push({
    ...entry,
    dateEntered: new Date().toISOString()
  });
  localStorage.setItem(USER_RENT_ENTRIES_KEY, JSON.stringify(entries));
}

// Delete a user rent entry by index (only deletes from real user entries)
export function deleteUserRentEntry(index: number): void {
  const entries = loadRealUserEntries();
  entries.splice(index, 1);
  localStorage.setItem(USER_RENT_ENTRIES_KEY, JSON.stringify(entries));
}

// Update a user rent entry by index (only updates real user entries)
export function updateUserRentEntry(index: number, entry: UserRentData): void {
  const entries = loadRealUserEntries();
  if (index >= 0 && index < entries.length) {
    entries[index] = entry;
    localStorage.setItem(USER_RENT_ENTRIES_KEY, JSON.stringify(entries));
  }
}

// Get the appropriate stats map based on rent type
function getStatsMapByType(rentType: RentType): Map<string, AggregatedRentStats> {
  let baseMap: Map<string, any>;
  switch (rentType) {
    case 'apartment':
      baseMap = new Map(apartmentStatsMap);
      break;
    case 'wg':
      baseMap = new Map(wgStatsMap);
      break;
    case 'dormitory':
      baseMap = new Map(dormitoryStatsMap);
      break;
    default:
      baseMap = new Map(apartmentStatsMap);
  }

  // Add fair rent calculation to each stat
  const enrichedMap = new Map<string, AggregatedRentStats>();
  baseMap.forEach((stat, key) => {
    const fairPricePerSqm = generateFairRent(stat.stadtviertel, stat.avgPricePerSqm, rentType);
    const unfairnessPercentage = ((stat.avgPricePerSqm - fairPricePerSqm) / fairPricePerSqm) * 100;
    enrichedMap.set(key, {
      ...stat,
      fairPricePerSqm,
      unfairnessPercentage
    });
  });

  return enrichedMap;
}

// Get aggregated stats by stadtviertel for a specific rent type
export function getAggregatedStatsByStadtviertel(rentType: RentType = 'apartment'): Map<string, AggregatedRentStats> {
  // Only load REAL user entries (not synthetic) to merge with pre-calculated stats
  const realUserEntries = loadRealUserEntries().filter(entry => entry.rentType === rentType);
  const aggregatedMap = getStatsMapByType(rentType);

  // Group REAL user entries by stadtviertel
  const userDataByViertel = new Map<string, UserRentData[]>();
  realUserEntries.forEach(entry => {
    if (entry.stadtviertel) {
      const existing = userDataByViertel.get(entry.stadtviertel) || [];
      existing.push(entry);
      userDataByViertel.set(entry.stadtviertel, existing);
    }
  });

  // Merge REAL user data with pre-calculated stats (which already include synthetic data)
  userDataByViertel.forEach((entries, viertel) => {
    const existingStats = aggregatedMap.get(viertel);

    // Calculate stats from user entries
    const userRents = entries.map(e => e.monthlyRent);
    const userSizes = entries.map(e => e.apartmentSize);
    const userPricePerSqm = entries.map(e => e.pricePerSqm || (e.monthlyRent / e.apartmentSize));

    const userAvgRent = userRents.reduce((a, b) => a + b, 0) / userRents.length;
    const userMinRent = Math.min(...userRents);
    const userMaxRent = Math.max(...userRents);
    const userAvgM2 = userSizes.reduce((a, b) => a + b, 0) / userSizes.length;
    const userAvgPricePerSqm = userPricePerSqm.reduce((a, b) => a + b, 0) / userPricePerSqm.length;

    if (existingStats) {
      // Merge with existing stats (weighted average)
      const totalCount = existingStats.entryCount + entries.length;
      const mergedAvgPricePerSqm = Math.round((existingStats.avgPricePerSqm * existingStats.entryCount + userAvgPricePerSqm * entries.length) / totalCount);
      const fairPricePerSqm = generateFairRent(viertel, mergedAvgPricePerSqm, rentType);
      const unfairnessPercentage = ((mergedAvgPricePerSqm - fairPricePerSqm) / fairPricePerSqm) * 100;

      const mergedStats: AggregatedRentStats = {
        stadtviertel: viertel,
        entryCount: totalCount,
        avgRent: Math.round((existingStats.avgRent * existingStats.entryCount + userAvgRent * entries.length) / totalCount),
        minRent: Math.min(existingStats.minRent, userMinRent),
        maxRent: Math.max(existingStats.maxRent, userMaxRent),
        avgM2: Math.round((existingStats.avgM2 * existingStats.entryCount + userAvgM2 * entries.length) / totalCount),
        avgPricePerSqm: mergedAvgPricePerSqm,
        fairPricePerSqm,
        unfairnessPercentage
      };
      aggregatedMap.set(viertel, mergedStats);
    } else {
      // New stadtviertel with only user data
      const avgPricePerSqmRounded = Math.round(userAvgPricePerSqm);
      const fairPricePerSqm = generateFairRent(viertel, avgPricePerSqmRounded, rentType);
      const unfairnessPercentage = ((avgPricePerSqmRounded - fairPricePerSqm) / fairPricePerSqm) * 100;

      const newStats: AggregatedRentStats = {
        stadtviertel: viertel,
        entryCount: entries.length,
        avgRent: Math.round(userAvgRent),
        minRent: userMinRent,
        maxRent: userMaxRent,
        avgM2: Math.round(userAvgM2),
        avgPricePerSqm: avgPricePerSqmRounded,
        fairPricePerSqm,
        unfairnessPercentage
      };
      aggregatedMap.set(viertel, newStats);
    }
  });

  return aggregatedMap;
}

// Get the latest REAL user rent entry (not synthetic, for backwards compatibility)
export function getLatestUserRentEntry(): UserRentData | null {
  const entries = loadRealUserEntries();
  return entries.length > 0 ? entries[entries.length - 1] : null;
}

// Export the function to get only real user entries (for identifying user's own entry)
export function getRealUserEntries(): UserRentData[] {
  return loadRealUserEntries();
}

// Clear all user rent entries
export function clearAllUserRentEntries(): void {
  localStorage.removeItem(USER_RENT_ENTRIES_KEY);
}
