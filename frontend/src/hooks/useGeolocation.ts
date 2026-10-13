import { useState, useEffect } from 'react';

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: 41.8902,
    longitude: 12.4922,
    error:
      typeof navigator !== 'undefined' && !navigator.geolocation
        ? 'Geolocation is not supported by your browser.'
        : null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => {
        setLocation((prev) => ({ ...prev, error: error.message }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return location;
};
