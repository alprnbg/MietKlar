const fs = require('fs');
const https = require('https');

// Munich bounding box coordinates
// Format: [south, west, north, east]
const MUNICH_BBOX = {
  south: 48.061,
  west: 11.360,
  north: 48.248,
  east: 11.723
};

// Overpass API endpoint
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// POI categories to fetch
const POI_CATEGORIES = {
  supermarkets: {
    query: 'shop=supermarket',
    filename: 'supermarkets.json'
  },
  restaurants: {
    query: 'amenity=restaurant',
    filename: 'restaurants.json'
  },
  cafes: {
    query: 'amenity=cafe',
    filename: 'cafes.json'
  },
  schools: {
    query: 'amenity=school',
    filename: 'schools.json'
  },
  kindergartens: {
    query: 'amenity=kindergarten',
    filename: 'kindergartens.json'
  },
  pharmacies: {
    query: 'amenity=pharmacy',
    filename: 'pharmacies.json'
  },
  hospitals: {
    query: 'amenity=hospital',
    filename: 'hospitals.json'
  },
  doctors: {
    query: 'amenity=doctors',
    filename: 'doctors.json'
  },
  banks: {
    query: 'amenity=bank',
    filename: 'banks.json'
  },
  atms: {
    query: 'amenity=atm',
    filename: 'atms.json'
  },
  subway_stations: {
    query: 'railway=subway_entrance',
    filename: 'subway_stations.json'
  },
  tram_stops: {
    query: 'railway=tram_stop',
    filename: 'tram_stops.json'
  },
  bus_stops: {
    query: 'highway=bus_stop',
    filename: 'bus_stops.json'
  },
  parks: {
    query: 'leisure=park',
    filename: 'parks.json'
  },
  playgrounds: {
    query: 'leisure=playground',
    filename: 'playgrounds.json'
  },
  gyms: {
    query: 'leisure=fitness_centre',
    filename: 'gyms.json'
  },
  bars: {
    query: 'amenity=bar',
    filename: 'bars.json'
  },
  pubs: {
    query: 'amenity=pub',
    filename: 'pubs.json'
  }
};

// Build Overpass QL query
function buildQuery(category, bbox) {
  // Split "key=value" format for proper Overpass QL syntax
  const [key, value] = category.split('=');

  return `
[out:json][timeout:60];
(
  node["${key}"="${value}"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
  way["${key}"="${value}"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
  relation["${key}"="${value}"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
);
out center;
`;
}

// Fetch data from Overpass API
function fetchPOI(category, queryString) {
  return new Promise((resolve, reject) => {
    const query = buildQuery(queryString, MUNICH_BBOX);
    const postData = `data=${encodeURIComponent(query)}`;

    console.log(`\nFetching ${category}...`);
    console.log(`Query: ${queryString}`);

    const options = {
      hostname: 'overpass-api.de',
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`✓ Found ${json.elements?.length || 0} ${category}`);
            resolve(json);
          } catch (e) {
            console.error(`✗ Error parsing JSON for ${category}:`, e.message);
            reject(e);
          }
        } else if (res.statusCode === 429) {
          console.error(`✗ Rate limited for ${category}. Waiting...`);
          reject(new Error('Rate limited'));
        } else {
          console.error(`✗ HTTP ${res.statusCode} for ${category}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error(`✗ Network error for ${category}:`, e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// Transform Overpass data to GeoJSON
function transformToGeoJSON(overpassData, category) {
  const features = overpassData.elements.map(element => {
    let coordinates;

    // Handle different geometry types
    if (element.type === 'node') {
      coordinates = [element.lon, element.lat];
    } else if (element.center) {
      // For ways and relations, use center point
      coordinates = [element.center.lon, element.center.lat];
    } else {
      return null;
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coordinates
      },
      properties: {
        id: element.id,
        type: element.type,
        name: element.tags?.name || 'Unnamed',
        category: category,
        ...element.tags
      }
    };
  }).filter(f => f !== null);

  return {
    type: 'FeatureCollection',
    features: features,
    metadata: {
      category: category,
      count: features.length,
      generatedAt: new Date().toISOString(),
      bbox: MUNICH_BBOX
    }
  };
}

// Sleep function for rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
async function main() {
  console.log('='.repeat(60));
  console.log('Munich POI Fetcher - Overpass API');
  console.log('='.repeat(60));
  console.log(`Bounding Box: ${MUNICH_BBOX.south},${MUNICH_BBOX.west} to ${MUNICH_BBOX.north},${MUNICH_BBOX.east}`);
  console.log(`Categories: ${Object.keys(POI_CATEGORIES).length}`);
  console.log('='.repeat(60));

  // Create output directory
  const outputDir = './src/data/pois';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`\n✓ Created directory: ${outputDir}`);
  }

  let successCount = 0;
  let failureCount = 0;

  for (const [category, config] of Object.entries(POI_CATEGORIES)) {
    try {
      // Fetch data
      const data = await fetchPOI(category, config.query);

      // Transform to GeoJSON
      const geoJSON = transformToGeoJSON(data, category);

      // Save to file
      const filepath = `${outputDir}/${config.filename}`;
      fs.writeFileSync(filepath, JSON.stringify(geoJSON, null, 2));
      console.log(`✓ Saved to ${filepath}`);

      successCount++;

      // Rate limiting - wait 2 seconds between requests
      console.log('Waiting 2 seconds before next request...');
      await sleep(2000);

    } catch (error) {
      console.error(`✗ Failed to fetch ${category}:`, error.message);
      failureCount++;

      // If rate limited, wait longer
      if (error.message === 'Rate limited') {
        console.log('Waiting 10 seconds due to rate limit...');
        await sleep(10000);
      } else {
        await sleep(2000);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`✓ Successfully fetched: ${successCount} categories`);
  console.log(`✗ Failed: ${failureCount} categories`);
  console.log(`📁 Output directory: ${outputDir}`);
  console.log('='.repeat(60));
}

// Run the script
main().catch(console.error);
