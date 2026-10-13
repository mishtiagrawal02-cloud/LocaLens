import React from 'react';
import { Activity, Radio } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface AudioWaveformProps {
  durationText?: string;
  guideMessage?: string;
  isMuted?: boolean;
  isActive?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  durationText = '00:14:32',
  guideMessage = '"Take the narrow alley on your left after the bakery; it opens into a quiet courtyard."',
  isMuted = false,
  isActive = true,
}) => {
  const bars = [22, 34, 18, 42, 30, 48, 24, 38, 28, 44, 20, 32];

  return (
    <GlassCard className="flex min-h-[330px] flex-col justify-between p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-extrabold text-slate-950">
          <Activity className="h-4 w-4 text-emerald-600" /> Live Voice Stream
        </h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-600">
          {durationText}
        </span>
      </div>

      <div className="rounded-[1.5rem] bg-slate-950 p-5 shadow-inner">
        <div className="mb-5 flex items-center justify-between">
          <span className="flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
            <Radio className="h-3.5 w-3.5" /> Marco is speaking
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isMuted ? 'bg-rose-400/15 text-rose-200' : 'bg-white/10 text-slate-300'}`}>
            {isMuted ? 'Mic muted' : 'Mic open'}
          </span>
        </div>

        <div className="flex h-24 items-center justify-center gap-1.5">
          {bars.map((height, index) => (
            <span
              key={index}
              className={`w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.38)] ${isActive ? 'wave-bar' : 'h-2 opacity-40'}`}
              style={{
                '--wave-height': `${height}px`,
                animationDelay: `${index * 0.08}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Latest guide transcript
        </p>
        <p className="text-sm font-semibold leading-6 text-slate-800">{guideMessage}</p>
      </div>
    </GlassCard>
  );
};
