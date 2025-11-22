import { munichDistrictsData } from '../data/munichDistricts_real';
import { wgRentData } from '../data/wgRentData';
import { dormitoryRentData } from '../data/dormitoryRentData';
import { pressureIndexData } from '../data/pressureIndexData';
import { DistrictsGeoJSON, RentType } from '../types';

export function getDistrictsWithRentType(rentType: RentType): DistrictsGeoJSON {
  // Select the appropriate rent data based on type
  const rentData = rentType === 'wg' ? wgRentData : rentType === 'dormitory' ? dormitoryRentData : null;
  const description = rentType === 'wg' ? 'WG-Zimmer' : rentType === 'dormitory' ? 'Studentenwohnheim' : null;

  // Create new GeoJSON with selected rent data and pressure index
  const districts: DistrictsGeoJSON = {
    type: 'FeatureCollection',
    features: munichDistrictsData.features.map(feature => {
      const districtId = feature.properties.id.toString().padStart(2, '0');
      const pressureData = pressureIndexData[districtId];

      // For apartments, just add pressure index
      if (rentType === 'apartment') {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            rentData: {
              ...feature.properties.rentData,
              pressureIndex: pressureData
            }
          }
        };
      }

      // For WG and dormitory, update rent data and add pressure index
      const data = rentData![districtId];
      return {
        ...feature,
        properties: {
          ...feature.properties,
          rentData: {
            ...feature.properties.rentData,
            ...data,
            description: `${description} in ${feature.properties.name}`,
            pressureIndex: pressureData
          }
        }
      };
    })
  };

  return districts;
}

export function getRentTypeLabel(rentType: RentType): string {
  if (rentType === 'apartment') return 'Wohnung';
  if (rentType === 'wg') return 'WG-Zimmer';
  return 'Studentenwohnheim';
}
