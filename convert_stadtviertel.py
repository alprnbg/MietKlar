#!/usr/bin/env python3
import json
from pyproj import Transformer

# Create transformer from EPSG:25832 (UTM 32N) to EPSG:4326 (WGS84)
# Munich data is typically in EPSG:25832
transformer = Transformer.from_crs("EPSG:25832", "EPSG:4326", always_xy=True)

def convert_coordinates(coords):
    """Recursively convert coordinates from UTM to WGS84"""
    if isinstance(coords[0], (int, float)):
        # This is a single coordinate pair
        lon, lat = transformer.transform(coords[0], coords[1])
        return [lon, lat]
    else:
        # This is a nested array
        return [convert_coordinates(c) for c in coords]

# Load the stadtviertel GeoJSON
print("Loading stadtviertel.json...")
with open('stadtviertel.json', 'r') as f:
    data = json.load(f)

print(f"Found {len(data['features'])} stadtviertel features")

# Convert each feature's coordinates
for i, feature in enumerate(data['features']):
    if i % 50 == 0:
        print(f"Converting feature {i+1}/{len(data['features'])}...")

    feature['geometry']['coordinates'] = convert_coordinates(
        feature['geometry']['coordinates']
    )

# Save the converted data
output_file = 'stadtviertel_wgs84.json'
with open(output_file, 'w') as f:
    json.dump(data, f)

print(f"✓ Converted coordinates saved to {output_file}")
print(f"✓ Total features: {len(data['features'])}")
