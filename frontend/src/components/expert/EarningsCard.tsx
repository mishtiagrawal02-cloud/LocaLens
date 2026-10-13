import React from 'react';
import { BadgeCheck, DollarSign, Headphones, Star } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface EarningsCardProps {
  todayEarnings?: number;
  completedCount?: number;
  rating?: number;
  isOnline?: boolean;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({
  todayEarnings = 128.50,
  completedCount = 8,
  rating = 4.98,
  isOnline = true,
}) => {
  const metrics = [
    {
      label: "Today's Earnings",
      value: `$${todayEarnings.toFixed(2)}`,
      detail: `${completedCount} micro-consultations`,
      icon: DollarSign,
    },
    {
      label: 'Completed Calls',
      value: String(completedCount),
      detail: 'Avg response under 18s',
      icon: Headphones,
    },
    {
      label: 'Guide Rating',
      value: `${rating} ★`,
      detail: 'Accessibility Champion',
      icon: Star,
    },
  ];

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Expert Portal</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">Remote Local Studio</h2>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800">
          <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          {isOnline ? 'Online & Matching' : 'Offline'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-slate-500">{metric.label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-950">{metric.value}</p>
              <span className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> {metric.detail}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
