import React, { useEffect, useState } from 'react';
import { ExternalLink, MapPin, Navigation, Volume2, X } from 'lucide-react';
import type { ActiveSessionPushedRoute } from '../../context/sessionState';

interface TravelerRouteCardProps {
  route: ActiveSessionPushedRoute;
  onDismiss: () => void;
  onPlayAudio: (text: string) => void;
}

export const TravelerRouteCard: React.FC<TravelerRouteCardProps> = ({
  route,
  onDismiss,
  onPlayAudio,
}) => {
  const [isFresh, setIsFresh] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsFresh(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  const audioCue =
    route.audioPrompt ??
    `${route.expertName} pinned ${route.destinationName}. ${route.distanceText} away, ${route.durationText}.`;

  const handleDismiss = () => {
    setIsClosing(true);
    window.setTimeout(onDismiss, 180);
  };

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-2xl shadow-emerald-900/10 transition-all duration-300 ${
        isFresh ? 'animate-routeBannerIn ring-4 ring-emerald-400/20' : ''
      } ${
        isClosing ? 'animate-routeBannerOut' : ''
      }`}
      aria-live="polite"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-emerald-400 opacity-20" />
            <MapPin className="relative h-6 w-6" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-extrabold text-slate-950">
                📍 {route.expertName} pinned a location for you:{' '}
                <span className="text-emerald-700">{route.destinationName}</span>
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800">
                <Navigation className="h-3.5 w-3.5" />
                Live route
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                {route.distanceText} away
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                {route.durationText}
              </span>
              {route.note && (
                <span className="max-w-full truncate rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 sm:max-w-[320px]">
                  {route.note}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-[1fr_1fr_auto] sm:shrink-0 sm:items-center">
          <button
            onClick={() => window.open(route.mapsUrl, '_blank', 'noopener,noreferrer')}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-extrabold text-white transition hover:bg-emerald-700 sm:px-4"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open in Google Maps</span>
          </button>
          <button
            onClick={() => onPlayAudio(audioCue)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 sm:px-4"
          >
            <Volume2 className="h-4 w-4" />
            <span>Audio Cue</span>
          </button>
          <button
            onClick={handleDismiss}
            className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:w-11"
            aria-label="Clear pinned route"
            title="Clear pinned route"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
