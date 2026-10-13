import React, { useState } from 'react';
import { X, QrCode, Gift, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import type { HotelPass } from '../../types';

interface HotelPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (hotelPass: HotelPass) => void;
}

// Mock hotel pass validation (in production, this would call your API)
const validateHotelPass = async (code: string): Promise<HotelPass | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const validPasses: Record<string, Omit<HotelPass, 'code' | 'isRedeemed'>> = {
    'ROME-HILTON-2026': {
      hotelName: 'Rome Hilton Garden Inn',
      minutesGranted: 60,
      expiresAt: new Date('2026-12-31'),
    },
    'VENICE-MARRIOTT-VIP': {
      hotelName: 'Venice Marriott',
      minutesGranted: 120,
      expiresAt: new Date('2026-12-31'),
    },
    'FLORENCE-HYATT-GOLD': {
      hotelName: 'Florence Hyatt Regency',
      minutesGranted: 90,
      expiresAt: new Date('2026-12-31'),
    },
  };
  
  const upperCode = code.toUpperCase().trim();
  const passData = validPasses[upperCode];
  
  if (passData) {
    return {
      code: upperCode,
      ...passData,
      isRedeemed: false,
    };
  }
  
  return null;
};

export const HotelPassModal: React.FC<HotelPassModalProps> = ({ isOpen, onClose, onRedeem }) => {
  const [passCode, setPassCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validatedPass, setValidatedPass] = useState<HotelPass | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRedeemed, setIsRedeemed] = useState(false);

  if (!isOpen) return null;

  const handleValidate = async () => {
    if (!passCode.trim()) {
      setError('Please enter a hotel pass code');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const pass = await validateHotelPass(passCode);
      
      if (pass) {
        setValidatedPass(pass);
        setError(null);
      } else {
        setError('Invalid hotel pass code. Please check and try again.');
        setValidatedPass(null);
      }
    } catch {
      setError('Failed to validate pass. Please try again.');
      setValidatedPass(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRedeem = () => {
    if (validatedPass) {
      onRedeem(validatedPass);
      setIsRedeemed(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setPassCode('');
    setValidatedPass(null);
    setError(null);
    setIsRedeemed(false);
    onClose();
  };

  const handleSimulateQRScan = () => {
    setPassCode('ROME-HILTON-2026');
    setTimeout(() => {
      setPassCode('ROME-HILTON-2026');
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative w-full max-w-md rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          {isRedeemed ? (
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="mt-4 text-2xl font-extrabold text-slate-950">
                Pass Redeemed!
              </h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {validatedPass?.minutesGranted} complimentary minutes added to your account
              </p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                  <Gift className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950">
                  Hotel Pass Voucher
                </h3>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  Redeem complimentary co-pilot minutes from partner hotels
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Enter Hotel Pass Code
                  </label>
                  <input
                    type="text"
                    value={passCode}
                    onChange={(e) => setPassCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                    placeholder="ROME-HILTON-2026"
                    disabled={isValidating || isRedeemed}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-center font-mono text-sm font-bold uppercase text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-50"
                  />
                  {error && (
                    <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
                  )}
                </div>

                {validatedPass && !isRedeemed && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                          Valid Pass
                        </p>
                        <p className="mt-1 text-sm font-extrabold text-emerald-950">
                          {validatedPass.hotelName}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-emerald-800">
                          {validatedPass.minutesGranted} minutes • Expires{' '}
                          {validatedPass.expiresAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleValidate}
                    disabled={isValidating || !passCode.trim() || isRedeemed}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      'Validate Code'
                    )}
                  </button>
                  
                  {validatedPass && !isRedeemed && (
                    <button
                      onClick={handleRedeem}
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-extrabold text-white transition hover:bg-slate-800"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Redeem Now
                    </button>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 font-bold uppercase tracking-wider text-slate-400">
                      Or
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSimulateQRScan}
                  disabled={isValidating || isRedeemed}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-sm font-bold text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                >
                  <QrCode className="h-5 w-5" />
                  Scan QR Code at Front Desk
                </button>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Demo Codes
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['ROME-HILTON-2026', 'VENICE-MARRIOTT-VIP', 'FLORENCE-HYATT-GOLD'].map((code) => (
                    <button
                      key={code}
                      onClick={() => setPassCode(code)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
