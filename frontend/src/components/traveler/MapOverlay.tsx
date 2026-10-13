import React, { useMemo } from 'react';
import { Navigation, Volume2 } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { InteractiveMap } from './InteractiveMap';
import type { ActiveSessionPushedRoute } from '../../context/sessionState';

interface MapOverlayProps {
  lowPowerMode?: boolean;
  userLocation?: { lat: number; lng: number } | null;
  pushedRoute?: ActiveSessionPushedRoute | null;
}

export const MapOverlay: React.FC<MapOverlayProps> = ({ 
  lowPowerMode = false,
  userLocation,
  pushedRoute,
}) => {
  const mapCenter = useMemo<[number, number]>(
    () => (userLocation ? [userLocation.lat, userLocation.lng] : [41.9028, 12.4964]),
    [userLocation]
  );

  const travelerMarker = useMemo(
    () =>
      userLocation
        ? { lat: userLocation.lat, lng: userLocation.lng, name: 'Your Location' }
        : { lat: mapCenter[0], lng: mapCenter[1], name: 'Current Position' },
    [mapCenter, userLocation]
  );

  const destinationMarker = useMemo(
    () =>
      pushedRoute
        ? {
            lat: pushedRoute.destinationLat,
            lng: pushedRoute.destinationLng,
            name: pushedRoute.destinationName,
            distanceText: pushedRoute.distanceText,
            durationText: pushedRoute.durationText,
            expertName: pushedRoute.expertName,
          }
        : null,
    [pushedRoute]
  );

  const nearbyLandmarks = [
    {
      id: 'bakery',
      name: 'Artisanal Bakery',
      lat: mapCenter[0] + 0.001,
      lng: mapCenter[1] + 0.0015,
      rating: 4.8,
      reviewCount: 156,
      hourlyRate: 0,
      languages: ['Italian'],
      specialty: 'Local landmark - Fresh pastries and coffee',
    },
    {
      id: 'courtyard',
      name: 'Hidden Courtyard',
      lat: mapCenter[0] - 0.0012,
      lng: mapCenter[1] - 0.001,
      rating: 4.9,
      reviewCount: 89,
      hourlyRate: 0,
      languages: ['Italian'],
      specialty: 'Historic spot - Quiet rest area',
    },
  ];

  return (
    <GlassCard className="relative overflow-hidden p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Current Context</p>
          <p className="mt-1 text-sm font-extrabold text-slate-950">Historic Center • Walking Route</p>
        </div>
        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
          {lowPowerMode ? 'Stealth/Battery Saver On' : 'Live GPS + Ambient AI'}
        </span>
      </div>

      <div className="mb-5">
        <InteractiveMap
          center={mapCenter}
          zoom={16}
          searchRadius={500}
          guides={nearbyLandmarks}
          pinnedLocation={travelerMarker}
          destinationMarker={destinationMarker}
          className="h-[400px] lg:h-[450px]"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lg shadow-slate-950/5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Next Smart Prompt</p>
            <p className="text-sm font-extrabold text-slate-950">
              {pushedRoute
                ? `${pushedRoute.destinationName}: ${pushedRoute.distanceText} away`
                : '100m ahead: Artisanal Gelato'}
            </p>
          </div>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 sm:w-auto">
          <Volume2 className="h-3.5 w-3.5" /> Audio Note
        </button>
      </div>
    </GlassCard>
  );
};
