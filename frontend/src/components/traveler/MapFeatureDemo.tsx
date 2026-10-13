import React, { useState } from 'react';
import { MapPin, Crosshair, Search, Users, Zap } from 'lucide-react';
import { InteractiveMap, type GuideMarker } from './InteractiveMap';
import { useGeocoding } from '../../hooks/useGeocoding';
import { GlassCard } from '../common/GlassCard';

/**
 * MapFeatureDemo - Showcases all interactive map capabilities
 * 
 * This component demonstrates:
 * - Click-to-drop pin
 * - Location search with geocoding
 * - Dynamic radius adjustment
 * - Guide marker filtering
 * - Real-time coordinate display
 */
export const MapFeatureDemo: React.FC = () => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.9028, 12.4964]);
  const [pinnedLocation, setPinnedLocation] = useState<{ lat: number; lng: number; name: string }>({
    lat: 41.9028,
    lng: 12.4964,
    name: 'Rome, Italy',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchRadius, setSearchRadius] = useState(1500);
  const [showGuides, setShowGuides] = useState(true);

  const { geocodeLocation, reverseGeocode, isLoading, error } = useGeocoding();

  // Demo guide markers around Rome
  const allGuides: GuideMarker[] = [
    {
      id: '1',
      name: 'Marco Bellini',
      lat: 41.9020,
      lng: 12.4960,
      rating: 4.98,
      reviewCount: 214,
      hourlyRate: 15,
      languages: ['English', 'Italian'],
      specialty: 'Historic Old Quarter & Wheelchair Routes',
    },
    {
      id: '2',
      name: 'Sofia Ricci',
      lat: 41.9035,
      lng: 12.4970,
      rating: 4.94,
      reviewCount: 179,
      hourlyRate: 18,
      languages: ['English', 'Italian', 'Spanish'],
      specialty: 'Artisan Shops, Food Stops & Family Walks',
    },
    {
      id: '3',
      name: 'Luca Marino',
      lat: 41.8910,
      lng: 12.4930,
      rating: 4.91,
      reviewCount: 151,
      hourlyRate: 20,
      languages: ['English', 'Italian', 'French'],
      specialty: 'Ancient Rome, Crowd Avoidance & Photo Timing',
    },
  ];

  const handleMapClick = async (lat: number, lng: number) => {
    // Reverse geocode the clicked location
    const result = await reverseGeocode(lat, lng);
    
    setPinnedLocation({
      lat,
      lng,
      name: result?.displayName || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });
    setMapCenter([lat, lng]);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    const result = await geocodeLocation(searchQuery);
    
    if (result) {
      setPinnedLocation({
        lat: result.lat,
        lng: result.lng,
        name: result.displayName,
      });
      setMapCenter([result.lat, result.lng]);
      setSearchQuery('');
    }
  };

  const handleRecenterUser = () => {
    // Simulate getting user location (would use useGeolocation in production)
    const userLat = 41.9028;
    const userLng = 12.4964;
    
    setPinnedLocation({
      lat: userLat,
      lng: userLng,
      name: 'Your Location',
    });
    setMapCenter([userLat, userLng]);
  };

  const handleGuideConnect = (_guideId: string, guideName: string, hourlyRate: number) => {
    alert(`🎉 Demo: Connecting to ${guideName} at $${hourlyRate}/hr\n\nIn production, this would:\n• Initialize WebRTC connection\n• Start audio stream\n• Begin session timer`);
  };

  return (
    <div className="space-y-5">
      <GlassCard className="p-5 sm:p-6">
        <div className="mb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
                Interactive Map Demo
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Test all map features: search, pin dropping, guide discovery
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowGuides(!showGuides)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  showGuides
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Users className="inline h-3.5 w-3.5 mr-1" />
                {showGuides ? 'Hide' : 'Show'} Guides
              </button>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="lg:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Location Search
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try: Trevi Fountain, Paris, Tokyo..."
                  disabled={isLoading}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {error && (
              <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>
            )}
          </form>

          {/* Radius Control */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Search Radius
            </label>
            <select
              value={searchRadius}
              onChange={(e) => setSearchRadius(Number(e.target.value))}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              <option value={500}>500m</option>
              <option value={1000}>1km</option>
              <option value={1500}>1.5km</option>
              <option value={2000}>2km</option>
              <option value={5000}>5km</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Actions
            </label>
            <button
              onClick={handleRecenterUser}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Crosshair className="h-4 w-4" />
              Recenter
            </button>
          </div>
        </div>

        {/* Current Location Info */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pinned Location</p>
            <p className="mt-1 text-sm font-extrabold text-slate-950 line-clamp-1">
              {pinnedLocation.name}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Coordinates</p>
            <p className="mt-1 font-mono text-sm font-bold text-slate-700">
              {pinnedLocation.lat.toFixed(4)}, {pinnedLocation.lng.toFixed(4)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Visible Guides</p>
            <p className="mt-1 text-sm font-extrabold text-slate-950">
              {showGuides ? allGuides.length : 0} guides
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-emerald-950">Interactive Features</p>
              <ul className="mt-2 space-y-1 text-xs font-semibold text-emerald-800">
                <li>• <strong>Click Map:</strong> Drop pin anywhere and get location name</li>
                <li>• <strong>Search Bar:</strong> Find any location worldwide (geocoding)</li>
                <li>• <strong>Guide Markers:</strong> Click amber markers for details + connect</li>
                <li>• <strong>Radius Circle:</strong> Emerald circle shows search area</li>
                <li>• <strong>Zoom Controls:</strong> Use +/- buttons or scroll wheel</li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Interactive Map */}
        <InteractiveMap
          center={mapCenter}
          zoom={14}
          searchRadius={searchRadius}
          guides={showGuides ? allGuides : []}
          pinnedLocation={pinnedLocation}
          onLocationClick={handleMapClick}
          onGuideConnect={handleGuideConnect}
          className="h-[500px] lg:h-[600px]"
        />
      </GlassCard>

      {/* Instructions */}
      <GlassCard className="p-5 sm:p-6">
        <h3 className="text-lg font-extrabold text-slate-950">How to Use This Demo</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Pin Dropping
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Click anywhere on the map to drop a pin. The location name is fetched automatically
              via reverse geocoding from OpenStreetMap.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Search className="h-4 w-4 text-emerald-600" />
              Location Search
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Type any location name (city, landmark, address) and click Search. The map will
              reposition and drop a pin at that location.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Users className="h-4 w-4 text-emerald-600" />
              Guide Discovery
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Amber markers represent available guides. Click a marker to see details, ratings,
              languages, and an option to connect via audio call.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Crosshair className="h-4 w-4 text-emerald-600" />
              Radius Control
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Adjust the search radius to control the area around your pinned location. Guides
              within this radius will be shown on the map.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
