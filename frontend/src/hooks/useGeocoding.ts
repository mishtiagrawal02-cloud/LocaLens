import { useState, useCallback } from 'react';

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  address?: {
    city?: string;
    country?: string;
    road?: string;
  };
}

/**
 * Hook for geocoding and reverse geocoding using Nominatim OpenStreetMap API
 */
export const useGeocoding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Forward geocoding: Convert location name to coordinates
   */
  const geocodeLocation = useCallback(async (query: string): Promise<GeocodingResult | null> => {
    if (!query.trim()) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: query,
            format: 'json',
            limit: '1',
            addressdetails: '1',
          }),
        {
          headers: {
            'User-Agent': 'LocaLens/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          displayName: result.display_name,
          address: result.address,
        };
      }

      setError('Location not found');
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to geocode location';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reverse geocoding: Convert coordinates to location name
   */
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<GeocodingResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
          new URLSearchParams({
            lat: lat.toString(),
            lon: lng.toString(),
            format: 'json',
            addressdetails: '1',
          }),
        {
          headers: {
            'User-Agent': 'LocaLens/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding request failed');
      }

      const data = await response.json();

      if (data) {
        return {
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lon),
          displayName: data.display_name,
          address: data.address,
        };
      }

      setError('Location not found');
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reverse geocode';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    geocodeLocation,
    reverseGeocode,
    isLoading,
    error,
  };
};
