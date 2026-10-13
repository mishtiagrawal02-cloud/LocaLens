import React, { useState, useCallback } from 'react';
import { MapPin, Send, Search, Navigation, Loader2, CheckCircle2, Clock, TrendingUp, Plus } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useGeocoding } from '../../hooks/useGeocoding';
import type { RouteDestination, TravelerLocation, PushedRoute } from '../../types';

interface ExpertMapPinPusherProps {
  travelerLocation: TravelerLocation;
  travelerName: string;
  expertName: string;
  onPushRoute: (route: PushedRoute) => void;
}

// Popular destination categories
const destinationCategories = [
  { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { id: 'landmark', label: 'Landmark', icon: '🏛️' },
  { id: 'viewpoint', label: 'Viewpoint', icon: '🌄' },
  { id: 'cafe', label: 'Café', icon: '☕' },
  { id: 'shop', label: 'Shop', icon: '🛍️' },
  { id: 'hidden-gem', label: 'Hidden Gem', icon: '💎' },
];

// Mock popular destinations (in production, these would come from your API or Google Places)
const popularDestinations: RouteDestination[] = [
  {
    id: '1',
    name: 'Trevi Fountain',
    lat: 41.9009,
    lng: 12.4833,
    category: 'landmark',
    note: 'Best time to visit is early morning for fewer crowds',
  },
  {
    id: '2',
    name: "Roscioli Bakery",
    lat: 41.8955,
    lng: 12.4729,
    category: 'restaurant',
    note: 'Authentic pizza bianca - ask for fresh mozzarella',
  },
  {
    id: '3',
    name: 'Orange Garden (Giardino degli Aranci)',
    lat: 41.8831,
    lng: 12.4788,
    category: 'viewpoint',
    note: 'Perfect sunset view of Rome skyline',
  },
  {
    id: '4',
    name: "Sant'Eustachio Il Caffè",
    lat: 41.8992,
    lng: 12.4755,
    category: 'cafe',
    note: "Rome's best espresso - order like locals: 'un caffè normale'",
  },
];

// Calculate walking distance and duration (simplified - production would use Google Directions API)
const calculateRoute = (
  from: TravelerLocation,
  to: RouteDestination
): { distance: number; duration: number } => {
  // Haversine formula for distance
  const R = 6371e3; // Earth radius in meters
  const φ1 = (from.lat * Math.PI) / 180;
  const φ2 = (to.lat * Math.PI) / 180;
  const Δφ = ((to.lat - from.lat) * Math.PI) / 180;
  const Δλ = ((to.lng - from.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  const duration = Math.ceil(distance / 80); // Assume 80m/min walking speed

  return { distance, duration };
};

// Generate Google Maps directions URL
const generateGoogleMapsUrl = (from: TravelerLocation, to: RouteDestination): string => {
  return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=walking`;
};

export const ExpertMapPinPusher: React.FC<ExpertMapPinPusherProps> = ({
  travelerLocation,
  travelerName,
  expertName,
  onPushRoute,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<RouteDestination | null>(null);
  const [customNote, setCustomNote] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [lastPushed, setLastPushed] = useState<PushedRoute | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const { geocodeLocation } = useGeocoding();

  // Filter destinations by search and category
  const filteredDestinations = popularDestinations.filter((dest) => {
    const matchesSearch = searchQuery
      ? dest.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? dest.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleSelectDestination = (destination: RouteDestination) => {
    setSelectedDestination(destination);
    setCustomNote(destination.note || '');
  };

  const handleSearchAsCustomDestination = async () => {
    if (!searchQuery.trim()) return;

    setIsGeocoding(true);

    try {
      const result = await geocodeLocation(searchQuery);

      if (result) {
        // Create custom destination from geocoded result
        const customDestination: RouteDestination = {
          id: `custom-${Date.now()}`,
          name: searchQuery,
          lat: result.lat,
          lng: result.lng,
          category: 'custom',
          note: `Custom location: ${result.displayName}`,
        };

        setSelectedDestination(customDestination);
        setCustomNote(customDestination.note || '');
      }
    } finally {
      setIsGeocoding(false);
    }
  };

  const handlePushRoute = useCallback(async () => {
    if (!selectedDestination) return;

    setIsPushing(true);

    // Calculate route
    const { distance, duration } = calculateRoute(travelerLocation, selectedDestination);
    const googleMapsUrl = generateGoogleMapsUrl(travelerLocation, selectedDestination);

    // Create pushed route payload
    const route: PushedRoute = {
      id: `route-${Date.now()}`,
      destination: {
        ...selectedDestination,
        note: customNote || selectedDestination.note,
      },
      distance,
      duration,
      pushedAt: new Date(),
      expertName,
      googleMapsUrl,
      audioPrompt: `New destination from ${expertName}: ${selectedDestination.name}. ${Math.round(distance)} meters away, about ${duration} minute walk.`,
    };

    // Simulate push delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    onPushRoute(route);
    setLastPushed(route);
    setIsPushing(false);

    // Reset after showing success
    setTimeout(() => {
      setLastPushed(null);
      setSelectedDestination(null);
      setCustomNote('');
      setSearchQuery('');
    }, 3000);
  }, [selectedDestination, customNote, travelerLocation, expertName, onPushRoute]);

  return (
    <GlassCard className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
              Route Push Engine
            </p>
            <h3 className="text-sm font-extrabold text-slate-950">
              Send Destination to {travelerName}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-5">
        {lastPushed ? (
          // Success State
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-slate-950">
              Route Pushed Successfully!
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {travelerName} will see navigation to{' '}
              <strong>{lastPushed.destination.name}</strong>
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 text-xs font-bold text-slate-500">
              <span>{lastPushed.distance}m away</span>
              <span>•</span>
              <span>{lastPushed.duration} min walk</span>
            </div>
          </div>
        ) : (
          <>
            {/* Category Pills */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick Categories
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition ${
                    selectedCategory === null
                      ? 'border-emerald-400 bg-emerald-100 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  All
                </button>
                {destinationCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition ${
                      selectedCategory === cat.id
                        ? 'border-emerald-400 bg-emerald-100 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="mr-1">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Search Destinations
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleSearchAsCustomDestination();
                    }
                  }}
                  placeholder="Search or enter any place name..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              {searchQuery.trim() && filteredDestinations.length === 0 && (
                <button
                  onClick={handleSearchAsCustomDestination}
                  disabled={isGeocoding}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                >
                  {isGeocoding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Finding location...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Use "{searchQuery}" as custom destination
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Destination List */}
            {filteredDestinations.length > 0 && (
              <div className="mb-4 max-h-64 space-y-2 overflow-y-auto">
                {filteredDestinations.map((destination) => {
                  const { distance, duration } = calculateRoute(travelerLocation, destination);
                  const isSelected = selectedDestination?.id === destination.id;

                  return (
                    <button
                      key={destination.id}
                      onClick={() => handleSelectDestination(destination)}
                      className={`w-full rounded-xl border-2 p-3 text-left transition ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-extrabold text-slate-950">{destination.name}</p>
                          {destination.note && (
                            <p className="mt-1 text-xs font-semibold text-slate-600 line-clamp-1">
                              {destination.note}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500">
                            <Navigation className="h-3 w-3" />
                            <span>{Math.round(distance)}m</span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>{duration} min</span>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Custom Note */}
            {selectedDestination && (
              <div className="mb-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Add Personal Note (Optional)
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Add tips or recommendations..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            )}

            {/* Route Preview */}
            {selectedDestination && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Route Preview
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-emerald-950">
                      {selectedDestination.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-emerald-800">
                      {Math.round(calculateRoute(travelerLocation, selectedDestination).distance)}m
                      away • {calculateRoute(travelerLocation, selectedDestination).duration} minute
                      walk
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Push Button */}
            <button
              onClick={handlePushRoute}
              disabled={!selectedDestination || isPushing}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPushing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Pushing Route...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Push Route to {travelerName}'s HUD
                </>
              )}
            </button>
          </>
        )}
      </div>
    </GlassCard>
  );
};
