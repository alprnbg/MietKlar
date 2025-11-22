import { stadtviertelData } from '../data/stadtviertel';

// Point-in-polygon algorithm
function pointInPolygon(point: [number, number], polygon: number[][]) {
  const x = point[0], y = point[1];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

// Find which stadtviertel a coordinate belongs to
export function findStadtviertel(lng: number, lat: number): string | null {
  for (const feature of (stadtviertelData as any).features) {
    const geometry = feature.geometry;

    if (geometry.type === 'Polygon') {
      for (const ring of geometry.coordinates) {
        if (pointInPolygon([lng, lat], ring)) {
          return feature.properties?.vi_nummer || feature.id;
        }
      }
    } else if (geometry.type === 'MultiPolygon') {
      for (const polygon of geometry.coordinates) {
        for (const ring of polygon) {
          if (pointInPolygon([lng, lat], ring)) {
            return feature.properties?.vi_nummer || feature.id;
          }
        }
      }
    }
  }

  return null; // Outside all stadtviertel
}

// Get the center coordinates of a stadtviertel
export function getViertelCenter(viertelId: string): [number, number] | null {
  for (const feature of (stadtviertelData as any).features) {
    const featureId = feature.properties?.vi_nummer || feature.id;
    if (featureId === viertelId) {
      const geometry = feature.geometry;
      let coordinates: number[][] = [];

      if (geometry.type === 'Polygon') {
        coordinates = geometry.coordinates[0];
      } else if (geometry.type === 'MultiPolygon') {
        // For MultiPolygon, use the first polygon
        coordinates = geometry.coordinates[0][0];
      }

      if (coordinates.length > 0) {
        // Calculate centroid
        let sumLng = 0, sumLat = 0;
        for (const coord of coordinates) {
          sumLng += coord[0];
          sumLat += coord[1];
        }
        return [sumLat / coordinates.length, sumLng / coordinates.length];
      }
    }
  }
  return null;
}
