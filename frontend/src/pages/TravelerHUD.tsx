import React, { useEffect, useMemo, useState } from 'react';
import { BatteryCharging, CheckCircle2, Eye, EyeOff, Mic, MicOff, PhoneOff, Gift } from 'lucide-react';
import { AudioWaveform } from '../components/traveler/AudioWaveform';
import { GuideDiscoveryOverlay } from '../components/traveler/GuideDiscoveryOverlay';
import { MicroActions } from '../components/traveler/MicroActions';
import { MapOverlay } from '../components/traveler/MapOverlay';
import { TranslationModal } from '../components/common/TranslationModal';
import { HotelPassModal } from '../components/common/HotelPassModal';
import { AccessibilityFilter } from '../components/common/AccessibilityFilter';
import { PostSessionModal } from '../components/common/PostSessionModal';
import { TravelerRouteCard } from '../components/traveler/TravelerRouteCard';
import { useSessionState } from '../context/useSessionState';
import type { HotelPass, AccessibilityFilter as AccessibilityFilterType, SessionReview } from '../types';

const formatElapsed = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
};

export const TravelerHUD: React.FC = () => {
  const { pushedRoute, onClearRoute } = useSessionState();
  const [isMuted, setIsMuted] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isTranslationOpen, setIsTranslationOpen] = useState(false);
  const [isHotelPassOpen, setIsHotelPassOpen] = useState(false);
  const [isPostSessionOpen, setIsPostSessionOpen] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(872);
  const [spotStatus, setSpotStatus] = useState<'idle' | 'requested' | 'verified'>('idle');
  const [activeGuideName, setActiveGuideName] = useState('Marco');
  const [activeGuideRate] = useState(0.25); // $0.25 per minute
  const [toast, setToast] = useState<string | null>(null);
  const [complimentaryMinutes, setComplimentaryMinutes] = useState(0);

  const elapsedText = useMemo(() => formatElapsed(elapsedSeconds), [elapsedSeconds]);
  const recentTip = '"Take the narrow alley on your left after the bakery; it opens into a quiet courtyard."';
  const totalSessionCost = useMemo(() => {
    const minutes = elapsedSeconds / 60;
    const effectiveMinutes = Math.max(0, minutes - complimentaryMinutes);
    return effectiveMinutes * activeGuideRate;
  }, [elapsedSeconds, activeGuideRate, complimentaryMinutes]);

  useEffect(() => {
    if (!isSessionActive) return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isSessionActive]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const handleSpotCheck = () => {
    setSpotStatus('requested');
    notify('Spot verification sent to Marco');
    window.setTimeout(() => setSpotStatus('verified'), 1200);
  };

  const toggleSession = () => {
    if (isSessionActive) {
      // Ending session - show review modal
      setIsSessionActive(false);
      setIsPostSessionOpen(true);
    } else {
      setIsSessionActive(true);
      notify(`Session restarted with ${activeGuideName}.`);
    }
  };

  const startGuideCall = (guideName: string, hourlyRate: number) => {
    setActiveGuideName(guideName);
    setIsSessionActive(true);
    setIsMuted(false);
    notify(`Initializing WebRTC session with ${guideName} at $${hourlyRate}/hr`);
  };

  const handleHotelPassRedeem = (hotelPass: HotelPass) => {
    setComplimentaryMinutes(hotelPass.minutesGranted);
    notify(`✨ ${hotelPass.minutesGranted} complimentary minutes added from ${hotelPass.hotelName}!`);
    setIsHotelPassOpen(false);
  };

  const handleAccessibilityFilterChange = (filters: AccessibilityFilterType) => {
    const activeCount = Object.values(filters).filter(Boolean).length;
    if (activeCount > 0) {
      notify(`${activeCount} accessibility filter${activeCount > 1 ? 's' : ''} applied`);
    }
  };

  const handlePostSessionSubmit = (review: SessionReview) => {
    notify(`Thank you for your ${review.rating}-star review!`);
    setIsPostSessionOpen(false);
    setElapsedSeconds(0); // Reset for demo
  };

  const handlePlayAudio = (text: string) => {
    notify(`🔊 Playing: "${text.substring(0, 50)}..."`);
    // In production, this would use Web Speech API or audio streaming
  };

  return (
    <div className="relative">
      {toast && (
        <div className="fixed right-4 top-24 z-40 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 text-xs font-bold text-emerald-800 shadow-xl shadow-emerald-950/10 backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" /> {toast}
        </div>
      )}

      {lowPowerMode && (
        <div className="pointer-events-none fixed inset-0 z-30 bg-slate-950/15 backdrop-grayscale" />
      )}

      <div className={`space-y-5 transition-all duration-300 ${lowPowerMode ? 'brightness-75 grayscale' : ''}`}>
        {pushedRoute && (
          <TravelerRouteCard
            key={pushedRoute.timestamp}
            route={pushedRoute}
            onDismiss={onClearRoute}
            onPlayAudio={handlePlayAudio}
          />
        )}

      <section className="flex flex-col justify-between gap-5 rounded-[2rem] bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 p-5 text-white shadow-2xl shadow-emerald-700/15 sm:p-6 lg:flex-row lg:items-center">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
              {isSessionActive ? 'Active Session' : 'Session Paused'}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-emerald-50">
              <BatteryCharging className="h-3.5 w-3.5" /> Earpiece Connected
            </span>
            <span className="rounded-full bg-slate-950/20 px-3 py-1 font-mono text-xs font-bold text-white">
              {elapsedText}
            </span>
            {complimentaryMinutes > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-white">
                <Gift className="h-3 w-3" /> Hotel Pass Active
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Connected to {activeGuideName}
          </h2>
          <p className="mt-1 max-w-2xl text-sm font-medium text-emerald-50">
            Navigating Old Town Quarter • High-fidelity audio stream
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsHotelPassOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-bold transition hover:bg-white/20"
            title="Redeem hotel pass voucher"
          >
            <Gift className="h-4 w-4" />
            <span>Hotel Pass</span>
          </button>

          <button
            onClick={() => setLowPowerMode(!lowPowerMode)}
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-bold transition hover:bg-white/20"
            title="Dim the screen and simplify visuals while walking"
            aria-pressed={lowPowerMode}
          >
            {lowPowerMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span>{lowPowerMode ? 'Normal View' : 'Stealth HUD'}</span>
          </button>

          <button
            onClick={() => {
              setIsMuted(!isMuted);
              notify(isMuted ? 'Microphone unmuted' : 'Microphone muted');
            }}
            className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/20"
            aria-pressed={isMuted}
          >
            {isMuted ? <MicOff className="h-4 w-4 text-red-100" /> : <Mic className="h-4 w-4" />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={toggleSession}
            className="flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-extrabold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
          >
            <PhoneOff className="h-4 w-4" />
            {isSessionActive ? 'End Session' : 'Start Session'}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-5 xl:col-span-4">
          <AudioWaveform
            durationText={elapsedText}
            guideMessage={recentTip}
            isMuted={isMuted}
            isActive={isSessionActive}
          />
          
          <MicroActions
            onTranslationClick={() => setIsTranslationOpen(true)}
            onSpotCheckClick={handleSpotCheck}
            spotStatus={spotStatus}
          />
        </div>
        <div className="lg:col-span-7 xl:col-span-8">
          <MapOverlay lowPowerMode={lowPowerMode} pushedRoute={pushedRoute} />
        </div>
      </div>

      {/* Accessibility Filter */}
      <AccessibilityFilter
        onFilterChange={handleAccessibilityFilterChange}
        matchingGuidesCount={12}
      />

      <GuideDiscoveryOverlay onStartCall={startGuideCall} />
      </div>

      {/* Modals */}
      <TranslationModal
        isOpen={isTranslationOpen}
        onClose={() => setIsTranslationOpen(false)}
        onPlay={() => notify('Italian phrase played to earpiece')}
      />

      <HotelPassModal
        isOpen={isHotelPassOpen}
        onClose={() => setIsHotelPassOpen(false)}
        onRedeem={handleHotelPassRedeem}
      />

      <PostSessionModal
        isOpen={isPostSessionOpen}
        onClose={() => setIsPostSessionOpen(false)}
        onSubmit={handlePostSessionSubmit}
        guideName={activeGuideName}
        sessionDuration={elapsedText}
        totalCost={totalSessionCost}
      />
    </div>
  );
};
