import { DistrictsGeoJSON } from '../types';

export const munichDistrictsData: DistrictsGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Altstadt-Lehel',
        id: 1,
        rentData: {
          name: 'Altstadt-Lehel',
          averageRent: 1850,
          minRent: 1400,
          maxRent: 2800,
          fairRent: 1650,
          pricePerSqm: 23.5,
          description: 'Historic city center with premium locations'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.567, 48.142], [11.595, 48.142], [11.595, 48.132], [11.567, 48.132], [11.567, 48.142]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Ludwigsvorstadt-Isarvorstadt',
        id: 2,
        rentData: {
          name: 'Ludwigsvorstadt-Isarvorstadt',
          averageRent: 1650,
          minRent: 1200,
          maxRent: 2400,
          fairRent: 1450,
          pricePerSqm: 21.0,
          description: 'Vibrant area near main station and Isar river'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.545, 48.132], [11.567, 48.132], [11.567, 48.122], [11.545, 48.122], [11.545, 48.132]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Maxvorstadt',
        id: 3,
        rentData: {
          name: 'Maxvorstadt',
          averageRent: 1550,
          minRent: 1100,
          maxRent: 2200,
          fairRent: 1400,
          pricePerSqm: 19.8,
          description: 'University district with cultural attractions'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.545, 48.142], [11.567, 48.142], [11.567, 48.132], [11.545, 48.132], [11.545, 48.142]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Schwabing-West',
        id: 4,
        rentData: {
          name: 'Schwabing-West',
          averageRent: 1480,
          minRent: 1050,
          maxRent: 2100,
          fairRent: 1350,
          pricePerSqm: 18.9,
          description: 'Trendy neighborhood with parks and cafes'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.545, 48.165], [11.567, 48.165], [11.567, 48.152], [11.545, 48.152], [11.545, 48.165]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Au-Haidhausen',
        id: 5,
        rentData: {
          name: 'Au-Haidhausen',
          averageRent: 1620,
          minRent: 1150,
          maxRent: 2300,
          fairRent: 1450,
          pricePerSqm: 20.6,
          description: 'Popular residential area east of Isar'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.595, 48.132], [11.615, 48.132], [11.615, 48.118], [11.595, 48.118], [11.595, 48.132]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Sendling',
        id: 6,
        rentData: {
          name: 'Sendling',
          averageRent: 1380,
          minRent: 950,
          maxRent: 1950,
          fairRent: 1250,
          pricePerSqm: 17.6,
          description: 'Affordable residential area south of center'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.530, 48.118], [11.555, 48.118], [11.555, 48.105], [11.530, 48.105], [11.530, 48.118]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Sendling-Westpark',
        id: 7,
        rentData: {
          name: 'Sendling-Westpark',
          averageRent: 1420,
          minRent: 1000,
          maxRent: 2000,
          fairRent: 1280,
          pricePerSqm: 18.1,
          description: 'Family-friendly area with Westpark'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.510, 48.125], [11.535, 48.125], [11.535, 48.110], [11.510, 48.110], [11.510, 48.125]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Schwanthalerhöhe',
        id: 8,
        rentData: {
          name: 'Schwanthalerhöhe',
          averageRent: 1460,
          minRent: 1050,
          maxRent: 2100,
          fairRent: 1320,
          pricePerSqm: 18.6,
          description: 'Mixed area with Theresienwiese nearby'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.525, 48.140], [11.545, 48.140], [11.545, 48.128], [11.525, 48.128], [11.525, 48.140]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Neuhausen-Nymphenburg',
        id: 9,
        rentData: {
          name: 'Neuhausen-Nymphenburg',
          averageRent: 1580,
          minRent: 1100,
          maxRent: 2350,
          fairRent: 1420,
          pricePerSqm: 20.1,
          description: 'Elegant district with Nymphenburg Palace'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.510, 48.155], [11.540, 48.155], [11.540, 48.140], [11.510, 48.140], [11.510, 48.155]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Moosach',
        id: 10,
        rentData: {
          name: 'Moosach',
          averageRent: 1280,
          minRent: 900,
          maxRent: 1850,
          fairRent: 1150,
          pricePerSqm: 16.3,
          description: 'Affordable northwestern district'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.490, 48.180], [11.520, 48.180], [11.520, 48.165], [11.490, 48.165], [11.490, 48.180]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Milbertshofen-Am Hart',
        id: 11,
        rentData: {
          name: 'Milbertshofen-Am Hart',
          averageRent: 1250,
          minRent: 880,
          maxRent: 1800,
          fairRent: 1120,
          pricePerSqm: 15.9,
          description: 'Residential area in northern Munich'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.545, 48.190], [11.575, 48.190], [11.575, 48.175], [11.545, 48.175], [11.545, 48.190]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Schwabing-Freimann',
        id: 12,
        rentData: {
          name: 'Schwabing-Freimann',
          averageRent: 1520,
          minRent: 1080,
          maxRent: 2200,
          fairRent: 1380,
          pricePerSqm: 19.4,
          description: 'Northern Schwabing with Englischer Garten'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.575, 48.175], [11.605, 48.175], [11.605, 48.158], [11.575, 48.158], [11.575, 48.175]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Bogenhausen',
        id: 13,
        rentData: {
          name: 'Bogenhausen',
          averageRent: 1780,
          minRent: 1300,
          maxRent: 2650,
          fairRent: 1600,
          pricePerSqm: 22.6,
          description: 'Upscale district with villa neighborhoods'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.605, 48.158], [11.635, 48.158], [11.635, 48.142], [11.605, 48.142], [11.605, 48.158]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Berg am Laim',
        id: 14,
        rentData: {
          name: 'Berg am Laim',
          averageRent: 1320,
          minRent: 920,
          maxRent: 1900,
          fairRent: 1180,
          pricePerSqm: 16.8,
          description: 'Eastern district with good transport links'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.625, 48.125], [11.655, 48.125], [11.655, 48.110], [11.625, 48.110], [11.625, 48.125]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Trudering-Riem',
        id: 15,
        rentData: {
          name: 'Trudering-Riem',
          averageRent: 1350,
          minRent: 950,
          maxRent: 1950,
          fairRent: 1200,
          pricePerSqm: 17.2,
          description: 'Growing area with new developments'
        }
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [11.655, 48.135], [11.690, 48.135], [11.690, 48.118], [11.655, 48.118], [11.655, 48.135]
        ]]
      }
    }
  ]
};

export const getRentColor = (averageRent: number): string => {
  if (averageRent >= 1700) return '#d7191c';
  if (averageRent >= 1500) return '#fdae61';
  if (averageRent >= 1350) return '#ffffbf';
  if (averageRent >= 1200) return '#a6d96a';
  return '#1a9641';
};
