import { createContext } from 'react';
import type { PushedRoute } from '../types';

export interface ActiveSessionPushedRoute {
  destinationName: string;
  distanceText: string;
  durationText: string;
  mapsUrl: string;
  timestamp: number;
  destinationLat: number;
  destinationLng: number;
  expertName: string;
  audioPrompt?: string;
  note?: string;
  sourceRouteId?: string;
}

export interface ActiveSessionContextValue {
  pushedRoute: ActiveSessionPushedRoute | null;
  onPushRoute: (route: PushedRoute | ActiveSessionPushedRoute) => void;
  onClearRoute: () => void;
}

export const ActiveSessionContext = createContext<ActiveSessionContextValue | undefined>(undefined);

const formatDistance = (meters: number) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }

  return `${Math.round(meters)}m`;
};

export const normalizeRoute = (route: PushedRoute | ActiveSessionPushedRoute): ActiveSessionPushedRoute => {
  if ('destinationName' in route) {
    return route;
  }

  return {
    destinationName: route.destination.name,
    distanceText: formatDistance(route.distance),
    durationText: `${route.duration} min${route.duration === 1 ? '' : 's'} walk`,
    mapsUrl: route.googleMapsUrl,
    timestamp: route.pushedAt.getTime(),
    destinationLat: route.destination.lat,
    destinationLng: route.destination.lng,
    expertName: route.expertName,
    audioPrompt: route.audioPrompt,
    note: route.destination.note,
    sourceRouteId: route.id,
  };
};
