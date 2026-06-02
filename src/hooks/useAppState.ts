import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, QuadrantType, Achievement, UserStats } from '../types';
import {
  DEFAULT_ACHIEVEMENTS,
  getTodayDateString,
  updateStreakAndCompletions,
} from '../utils';
import { getLOTRTasks } from '../lotrData';
import { generateFiftyExampleNotes } from '../exampleNotes';

export function useAppState() {
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tm_tasks');
    return saved ? JSON.parse(saved) : getLOTRTasks();
  });

  // User Stats state
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('tm_user_stats');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      xp: 600,
      level: 7,
      dailyStreak: 3,
      lastCompletionDate: getTodayDateString(),
      totalCompletedCount: 60,
    };
  });

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('tm_achievements');
    return saved ? JSON.parse(saved) : DEFAULT_ACHIEVEMENTS;
  });

  // Active Reminder modal alert state
  const [activeReminderTask, setActiveReminderTask] = useState<Task | null>(null);

  // Unfinished edits modal trigger
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Show achievements modal toggle
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);

  // In-app notifications box for streak level changes or achievements
  const [activeToast, setActiveToast] = useState<{ message: string; subMessage?: string } | null>(null);

  // End of day summary toast state
  const [endOfDaySummary, setEndOfDaySummary] = useState<{ clearedCount: number; timestamp: string } | null>(null);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // M3 Composer Open State
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);

  // Daily Focus Selected Task State
  const [dailyFocusId, setDailyFocusId] = useState<string | null>(() => {
    return localStorage.getItem('tm_daily_focus_id') || null;
  });

  // Collapsed sections states (restores state from localStorage for elite polish)
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(() => {
    return localStorage.getItem('tm_collapsed_calendar') === 'true';
  });
  const [isMatrixCollapsed, setIsMatrixCollapsed] = useState(() => {
    return localStorage.getItem('tm_collapsed_matrix') === 'true';
  });
  const [isFocusCollapsed, setIsFocusCollapsed] = useState(() => {
    return localStorage.getItem('tm_collapsed_focus') === 'true';
  });
  const [isVelocityCollapsed, setIsVelocityCollapsed] = useState(() => {
    return localStorage.getItem('tm_collapsed_velocity') === 'true';
  });

  // Matrix sorting state: 'priority' | 'title' | 'date'
  const [matrixSortBy, setMatrixSortBy] = useState<'priority' | 'title' | 'date'>(() => {
    return (localStorage.getItem('tm_matrix_sort_by') as 'priority' | 'title' | 'date') || 'priority';
  });

  // Matrix view mode: 'active' | 'archived'
  const [matrixViewMode, setMatrixViewMode] = useState<'active' | 'archived'>(() => {
    return (localStorage.getItem('tm_matrix_view_mode') as 'active' | 'archived') || 'active';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tm_matrix_sort_by', matrixSortBy);
  }, [matrixSortBy]);

  useEffect(() => {
    localStorage.setItem('tm_matrix_view_mode', matrixViewMode);
  }, [matrixViewMode]);

  useEffect(() => {
    localStorage.setItem('tm_collapsed_calendar', String(isCalendarCollapsed));
  }, [isCalendarCollapsed]);

  useEffect(() => {
    localStorage.setItem('tm_collapsed_matrix', String(isMatrixCollapsed));
  }, [isMatrixCollapsed]);

  useEffect(() => {
    localStorage.setItem('tm_collapsed_focus', String(isFocusCollapsed));
  }, [isFocusCollapsed]);

  useEffect(() => {
    localStorage.setItem('tm_collapsed_velocity', String(isVelocityCollapsed));
  }, [isVelocityCollapsed]);

  useEffect(() => {
    localStorage.setItem('tm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tm_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('tm_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    if (dailyFocusId === null) {
      localStorage.removeItem('tm_daily_focus_id');
    } else {
      localStorage.setItem('tm_daily_focus_id', dailyFocusId);
    }
  }, [dailyFocusId]);

  // Toast Trigger Helper
  const triggerToast = useCallback((message: string, subMessage?: string) => {
    setActiveToast({ message, subMessage });
    setTimeout(() => {
      setActiveToast((current) => {
        if (current?.message === message && current?.subMessage === subMessage) {
          return null;
        }
        return current;
      });
    }, 5000);
  }, []);

  // Reward points handler
  const rewardXP = useCallback((amount: number, reason: string) => {
    setUserStats((prev) => {
      const computedXP = Math.max(0, prev.xp + amount);
      const computedLevel = Math.floor(computedXP / 100) + 1;

      if (computedLevel > prev.level) {
        setTimeout(() => {
          triggerToast(`🎉 Level Up! Level ${computedLevel}`, `You reached a new rank! Keep balancing your matrix.`);
        }, 500);
      }

      return {
        ...prev,
        xp: computedXP,
        level: computedLevel,
      };
    });
  }, [triggerToast]);

  // Audit and mark achievements
  const auditAchievements = useCallback((type: 'streak' | 'completion_count' | 'calendar_scheduled', testValue?: number) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.type === type && !ach.unlockedAt) {
          let checkValue = testValue;
          if (checkValue === undefined) {
            if (type === 'calendar_scheduled') {
              checkValue = tasks.filter(t => !!t.scheduledDate).length;
            } else if (type === 'streak') {
              checkValue = userStats.dailyStreak;
            } else if (type === 'completion_count') {
              checkValue = userStats.totalCompletedCount;
            }
          }

          if ((checkValue || 0) >= ach.targetValue) {
            const unlockedTime = new Date().toISOString();
            
            setTimeout(() => {
              rewardXP(50, `Achievement Unlocked: ${ach.title}`);
              triggerToast(`🌟 Achievement Unlocked!`, `${ach.title}: ${ach.description}`);
            }, 200);

            return { ...ach, unlockedAt: unlockedTime };
          }
        }
        return ach;
      })
    );
  }, [tasks, userStats.dailyStreak, userStats.totalCompletedCount, rewardXP, triggerToast]);

  // Triggers end of day summary toast on first completion after 8 AM
  const checkAndShowSummaryToast = useCallback((completedTaskId: string) => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 8) {
      const todayStr = getTodayDateString();
      const lastShownDate = localStorage.getItem('tm_day_summary_toast_shown');

      if (lastShownDate !== todayStr) {
        localStorage.setItem('tm_day_summary_toast_shown', todayStr);

        const nowMs = Date.now();
        const past24HoursMs = nowMs - 24 * 60 * 60 * 1000;

        // Count existing completed tasks in the last 24 hours
        const completedIn24h = tasks.filter(t => 
          t.id !== completedTaskId && 
          t.completed && 
          t.completedAt && 
          new Date(t.completedAt).getTime() >= past24HoursMs
        ).length;

        const totalCleared = completedIn24h + 1;

        setEndOfDaySummary({
          clearedCount: totalCleared,
          timestamp: now.toISOString()
        });
      }
    }
  }, [tasks]);

  // Complete and claim rewards check
  const handleToggleComplete = useCallback((id: string) => {
    let wasCompleted = false;
    
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          wasCompleted = !t.completed;
          return {
            ...t,
            completed: wasCompleted,
            completedAt: wasCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );

    if (wasCompleted) {
      const todayStr = getTodayDateString();
      const nextStats = updateStreakAndCompletions(userStats, todayStr);

      rewardXP(25, 'Task Completed!');

      setUserStats((prev) => ({
        ...prev,
        dailyStreak: nextStats.dailyStreak,
        lastCompletionDate: nextStats.lastCompletionDate,
        totalCompletedCount: nextStats.totalCompletedCount,
      }));

      triggerToast('Task Completed! +25 XP', `Habit streak: ${nextStats.dailyStreak} days! Keep balancing!`);

      auditAchievements('completion_count', nextStats.totalCompletedCount);
      auditAchievements('streak', nextStats.dailyStreak);
      checkAndShowSummaryToast(id);
    } else {
      rewardXP(-15, 'Task Uncompleted');
    }
  }, [userStats, rewardXP, triggerToast, auditAchievements, checkAndShowSummaryToast]);

  // Add Task Handler
  const handleAddTask = useCallback((newTaskData: {
    title: string;
    description: string;
    quadrant: QuadrantType;
    color: string;
    reminder?: string;
    scheduledDate?: string;
    tags: string[];
  }) => {
    const maxPriority = tasks.reduce((max, t) => (t.priority > max ? t.priority : max), 0);
    
    const createdTask: Task = {
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      title: newTaskData.title,
      description: newTaskData.description,
      quadrant: newTaskData.quadrant,
      completed: false,
      color: newTaskData.color,
      reminder: newTaskData.reminder,
      scheduledDate: newTaskData.scheduledDate,
      priority: maxPriority + 1,
      createdAt: new Date().toISOString(),
      tags: newTaskData.tags,
    };

    setTasks((prev) => [createdTask, ...prev]);
    rewardXP(10, 'Task Created');
    setIsComposerOpen(false);

    if (newTaskData.scheduledDate) {
      auditAchievements('calendar_scheduled');
    }
  }, [tasks, rewardXP, auditAchievements]);

  // Drag over / Drops moving quadrants
  const handleTaskQuadrantChange = useCallback((taskId: string, targetQuadrant: QuadrantType) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, quadrant: targetQuadrant } : t))
    );
    rewardXP(5, 'Quadrant Recalibrated');
  }, [rewardXP]);

  // Drag drops rescheduling
  const handleRescheduleTask = useCallback((taskId: string, targetDateString: string | undefined) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, scheduledDate: targetDateString } : t))
    );

    if (targetDateString) {
      rewardXP(15, `Scheduled onto Calendar (${targetDateString})`);
      auditAchievements('calendar_scheduled');
    } else {
      rewardXP(2, 'Returned to Matrix');
    }
  }, [rewardXP, auditAchievements]);

  // Move quadrants directly
  const handleMoveQuadrantDirect = useCallback((taskId: string, newQuad: QuadrantType) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, quadrant: newQuad } : t))
    );
    rewardXP(5, 'Task priority toggled');
  }, [rewardXP]);

  // Save edit callback
  const handleSaveEditTask = useCallback((id: string, updatedFields: Partial<Task>) => {
    let completionChanged = false;
    let isCompletedNow = false;

    setTasks((prev) => {
      const existing = prev.find((t) => t.id === id);
      if (existing && updatedFields.completed !== undefined && existing.completed !== updatedFields.completed) {
        completionChanged = true;
        isCompletedNow = updatedFields.completed;
      }
      return prev.map((t) => {
        if (t.id === id) {
          const isComp = updatedFields.completed;
          return {
            ...t,
            ...updatedFields,
            completedAt: isComp ? (t.completedAt || new Date().toISOString()) : undefined,
          };
        }
        return t;
      });
    });

    if (completionChanged) {
      if (isCompletedNow) {
        const todayStr = getTodayDateString();
        const nextStats = updateStreakAndCompletions(userStats, todayStr);

        rewardXP(25, 'Task Completed!');

        setUserStats((prev) => ({
          ...prev,
          dailyStreak: nextStats.dailyStreak,
          lastCompletionDate: nextStats.lastCompletionDate,
          totalCompletedCount: nextStats.totalCompletedCount,
        }));

        triggerToast('Task Completed! +25 XP', `Habit streak: ${nextStats.dailyStreak} days! Keep balancing!`);

        auditAchievements('completion_count', nextStats.totalCompletedCount);
        auditAchievements('streak', nextStats.dailyStreak);
        checkAndShowSummaryToast(id);
      } else {
        rewardXP(-15, 'Task Uncompleted');
      }
    } else {
      rewardXP(5, 'Task Updated');
    }
  }, [userStats, rewardXP, triggerToast, auditAchievements, checkAndShowSummaryToast]);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    triggerToast('Task Permadeleted');
  }, [triggerToast]);

  const handleSeedFiftyExamples = useCallback(() => {
    const newExamples = generateFiftyExampleNotes();
    setTasks((prev) => [...newExamples, ...prev]);
    rewardXP(20, 'Seed Complete');
    triggerToast('🚀 Seeded 50 Examples!', '50 epic Middle-earth & productivity tasks have been populated across your matrix & calendar.');
  }, [rewardXP, triggerToast]);

  // Periodic Reminder Alert Check loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (task.reminder && !task.reminderDismissed && !task.completed) {
          const reminderTime = new Date(task.reminder);
          if (now >= reminderTime) {
            setActiveReminderTask(task);
            
            // Mark as dismissed temporarily so it doesn't trigger again continuously
            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...t, reminderDismissed: true } : t))
            );
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [tasks]);

  // Check streaks on system startup
  useEffect(() => {
    const todayStr = getTodayDateString();
    const lastDate = userStats.lastCompletionDate;

    if (lastDate) {
      const todayDate = new Date(todayStr);
      const lastCompletion = new Date(lastDate);
      const diffTime = Math.abs(todayDate.getTime() - lastCompletion.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1 && userStats.dailyStreak > 0) {
        setUserStats((prev) => ({
          ...prev,
          dailyStreak: 0,
        }));
        triggerToast("Streak Reset", "You haven't completed tasks in 48 hours. Let's start fresh!");
      }
    }
  }, []);

  // Filtered tasks for Eisenhower Matrix view
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const cleanQuery = searchQuery.trim().toLowerCase();
    const queryWithoutHash = cleanQuery.startsWith('#') ? cleanQuery.slice(1) : cleanQuery;

    return tasks.filter((task) => {
      const matchTitle = task.title.toLowerCase().includes(cleanQuery);
      const matchTag = task.tags ? task.tags.some((tag) => {
        const normalizedTag = tag.toLowerCase();
        return normalizedTag.includes(cleanQuery) || normalizedTag.includes(queryWithoutHash);
      }) : false;
      return matchTitle || matchTag;
    });
  }, [tasks, searchQuery]);

  return {
    tasks,
    filteredTasks,
    userStats,
    achievements,
    activeReminderTask,
    editingTask,
    showAchievementsModal,
    activeToast,
    endOfDaySummary,
    searchQuery,
    isComposerOpen,
    dailyFocusId,
    isCalendarCollapsed,
    isMatrixCollapsed,
    isFocusCollapsed,
    isVelocityCollapsed,
    matrixSortBy,
    matrixViewMode,
    setTasks,
    setUserStats,
    setAchievements,
    setActiveReminderTask,
    setEditingTask,
    setShowAchievementsModal,
    setActiveToast,
    setEndOfDaySummary,
    setSearchQuery,
    setIsComposerOpen,
    setDailyFocusId,
    setIsCalendarCollapsed,
    setIsMatrixCollapsed,
    setIsFocusCollapsed,
    setIsVelocityCollapsed,
    setMatrixSortBy,
    setMatrixViewMode,
    triggerToast,
    rewardXP,
    handleAddTask,
    handleTaskQuadrantChange,
    handleRescheduleTask,
    handleMoveQuadrantDirect,
    handleToggleComplete,
    handleSaveEditTask,
    handleDeleteTask,
    handleSeedFiftyExamples,
  };
}
