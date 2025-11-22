# Munich POI Scripts

This directory contains scripts for fetching and processing Points of Interest (POI) data for Munich neighborhoods.

## 📋 Overview

There are two main scripts:

1. **fetch_munich_pois.cjs** - Fetches POI data from OpenStreetMap via Overpass API
2. **update_stadtviertel_pois.cjs** - Updates stadtviertel GeoJSON with POI availability information

## 🔄 Workflow

### Step 1: Fetch POI Data

```bash
node fetch_munich_pois.cjs
```

This script:
- Fetches 18 different POI categories from OpenStreetMap
- Saves each category to `src/data/pois/[category].json`
- Includes rate limiting (2 seconds between requests)
- Handles errors and retries

**Categories fetched:**
- 🛒 Supermarkets (697 POIs)
- 🍽️ Restaurants (2,372 POIs)
- ☕ Cafes (881 POIs)
- 🏫 Schools (544 POIs)
- 👶 Kindergartens (1,179 POIs)
- 💊 Pharmacies (370 POIs)
- 🏥 Hospitals (47 POIs)
- 👨‍⚕️ Doctors (1,027 POIs)
- 🏦 Banks (263 POIs)
- 🏧 ATMs (425 POIs)
- 🚇 Subway Stations (633 POIs)
- 🚊 Tram Stops (245 POIs)
- 🚌 Bus Stops (3,360 POIs)
- 🌳 Parks (1,144 POIs)
- 🎮 Playgrounds (3,599 POIs)
- 💪 Gyms (279 POIs)
- 🍺 Bars (312 POIs)
- 🍻 Pubs (283 POIs)

**Time required:** ~36 seconds (with rate limiting)

### Step 2: Update Stadtviertel Data

```bash
node update_stadtviertel_pois.cjs
```

This script:
- Reads all POI JSON files from `src/data/pois/`
- Loads stadtviertel GeoJSON from `src/data/stadtviertel_wgs84.json`
- For each POI, determines which stadtviertel it belongs to using point-in-polygon algorithm
- Updates each stadtviertel with POI availability flags:
  - `hasSubway` - Has at least one subway station
  - `hasHealthcare` - Has at least one hospital or doctor
  - `hasSchools` - Has at least one school
  - `hasKindergartens` - Has at least one kindergarten
  - `hasSupermarkets` - Has at least one supermarket
  - `hasRestaurants` - Has at least one restaurant
  - `hasParks` - Has at least one park
- Saves updated data back to `src/data/stadtviertel_wgs84.json`

**Statistics:**
- 477 total stadtviertel
- 79.9% have restaurants
- 70.9% have parks
- 68.8% have kindergartens
- 53.5% have supermarkets
- 51.2% have healthcare
- 45.1% have schools
- 38.4% have subway stations

**Time required:** ~5 seconds

## 🎨 Frontend Display

The POI availability is displayed in the **StadtviertelDetail** component when clicking on a neighborhood:

- Shows 7 amenity categories with icons
- Green checkmark (✓) if available, red X (✗) if not
- Available amenities are highlighted in green
- Unavailable amenities are grayed out

## 🔧 Technical Details

### Point-in-Polygon Algorithm

The `update_stadtviertel_pois.cjs` script uses a ray-casting algorithm to determine if a POI point falls within a stadtviertel polygon:

```javascript
function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;
  const ring = polygon[0]; // exterior ring

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}
```

This avoids adding external dependencies like Turf.js.

### Overpass API Query Format

Queries use Overpass QL syntax:

```
[out:json][timeout:60];
(
  node["amenity"="restaurant"](48.061,11.360,48.248,11.723);
  way["amenity"="restaurant"](48.061,11.360,48.248,11.723);
  relation["amenity"="restaurant"](48.061,11.360,48.248,11.723);
);
out center;
```

This fetches:
- `node` - Point features
- `way` - Line/polygon features (converted to center point)
- `relation` - Multi-polygon features (converted to center point)

### Munich Bounding Box

```javascript
const MUNICH_BBOX = {
  south: 48.061,
  west: 11.360,
  north: 48.248,
  east: 11.723
};
```

## 🐛 Troubleshooting

### Empty POI files

If POI files are empty after running `fetch_munich_pois.cjs`:

1. **Check query syntax** - Test on https://overpass-turbo.eu
2. **Verify tag names** - Some POIs use different tags (e.g., `amenity=doctors` vs `amenity=clinic`)
3. **Rate limiting** - If getting HTTP 429, increase wait time between requests
4. **Timeout** - Increase timeout in query: `[out:json][timeout:120]`

### POIs not matching to stadtviertel

If `update_stadtviertel_pois.cjs` shows low match rates:

1. **Coordinate system** - Ensure both use WGS84 (EPSG:4326)
2. **Polygon validity** - Check for self-intersecting polygons
3. **Boundary precision** - Some POIs may fall just outside boundaries

## 📁 Output Files

### POI GeoJSON Format

Each POI file (`src/data/pois/[category].json`) has this structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [11.5820, 48.1351]
      },
      "properties": {
        "id": 123456,
        "name": "Example Supermarket",
        "category": "supermarkets",
        "opening_hours": "Mo-Sa 08:00-20:00",
        "wheelchair": "yes",
        ...
      }
    }
  ],
  "metadata": {
    "category": "supermarkets",
    "count": 697,
    "generatedAt": "2025-11-22T...",
    "bbox": {...}
  }
}
```

### Updated Stadtviertel Format

After running `update_stadtviertel_pois.cjs`, each feature in `stadtviertel_wgs84.json` has:

```json
{
  "type": "Feature",
  "properties": {
    "vi_nummer": "20.3.6",
    "flaeche_qm": 111598.12,
    "hasSubway": false,
    "hasHealthcare": false,
    "hasSchools": false,
    "hasKindergartens": true,
    "hasSupermarkets": false,
    "hasRestaurants": false,
    "hasParks": true
  },
  "geometry": {...}
}
```

## 🔄 Updating POI Data

To refresh POI data:

```bash
# Step 1: Fetch latest POI data from OpenStreetMap
node fetch_munich_pois.cjs

# Step 2: Update stadtviertel with new POI availability
node update_stadtviertel_pois.cjs
```

Recommended frequency: Monthly (or when significant changes to POIs are expected)

## 📚 Resources

- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [Overpass Turbo (Query Tester)](https://overpass-turbo.eu)
- [OSM Tag Finder](https://taginfo.openstreetmap.org/)
- [Munich on OSM](https://www.openstreetmap.org/relation/62428)

## 🎯 Future Enhancements

Potential improvements:
- Add more POI categories (libraries, post offices, etc.)
- Show POI count per category (not just boolean availability)
- Display actual POI locations on the map
- Filter stadtviertel by POI availability
- Distance to nearest POI of each type
- POI density heatmap
