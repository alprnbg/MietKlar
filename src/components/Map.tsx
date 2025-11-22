import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';
import { Layer } from 'leaflet';
import { getApartmentRentColor, getWGRentColor, getDormitoryRentColor } from '../utils/colorScales';
import { MunichDistrict, DistrictsGeoJSON, RentType } from '../types';
import { stadtviertelData } from '../data/stadtviertel';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  onDistrictClick: (district: MunichDistrict) => void;
  districtsData: DistrictsGeoJSON;
  rentType: RentType;
}

// Component to track zoom level
function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });
  return null;
}

export const Map = ({ onDistrictClick, districtsData, rentType }: MapProps) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [geoJsonKey, setGeoJsonKey] = useState(0);
  const [currentZoom, setCurrentZoom] = useState(11);
  const ZOOM_THRESHOLD = 13; // Show stadtviertel when zoom >= 13

  useEffect(() => {
    // Force GeoJSON to re-render when data changes or zoom changes
    setGeoJsonKey(prev => prev + 1);
  }, [districtsData, currentZoom]);

  const getRentColor =
    rentType === 'apartment' ? getApartmentRentColor :
    rentType === 'wg' ? getWGRentColor :
    getDormitoryRentColor;

  const onEachFeature = (feature: any, layer: Layer) => {
    const district = feature as MunichDistrict;

    // Bind tooltip to this specific layer
    layer.bindTooltip(
      `<div>
        <strong>${district.properties.name}</strong><br/>
        Ø Miete: €${district.properties.rentData.averageRent}<br/>
        Fair Miete: €${district.properties.rentData.fairRent}<br/>
        €${district.properties.rentData.pricePerSqm}/m²
      </div>`,
      { sticky: true }
    );

    layer.on({
      mouseover: () => {
        setHoveredDistrict(district.properties.name);
        (layer as any).setStyle({
          weight: 3,
          fillOpacity: 0.8
        });
      },
      mouseout: () => {
        setHoveredDistrict(null);
        (layer as any).setStyle({
          weight: 2,
          fillOpacity: 0.6
        });
      },
      click: () => {
        onDistrictClick(district);
      }
    });
  };

  // Handler for stadtviertel features (neighborhoods)
  const onEachStadtviertel = (feature: any, layer: Layer) => {
    const viertelName = feature.properties?.vi_nummer || 'Unknown';

    // Bind tooltip
    layer.bindTooltip(
      `<div>
        <strong>Viertel: ${viertelName}</strong><br/>
        <em>Detailed rent data coming soon</em>
      </div>`,
      { sticky: true }
    );

    layer.on({
      mouseover: () => {
        setHoveredDistrict(viertelName);
        (layer as any).setStyle({
          weight: 2,
          fillOpacity: 0.7
        });
      },
      mouseout: () => {
        setHoveredDistrict(null);
        (layer as any).setStyle({
          weight: 1,
          fillOpacity: 0.5
        });
      }
    });
  };

  const getStyle = (feature: any) => {
    const district = feature as MunichDistrict;
    const color = getRentColor(district.properties.rentData.averageRent);

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: '#666',
      fillOpacity: 0.6
    };
  };

  // Style for stadtviertel (simple blue color for now)
  const getStadtviertelStyle = () => {
    return {
      fillColor: '#4A90E2',
      weight: 1,
      opacity: 1,
      color: '#2E5C8A',
      fillOpacity: 0.5
    };
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[48.1351, 11.582]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomTracker onZoomChange={setCurrentZoom} />

        {/* Show Bezirke (districts) when zoomed out */}
        {currentZoom < ZOOM_THRESHOLD && (
          <GeoJSON
            key={`bezirke-${geoJsonKey}`}
            data={districtsData as any}
            style={getStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Show Stadtviertel (neighborhoods) when zoomed in */}
        {currentZoom >= ZOOM_THRESHOLD && (
          <GeoJSON
            key={`viertel-${geoJsonKey}`}
            data={stadtviertelData as any}
            style={getStadtviertelStyle}
            onEachFeature={onEachStadtviertel}
          />
        )}
      </MapContainer>

      {/* Zoom indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 1000,
        fontSize: '12px',
        fontWeight: '600',
        color: '#333'
      }}>
        {currentZoom >= ZOOM_THRESHOLD ? '🔍 Stadtviertel' : '📍 Bezirke'} (Zoom: {currentZoom})
      </div>

      {hoveredDistrict && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '8px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <strong>{hoveredDistrict}</strong>
        </div>
      )}
    </div>
  );
};
