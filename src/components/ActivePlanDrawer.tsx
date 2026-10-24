'use client';

import React, { useState } from 'react';
import { CheckCircle2, ChevronUp, ChevronDown, MapPin, QrCode, Sparkles } from 'lucide-react';
import { Meetup } from '@/lib/types';
import confetti from 'canvas-confetti';

interface ActivePlanDrawerProps {
  activeMeetup: Meetup | null;
  onCheckIn: (meetupId: string) => void;
}

export const ActivePlanDrawer: React.FC<ActivePlanDrawerProps> = ({ activeMeetup, onCheckIn }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  if (!activeMeetup) return null;

  const isConfirmed = activeMeetup.status === 'confirmed' || activeMeetup.currentCount >= activeMeetup.thresholdCount;

  const handleCheckIn = () => {
    setHasCheckedIn(true);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.8 },
      });
    } catch (e) {
      console.error(e);
    }
    onCheckIn(activeMeetup.id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4 pointer-events-none">
      <div className="pointer-events-auto bg-zinc-900/95 border border-emerald-500/30 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300">
        {/* Minimized Bar */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className={`p-1.5 rounded-lg ${isConfirmed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>

            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {isConfirmed ? 'Plan Confirmed' : 'Lock-In Pending'}
                </span>
                <span className="text-zinc-500 text-xs">•</span>
                <span className="text-xs text-zinc-300 font-mono font-medium">
                  {activeMeetup.currentCount}/{activeMeetup.thresholdCount} Quorum
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white truncate max-w-[220px]">
                {activeMeetup.title}
              </h4>
            </div>
          </div>

          <button className="text-zinc-400 p-1 hover:text-white">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{activeMeetup.locationName} {activeMeetup.locationDetails && `(${activeMeetup.locationDetails})`}</span>
            </div>

            {/* Check-In Action */}
            {isConfirmed && !hasCheckedIn && (
              <button
                onClick={handleCheckIn}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-xs transition-all active:scale-95 shadow-emerald-glow flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>I&apos;m Here • Check In & Refund Token (+2% Rep)</span>
              </button>
            )}

            {hasCheckedIn && (
              <div className="py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Attendance Verified • 1 Token Refunded</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
