const fs = require('fs');
const path = require('path');

// Load stadtviertel GeoJSON to assign entries to actual neighborhoods
const stadtviertelData = JSON.parse(fs.readFileSync('stadtviertel_wgs84.json', 'utf8'));

// Point-in-polygon algorithm
function pointInPolygon(point, polygon) {
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
function findStadtviertel(lng, lat) {
  for (const feature of stadtviertelData.features) {
    const geometry = feature.geometry;

    if (geometry.type === 'Polygon') {
      for (const ring of geometry.coordinates) {
        if (pointInPolygon([lng, lat], ring)) {
          return feature.properties.vi_nummer || feature.id;
        }
      }
    } else if (geometry.type === 'MultiPolygon') {
      for (const polygon of geometry.coordinates) {
        for (const ring of polygon) {
          if (pointInPolygon([lng, lat], ring)) {
            return feature.properties.vi_nummer || feature.id;
          }
        }
      }
    }
  }

  return null;
}

// Generate random number in range
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random float in range
function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Generate a random Munich coordinate
function generateMunichCoordinate() {
  return {
    lat: randomFloat(48.06, 48.25, 6),
    lng: randomFloat(11.36, 11.72, 6)
  };
}

// Generate rent data entry for apartment
function generateApartmentEntry(id) {
  const rooms = randomInt(1, 5);
  const m2 = randomInt(25, 150);
  const builtYear = randomInt(1950, 2024);

  // Generate coordinates and find stadtviertel
  let coords, viertel;
  let attempts = 0;
  do {
    coords = generateMunichCoordinate();
    viertel = findStadtviertel(coords.lng, coords.lat);
    attempts++;
  } while (!viertel && attempts < 50);

  // Calculate realistic rent for apartments
  let baseRent = m2 * randomFloat(15, 30);

  if (builtYear > 2015) baseRent *= 1.25;
  else if (builtYear > 2000) baseRent *= 1.15;
  else if (builtYear < 1970) baseRent *= 0.9;

  const monthlyRent = Math.round(baseRent / 10) * 10;

  return {
    id: `apt_${id}`,
    rentType: 'apartment',
    coordinates: coords,
    stadtviertel: viertel || 'unknown',
    monthlyRent,
    apartmentSize: m2,
    rooms,
    yearBuilt: builtYear,
    hasBalcony: Math.random() > 0.6,
    hasElevator: Math.random() > 0.5,
    heatingIncluded: Math.random() > 0.7,
    pricePerSqm: parseFloat((monthlyRent / m2).toFixed(2)),
    dateEntered: new Date(Date.now() - randomInt(0, 730) * 24 * 60 * 60 * 1000).toISOString()
  };
}

// Generate rent data entry for WG (shared apartment)
function generateWGEntry(id) {
  const m2 = randomInt(10, 35); // WG rooms are typically smaller
  const builtYear = randomInt(1950, 2024);

  let coords, viertel;
  let attempts = 0;
  do {
    coords = generateMunichCoordinate();
    viertel = findStadtviertel(coords.lng, coords.lat);
    attempts++;
  } while (!viertel && attempts < 50);

  // WG rents are generally lower per m² but can vary
  let baseRent = m2 * randomFloat(18, 35);

  if (builtYear > 2015) baseRent *= 1.2;
  else if (builtYear > 2000) baseRent *= 1.1;

  const monthlyRent = Math.round(baseRent / 10) * 10;

  return {
    id: `wg_${id}`,
    rentType: 'wg',
    coordinates: coords,
    stadtviertel: viertel || 'unknown',
    monthlyRent,
    apartmentSize: m2,
    rooms: 1, // WG entries are typically for one room
    yearBuilt: builtYear,
    hasBalcony: Math.random() > 0.7,
    hasElevator: Math.random() > 0.6,
    heatingIncluded: Math.random() > 0.5,
    pricePerSqm: parseFloat((monthlyRent / m2).toFixed(2)),
    dateEntered: new Date(Date.now() - randomInt(0, 730) * 24 * 60 * 60 * 1000).toISOString()
  };
}

// Generate rent data entry for dormitory
function generateDormitoryEntry(id) {
  const m2 = randomInt(8, 25); // Dorm rooms are smaller
  const builtYear = randomInt(1960, 2024);

  let coords, viertel;
  let attempts = 0;
  do {
    coords = generateMunichCoordinate();
    viertel = findStadtviertel(coords.lng, coords.lat);
    attempts++;
  } while (!viertel && attempts < 50);

  // Dormitory rents are generally more affordable
  let baseRent = m2 * randomFloat(12, 25);

  if (builtYear > 2010) baseRent *= 1.15;

  const monthlyRent = Math.round(baseRent / 10) * 10;

  return {
    id: `dorm_${id}`,
    rentType: 'dormitory',
    coordinates: coords,
    stadtviertel: viertel || 'unknown',
    monthlyRent,
    apartmentSize: m2,
    rooms: 1,
    yearBuilt: builtYear,
    hasBalcony: Math.random() > 0.9,
    hasElevator: Math.random() > 0.4,
    heatingIncluded: Math.random() > 0.3,
    pricePerSqm: parseFloat((monthlyRent / m2).toFixed(2)),
    dateEntered: new Date(Date.now() - randomInt(0, 730) * 24 * 60 * 60 * 1000).toISOString()
  };
}

// Generate entries for a specific type
function generateEntries(type, count, generatorFn) {
  console.log(`\nGenerating ${count} ${type} entries...`);
  const entries = [];

  for (let i = 1; i <= count; i++) {
    entries.push(generatorFn(i));
    if (i % 1000 === 0) {
      console.log(`  Generated ${i}/${count} ${type} entries...`);
    }
  }

  const validEntries = entries.filter(e => e.stadtviertel !== 'unknown');
  console.log(`  Valid entries: ${validEntries.length}/${entries.length}`);

  return validEntries;
}

// Main execution
console.log('='.repeat(60));
console.log('Generating Fake Rent Data for Munich');
console.log('='.repeat(60));

const entriesPerType = 5000;

// Generate entries for each type
const apartmentEntries = generateEntries('apartment', entriesPerType, generateApartmentEntry);
const wgEntries = generateEntries('wg', entriesPerType, generateWGEntry);
const dormitoryEntries = generateEntries('dormitory', entriesPerType, generateDormitoryEntry);

// Ensure src/data directory exists
const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Save to separate JSON files
fs.writeFileSync(
  path.join(dataDir, 'userRentData_apartment.json'),
  JSON.stringify(apartmentEntries, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'userRentData_wg.json'),
  JSON.stringify(wgEntries, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'userRentData_dormitory.json'),
  JSON.stringify(dormitoryEntries, null, 2)
);

// Calculate and save aggregated statistics for each type
function calculateStats(entries, type) {
  const byStadtviertel = {};
  entries.forEach(entry => {
    if (!byStadtviertel[entry.stadtviertel]) {
      byStadtviertel[entry.stadtviertel] = [];
    }
    byStadtviertel[entry.stadtviertel].push(entry);
  });

  const stats = Object.entries(byStadtviertel).map(([viertel, viertelEntries]) => {
    const avgRent = viertelEntries.reduce((sum, e) => sum + e.monthlyRent, 0) / viertelEntries.length;
    const avgM2 = viertelEntries.reduce((sum, e) => sum + e.apartmentSize, 0) / viertelEntries.length;
    const avgPricePerSqm = viertelEntries.reduce((sum, e) => sum + e.pricePerSqm, 0) / viertelEntries.length;
    const minRent = Math.min(...viertelEntries.map(e => e.monthlyRent));
    const maxRent = Math.max(...viertelEntries.map(e => e.monthlyRent));

    return {
      stadtviertel: viertel,
      entryCount: viertelEntries.length,
      avgRent: Math.round(avgRent),
      minRent,
      maxRent,
      avgM2: Math.round(avgM2),
      avgPricePerSqm: parseFloat(avgPricePerSqm.toFixed(2))
    };
  });

  return { byStadtviertel: stats, total: entries.length };
}

const apartmentStats = calculateStats(apartmentEntries, 'apartment');
const wgStats = calculateStats(wgEntries, 'wg');
const dormitoryStats = calculateStats(dormitoryEntries, 'dormitory');

// Save stats
fs.writeFileSync(
  path.join(dataDir, 'rentStatsByStadtviertel_apartment.json'),
  JSON.stringify(apartmentStats.byStadtviertel, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'rentStatsByStadtviertel_wg.json'),
  JSON.stringify(wgStats.byStadtviertel, null, 2)
);

fs.writeFileSync(
  path.join(dataDir, 'rentStatsByStadtviertel_dormitory.json'),
  JSON.stringify(dormitoryStats.byStadtviertel, null, 2)
);

console.log('\n' + '='.repeat(60));
console.log('Summary');
console.log('='.repeat(60));
console.log(`✓ Apartment entries: ${apartmentEntries.length}`);
console.log(`✓ WG entries: ${wgEntries.length}`);
console.log(`✓ Dormitory entries: ${dormitoryEntries.length}`);
console.log(`✓ Total entries: ${apartmentEntries.length + wgEntries.length + dormitoryEntries.length}`);
console.log('\nFiles saved to src/data/:');
console.log('  - userRentData_apartment.json');
console.log('  - userRentData_wg.json');
console.log('  - userRentData_dormitory.json');
console.log('  - rentStatsByStadtviertel_apartment.json');
console.log('  - rentStatsByStadtviertel_wg.json');
console.log('  - rentStatsByStadtviertel_dormitory.json');
console.log('='.repeat(60));
