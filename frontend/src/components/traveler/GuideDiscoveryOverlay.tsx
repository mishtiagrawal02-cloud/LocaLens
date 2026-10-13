import React, { useState } from 'react';
import { MapPin, Search, Star, UserCheck, Loader2 } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { InteractiveMap, type GuideMarker } from './InteractiveMap';
import { useGeocoding } from '../../hooks/useGeocoding';

interface GuideDiscoveryOverlayProps {
  onStartCall?: (guideName: string, hourlyRate: number) => void;
}

interface LocationOption {
  id: string;
  label: string;
  zone: string;
  hint: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface AvailableGuide {
  id: string;
  name: string;
  lat: number;
  lng: number;
  specialty: string;
  rating: number;
  reviewCount: number;
  languages: string[];
  hourlyRate: number;
  coverageZones: string[];
}

// Rome landmarks with actual coordinates
const locations: LocationOption[] = [
  {
    id: 'piazza-navona',
    label: 'Piazza Navona, Rome',
    zone: 'historic-center',
    hint: 'Historic plazas, churches, and step-free detours',
    coordinates: { lat: 41.8992, lng: 12.4731 },
  },
  {
    id: 'trastevere',
    label: 'Trastevere, Rome',
    zone: 'trastevere',
    hint: 'Food lanes, nightlife corners, and quiet river crossings',
    coordinates: { lat: 41.8895, lng: 12.4698 },
  },
  {
    id: 'colosseum',
    label: 'Colosseum, Rome',
    zone: 'ancient-rome',
    hint: 'Forum entrances, crowd timing, and accessible viewpoints',
    coordinates: { lat: 41.8902, lng: 12.4922 },
  },
];

// Guides with actual coordinates near their zones
const guides: AvailableGuide[] = [
  {
    id: 'marco',
    name: 'Marco Bellini',
    lat: 41.8985,
    lng: 12.4725,
    specialty: 'Historic Old Quarter & Wheelchair Routes',
    rating: 4.98,
    reviewCount: 214,
    languages: ['English', 'Italian'],
    hourlyRate: 15,
    coverageZones: ['historic-center', 'ancient-rome'],
  },
  {
    id: 'sofia',
    name: 'Sofia Ricci',
    lat: 41.9005,
    lng: 12.4745,
    specialty: 'Artisan Shops, Food Stops & Family Walks',
    rating: 4.94,
    reviewCount: 179,
    languages: ['English', 'Italian', 'Spanish'],
    hourlyRate: 18,
    coverageZones: ['historic-center', 'trastevere'],
  },
  {
    id: 'luca',
    name: 'Luca Marino',
    lat: 41.8910,
    lng: 12.4930,
    specialty: 'Ancient Rome, Crowd Avoidance & Photo Timing',
    rating: 4.91,
    reviewCount: 151,
    languages: ['English', 'Italian', 'French'],
    hourlyRate: 20,
    coverageZones: ['ancient-rome'],
  },
  {
    id: 'giulia',
    name: 'Giulia Conti',
    lat: 41.8890,
    lng: 12.4680,
    specialty: 'Trastevere Food Alleys & Local Etiquette',
    rating: 4.96,
    reviewCount: 188,
    languages: ['English', 'Italian'],
    hourlyRate: 16,
    coverageZones: ['trastevere'],
  },
];

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getGuidesForLocation = (lat: number, lng: number, radiusKm: number = 1.5) =>
  guides
    .map((guide) => ({
      ...guide,
      distanceKm: calculateDistance(lat, lng, guide.lat, guide.lng),
    }))
    .filter((guide) => guide.distanceKm <= radiusKm)
    .sort((first, second) => first.distanceKm - second.distanceKm);

const getGuidesForZone = (zone: string) =>
  guides
    .filter((guide) => guide.coverageZones.includes(zone))
    .map((guide) => ({ ...guide, distanceKm: 0.5 }))
    .sort((first, second) => first.distanceKm - second.distanceKm);

const resolveLocation = (query: string): LocationOption | null => {
  const normalizedQuery = query.trim().toLowerCase();

  return (
    locations.find((location) => location.label.toLowerCase().includes(normalizedQuery)) ??
    locations.find((location) => normalizedQuery.includes(location.id.replace('-', ' '))) ??
    null
  );
};

export const GuideDiscoveryOverlay: React.FC<GuideDiscoveryOverlayProps> = ({ onStartCall }) => {
  const [searchQuery, setSearchQuery] = useState('Piazza Navona');
  const [pinnedLocation, setPinnedLocation] = useState<{ lat: number; lng: number; name: string }>({
    lat: locations[0].coordinates.lat,
    lng: locations[0].coordinates.lng,
    name: locations[0].label,
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    locations[0].coordinates.lat,
    locations[0].coordinates.lng,
  ]);
  const [filteredGuides, setFilteredGuides] = useState<(AvailableGuide & { distanceKm: number })[]>(
    getGuidesForLocation(locations[0].coordinates.lat, locations[0].coordinates.lng)
  );
  const [activeCallGuideId, setActiveCallGuideId] = useState<string | null>(null);
  const [searchRadius] = useState(1500); // 1.5km in meters

  const { geocodeLocation, reverseGeocode, isLoading } = useGeocoding();

  const updatePinnedLocationByCoords = async (lat: number, lng: number, name?: string) => {
    let locationName = name;

    // If no name provided, reverse geocode to get location name
    if (!locationName) {
      const result = await reverseGeocode(lat, lng);
      locationName = result?.displayName || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    setPinnedLocation({ lat, lng, name: locationName });
    setMapCenter([lat, lng]);
    setSearchQuery(locationName);

    // Update guides based on new location
    const nearbyGuides = getGuidesForLocation(lat, lng, 1.5);
    setFilteredGuides(nearbyGuides);
  };

  const updatePinnedLocationByOption = (location: LocationOption) => {
    setPinnedLocation({
      lat: location.coordinates.lat,
      lng: location.coordinates.lng,
      name: location.label,
    });
    setMapCenter([location.coordinates.lat, location.coordinates.lng]);
    setSearchQuery(location.label);
    setFilteredGuides(getGuidesForZone(location.zone));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // First, check if it matches a predefined location
    const predefinedLocation = resolveLocation(searchQuery);
    if (predefinedLocation) {
      updatePinnedLocationByOption(predefinedLocation);
      return;
    }

    // Otherwise, geocode the search query
    const result = await geocodeLocation(searchQuery);
    if (result) {
      updatePinnedLocationByCoords(result.lat, result.lng, result.displayName);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    updatePinnedLocationByCoords(lat, lng);
  };

  const handleGuideConnect = (guideId: string, guideName: string, hourlyRate: number) => {
    setActiveCallGuideId(guideId);
    onStartCall?.(guideName.split(' ')[0], hourlyRate);
  };

  const handleCall = (guide: AvailableGuide & { distanceKm: number }) => {
    handleGuideConnect(guide.id, guide.name, guide.hourlyRate);
  };

  // Convert guides to map markers
  const guideMarkers: GuideMarker[] = filteredGuides.map((guide) => ({
    id: guide.id,
    name: guide.name,
    lat: guide.lat,
    lng: guide.lng,
    rating: guide.rating,
    reviewCount: guide.reviewCount,
    hourlyRate: guide.hourlyRate,
    languages: guide.languages,
    specialty: guide.specialty,
  }));

  return (
    <GlassCard className="overflow-hidden p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Guide Discovery</p>
          <h3 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950">
            Search a zone or click map to drop a pin
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full gap-2 lg:max-w-md">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Piazza Navona, Trastevere, Colosseum"
              disabled={isLoading}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 pl-10 pr-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching
              </>
            ) : (
              'Search'
            )}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <InteractiveMap
            center={mapCenter}
            zoom={15}
            searchRadius={searchRadius}
            guides={guideMarkers}
            pinnedLocation={pinnedLocation}
            onLocationClick={handleMapClick}
            onGuideConnect={handleGuideConnect}
            className="h-[400px] lg:h-[500px]"
          />
        </div>

        <div className="xl:col-span-7">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
              </span>
              <span className="truncate max-w-[200px]">{pinnedLocation.name}</span>
            </div>
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-600">
              {filteredGuides.length} Guides Nearby
            </span>
          </div>

          {filteredGuides.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <MapPin className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-600">No guides available in this area</p>
              <p className="mt-1 text-xs text-slate-500">Try searching for a different location or expanding your search radius</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-extrabold text-emerald-800">
                        {guide.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-extrabold text-slate-950">{guide.name}</p>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                            {guide.distanceKm.toFixed(1)} km away
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-bold text-slate-500">{guide.specialty}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1 text-xs font-extrabold text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {guide.rating.toFixed(2)} ({guide.reviewCount})
                          </span>
                          {guide.languages.map((language) => (
                            <span
                              key={language}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-600"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCall(guide)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition sm:w-auto ${
                        activeCallGuideId === guide.id
                          ? 'bg-slate-950 text-white'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      <UserCheck className="h-4 w-4" />
                      {activeCallGuideId === guide.id ? 'Session Starting' : `Call ($${guide.hourlyRate}/hr)`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
