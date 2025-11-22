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
export type OwnerType = 'private' | 'company';
export type ApartmentSource = 'immobilienscout24' | 'immowelt' | 'wg-gesucht' | 'ebay-kleinanzeigen' | 'facebook' | 'friends' | 'newspaper' | 'other';

export interface UserRentData {
  district: string;
  rentType: RentType;
  monthlyRent: number;
  apartmentSize: number;
  rooms: number;
  yearBuilt: number;
  hasBalcony: boolean;
  hasElevator: boolean;
  recentlyRenovated: boolean;
  ownerType: OwnerType;
  ownerCompanyName?: string;
  apartmentSource: ApartmentSource;
  description: string;
  dateEntered: string;
  // New fields for location-based entry
  coordinates?: { lat: number; lng: number };
  address?: string;
  street?: string;
  number?: number;
  stadtviertel?: string;
  apartmentType?: string;
  pricePerSqm?: number;
}

export interface POIAvailability {
  hasSubway: boolean;
  hasHealthcare: boolean;
  hasSchools: boolean;
  hasKindergartens: boolean;
  hasSupermarkets: boolean;
  hasRestaurants: boolean;
  hasParks: boolean;
}
