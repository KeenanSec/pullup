'use client';

import React from 'react';
import { Category } from '@/lib/types';
import { Layers, BookOpen, Dumbbell, Coffee, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  selected: Category | 'all';
  onSelect: (cat: Category | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  const tabs: { id: Category | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'study', label: 'Study', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'sports', label: 'Sports', icon: <Dumbbell className="w-3.5 h-3.5" /> },
    { id: 'food', label: 'Food & Coffee', icon: <Coffee className="w-3.5 h-3.5" /> },
    { id: 'hangout', label: 'Hangouts', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="px-4 py-2 border-b border-white/5 bg-zinc-950/60 backdrop-blur-md sticky top-[61px] z-20">
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {tabs.map((tab) => {
          const isActive = selected === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                isActive
                  ? 'bg-zinc-100 text-zinc-950 shadow-md font-semibold'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
