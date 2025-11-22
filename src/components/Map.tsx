import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import { Layer } from 'leaflet';
import { getUnfairnessColor } from '../utils/colorScales';
import { DistrictsGeoJSON, RentType } from '../types';
import { stadtviertelData } from '../data/stadtviertel';
import { getAggregatedStatsByStadtviertel, AggregatedRentStats } from '../utils/userRentDatabase';
import { getViertelCenter } from '../utils/geoUtils';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  districtsData: DistrictsGeoJSON;
  rentType: RentType;
  refreshTrigger?: number; // Used to trigger map refresh when user data changes
  highlightStadtviertel?: string; // Stadtviertel ID to highlight
  onViertelClick?: (viertelId: string) => void; // Callback when a viertel is clicked
  initialCenter?: [number, number]; // Initial map center
  initialZoom?: number; // Initial map zoom level
  zoomToViertel?: string | null; // Viertel ID to zoom to
  onZoomComplete?: () => void; // Callback when zoom is complete
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

// Component to handle zooming to a viertel
function ViertelZoomer({ viertelId, onComplete }: { viertelId: string | null; onComplete?: () => void }) {
  const map = useMap();

  useEffect(() => {
    if (viertelId) {
      const center = getViertelCenter(viertelId);
      if (center) {
        map.flyTo(center, 15, { duration: 1.5 });
        // Call onComplete after zoom animation
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1500);
      }
    }
  }, [viertelId, map, onComplete]);

  return null;
}

export const Map = ({
  districtsData,
  rentType,
  refreshTrigger,
  highlightStadtviertel,
  onViertelClick,
  initialCenter = [48.1351, 11.582],
  initialZoom = 11,
  zoomToViertel,
  onZoomComplete
}: MapProps) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [geoJsonKey, setGeoJsonKey] = useState(0);
  const [currentZoom, setCurrentZoom] = useState(11);
  const [rentStatsMap, setRentStatsMap] = useState<Map<string, AggregatedRentStats>>(() => getAggregatedStatsByStadtviertel(rentType));

  useEffect(() => {
    // Force GeoJSON to re-render when data changes or zoom changes
    setGeoJsonKey(prev => prev + 1);
  }, [districtsData, currentZoom]);

  useEffect(() => {
    // Refresh aggregated stats when user data changes or rent type changes
    setRentStatsMap(getAggregatedStatsByStadtviertel(rentType));
    setGeoJsonKey(prev => prev + 1);
  }, [refreshTrigger, rentType]);

  // Handler for stadtviertel features (neighborhoods)
  const onEachStadtviertel = (feature: any, layer: Layer) => {
    const viertelId = feature.properties?.vi_nummer || feature.id;
    const rentStats = rentStatsMap.get(viertelId);

    // Build tooltip content
    let tooltipContent = `<div><strong>Viertel: ${viertelId}</strong><br/>`;

    if (rentStats && rentStats.entryCount > 0) {
      const unfairnessSign = rentStats.unfairnessPercentage >= 0 ? '+' : '';
      tooltipContent += `
        <strong>€${rentStats.avgPricePerSqm}/m²</strong> (${rentStats.entryCount} entries)<br/>
        Fair: €${rentStats.fairPricePerSqm.toFixed(2)}/m²<br/>
        <strong style="color: ${getUnfairnessColor(rentStats.unfairnessPercentage)}">${unfairnessSign}${rentStats.unfairnessPercentage.toFixed(1)}%</strong> vs Fair<br/>
        Ø Miete: €${rentStats.avgRent} | Ø ${rentStats.avgM2}m²
      `;
    } else {
      tooltipContent += `<em>No user data yet</em>`;
    }

    tooltipContent += '</div>';

    // Bind tooltip
    layer.bindTooltip(tooltipContent, { sticky: true });

    layer.on({
      mouseover: () => {
        setHoveredDistrict(rentStats ? `${viertelId} (${rentStats.entryCount} entries)` : viertelId);
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
      },
      click: () => {
        if (onViertelClick) {
          onViertelClick(viertelId);
        }
      }
    });
  };

  // Style for stadtviertel (color by unfairness)
  const getStadtviertelStyle = (feature: any) => {
    const viertelId = feature.properties?.vi_nummer || feature.id;
    const rentStats = rentStatsMap.get(viertelId);
    const isHighlighted = highlightStadtviertel === viertelId;

    let fillColor = '#CCCCCC'; // Gray for no data

    if (rentStats && rentStats.entryCount > 0) {
      // Use unfairness color scale
      fillColor = getUnfairnessColor(rentStats.unfairnessPercentage);
    }

    return {
      fillColor: fillColor,
      weight: isHighlighted ? 4 : 1, // Thicker border for highlighted
      opacity: 1,
      color: isHighlighted ? '#FF6B00' : '#666', // Orange border for highlighted
      fillOpacity: rentStats && rentStats.entryCount > 0 ? 0.6 : 0.3
    };
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomTracker onZoomChange={setCurrentZoom} />
        <ViertelZoomer viertelId={zoomToViertel ?? null} onComplete={onZoomComplete} />

        {/* Always show Stadtviertel with unfairness coloring */}
        <GeoJSON
          key={`viertel-${geoJsonKey}`}
          data={stadtviertelData as any}
          style={getStadtviertelStyle}
          onEachFeature={onEachStadtviertel}
        />
      </MapContainer>

      {/* Zoom indicator 
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
      */}
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
