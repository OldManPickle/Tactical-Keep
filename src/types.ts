export type QuadrantType =
  | 'urgent-important'
  | 'important-not-urgent'
  | 'urgent-not-important'
  | 'not-urgent-not-important';

export interface Task {
  id: string;
  title: string;
  description: string;
  quadrant: QuadrantType;
  completed: boolean;
  color: string; // Tailwind bg class or hex code
  reminder?: string; // ISO date-time string
  reminderDismissed?: boolean;
  scheduledDate?: string; // YYYY-MM-DD
  priority: number; // For sorting
  createdAt: string;
  completedAt?: string; // ISO datetime string when completed
  tags?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  unlockedAt?: string;
  conditionDescription: string;
  type: 'streak' | 'completion_count' | 'matrix_clean' | 'calendar_scheduled';
  targetValue: number;
}

export interface UserStats {
  xp: number;
  level: number;
  dailyStreak: number;
  lastCompletionDate?: string; // YYYY-MM-DD
  totalCompletedCount: number;
}
