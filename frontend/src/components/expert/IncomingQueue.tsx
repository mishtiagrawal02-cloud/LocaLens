import React from 'react';
import { CheckCircle, Users } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import type { IncomingRequest } from '../../types';

interface IncomingQueueProps {
  requests: IncomingRequest[];
  onAccept: (id: string) => void;
}

export const IncomingQueue: React.FC<IncomingQueueProps> = ({ requests, onAccept }) => {
  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-extrabold text-slate-950">
          <Users className="h-4 w-4 text-emerald-600" /> Incoming Traveler Queue
        </h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
          {requests.filter((request) => request.status === 'pending').length} waiting
        </span>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-300 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-extrabold text-slate-600">
                {req.travelerName
                  .split(' ')
                  .map((name) => name[0])
                  .join('')}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-950">
                  {req.travelerName}
                  <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                    {req.travelerTag}
                  </span>
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{req.requestText}</p>
              </div>
            </div>

            {req.status === 'active' ? (
              <span className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-100 px-4 py-2.5 text-xs font-extrabold text-emerald-800 sm:w-auto">
                <CheckCircle className="h-3.5 w-3.5" /> Active Call
              </span>
            ) : (
              <button
                onClick={() => onAccept(req.id)}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-700 sm:w-auto"
              >
                Accept Call (${req.estimatedEarnings.toFixed(2)})
              </button>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
