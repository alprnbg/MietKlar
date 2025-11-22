import requests
import json
from pathlib import Path

# -------------------------------
# Overpass API endpoint
# -------------------------------
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# -------------------------------
# Munich boundary (OSM relation)
# Relation 62422 = Stadtbezirk München
# -------------------------------
MUNICH_RELATION_ID = 62422

# -------------------------------
# POI categories you want
# Key = category name in output
# Value = Overpass tag filter
# You can add unlimited categories here
# -------------------------------
CATEGORIES = {
    "hospitals":       '["amenity"="hospital"]',
    "schools":         '["amenity"="school"]',
    "kindergartens":   '["amenity"="kindergarten"]',
    "parks":           '["leisure"="park"]',
    "playgrounds":     '["leisure"="playground"]',
    "sports_centers":  '["leisure"="sports_centre"]',
    "sports_pitches":  '["leisure"="pitch"]'
}

# -------------------------------
# Helper: build Overpass Query
# -------------------------------
def build_query(tag):
    return f"""
    [out:json][timeout:60];
    area({MUNICH_RELATION_ID})->.searchArea;

    (
      node{tag}(area.searchArea);
      way{tag}(area.searchArea);
      relation{tag}(area.searchArea);
    );

    out center;
    """

# -------------------------------
# Helper: run Overpass Query
# -------------------------------
def fetch_pois(tag):
    query = build_query(tag)
    response = requests.post(OVERPASS_URL, data={"data": query})
    response.raise_for_status()
    return response.json()

# -------------------------------
# Convert Overpass -> GeoJSON
# -------------------------------
def overpass_to_geojson(overpass_data):
    features = []

    for el in overpass_data.get("elements", []):
        # Find coordinates (node or centroid of ways/rel.)
        if el["type"] == "node":
            lon = el["lon"]
            lat = el["lat"]
        else:
            if "center" not in el:
                # skip objects without center point
                continue
            lon = el["center"]["lon"]
            lat = el["center"]["lat"]

        props = {
            "id": el.get("id"),
            "tags": el.get("tags", {})
        }

        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
            "properties": props
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

# -------------------------------
# Main: fetch and export all sets
# -------------------------------
def main():
    output_dir = Path("munich_pois")
    output_dir.mkdir(exist_ok=True)

    combined = {}

    for name, tag in CATEGORIES.items():
        print(f"Fetching {name}...")
        raw = fetch_pois(tag)
        geojson = overpass_to_geojson(raw)

        # Save to file
        filepath = output_dir / f"{name}.geojson"
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(geojson, f, ensure_ascii=False, indent=2)

        # Also collect a simplified list
        combined[name] = [
            {
                "name": f["properties"]["tags"].get("name"),
                "lat": f["geometry"]["coordinates"][1],
                "lon": f["geometry"]["coordinates"][0],
                "tags": f["properties"]["tags"]
            }
            for f in geojson["features"]
        ]

        print(f" → saved {filepath}")

    # Write combined JSON
    with open(output_dir / "all_pois.json", "w", encoding="utf-8") as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)

    print("All categories exported successfully!")

if __name__ == "__main__":
    main()
