# Interactive Map Components

This directory contains the fully functional interactive map implementation for LocaLens using React-Leaflet and OpenStreetMap.

## Components

### 1. **InteractiveMap.tsx**
The core map component providing:
- Live OpenStreetMap tiles with custom styling
- Click-to-drop pin functionality
- Dynamic search radius visualization (emerald circle)
- Custom guide markers with popups
- Smooth zoom and pan controls
- Interactive legend

**Props:**
- `center`: [lat, lng] coordinates for map center
- `zoom`: Zoom level (default: 15)
- `searchRadius`: Radius in meters for guide search (default: 1500m)
- `guides`: Array of guide markers to display
- `pinnedLocation`: User's pinned location
- `onLocationClick`: Callback when map is clicked
- `onGuideConnect`: Callback when guide "Connect" button is clicked

### 2. **GuideDiscoveryOverlay.tsx**
Enhanced guide discovery interface featuring:
- Real-time location search with geocoding
- Interactive map with click-to-pin
- Reverse geocoding for clicked coordinates
- Distance-based guide filtering (Haversine formula)
- Live guide markers on map
- Searchable location input with Nominatim API

**Key Features:**
- Search by location name (geocodes automatically)
- Click anywhere on map to drop custom pin
- 1.5km search radius shown as emerald circle
- Guides within radius displayed on map with popups
- Real coordinates for Rome landmarks (Piazza Navona, Trastevere, Colosseum)

### 3. **MapOverlay.tsx**
Context-aware map for traveler's current location:
- Shows user's current position with custom pin
- Displays nearby landmarks (500m radius)
- Real-time GPS tracking visualization
- Smart prompts for next points of interest

## Hooks

### **useGeocoding.ts**
Custom hook for location services:
- `geocodeLocation(query)`: Convert location name → coordinates
- `reverseGeocode(lat, lng)`: Convert coordinates → location name
- Uses OpenStreetMap Nominatim API
- Handles loading states and errors

### **useGeolocation.ts** (existing)
Browser geolocation API wrapper for getting user's current position.

## Styling

### **map-styles.css**
Custom CSS for Leaflet components:
- Custom popup styling with glassmorphism
- Emerald-themed controls matching LocaLens brand
- Smooth marker hover animations
- Custom zoom controls
- Live ring animations for pinned locations

## Custom Map Icons

### Pin Icon (Dropped Location)
- Emerald circular badge with MapPin icon
- Animated ping effect for active pin
- White border with shadow for depth

### Guide Icon (Available Guides)
- Amber circular badge with guide initials
- Green online indicator dot
- Hover scale animation

## Technical Details

### Leaflet Icon Fix
The component includes a fix for Leaflet's default marker icons in React/Vite builds:
```typescript
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
```

### Tile Layer
Uses OpenStreetMap tiles with custom brightness/contrast adjustments:
```
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Distance Calculation
Haversine formula implementation for accurate geographic distance:
```typescript
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  // Returns distance in kilometers
}
```

## Usage Examples

### Basic Interactive Map
```tsx
<InteractiveMap
  center={[41.9028, 12.4964]}
  zoom={15}
  searchRadius={1500}
  guides={guideMarkers}
  pinnedLocation={{ lat: 41.9028, lng: 12.4964, name: "Piazza Navona" }}
  onLocationClick={(lat, lng) => handlePinDrop(lat, lng)}
  onGuideConnect={(id, name, rate) => handleConnect(id, name, rate)}
/>
```

### Search with Geocoding
```tsx
const { geocodeLocation } = useGeocoding();

const handleSearch = async (query: string) => {
  const result = await geocodeLocation(query);
  if (result) {
    setMapCenter([result.lat, result.lng]);
  }
};
```

## Dependencies

Required packages (already in package.json):
- `leaflet`: ^1.9.4
- `react-leaflet`: ^5.0.0
- `@types/leaflet`: ^1.9.22
- `lucide-react`: ^1.50.0

## API Services

### Nominatim (OpenStreetMap)
- **Geocoding**: https://nominatim.openstreetmap.org/search
- **Reverse Geocoding**: https://nominatim.openstreetmap.org/reverse
- Rate Limit: 1 request/second
- User-Agent: 'LocaLens/1.0' (configured in useGeocoding hook)

## Performance Optimizations

- Markers use `divIcon` for custom HTML rendering (faster than image icons)
- Map center updates use smooth animations
- Guide filtering happens client-side after initial load
- Debounced search input (recommended for production)

## Future Enhancements

- [ ] Clustered markers for high-density guide areas
- [ ] Route drawing between user and selected guide
- [ ] Real-time guide location updates via WebSocket
- [ ] Custom tile layers (satellite, terrain)
- [ ] Offline map caching with service workers
- [ ] Accessibility improvements (keyboard navigation)

## Browser Support

Works in all modern browsers that support:
- ES6+
- CSS Grid/Flexbox
- HTML5 Canvas (for map tiles)
- Geolocation API (optional, for user location)

## License

OpenStreetMap tiles: © OpenStreetMap contributors
Leaflet: BSD 2-Clause License
