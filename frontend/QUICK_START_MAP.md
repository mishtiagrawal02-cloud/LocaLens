# 🗺️ Quick Start - Interactive Map

## 🚀 Start Development

```bash
cd frontend
npm run dev
```

Navigate to **Traveler Mode** in the browser.

## 📍 Core Components

### 1. Interactive Map with Guides
```tsx
import { GuideDiscoveryOverlay } from './components/traveler/GuideDiscoveryOverlay';

<GuideDiscoveryOverlay 
  onStartCall={(name, rate) => {
    console.log(`Starting call with ${name} at $${rate}/hr`);
  }} 
/>
```

### 2. Custom Map Instance
```tsx
import { InteractiveMap } from './components/traveler/InteractiveMap';

<InteractiveMap
  center={[41.9028, 12.4964]}
  zoom={15}
  searchRadius={1500}
  guides={guideArray}
  pinnedLocation={{ lat: 41.9, lng: 12.5, name: "Rome" }}
  onLocationClick={(lat, lng) => handlePinDrop(lat, lng)}
  onGuideConnect={(id, name, rate) => startAudioCall(id)}
/>
```

### 3. Location Search
```tsx
import { useGeocoding } from './hooks/useGeocoding';

const { geocodeLocation, reverseGeocode, isLoading } = useGeocoding();

// Forward geocoding
const result = await geocodeLocation('Trevi Fountain');
// Returns: { lat: 41.9009, lng: 12.4833, displayName: "..." }

// Reverse geocoding
const location = await reverseGeocode(41.9028, 12.4964);
// Returns: { lat, lng, displayName: "Piazza Navona, Rome, ..." }
```

## ✨ Key Features

| Feature | How to Use |
|---------|-----------|
| **Drop Pin** | Click anywhere on the map |
| **Search Location** | Type in search bar and click "Search" |
| **View Guide** | Click amber circular marker |
| **Connect to Guide** | Click "Connect Audio Call" in popup |
| **Adjust Radius** | Change radius dropdown (500m - 5km) |
| **Zoom** | Use +/- controls or scroll wheel |
| **Pan** | Click and drag the map |

## 🎨 Customization

### Change Search Radius
```tsx
<InteractiveMap searchRadius={2000} /> // 2km radius
```

### Adjust Initial Zoom
```tsx
<InteractiveMap zoom={16} /> // Closer zoom
```

### Custom Tile Server
```tsx
// In InteractiveMap.tsx
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // Change to your preferred tile server
/>
```

## 📊 Real Coordinates

Predefined Rome locations:

```typescript
const locations = {
  piazzaNavona: { lat: 41.8992, lng: 12.4731 },
  trastevere: { lat: 41.8895, lng: 12.4698 },
  colosseum: { lat: 41.8902, lng: 12.4922 },
};
```

## 🧪 Testing

1. **Test Search**: Type "Piazza Navona" → Map centers and drops pin
2. **Test Pin Drop**: Click map → Pin appears with location name
3. **Test Guides**: Click amber marker → Popup with details
4. **Test Connect**: Click "Connect Audio Call" → Callback triggered

## 🐛 Common Issues

### Map Not Showing
**Fix**: Ensure Leaflet CSS is imported in component:
```tsx
import 'leaflet/dist/leaflet.css';
```

### Icons Missing
**Fix**: Already handled in `InteractiveMap.tsx` with manual icon imports.

### Geocoding Fails
**Check**: 
- Network connectivity
- Console for CORS errors
- Nominatim rate limit (max 1 req/sec)

## 📚 Full Documentation

- **Component API**: `src/components/traveler/MAP_README.md`
- **Implementation Guide**: `INTERACTIVE_MAP_GUIDE.md`
- **Demo Component**: `src/components/traveler/MapFeatureDemo.tsx`

## 🎯 What's Included

- ✅ Live OpenStreetMap canvas
- ✅ Click-to-drop pin with reverse geocoding
- ✅ Location search with forward geocoding
- ✅ Live guide markers with popups
- ✅ Dynamic search radius visualization
- ✅ Distance-based guide filtering
- ✅ Fully responsive design
- ✅ TypeScript type safety
- ✅ Custom emerald theming

## 🚀 Production Checklist

- [ ] Add geocoding rate limiting
- [ ] Implement result caching
- [ ] Add error boundaries
- [ ] Set up monitoring/analytics
- [ ] Configure CDN for tiles (optional)
- [ ] Add accessibility labels
- [ ] Test on real mobile devices

## 📞 Need Help?

Check the comprehensive docs:
- `MAP_README.md` - Component documentation
- `INTERACTIVE_MAP_GUIDE.md` - Full implementation guide

---

**Happy Mapping! 🗺️✨**
