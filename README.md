# München Mietenübersicht

### Presentation Link: https://docs.google.com/presentation/d/1SLaT66ZoI_Q_-8t36kOf78QVjLYxCqsY/edit?usp=sharing&ouid=105215994056907434853&rtpof=true&sd=true
### Video Demo: https://youtu.be/kNLnQ7zRNyk?si=074RPYjHocVM0SSM


An interactive map application for Munich residents to learn about fair rents across different districts.

## Features

- **Interactive Map**: Explore Munich districts on an OpenStreetMap-based interface
- **Color-Coded Districts**: Visual representation of rent levels across areas
- **Hover Tooltips**: Quick preview of rent information when hovering over districts
- **Detailed Information**: Click any district to see comprehensive rent data
- **Fair Rent Comparison**: See how average rents compare to fair market rates
- **Savings Calculator**: Calculate potential monthly savings with fair rent prices

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to view the app.

### Build

```bash
npm run build
```

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Leaflet** with React-Leaflet for map visualization
- **OpenStreetMap** for map tiles

## Data

Currently using fake/mock data for demonstration purposes. The app includes:
- 15 Munich districts
- Rental prices (average, min, max, fair rent)
- Price per square meter
- District descriptions

## Future Enhancements

- Real rental data integration
- More detailed district boundaries
- Search functionality
- Filter options (price range, amenities)
- Mobile app with React Native (code sharing)
- Historical rent price trends
- User reviews and ratings

## Mobile App

This React app is designed to share code with a future React Native mobile application, allowing efficient cross-platform development.
