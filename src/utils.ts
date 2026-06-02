import { Task, Achievement, UserStats } from './types';

export const LEVEL_UP_XP = 100;

export const COLOR_OPTIONS = [
  { name: 'Default', light: 'bg-white border-neutral-200/80 text-neutral-800 dark:bg-neutral-850 dark:border-neutral-750 dark:text-neutral-100', dark: 'bg-neutral-800 border-neutral-700 text-neutral-100' },
  { name: 'Red', light: 'bg-red-500/5 hover:bg-red-500/10 border-red-500/30 text-red-950 dark:text-red-100', dark: 'bg-red-950/35 border-red-500/30 text-red-200' },
  { name: 'Green', light: 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100', dark: 'bg-emerald-950/35 border-emerald-500/30 text-emerald-200' },
  { name: 'Blue', light: 'bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/30 text-blue-950 dark:text-blue-100', dark: 'bg-blue-950/35 border-blue-500/30 text-blue-200' },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Venture',
    description: 'Began your tactical organization by completing your first task.',
    icon: 'CheckCircle',
    conditionDescription: 'Complete 1 task',
    type: 'completion_count',
    targetValue: 1,
  },
  {
    id: 'commander',
    title: 'Eisenhower Commander',
    description: 'Showed real balance by scheduling 3 tasks onto the weekly calendar.',
    icon: 'Calendar',
    conditionDescription: 'Schedule 3 tasks in the Calendar',
    type: 'calendar_scheduled',
    targetValue: 3,
  },
  {
    id: 'streak-bronze',
    title: 'Consistent Tactician',
    description: 'Completed tasks 2 days in a row.',
    icon: 'Flame',
    conditionDescription: 'Achieve a 2-day streak',
    type: 'streak',
    targetValue: 2,
  },
  {
    id: 'matrix-master',
    title: 'Priority Master',
    description: 'Complete 8 tasks of any priority to command the matrix.',
    icon: 'Award',
    conditionDescription: 'Complete 8 tasks total',
    type: 'completion_count',
    targetValue: 8,
  },
  {
    id: 'streak-silver',
    title: 'Habit Warrior',
    description: 'Kept the fire burning for a 4-day task completion streak.',
    icon: 'Zap',
    conditionDescription: 'Achieve a 4-day streak',
    type: 'streak',
    targetValue: 4,
  },
];

export function calculateLevel(xp: number): number {
  return Math.floor(xp / LEVEL_UP_XP) + 1;
}

export function truncateText(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
}

export function getTodayDateString(): string {
  // Return YYYY-MM-DD in local time
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
