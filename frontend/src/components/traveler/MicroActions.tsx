import React from 'react';
import { CheckCircle2, ChevronRight, Languages, MapPin } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface MicroActionsProps {
  onTranslationClick?: () => void;
  onSpotCheckClick?: () => void;
  spotStatus?: 'idle' | 'requested' | 'verified';
}

export const MicroActions: React.FC<MicroActionsProps> = ({
  onTranslationClick,
  onSpotCheckClick,
  spotStatus = 'idle',
}) => {
  const statusLabel = spotStatus === 'verified' ? 'Verified' : spotStatus === 'requested' ? 'Checking' : 'Ask Marco';

  return (
    <GlassCard className="space-y-3 p-4">
      <button
        onClick={onTranslationClick}
        className="flex w-full items-center justify-between rounded-2xl border border-emerald-200/80 bg-emerald-50 px-4 py-3 text-left text-xs font-extrabold text-emerald-800 transition hover:bg-emerald-100"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Languages className="h-4 w-4 shrink-0" /> Instant Translation
        </span>
        <ChevronRight className="h-4 w-4 shrink-0" />
      </button>

      <button
        onClick={onSpotCheckClick}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-left text-xs font-extrabold text-slate-700 transition hover:border-emerald-300 hover:bg-white"
      >
        <span className="flex min-w-0 items-center gap-2">
          {spotStatus === 'verified' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <MapPin className="h-4 w-4 shrink-0" />
          )}
          Request Spot Verification
        </span>
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-500">
          {statusLabel}
        </span>
      </button>
    </GlassCard>
  );
};
