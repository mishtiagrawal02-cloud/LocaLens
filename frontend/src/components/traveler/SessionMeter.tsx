import React, { useMemo } from 'react';
import { Clock, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import type { SessionCost } from '../../types';

interface SessionMeterProps {
  elapsedSeconds: number;
  ratePerMinute: number;
  guideName: string;
  isActive: boolean;
  complimentaryMinutes?: number;
  onAddMinutes?: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(v => String(v).padStart(2, '0')).join(':');
};

const calculateSessionCost = (elapsedSeconds: number, ratePerMinute: number): SessionCost => {
  const totalMinutes = elapsedSeconds / 60;
  const totalCost = totalMinutes * ratePerMinute;
  const guideShare = totalCost * 0.8; // 80% to guide
  const platformFee = totalCost * 0.2; // 20% platform fee
  
  return {
    totalMinutes,
    ratePerMinute,
    totalCost,
    guideShare,
    platformFee,
  };
};

export const SessionMeter: React.FC<SessionMeterProps> = ({
  elapsedSeconds,
  ratePerMinute,
  guideName,
  isActive,
  complimentaryMinutes = 0,
  onAddMinutes,
}) => {
  const cost = useMemo(() => calculateSessionCost(elapsedSeconds, ratePerMinute), [elapsedSeconds, ratePerMinute]);
  const elapsedMinutes = elapsedSeconds / 60;
  const isUsingComplimentary = complimentaryMinutes > 0 && elapsedMinutes <= complimentaryMinutes;
  const remainingComplimentary = Math.max(0, complimentaryMinutes - elapsedMinutes);
  
  return (
    <GlassCard className="overflow-hidden">
      <div className="relative">
        {/* Header */}
        <div className="border-b border-slate-200/80 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Session Timer
                </p>
                <p className="text-sm font-extrabold text-slate-950">
                  {isActive ? 'Recording Time' : 'Session Paused'}
                </p>
              </div>
            </div>
            
            {isActive && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-600" />
                </span>
                <span className="text-xs font-bold text-emerald-700">LIVE</span>
              </div>
            )}
          </div>
        </div>

        {/* Time Display */}
        <div className="border-b border-slate-200/80 bg-white px-5 py-6 text-center">
          <div className="mb-2 font-mono text-5xl font-extrabold tracking-tight text-slate-950">
            {formatTime(elapsedSeconds)}
          </div>
          <p className="text-xs font-semibold text-slate-500">
            {cost.totalMinutes.toFixed(2)} minutes elapsed
          </p>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-4 px-5 py-5">
          {/* Complimentary Minutes Banner */}
          {isUsingComplimentary && (
            <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Hotel Pass Active
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-emerald-950">
                    {remainingComplimentary.toFixed(1)} complimentary minutes remaining
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Current Cost */}
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Total
            </span>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-slate-950">
                ${isUsingComplimentary ? '0.00' : cost.totalCost.toFixed(2)}
              </span>
              {isUsingComplimentary && (
                <span className="ml-2 text-xs font-bold text-emerald-600">FREE</span>
              )}
            </div>
          </div>

          {/* Rate */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600">Rate per minute</span>
            <span className="font-bold text-slate-800">${ratePerMinute.toFixed(2)}/min</span>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200" />

          {/* Payout Breakdown */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Payout Breakdown
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    Guide Share (80%)
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-700">
                  ${isUsingComplimentary ? '0.00' : cost.guideShare.toFixed(2)}
                </span>
              </div>
              
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">
                    Local Lens Fee (20%)
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-slate-600">
                  ${isUsingComplimentary ? '0.00' : cost.platformFee.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Guide Info */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Session with
            </p>
            <p className="mt-1 text-sm font-extrabold text-slate-950">{guideName}</p>
          </div>

          {/* Add Minutes Button */}
          {onAddMinutes && isActive && (
            <button
              onClick={onAddMinutes}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Extra Minutes
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
