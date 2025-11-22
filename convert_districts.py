#!/usr/bin/env python3
import json

# Fake rent data for Munich districts
rent_data = {
    "01": {"averageRent": 1850, "minRent": 1400, "maxRent": 2800, "fairRent": 1650, "pricePerSqm": 23.5, "description": "Historic city center with premium locations"},
    "02": {"averageRent": 1650, "minRent": 1200, "maxRent": 2400, "fairRent": 1450, "pricePerSqm": 21.0, "description": "Vibrant area near main station and Isar river"},
    "03": {"averageRent": 1550, "minRent": 1100, "maxRent": 2200, "fairRent": 1400, "pricePerSqm": 19.8, "description": "University district with cultural attractions"},
    "04": {"averageRent": 1480, "minRent": 1050, "maxRent": 2100, "fairRent": 1350, "pricePerSqm": 18.9, "description": "Trendy neighborhood with parks and cafes"},
    "05": {"averageRent": 1620, "minRent": 1150, "maxRent": 2300, "fairRent": 1450, "pricePerSqm": 20.6, "description": "Popular residential area east of Isar"},
    "06": {"averageRent": 1380, "minRent": 950, "maxRent": 1950, "fairRent": 1250, "pricePerSqm": 17.6, "description": "Affordable residential area south of center"},
    "07": {"averageRent": 1420, "minRent": 1000, "maxRent": 2000, "fairRent": 1280, "pricePerSqm": 18.1, "description": "Family-friendly area with Westpark"},
    "08": {"averageRent": 1460, "minRent": 1050, "maxRent": 2100, "fairRent": 1320, "pricePerSqm": 18.6, "description": "Mixed area with Theresienwiese nearby"},
    "09": {"averageRent": 1580, "minRent": 1100, "maxRent": 2350, "fairRent": 1420, "pricePerSqm": 20.1, "description": "Elegant district with Nymphenburg Palace"},
    "10": {"averageRent": 1280, "minRent": 900, "maxRent": 1850, "fairRent": 1150, "pricePerSqm": 16.3, "description": "Affordable northwestern district"},
    "11": {"averageRent": 1250, "minRent": 880, "maxRent": 1800, "fairRent": 1120, "pricePerSqm": 15.9, "description": "Residential area in northern Munich"},
    "12": {"averageRent": 1520, "minRent": 1080, "maxRent": 2200, "fairRent": 1380, "pricePerSqm": 19.4, "description": "Northern Schwabing with Englischer Garten"},
    "13": {"averageRent": 1780, "minRent": 1300, "maxRent": 2650, "fairRent": 1600, "pricePerSqm": 22.6, "description": "Upscale district with villa neighborhoods"},
    "14": {"averageRent": 1320, "minRent": 920, "maxRent": 1900, "fairRent": 1180, "pricePerSqm": 16.8, "description": "Eastern district with good transport links"},
    "15": {"averageRent": 1350, "minRent": 950, "maxRent": 1950, "fairRent": 1200, "pricePerSqm": 17.2, "description": "Growing area with new developments"},
    "16": {"averageRent": 1290, "minRent": 900, "maxRent": 1850, "fairRent": 1150, "pricePerSqm": 16.5, "description": "Southeast district with mixed housing"},
    "17": {"averageRent": 1410, "minRent": 980, "maxRent": 2000, "fairRent": 1270, "pricePerSqm": 17.9, "description": "Residential area south of Isar"},
    "18": {"averageRent": 1450, "minRent": 1020, "maxRent": 2050, "fairRent": 1310, "pricePerSqm": 18.4, "description": "Quiet residential district with good connections"},
    "19": {"averageRent": 1520, "minRent": 1080, "maxRent": 2200, "fairRent": 1380, "pricePerSqm": 19.3, "description": "Large southern district with green spaces"},
    "20": {"averageRent": 1390, "minRent": 970, "maxRent": 1980, "fairRent": 1250, "pricePerSqm": 17.7, "description": "Southwest district near Waldfriedhof"},
    "21": {"averageRent": 1560, "minRent": 1100, "maxRent": 2250, "fairRent": 1410, "pricePerSqm": 19.9, "description": "Western district with excellent amenities"},
    "22": {"averageRent": 1340, "minRent": 940, "maxRent": 1920, "fairRent": 1200, "pricePerSqm": 17.1, "description": "Far western district with suburban character"},
    "23": {"averageRent": 1270, "minRent": 890, "maxRent": 1830, "fairRent": 1140, "pricePerSqm": 16.2, "description": "Northwestern district with industrial areas"},
    "24": {"averageRent": 1240, "minRent": 870, "maxRent": 1790, "fairRent": 1110, "pricePerSqm": 15.8, "description": "Northern district with affordable housing"},
    "25": {"averageRent": 1440, "minRent": 1010, "maxRent": 2040, "fairRent": 1300, "pricePerSqm": 18.3, "description": "Central-western district near train stations"}
}

# Load GeoJSON
with open('munich_districts_wgs84.json', 'r') as f:
    geojson_data = json.load(f)

# Combine multi-polygon districts and deduplicate
districts_map = {}
for feature in geojson_data['features']:
    sb_nummer = feature['properties']['sb_nummer']
    name = feature['properties']['name']

    if sb_nummer not in districts_map:
        districts_map[sb_nummer] = {
            'name': name,
            'geometries': [feature['geometry']['coordinates']]
        }
    else:
        # Add to existing (multi-polygon district)
        districts_map[sb_nummer]['geometries'].append(feature['geometry']['coordinates'])

# Build TypeScript output
output_features = []
for sb_nummer, district_info in sorted(districts_map.items()):
    name = district_info['name']
    rent_info = rent_data.get(sb_nummer, rent_data["10"])  # fallback to district 10

    # Use MultiPolygon if multiple geometries, otherwise Polygon
    if len(district_info['geometries']) > 1:
        geometry = {
            'type': 'MultiPolygon',
            'coordinates': district_info['geometries']
        }
    else:
        geometry = {
            'type': 'Polygon',
            'coordinates': district_info['geometries'][0]
        }

    feature = {
        'type': 'Feature',
        'properties': {
            'name': name,
            'id': int(sb_nummer),
            'rentData': {
                'name': name,
                **rent_info
            }
        },
        'geometry': geometry
    }
    output_features.append(feature)

# Generate TypeScript file
ts_content = '''import { DistrictsGeoJSON } from '../types';

export const munichDistrictsData: DistrictsGeoJSON = '''

ts_content += json.dumps({
    'type': 'FeatureCollection',
    'features': output_features
}, indent=2)

ts_content += ';\n'

with open('src/data/munichDistricts_real.ts', 'w') as f:
    f.write(ts_content)

print(f"✓ Generated src/data/munichDistricts_real.ts with {len(output_features)} districts")
print(f"Districts: {', '.join([d['name'] for d in sorted(districts_map.values(), key=lambda x: x['name'])])}")
