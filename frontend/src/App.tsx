import { useState } from 'react';
import { Compass, Headphones, Mic } from 'lucide-react';
import { TravelerHUD } from './pages/TravelerHUD';
import { ExpertStudio } from './pages/ExpertStudio';
import { ActiveSessionProvider } from './context/ActiveSessionProvider';

export function App() {
  const [activeTab, setActiveTab] = useState<'traveler' | 'expert'>('traveler');

  return (
    <ActiveSessionProvider>
      <div className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#ecfdf5_46%,#f8fafc_100%)] text-slate-800 font-sans antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm backdrop-blur-md sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/25">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
                  Local Lens <span className="text-slate-400">—</span> Audio Co-Pilot
                </h1>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  Human locals, voice-first guidance
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-100/80 p-1">
              <button
                onClick={() => setActiveTab('traveler')}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all sm:px-4 ${
                  activeTab === 'traveler'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-pressed={activeTab === 'traveler'}
              >
                <Headphones className="h-4 w-4" /> Traveler Mode
              </button>
              <button
                onClick={() => setActiveTab('expert')}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all sm:px-4 ${
                  activeTab === 'expert'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                aria-pressed={activeTab === 'expert'}
              >
                <Mic className="h-4 w-4" /> Expert Portal
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          {activeTab === 'traveler' ? <TravelerHUD /> : <ExpertStudio />}
        </main>
      </div>
    </ActiveSessionProvider>
  );
}

export default App;
