const fs = require('fs');
const path = require('path');

// Simple point-in-polygon algorithm (ray casting)
// We'll use this instead of adding turf.js dependency
function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  // polygon is an array of rings, we only check the first ring (exterior)
  const ring = polygon[0];

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

// POI categories to check
const POI_CATEGORIES = {
  hasSubway: ['subway_stations'],
  hasHealthcare: ['hospitals', 'doctors'],
  hasSchools: ['schools'],
  hasKindergartens: ['kindergartens'],
  hasSupermarkets: ['supermarkets'],
  hasRestaurants: ['restaurants'],
  hasParks: ['parks']
};

// Load JSON file
function loadJSON(filepath) {
  const data = fs.readFileSync(filepath, 'utf8');
  return JSON.parse(data);
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('Updating Stadtviertel with POI Availability');
  console.log('='.repeat(60));

  // Load stadtviertel data
  const stadtviertelPath = './src/data/stadtviertel_wgs84.json';
  console.log(`\n📂 Loading ${stadtviertelPath}...`);
  const stadtviertel = loadJSON(stadtviertelPath);
  console.log(`✓ Loaded ${stadtviertel.features.length} stadtviertel`);

  // Initialize POI availability for all stadtviertel
  stadtviertel.features.forEach(feature => {
    Object.keys(POI_CATEGORIES).forEach(category => {
      feature.properties[category] = false;
    });
  });

  // Process each POI category
  for (const [propertyName, poiFiles] of Object.entries(POI_CATEGORIES)) {
    console.log(`\n🔍 Processing ${propertyName}...`);

    let totalPOIs = 0;
    let matchedPOIs = 0;

    // Load all POI files for this category
    for (const poiFile of poiFiles) {
      const poiPath = `./src/data/pois/${poiFile}.json`;

      if (!fs.existsSync(poiPath)) {
        console.log(`  ⚠️  ${poiFile}.json not found, skipping`);
        continue;
      }

      const poiData = loadJSON(poiPath);
      const pois = poiData.features || [];
      totalPOIs += pois.length;

      console.log(`  📍 ${poiFile}: ${pois.length} POIs`);

      // For each POI, find which stadtviertel it belongs to
      pois.forEach(poi => {
        const [lon, lat] = poi.geometry.coordinates;

        // Check each stadtviertel polygon
        for (const viertel of stadtviertel.features) {
          if (viertel.geometry.type === 'Polygon') {
            if (pointInPolygon([lon, lat], viertel.geometry.coordinates)) {
              viertel.properties[propertyName] = true;
              matchedPOIs++;
              break; // POI can only be in one viertel
            }
          } else if (viertel.geometry.type === 'MultiPolygon') {
            // Check each polygon in the MultiPolygon
            for (const polygon of viertel.geometry.coordinates) {
              if (pointInPolygon([lon, lat], polygon)) {
                viertel.properties[propertyName] = true;
                matchedPOIs++;
                break;
              }
            }
          }
        }
      });
    }

    // Count how many stadtviertel have this POI type
    const viertelWithPOI = stadtviertel.features.filter(f => f.properties[propertyName]).length;
    console.log(`  ✓ ${viertelWithPOI}/${stadtviertel.features.length} stadtviertel have ${propertyName}`);
    console.log(`  ✓ ${matchedPOIs}/${totalPOIs} POIs matched to stadtviertel`);
  }

  // Save updated stadtviertel data
  console.log('\n💾 Saving updated stadtviertel data...');
  fs.writeFileSync(stadtviertelPath, JSON.stringify(stadtviertel, null, 2));
  console.log(`✓ Saved to ${stadtviertelPath}`);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  // Show example of updated data
  const exampleViertel = stadtviertel.features[0];
  console.log(`\nExample: Viertel ${exampleViertel.properties.vi_nummer}:`);
  Object.keys(POI_CATEGORIES).forEach(category => {
    const hasIt = exampleViertel.properties[category] ? '✓' : '✗';
    console.log(`  ${hasIt} ${category}`);
  });

  // Statistics
  console.log('\nPOI Availability Statistics:');
  Object.keys(POI_CATEGORIES).forEach(category => {
    const count = stadtviertel.features.filter(f => f.properties[category]).length;
    const percentage = ((count / stadtviertel.features.length) * 100).toFixed(1);
    console.log(`  ${category}: ${count}/${stadtviertel.features.length} (${percentage}%)`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('✓ Done!');
  console.log('='.repeat(60));
}

// Run the script
main().catch(console.error);
