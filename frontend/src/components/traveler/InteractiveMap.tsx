import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { UserCheck, Star } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './map-styles.css';

// Fix Leaflet default icon paths for Vite/React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom pin icon for dropped location
const createPinIcon = (isPrimary = true) =>
  L.divIcon({
    className: 'custom-pin-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute h-14 w-14 rounded-full ${
          isPrimary ? 'bg-emerald-400/30 animate-ping' : 'bg-blue-400/20'
        }"></div>
        <div class="relative flex h-11 w-11 items-center justify-center rounded-full border-4 border-white shadow-xl ${
          isPrimary ? 'bg-emerald-600' : 'bg-blue-600'
        }">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });

// Custom guide marker icon
const createGuideIcon = (initials: string) =>
  L.divIcon({
    className: 'custom-guide-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="relative flex h-10 w-10 items-center justify-center rounded-full border-3 border-white shadow-lg bg-amber-500">
          <span class="text-xs font-extrabold text-white">${initials}</span>
        </div>
        <div class="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

export interface GuideMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  languages: string[];
  specialty: string;
}

interface InteractiveMapProps {
  center: [number, number];
  zoom?: number;
  searchRadius?: number; // in meters
  guides?: GuideMarker[];
  pinnedLocation?: { lat: number; lng: number; name: string } | null;
  destinationMarker?: {
    lat: number;
    lng: number;
    name: string;
    distanceText: string;
    durationText: string;
    expertName: string;
  } | null;
  onLocationClick?: (lat: number, lng: number) => void;
  onGuideConnect?: (guideId: string, guideName: string, hourlyRate: number) => void;
  className?: string;
}

// Component to handle map click events
const MapClickHandler: React.FC<{ onClick: (lat: number, lng: number) => void }> = ({ onClick }) => {
  useMapEvents({
    click: (event) => {
      onClick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
};

// Component to handle map center changes
const MapCenterController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);

  return null;
};

const MapBoundsController: React.FC<{
  pinnedLocation?: { lat: number; lng: number } | null;
  destinationMarker?: { lat: number; lng: number } | null;
}> = ({ pinnedLocation, destinationMarker }) => {
  const map = useMap();

  useEffect(() => {
    if (!pinnedLocation || !destinationMarker) return;

    const bounds = L.latLngBounds(
      [pinnedLocation.lat, pinnedLocation.lng],
      [destinationMarker.lat, destinationMarker.lng]
    );

    map.fitBounds(bounds.pad(0.24), {
      animate: true,
      maxZoom: 16,
      padding: [36, 36],
    });
  }, [destinationMarker, map, pinnedLocation]);

  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center,
  zoom = 15,
  searchRadius = 1500,
  guides = [],
  pinnedLocation,
  destinationMarker,
  onLocationClick,
  onGuideConnect,
  className = '',
}) => {
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);

  const handleGuideConnect = (guide: GuideMarker) => {
    setActiveGuideId(guide.id);
    onGuideConnect?.(guide.id, guide.name, guide.hourlyRate);
  };

  return (
    <div className={`relative overflow-hidden rounded-[1.5rem] border border-slate-200 ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full min-h-[400px] z-0"
        zoomControl={true}
      >
        {/* OpenStreetMap Tile Layer with custom styling */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles brightness-[1.02] contrast-[1.05] saturate-[0.95]"
        />

        {/* Map Center Controller */}
        {destinationMarker ? (
          <MapBoundsController pinnedLocation={pinnedLocation} destinationMarker={destinationMarker} />
        ) : (
          <MapCenterController center={center} zoom={zoom} />
        )}

        {/* Click Handler for Pin Dropping */}
        {onLocationClick && <MapClickHandler onClick={onLocationClick} />}

        {/* Search Radius Circle */}
        {pinnedLocation && (
          <Circle
            center={[pinnedLocation.lat, pinnedLocation.lng]}
            radius={searchRadius}
            pathOptions={{
              fillColor: '#10b981',
              fillOpacity: 0.1,
              color: '#10b981',
              weight: 2,
              opacity: 0.6,
              dashArray: '5, 10',
            }}
          />
        )}

        {/* Traveler Location Marker */}
        {pinnedLocation && (
          <Marker
            position={[pinnedLocation.lat, pinnedLocation.lng]}
            icon={createPinIcon(true)}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pinned Location</p>
                <p className="mt-1 text-sm font-extrabold text-slate-950">{pinnedLocation.name}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {pinnedLocation.lat.toFixed(6)}, {pinnedLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Expert Destination Marker */}
        {destinationMarker && (
          <Marker
            position={[destinationMarker.lat, destinationMarker.lng]}
            icon={createPinIcon(false)}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  Pinned by {destinationMarker.expertName}
                </p>
                <p className="mt-1 text-sm font-extrabold text-slate-950">{destinationMarker.name}</p>
                <p className="mt-1 text-xs font-bold text-slate-600">
                  {destinationMarker.distanceText} away • {destinationMarker.durationText}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Guide Markers */}
        {guides.map((guide) => {
          const initials = guide.name
            .split(' ')
            .map((part) => part[0])
            .join('');

          return (
            <Marker
              key={guide.id}
              position={[guide.lat, guide.lng]}
              icon={createGuideIcon(initials)}
            >
              <Popup className="custom-popup" minWidth={280}>
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-extrabold text-emerald-800">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-extrabold text-slate-950">{guide.name}</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-600 line-clamp-2">{guide.specialty}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-extrabold text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {guide.rating.toFixed(2)} ({guide.reviewCount})
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      ${guide.hourlyRate}/hr
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {guide.languages.map((language) => (
                      <span
                        key={language}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-600"
                      >
                        {language}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleGuideConnect(guide)}
                    disabled={activeGuideId === guide.id}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                      activeGuideId === guide.id
                        ? 'bg-slate-950 text-white cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <UserCheck className="h-4 w-4" />
                    {activeGuideId === guide.id ? 'Connecting...' : 'Connect Audio Call'}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Legend</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-600 border-2 border-white shadow"></div>
            <span className="text-xs font-semibold text-slate-700">Traveler GPS</span>
          </div>
          {destinationMarker && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-600 border-2 border-white shadow"></div>
              <span className="text-xs font-semibold text-slate-700">Expert Pin</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500 border-2 border-white shadow"></div>
            <span className="text-xs font-semibold text-slate-700">Available Guide</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full border-2 border-emerald-500 bg-emerald-100"></div>
            <span className="text-xs font-semibold text-slate-700">Search Radius</span>
          </div>
        </div>
      </div>
    </div>
  );
};
