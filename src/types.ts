export interface PressureIndexData {
  listingCount: number;        // İlan Sayısı
  daysOnline: number;           // Yayında Kalma Süresi (average days)
  growthRate: number;           // Artış Hızı (%)
  studentPercentage: number;    // Öğrenci (%)
  highIncomePercentage: number; // Yüksek Gelir (%)
}

export interface DistrictRentData {
  name: string;
  averageRent: number;
  minRent: number;
  maxRent: number;
  fairRent: number;
  pricePerSqm: number;
  description: string;
  pressureIndex?: PressureIndexData;
}

export interface MunichDistrict {
  type: string;
  properties: {
    name: string;
    id: number;
    rentData: DistrictRentData;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface DistrictsGeoJSON {
  type: string;
  features: MunichDistrict[];
}

export type RentType = 'apartment' | 'wg' | 'dormitory';

export interface UserRentData {
  district: string;
  rentType: RentType;
  monthlyRent: number;
  apartmentSize: number;
  rooms: number;
  yearBuilt: number;
  hasBalcony: boolean;
  hasElevator: boolean;
  heatingIncluded: boolean;
  description: string;
  dateEntered: string;
}
