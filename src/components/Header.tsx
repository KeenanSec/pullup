'use client';

import React from 'react';
import { Zap, ShieldCheck, MapPin } from 'lucide-react';
import { User } from '@/lib/types';

interface HeaderProps {
  user: User;
  onOpenRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenRules }) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-zinc-950/80 border-b border-white/5 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Brand & Campus */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              PullUp
            </span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Campus Quorum
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5 font-medium">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span className="truncate max-w-[170px]">{user.campus}</span>
          </div>
        </div>

        {/* User Stats: Tokens & Reliability */}
        <div className="flex items-center gap-2">
          {/* Commitment Tokens Button */}
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-amber-300 hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
            title="Commitment Tokens (Anti-Flake)"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold font-mono">{user.tokens}/{user.maxTokens}</span>
          </button>

          {/* User Profile Avatar with Rep Ring */}
          <button
            onClick={onOpenRules}
            className="relative flex items-center justify-center p-0.5 rounded-full border border-emerald-500/40 bg-zinc-900 group active:scale-95 transition-all"
            title={`Reliability Score: ${user.reliability}%`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-950" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
