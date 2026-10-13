import React from 'react';
import { AlertCircle, Compass, MapPin, Send } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface QuickTipDispatcherProps {
  onSendTip: (tip: string) => void;
}

export const QuickTipDispatcher: React.FC<QuickTipDispatcherProps> = ({ onSendTip }) => {
  const presetTips = [
    { label: 'Look Left: Hidden Courtyard', icon: Compass },
    { label: 'Wheelchair Ramp Available', icon: MapPin },
    { label: 'Crowded Zone', icon: AlertCircle },
  ];

  return (
    <GlassCard className="h-full p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="flex items-center gap-2 font-extrabold text-slate-950">
          <Send className="h-4 w-4 text-emerald-600" /> Quick Dispatch
        </h3>
        <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
          Instant earpiece ping
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {presetTips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <button
              key={idx}
              onClick={() => onSendTip(tip.label)}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm transition group-hover:text-emerald-700">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-extrabold text-slate-700 group-hover:text-emerald-900">
                  {tip.label}
                </span>
              </span>
              <Send className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-emerald-600" />
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
};
