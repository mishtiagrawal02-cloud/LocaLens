import React, { useState } from 'react';
import { ShieldAlert, MapPin, Battery, Phone, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import type { EmergencyContact } from '../../types';

interface EmergencyAssistProps {
  userLocation?: { lat: number; lng: number } | null;
  batteryLevel?: number;
  audioStreamUrl?: string;
  emergencyContacts?: EmergencyContact[];
  hotelName?: string;
}

export const EmergencyAssist: React.FC<EmergencyAssistProps> = ({
  userLocation,
  batteryLevel = 75,
  audioStreamUrl,
  emergencyContacts = [],
  hotelName,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleEmergencySOS = async () => {
    setIsSending(true);

    // Simulate emergency alert being sent
    // In production, this would:
    // 1. Send SMS/push notifications to emergency contacts
    // 2. Alert hotel front desk
    // 3. Share live location link
    // 4. Provide audio stream access
    // 5. Log to emergency services dashboard

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSending(false);
    setIsSent(true);

    // Reset after 5 seconds
    setTimeout(() => {
      setIsSent(false);
      setIsExpanded(false);
    }, 5000);
  };

  if (isSent) {
    return (
      <div className="rounded-[1.5rem] border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Emergency Alert Sent
            </p>
            <p className="mt-1 text-lg font-extrabold text-slate-950">
              Help is on the way
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {emergencyContacts.length + (hotelName ? 1 : 0)} contacts notified with your location
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="group w-full rounded-[1.5rem] border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-4 shadow-sm transition hover:border-red-300 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition group-hover:scale-105">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-red-600">
              Emergency Safety Net
            </p>
            <p className="mt-1 text-sm font-extrabold text-slate-950">
              Tap for Instant Help
            </p>
          </div>
          <div className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-extrabold text-red-700">
            SOS
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-[1.5rem] border-2 border-red-400 bg-white p-5 shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-600">
              Emergency SOS
            </p>
            <p className="mt-1 text-lg font-extrabold text-slate-950">
              Send Emergency Alert
            </p>
          </div>
        </div>
        
        {!isSending && (
          <button
            onClick={() => setIsExpanded(false)}
            className="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Alert Preview */}
      <div className="mb-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          This will send:
        </p>

        {/* Location */}
        {userLocation && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Live GPS Location</p>
              <p className="mt-0.5 font-mono text-xs text-slate-600">
                {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        )}

        {/* Battery */}
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <Battery className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">Battery Status</p>
            <p className="mt-0.5 text-xs text-slate-600">{batteryLevel}% remaining</p>
          </div>
        </div>

        {/* Audio Stream */}
        {audioStreamUrl && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">Live Audio Stream Access</p>
              <p className="mt-0.5 text-xs text-slate-600">Real-time listening link</p>
            </div>
          </div>
        )}
      </div>

      {/* Recipients */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Will be sent to:
        </p>
        <div className="mt-3 space-y-2">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-600" />
              <span className="text-sm font-semibold text-slate-700">
                {contact.name} ({contact.relationship})
              </span>
            </div>
          ))}
          {hotelName && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="text-sm font-semibold text-slate-700">
                {hotelName} Front Desk
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Warning */}
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-xs font-semibold text-amber-800">
          Only use in genuine emergencies. False alarms may result in service suspension.
        </p>
      </div>

      {/* Send Button */}
      <button
        onClick={handleEmergencySOS}
        disabled={isSending}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-red-600 text-base font-extrabold text-white shadow-lg transition hover:bg-red-700 disabled:opacity-50"
      >
        {isSending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending Emergency Alert...
          </>
        ) : (
          <>
            <ShieldAlert className="h-5 w-5" />
            Send Emergency SOS Now
          </>
        )}
      </button>
    </div>
  );
};
