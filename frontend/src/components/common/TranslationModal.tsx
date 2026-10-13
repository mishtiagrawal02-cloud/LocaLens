import React, { useState } from 'react';
import { Languages, Volume2, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlay?: () => void;
}

const translations: Record<string, string> = {
  entrance: "Dove si trova l'ingresso accessibile piu vicino?",
  bakery: 'La panetteria e prima o dopo il vicolo stretto?',
  water: "Posso avere una bottiglia d'acqua, per favore?",
  station: 'Quanto dista la stazione a piedi?',
};

const translatePhrase = (phrase: string) => {
  const normalized = phrase.toLowerCase();
  const match = Object.entries(translations).find(([keyword]) => normalized.includes(keyword));

  return match?.[1] ?? "Mi puo aiutare con questa frase, per favore?";
};

export const TranslationModal: React.FC<TranslationModalProps> = ({ isOpen, onClose, onPlay }) => {
  const [phrase, setPhrase] = useState('Where is the nearest wheelchair accessible entrance?');

  if (!isOpen) return null;

  const translated = translatePhrase(phrase);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <GlassCard className="relative w-full max-w-lg p-5 shadow-2xl shadow-slate-950/20 sm:p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close translation modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex items-center gap-2 pr-9 font-extrabold text-emerald-700">
          <Languages className="h-5 w-5" />
          <span>Instant Speech Translation</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Traveler phrase (English)</label>
            <textarea
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              rows={3}
            />
          </div>

          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-800">
                Italian output
              </span>
              <button
                onClick={onPlay}
                className="rounded-full p-1.5 text-emerald-700 transition hover:bg-white hover:text-emerald-900"
                aria-label="Preview translated audio"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-base font-extrabold leading-7 text-emerald-950">{translated}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-extrabold text-slate-700 transition hover:bg-slate-200"
          >
            Close
          </button>
          <button
            onClick={onPlay}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-emerald-700"
          >
            <Volume2 className="h-4 w-4" /> Play to Earpiece
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
