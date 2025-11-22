# Munich POI Fetcher - Overpass API

## 📍 What This Does

Fetches Points of Interest (POIs) for Munich using the Overpass API and saves them as GeoJSON files.

## 🚀 How to Use

### Method 1: Fetch All Categories (Recommended)
```bash
node fetch_munich_pois.js
```

This will:
- Fetch 18 different POI categories
- Save each category to `src/data/pois/[category].json`
- Include rate limiting (2 seconds between requests)
- Show progress and statistics

### Method 2: Quick Test (Single Category)
```bash
node fetch_munich_pois_quick.js supermarkets
```

## 📊 POI Categories Included

1. **Shopping**
   - Supermarkets
   - Pharmacies

2. **Food & Drink**
   - Restaurants
   - Cafes
   - Bars
   - Pubs

3. **Education**
   - Schools
   - Kindergartens

4. **Healthcare**
   - Hospitals
   - Doctors

5. **Finance**
   - Banks
   - ATMs

6. **Transportation**
   - Subway Stations
   - Tram Stops
   - Bus Stops

7. **Leisure**
   - Parks
   - Playgrounds
   - Gyms

## 🛠️ Output Format

Each JSON file is a GeoJSON FeatureCollection:

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
        ...
      }
    }
  ],
  "metadata": {
    "category": "supermarkets",
    "count": 150,
    "generatedAt": "2025-01-22T...",
    "bbox": {...}
  }
}
```

## ⚠️ Common Issues & Solutions

### Empty JSON Files

**Problem:** Files are created but contain no POIs
```json
{
  "type": "FeatureCollection",
  "features": [],
  "metadata": { "count": 0 }
}
```

**Solutions:**

1. **Check Bounding Box** - Make sure Munich coordinates are correct:
   ```javascript
   const MUNICH_BBOX = {
     south: 48.061,
     west: 11.360,
     north: 48.248,
     east: 11.723
   };
   ```

2. **Verify Query Syntax** - Test query on https://overpass-turbo.eu:
   ```
   [out:json];
   node["shop"="supermarket"](48.061,11.360,48.248,11.723);
   out;
   ```

3. **Check Tag Names** - Some POIs use different tags:
   - `amenity=restaurant` ✓ (common)
   - `cuisine=restaurant` ✗ (incorrect)

4. **Rate Limiting** - If getting HTTP 429:
   - Increase delay between requests (currently 2 seconds)
   - Try different Overpass API servers

### Timeout Errors

**Solution:** Increase timeout in query:
```javascript
[out:json][timeout:120];  // Increase from 60 to 120 seconds
```

### Rate Limit (HTTP 429)

**Solution:** Script automatically waits 10 seconds when rate limited. You can also:
- Use a different Overpass server: `https://overpass.kumi.systems/api/interpreter`
- Reduce number of categories
- Increase wait time between requests

## 🎯 Testing Your Query

Before running the full script, test your query at:
https://overpass-turbo.eu

Example test query for Munich supermarkets:
```
[out:json][timeout:25];
node["shop"="supermarket"](48.061,11.360,48.248,11.723);
out center;
```

## 📝 Customization

### Add More Categories

Edit `POI_CATEGORIES` in `fetch_munich_pois.js`:

```javascript
my_category: {
  query: 'amenity=library',  // Overpass tag
  filename: 'libraries.json'  // Output filename
}
```

### Change Bounding Box

To fetch POIs for a different area:

1. Get coordinates from https://boundingbox.klokantech.com/
2. Update `MUNICH_BBOX` in the script

### Adjust Rate Limiting

```javascript
await sleep(2000);  // Change to 5000 for 5 seconds
```

## 🔍 Debugging

Enable verbose logging:

```javascript
console.log('Raw response:', data.substring(0, 500));
```

Check if query returns data:
```bash
curl -X POST https://overpass-api.de/api/interpreter \
  -d 'data=[out:json];node["shop"="supermarket"](48.061,11.360,48.248,11.723);out;'
```

## 📚 Useful Links

- [Overpass API Documentation](https://wiki.openstreetmap.org/wiki/Overpass_API)
- [Overpass Turbo (Query Tester)](https://overpass-turbo.eu)
- [OSM Tag Finder](https://taginfo.openstreetmap.org/)
- [Munich on OSM](https://www.openstreetmap.org/relation/62428)
