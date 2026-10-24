'use client';

import React from 'react';
import { X, Zap, Shield, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { User } from '@/lib/types';

interface TokenRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export const TokenRulesModal: React.FC<TokenRulesModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md transition-all">
      <div 
        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Social Staking & Quorum</h3>
              <p className="text-xs text-zinc-400">How PullUp eliminates campus flake culture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Current Standing */}
        <div className="mt-5 p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Your Balance</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-amber-300 font-mono">{user.tokens}</span>
              <span className="text-xs text-zinc-500">/ {user.maxTokens} Tokens</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-zinc-800" />

          <div>
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Reliability Score</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-emerald-400 font-mono">{user.reliability}%</span>
              <span className="text-xs text-emerald-500 font-medium">Top Tier</span>
            </div>
          </div>
        </div>

        {/* 3 Core Rules */}
        <div className="mt-5 space-y-3.5 text-xs">
          <div className="flex gap-3">
            <div className="mt-0.5 p-1 rounded-lg bg-emerald-500/10 text-emerald-400 h-fit">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-zinc-200">1. Conditional Lock-In (Assurance Contract)</span>
              <p className="text-zinc-400 mt-0.5 leading-relaxed">
                You only show up if the threshold is hit. If 4 people are needed and only 3 lock in before the timer expires, the plan quietly dissolves. Zero awkwardness.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-0.5 p-1 rounded-lg bg-amber-500/10 text-amber-400 h-fit">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-zinc-200">2. Commitment Tokens</span>
              <p className="text-zinc-400 mt-0.5 leading-relaxed">
                Joining a plan temporarily stakes 1 token. When the meetup confirms and you check in at the spot, your token is refunded and your reliability score increases.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-0.5 p-1 rounded-lg bg-rose-500/10 text-rose-400 h-fit">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-zinc-200">3. Anti-Flake Penalty</span>
              <p className="text-zinc-400 mt-0.5 leading-relaxed">
                If an event confirms and you ghost without giving 15m advance notice, your staked token is burned. Hitting 0 tokens triggers a 7-day campus RSVP lockout.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom dismiss */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-1.5"
        >
          <span>Got it, let&apos;s lock in</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
