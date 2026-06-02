import React from 'react';
import * as Icons from 'lucide-react';
import { Achievement, UserStats } from '../types';
import { motion } from 'motion/react';

interface AchievementsPanelProps {
  achievements: Achievement[];
  userStats: UserStats;
  onClose: () => void;
}

export default function AchievementsPanel({
  achievements,
  userStats,
  onClose,
}: AchievementsPanelProps) {
  return (
    <div id="achievements_overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        id="achievements_card"
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 p-6 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-950/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-2.5 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Icons.Award className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">Tactical Achievements</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Complete tasks and build daily streaks to unlock premium Keep styles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="close_achievements_btn"
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        {/* Level Stats Summary */}
        <div className="grid grid-cols-3 gap-4 border-b border-neutral-100 p-6 dark:border-neutral-850 dark:bg-neutral-900 bg-neutral-50/50">
          <div className="text-center">
            <span className="block text-2xl font-black text-neutral-800 dark:text-neutral-100">{userStats.level}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Current Level</span>
          </div>
          <div className="text-center border-x border-neutral-100 dark:border-neutral-800">
            <span className="block text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Icons.Flame className="h-5 w-5 fill-amber-500 text-amber-500 inline" />
              {userStats.dailyStreak}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Daily Streak</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-black text-green-500">{userStats.totalCompletedCount}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Total Completed</span>
          </div>
        </div>

        {/* Content */}
        <div id="achievements_list" className="max-h-[380px] overflow-y-auto p-6 space-y-4">
          {achievements.map((achievement) => {
            const IconComponent = (Icons as any)[achievement.icon] || Icons.HelpCircle;
            const isUnlocked = !!achievement.unlockedAt;

            return (
              <div
                key={achievement.id}
                id={`achievement_row_${achievement.id}`}
                className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-neutral-50/70 border-neutral-200 dark:bg-neutral-800/40 dark:border-neutral-700'
                    : 'bg-neutral-50/20 border-neutral-100 dark:bg-neutral-900/10 dark:border-neutral-850 opacity-60'
                }`}
              >
                {/* Icon Container */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                    isUnlocked
                      ? 'bg-amber-100 border-amber-200 text-amber-600 dark:bg-amber-950/50 dark:border-amber-900/40 dark:text-amber-400 shadow-sm'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-400 dark:bg-neutral-950 dark:border-neutral-800/60'
                  }`}
                >
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      {achievement.title}
                      {isUnlocked && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                          <Icons.BadgeCheck className="h-3.5 w-3.5" /> Unlocked
                        </span>
                      )}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                    {achievement.description}
                  </p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 font-medium font-mono">
                    Requirement: {achievement.conditionDescription}
                  </p>
                </div>

                {/* Unlock badge or lock icon */}
                <div className="absolute top-4 right-4 text-xs text-neutral-400">
                  {!isUnlocked ? (
                    <Icons.Lock className="h-4 w-4 text-neutral-300 dark:text-neutral-600" />
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-400 italic">
                      +50 XP reward!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 border-t border-neutral-100 p-4 text-center text-xs text-neutral-500 dark:bg-neutral-950/20 dark:border-neutral-800 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Icons.Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            Unlocking achievements rewards bonus XP to level up themes!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg font-medium text-xs transition-colors"
          >
            Acknowledge
          </button>
        </div>
      </motion.div>
    </div>
  );
}
