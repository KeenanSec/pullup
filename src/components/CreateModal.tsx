'use client';

import React, { useState } from 'react';
import { X, BookOpen, Dumbbell, Coffee, Sparkles, MapPin, Users, Clock, Zap, ArrowRight } from 'lucide-react';
import { Category, Meetup } from '@/lib/types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (meetup: Omit<Meetup, 'id' | 'currentCount' | 'status' | 'isUserLockedIn' | 'lockedUsers'>) => void;
  userTokens: number;
}

export const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onCreate, userTokens }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('study');
  const [locationName, setLocationName] = useState('Library Floor 3');
  const [locationDetails, setLocationDetails] = useState('');
  const [thresholdCount, setThresholdCount] = useState(4);
  const [durationMinutes, setDurationMinutes] = useState(30);

  if (!isOpen) return null;

  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'study', label: 'Study', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'sports', label: 'Sports', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'food', label: 'Food', icon: <Coffee className="w-4 h-4" /> },
    { id: 'hangout', label: 'Hangout', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const locationPresets = [
    'Library Floor 3',
    'Student Union',
    'Campus Rec Center',
    'North Quad Green',
    'Dorm Lounge',
  ];

  const durationPresets = [15, 30, 45, 60];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();

    onCreate({
      creatorId: 'user_me',
      creatorName: 'Alex Rivera',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      title: title.trim(),
      category,
      locationName,
      locationDetails: locationDetails.trim() || undefined,
      thresholdCount,
      maxCount: thresholdCount + 2,
      expiresAt,
    });

    onClose();
    // Reset form
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md transition-all">
      <div 
        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Create Assurance Contract</h3>
            <p className="text-xs text-zinc-400">Plan activates only if headcount threshold is hit</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto no-scrollbar flex-1 pb-2">
          {/* Category Selector */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-medium transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-semibold'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat.icon}
                    <span className="mt-1 text-[11px]">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5">
              Plan Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Organic Chem 2 Quiz Review, 5v5 Run"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Location Presets & Custom */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>Campus Spot</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {locationPresets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setLocationName(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    locationName === preset
                      ? 'bg-zinc-200 text-zinc-950 font-semibold border-white'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Room number / Specific spot instructions"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Quorum Threshold Stepper */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-zinc-200">Required Quorum</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Plan dissolves if this count is not hit
              </p>
            </div>

            <div className="flex items-center gap-2 bg-zinc-950 rounded-xl border border-zinc-800 p-1">
              <button
                type="button"
                onClick={() => setThresholdCount(Math.max(2, thresholdCount - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-200 hover:bg-zinc-800 font-bold active:scale-95"
              >
                -
              </button>
              <span className="w-6 text-center font-mono font-bold text-emerald-400 text-sm">
                {thresholdCount}
              </span>
              <button
                type="button"
                onClick={() => setThresholdCount(Math.min(12, thresholdCount + 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-900 text-zinc-200 hover:bg-zinc-800 font-bold active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Countdown Window */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Confirmation Countdown</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {durationPresets.map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-2 rounded-xl border text-xs font-mono font-medium transition-all ${
                    durationMinutes === mins
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Token Stake Notice */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-300 text-[11px]">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 flex-shrink-0" />
            <span>Posting this plan stakes 1 Commitment Token. Refunded when confirmed.</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={userTokens <= 0 || !title.trim()}
            className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Publish Assurance Contract</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
