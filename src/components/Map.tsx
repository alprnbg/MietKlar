import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Layer } from 'leaflet';
import { getApartmentRentColor, getWGRentColor, getDormitoryRentColor } from '../utils/colorScales';
import { MunichDistrict, DistrictsGeoJSON, RentType } from '../types';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  onDistrictClick: (district: MunichDistrict) => void;
  districtsData: DistrictsGeoJSON;
  rentType: RentType;
}

export const Map = ({ onDistrictClick, districtsData, rentType }: MapProps) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [geoJsonKey, setGeoJsonKey] = useState(0);

  useEffect(() => {
    // Force GeoJSON to re-render when data changes
    setGeoJsonKey(prev => prev + 1);
  }, [districtsData]);

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
        <GeoJSON
          key={geoJsonKey}
          data={districtsData as any}
          style={getStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

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
