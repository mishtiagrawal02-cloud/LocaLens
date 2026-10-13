# LocaLens Interactive Map - Implementation Guide

## 🎉 Overview

The LocaLens frontend now features a **fully functional, interactive OpenStreetMap canvas** with real-time guide discovery, pin dropping, location search, and dynamic radius visualization.

## ✨ Key Features Implemented

### 1. **Interactive Leaflet Map Canvas**
- ✅ Live OpenStreetMap tiles with custom emerald theming
- ✅ Smooth zoom controls and panning
- ✅ High-contrast, clean map styling
- ✅ Responsive design (mobile to desktop)

### 2. **Click-to-Drop Pin Functionality**
- ✅ Click anywhere on map to drop custom pin at exact coordinates
- ✅ Automatic reverse geocoding to show location name
- ✅ Animated emerald pin with pulsing effect
- ✅ Pin displays coordinates and location name in popup

### 3. **Dynamic Search Radius Visualization**
- ✅ Semi-transparent emerald circle around pinned location
- ✅ Configurable radius (default: 1.5km)
- ✅ Dashed border styling for clear visual distinction
- ✅ Updates in real-time when pin is moved

### 4. **Live Guide Map Markers**
- ✅ Custom amber circular markers with guide initials
- ✅ Green "online" indicator dot
- ✅ Hover animations and scale effects
- ✅ Interactive popups with complete guide info

### 5. **Guide Popup Details**
Each guide marker popup shows:
- ✅ Guide name and profile initials badge
- ✅ Specialty description
- ✅ Star rating and review count
- ✅ Hourly rate
- ✅ Spoken languages (as pills)
- ✅ "Connect Audio Call" button

### 6. **Location Search with Geocoding**
- ✅ Integrated search bar with geocoding
- ✅ Supports location names (e.g., "Trevi Fountain", "Piazza Navona")
- ✅ Auto-repositions map center on search
- ✅ Drops pin automatically at searched location
- ✅ Loading states during API calls
- ✅ Uses Nominatim OpenStreetMap API

### 7. **Distance-Based Guide Filtering**
- ✅ Haversine formula for accurate geographic distance
- ✅ Automatically filters guides within search radius
- ✅ Displays distance in kilometers for each guide
- ✅ Updates guide list when pin is moved
- ✅ Shows "No guides available" message when none found

## 📦 Components Architecture

```
src/
├── components/
│   └── traveler/
│       ├── InteractiveMap.tsx           # Core map component
│       ├── GuideDiscoveryOverlay.tsx    # Guide search + map interface
│       ├── MapOverlay.tsx               # User location map view
│       ├── map-styles.css               # Custom Leaflet styling
│       └── MAP_README.md                # Component documentation
├── hooks/
│   ├── useGeocoding.ts                  # Geocoding/reverse geocoding
│   ├── useGeolocation.ts                # Browser GPS (existing)
│   └── useWebSocket.ts                  # WebSocket for real-time (existing)
└── types/
    └── index.ts                         # TypeScript definitions
```

## 🚀 Usage Examples

### Basic Map with Pin Dropping

```tsx
import { InteractiveMap } from './components/traveler/InteractiveMap';

function MyComponent() {
  const [pin, setPin] = useState({ lat: 41.9028, lng: 12.4964, name: 'Rome' });
  
  return (
    <InteractiveMap
      center={[pin.lat, pin.lng]}
      zoom={15}
      searchRadius={1500}
      pinnedLocation={pin}
      onLocationClick={(lat, lng) => {
        setPin({ lat, lng, name: 'Custom Location' });
      }}
    />
  );
}
```

### Search with Geocoding

```tsx
import { useGeocoding } from './hooks/useGeocoding';

function SearchExample() {
  const { geocodeLocation, isLoading } = useGeocoding();
  
  const handleSearch = async (query: string) => {
    const result = await geocodeLocation(query);
    if (result) {
      console.log(`Found: ${result.displayName}`);
      console.log(`Coordinates: ${result.lat}, ${result.lng}`);
    }
  };
  
  return (
    <input 
      onChange={(e) => handleSearch(e.target.value)}
      disabled={isLoading}
    />
  );
}
```

### Guide Discovery with Interactive Map

```tsx
import { GuideDiscoveryOverlay } from './components/traveler/GuideDiscoveryOverlay';

function GuideFinder() {
  const handleGuideConnect = (name: string, rate: number) => {
    console.log(`Connecting to ${name} at $${rate}/hr`);
    // Initialize WebRTC audio call
  };
  
  return (
    <GuideDiscoveryOverlay onStartCall={handleGuideConnect} />
  );
}
```

## 🎨 Theming & Customization

### Colors
The map uses LocaLens's emerald brand colors:
- **Primary Pin**: `emerald-600` (#10b981)
- **Guide Markers**: `amber-500` (#f59e0b)
- **Search Radius**: `emerald-400/30` (semi-transparent)
- **Online Indicators**: `green-500` (#22c55e)

### Customizing Search Radius

```tsx
<InteractiveMap
  searchRadius={2000}  // 2km radius
  // ... other props
/>
```

### Custom Map Styling

Edit `map-styles.css` to adjust:
- Popup border radius and shadows
- Marker hover effects
- Zoom control styling
- Attribution positioning

## 🔧 Configuration

### Nominatim API Settings

The geocoding hook uses OpenStreetMap's Nominatim API:

```typescript
// In useGeocoding.ts
headers: {
  'User-Agent': 'LocaLens/1.0',  // Required by Nominatim
}
```

**Rate Limit**: 1 request/second (for production, consider rate limiting on client)

### Tile Server

Default tile server: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

To use alternative tiles (satellite, custom style):

```tsx
<TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  attribution="Esri"
/>
```

## 📍 Real Coordinates Used

The app includes real Rome landmarks:

| Location | Latitude | Longitude |
|----------|----------|-----------|
| Piazza Navona | 41.8992 | 12.4731 |
| Trastevere | 41.8895 | 12.4698 |
| Colosseum | 41.8902 | 12.4922 |

Guides are positioned near these landmarks with slight offsets.

## 🧪 Testing the Map

1. **Start the dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to Traveler Mode** in the app

3. **Test Search:**
   - Type "Trevi Fountain" in search bar
   - Click "Search"
   - Map should reposition and drop pin

4. **Test Pin Dropping:**
   - Click anywhere on the map
   - Pin should appear at clicked location
   - Location name should update via reverse geocoding

5. **Test Guide Markers:**
   - Click on an amber guide marker
   - Popup should show guide details
   - Click "Connect Audio Call" button

## 🐛 Troubleshooting

### Map Not Displaying

**Issue**: Blank gray box instead of map

**Solution**: Check that Leaflet CSS is imported:
```tsx
import 'leaflet/dist/leaflet.css';
```

### Marker Icons Not Showing

**Issue**: Default marker icon broken

**Solution**: Already fixed in `InteractiveMap.tsx` with manual icon imports:
```tsx
import icon from 'leaflet/dist/images/marker-icon.png';
```

### Geocoding Not Working

**Issue**: Search returns no results

**Possible causes:**
1. Network request blocked (check CORS)
2. Rate limit exceeded (wait 1 second between requests)
3. Invalid User-Agent header

**Solution**: Check browser console for errors and verify Nominatim API is accessible

### TypeScript Errors

**Issue**: Type errors in IDE

**Solution**: Ensure `@types/leaflet` is installed:
```bash
npm install --save-dev @types/leaflet
```

## 🚀 Production Considerations

### Performance Optimizations

1. **Debounce Search Input**
   ```tsx
   import { debounce } from 'lodash';
   
   const debouncedSearch = debounce(geocodeLocation, 500);
   ```

2. **Marker Clustering** (for high guide density)
   ```bash
   npm install react-leaflet-cluster
   ```

3. **Lazy Load Map** (reduce initial bundle)
   ```tsx
   const InteractiveMap = lazy(() => import('./InteractiveMap'));
   ```

### API Rate Limiting

For production, implement rate limiting:

```typescript
// Simple rate limiter
const lastCallTime = { current: 0 };

const rateLimitedGeocode = async (query: string) => {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime.current;
  
  if (timeSinceLastCall < 1000) {
    await new Promise(resolve => 
      setTimeout(resolve, 1000 - timeSinceLastCall)
    );
  }
  
  lastCallTime.current = Date.now();
  return geocodeLocation(query);
};
```

### Caching Geocoding Results

```typescript
const cache = new Map<string, GeocodingResult>();

const cachedGeocode = async (query: string) => {
  if (cache.has(query)) {
    return cache.get(query);
  }
  
  const result = await geocodeLocation(query);
  if (result) cache.set(query, result);
  return result;
};
```

## 📚 Additional Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [React-Leaflet API](https://react-leaflet.js.org/)
- [Nominatim API Docs](https://nominatim.org/release-docs/latest/api/Overview/)
- [OpenStreetMap Wiki](https://wiki.openstreetmap.org/)

## 🎯 Next Steps

Recommended enhancements:

1. **Route Drawing** - Show path from user to selected guide using Leaflet Routing Machine
2. **Real-time Updates** - Guide location updates via WebSocket
3. **Offline Maps** - Cache tiles with service workers
4. **Custom Basemaps** - Support satellite view, dark mode tiles
5. **Accessibility** - Keyboard navigation, ARIA labels
6. **Analytics** - Track search queries, popular locations

## 📄 License

OpenStreetMap tiles: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)  
Leaflet: BSD 2-Clause License  
LocaLens: Proprietary

---

**Built with ❤️ using React, TypeScript, Leaflet, and OpenStreetMap**
