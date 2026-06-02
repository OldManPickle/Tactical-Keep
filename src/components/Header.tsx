import React from 'react';
import * as Icons from 'lucide-react';
import { UserStats } from '../types';
import { LEVEL_UP_XP } from '../utils';

interface HeaderProps {
  userStats: UserStats;
  onOpenAchievements: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onAddFiftyExamples: () => void;
}

export default function Header({
  userStats,
  onOpenAchievements,
  searchQuery,
  onSearchQueryChange,
  onAddFiftyExamples,
}: HeaderProps) {
  // Let's find out progress inside current level (0 to 99)
  const currentXPInLevel = userStats.xp % LEVEL_UP_XP;
  const progressPercent = Math.min((currentXPInLevel / LEVEL_UP_XP) * 100, 100);

  return (
    <header className="border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <div className="bg-amber-500 text-white rounded-xl p-2 flex items-center justify-center shadow-xs">
            <Icons.CheckSquare className="h-5 w-5 fill-white/15" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-neutral-900 dark:text-neutral-100 uppercase">
                Tactical Keep
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-700">
                Eisenhower
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">Distraction-free matrix organizer</p>
          </div>
        </div>

        {/* Center/Right Actions and Stats */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto md:flex-1 justify-end">
          {/* Tactical Search Bar */}
          <div className="relative w-full sm:max-w-[240px] md:max-w-[280px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-450 dark:text-neutral-500">
              <Icons.Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              id="header_task_search_input"
              placeholder="Search by title or #tag..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="block w-full pl-9 pr-8 py-2 text-xs bg-neutral-150/80 dark:bg-neutral-800/80 hover:bg-neutral-200/60 dark:hover:bg-neutral-750/60 focus:bg-white dark:focus:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-700/60 rounded-xl text-neutral-800 dark:text-neutral-200 placeholder-neutral-450 dark:placeholder-neutral-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:ring-amber-500/45 dark:focus:border-amber-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchQueryChange('')}
                id="clear_search_btn"
                title="Clear Search"
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-neutral-650 dark:text-neutral-500 dark:hover:text-neutral-350 transition-colors"
                type="button"
              >
                <Icons.X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Gamified Habit Level & XP Rewards Bar */}
          <div className="w-full sm:max-w-[200px] md:max-w-[220px] bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/50 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-[11px]">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-extrabold text-neutral-700 dark:text-neutral-300 flex items-center gap-0.5">
                <Icons.Sparkles className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                Lvl {userStats.level}
              </span>
              <span className="text-[9px] text-neutral-400 font-mono">
                {currentXPInLevel}/{LEVEL_UP_XP} XP
              </span>
            </div>
            {/* Progress bar container */}
            <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Seed 50 examples button */}
          <button
            onClick={onAddFiftyExamples}
            id="seed_examples_btn"
            title="Seed 50 Epic Example Notes"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs font-bold border border-amber-500/20 transition-all active:scale-95 shrink-0"
          >
            <Icons.DatabaseBackup className="h-4 w-4 text-amber-500" />
            <span>+50 Examples</span>
          </button>

          {/* Achievements modal trigger */}
          <button
            onClick={onOpenAchievements}
            id="open_achievements_btn"
            title="View Achievements & Streaks"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-semibold border border-neutral-200/60 dark:border-neutral-700 transition-all active:scale-95 shrink-0"
          >
            <Icons.Award className="h-4 w-4 text-amber-500" />
            <span>Achievements</span>
          </button>
        </div>
      </div>
    </header>
  );
}
