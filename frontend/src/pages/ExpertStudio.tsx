import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { EarningsCard } from '../components/expert/EarningsCard';
import { IncomingQueue } from '../components/expert/IncomingQueue';
import { QuickTipDispatcher } from '../components/expert/QuickTipDispatcher';
import { ExpertMapPinPusher } from '../components/expert/ExpertMapPinPusher';
import { useSessionState } from '../context/useSessionState';
import type { IncomingRequest, PushedRoute, TravelerLocation } from '../types';

export const ExpertStudio: React.FC = () => {
  const { onPushRoute } = useSessionState();
  const [requests, setRequests] = useState<IncomingRequest[]>([
    {
      id: '1',
      travelerName: 'John D.',
      travelerTag: 'Digital Nomad',
      requestText: 'Quiet cafe recommendations near Old Square • 15 min pass',
      estimatedEarnings: 12.0,
      status: 'pending',
    },
    {
      id: '2',
      travelerName: 'Elena S.',
      travelerTag: 'Cultural Explorer',
      requestText: 'Wheelchair accessible path to fortress viewpoint',
      estimatedEarnings: 15.0,
      status: 'pending',
    },
    {
      id: '3',
      travelerName: 'Mina K.',
      travelerTag: 'Food Scout',
      requestText: 'Help me avoid tourist-trap menus around the market',
      estimatedEarnings: 9.5,
      status: 'pending',
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  // Mock traveler location (in production, this would come from real-time WebSocket)
  const activeTravelerLocation: TravelerLocation = {
    lat: 41.9028,
    lng: 12.4964,
    accuracy: 10,
    timestamp: new Date(),
  };

  const handleAccept = (id: string) => {
    const traveler = requests.find((request) => request.id === id)?.travelerName ?? 'Traveler';
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: 'active' } : request)));
    setNotification(`${traveler} is now in an active call`);
    window.setTimeout(() => setNotification(null), 2600);
  };

  const handleSendTip = (tip: string) => {
    setNotification(`Audio alert dispatched: ${tip}`);
    window.setTimeout(() => setNotification(null), 2600);
  };

  const handlePushRoute = (route: PushedRoute) => {
    onPushRoute(route);
    setNotification(`Route to "${route.destination.name}" pushed to traveler HUD`);
    window.setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="relative space-y-5">
      {notification && (
        <div className="fixed right-4 top-24 z-40 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 text-xs font-bold text-emerald-800 shadow-xl shadow-emerald-950/10 backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" /> {notification}
        </div>
      )}
      <EarningsCard todayEarnings={128.5} completedCount={8} rating={4.98} isOnline={true} />
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="space-y-5">
            <QuickTipDispatcher onSendTip={handleSendTip} />
            <ExpertMapPinPusher
              travelerLocation={activeTravelerLocation}
              travelerName="John D."
              expertName="Marco"
              onPushRoute={handlePushRoute}
            />
          </div>
        </div>
        <div className="lg:col-span-7">
          <IncomingQueue requests={requests} onAccept={handleAccept} />
        </div>
      </div>
    </div>
  );
};
