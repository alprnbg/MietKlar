// @ts-ignore
import apartmentStats from './rentStatsByStadtviertel_apartment.json';
// @ts-ignore
import wgStats from './rentStatsByStadtviertel_wg.json';
// @ts-ignore
import dormitoryStats from './rentStatsByStadtviertel_dormitory.json';

export interface StadtviertelRentStats {
  stadtviertel: string;
  entryCount: number;
  avgRent: number;
  minRent: number;
  maxRent: number;
  avgM2: number;
  avgPricePerSqm: number;
}

// Export type-specific stats arrays
export const apartmentRentStats: StadtviertelRentStats[] = apartmentStats;
export const wgRentStats: StadtviertelRentStats[] = wgStats;
export const dormitoryRentStats: StadtviertelRentStats[] = dormitoryStats;

// Create maps for quick lookup
export const apartmentStatsMap = new Map<string, StadtviertelRentStats>(
  apartmentRentStats.map(stat => [stat.stadtviertel, stat])
);

export const wgStatsMap = new Map<string, StadtviertelRentStats>(
  wgRentStats.map(stat => [stat.stadtviertel, stat])
);

export const dormitoryStatsMap = new Map<string, StadtviertelRentStats>(
  dormitoryRentStats.map(stat => [stat.stadtviertel, stat])
);

// Default export for backward compatibility (apartment)
export const rentStatsByStadtviertel = apartmentRentStats;
export const rentStatsMap = apartmentStatsMap;
