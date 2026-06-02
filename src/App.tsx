import React, { useState, useEffect } from 'react';
import { Task, QuadrantType, Achievement, UserStats } from './types';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import MatrixGrid from './components/MatrixGrid';
import CalendarGrid from './components/CalendarGrid';
import AchievementsPanel from './components/AchievementsPanel';
import TaskEditModal from './components/TaskEditModal';
import DailyFocus from './components/DailyFocus';
import CompletionTrendChart from './components/CompletionTrendChart';
import { Scaffold, FloatingActionButton, M3Typography } from './components/Material3Components';
import {
  DEFAULT_ACHIEVEMENTS,
  LEVEL_UP_XP,
  calculateLevel,
  getTodayDateString,
  COLOR_OPTIONS,
} from './utils';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLOTRTasks } from './lotrData';
import { generateFiftyExampleNotes } from './exampleNotes';

export default function App() {
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
    // Set realistic level/XP stats matching the completed tasks in our initial LOTR questline (60 completed = 600 XP = Lvl 7 with 0 XP inside level)
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

  // Filtered tasks for Eisenhower Matrix view
  const filteredTasks = React.useMemo(() => {
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

  // Handle saving states
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

  // Periodic Reminder Alert Check loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach((task) => {
        if (task.reminder && !task.reminderDismissed && !task.completed) {
          const reminderTime = new Date(task.reminder);
          if (now >= reminderTime) {
            // Trigger critical alert modal popup
            setActiveReminderTask(task);
            
            // Mark as dismissed temporarily so it doesn't trigger again continuously
            setTasks((prev) =>
              prev.map((t) => (t.id === task.id ? { ...t, reminderDismissed: true } : t))
            );
          }
        }
      });
    }, 5000); // Check every 5 seconds for precision

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

      // If more than 1 day skipped since last completion, daily streak resets
      if (diffDays > 1 && userStats.dailyStreak > 0) {
        setUserStats((prev) => ({
          ...prev,
          dailyStreak: 0,
        }));
        triggerToast("Streak Reset", "You haven't completed tasks in 48 hours. Let's start fresh!");
      }
    }
  }, []);

  const triggerToast = (message: string, subMessage?: string) => {
    setActiveToast({ message, subMessage });
    setTimeout(() => {
      setActiveToast(null);
    }, 5000);
  };

  // Triggers end of day summary toast on first completion after 8 AM
  const checkAndShowSummaryToast = (completedTaskId: string) => {
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
  };

  // Add Task Handler
  const handleAddTask = (newTaskData: {
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
    rewardXP(10, 'Task Created'); // Reward minor creation XP
    setIsComposerOpen(false); // Close M3 Dialogue overlay

    // If scheduled immediately, run audit
    if (newTaskData.scheduledDate) {
      auditAchievements('calendar_scheduled');
    }
  };

  // Drag over / Drops moving quadrants
  const handleTaskQuadrantChange = (taskId: string, targetQuadrant: QuadrantType) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, quadrant: targetQuadrant } : t))
    );
    rewardXP(5, 'Quadrant Recalibrated');
  };

  // Drag drops rescheduling
  const handleRescheduleTask = (taskId: string, targetDateString: string | undefined) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, scheduledDate: targetDateString } : t))
    );

    if (targetDateString) {
      rewardXP(15, `Scheduled onto Calendar (${targetDateString})`);
      auditAchievements('calendar_scheduled');
    } else {
      rewardXP(2, 'Returned to Matrix');
    }
  };

  // Move quadrants directly
  const handleMoveQuadrantDirect = (taskId: string, newQuad: QuadrantType) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, quadrant: newQuad } : t))
    );
    rewardXP(5, 'Task priority toggled');
  };

  // Complete and claim rewards check
  const handleToggleComplete = (id: string) => {
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
      // Reward completion
      const todayStr = getTodayDateString();
      const lastDate = userStats.lastCompletionDate;
      let newStreak = userStats.dailyStreak;

      if (!lastDate) {
        newStreak = 1;
      } else if (lastDate === todayStr) {
        // Already completed today, leave streak as-is
      } else {
        const lastCompletion = new Date(lastDate);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastCompletion.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      const totalCompletedNew = userStats.totalCompletedCount + 1;

      // Calculate XP
      rewardXP(25, 'Task Completed!');

      setUserStats((prev) => ({
        ...prev,
        dailyStreak: newStreak,
        lastCompletionDate: todayStr,
        totalCompletedCount: totalCompletedNew,
      }));

      // Trigger standard auditory buzz in app
      triggerToast('Task Completed! +25 XP', `Habit streak: ${newStreak} days! Keep balancing!`);

      // Audit completions & streaks achievements
      auditAchievements('completion_count', totalCompletedNew);
      auditAchievements('streak', newStreak);
      checkAndShowSummaryToast(id);
    } else {
      // Un-completing removes minor XP to prevent abuse
      rewardXP(-15, 'Task Uncompleted');
    }
  };

  // Audit and mark achievements
  const auditAchievements = (type: 'streak' | 'completion_count' | 'calendar_scheduled', testValue?: number) => {
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

    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.type === type && !ach.unlockedAt && (checkValue || 0) >= ach.targetValue) {
          // Unlock!
          const unlockedTime = new Date().toISOString();
          
          // Reward XP bonus on next frame
          setTimeout(() => {
            rewardXP(50, `Achievement Unlocked: ${ach.title}`);
            triggerToast(`🌟 Achievement Unlocked!`, `${ach.title}: ${ach.description}`);
          }, 200);

          return { ...ach, unlockedAt: unlockedTime };
        }
        return ach;
      })
    );
  };

  // Reward points handler
  const rewardXP = (amount: number, reason: string) => {
    setUserStats((prev) => {
      const computedXP = Math.max(0, prev.xp + amount);
      const computedLevel = Math.floor(computedXP / 100) + 1;

      if (computedLevel > prev.level) {
        // Level up announcement!
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
  };

  // Edit action
  const handleSaveEditTask = (id: string, updatedFields: Partial<Task>) => {
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
        // Reward completion
        const todayStr = getTodayDateString();
        const lastDate = userStats.lastCompletionDate;
        let newStreak = userStats.dailyStreak;

        if (!lastDate) {
          newStreak = 1;
        } else if (lastDate === todayStr) {
          // Already completed today, leave streak as-is
        } else {
          const lastCompletion = new Date(lastDate);
          const todayDate = new Date(todayStr);
          const diffTime = Math.abs(todayDate.getTime() - lastCompletion.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }

        const totalCompletedNew = userStats.totalCompletedCount + 1;

        // Calculate XP
        rewardXP(25, 'Task Completed!');

        setUserStats((prev) => ({
          ...prev,
          dailyStreak: newStreak,
          lastCompletionDate: todayStr,
          totalCompletedCount: totalCompletedNew,
        }));

        triggerToast('Task Completed! +25 XP', `Habit streak: ${newStreak} days! Keep balancing!`);

        // Audit completions & streaks achievements
        auditAchievements('completion_count', totalCompletedNew);
        auditAchievements('streak', newStreak);
        checkAndShowSummaryToast(id);
      } else {
        // Un-completing removes minor XP to prevent abuse
        rewardXP(-15, 'Task Uncompleted');
      }
    } else {
      rewardXP(5, 'Task Updated');
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    triggerToast('Task Permadeleted');
  };

  const handleSeedFiftyExamples = () => {
    const newExamples = generateFiftyExampleNotes();
    setTasks((prev) => [...newExamples, ...prev]);
    // Reward some starting XP for seeding database
    rewardXP(20, 'Seed Complete');
    triggerToast('🚀 Seeded 50 Examples!', '50 epic Middle-earth & productivity tasks have been populated across your matrix & calendar.');
  };

  return (
    <Scaffold
      topBar={
        <Header
          userStats={userStats}
          onOpenAchievements={() => setShowAchievementsModal(true)}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onAddFiftyExamples={handleSeedFiftyExamples}
        />
      }
      floatingActionButton={
        <FloatingActionButton
          onClick={() => setIsComposerOpen(true)}
          label="Create Task"
        />
      }
    >
      {/* Main layout frame */}
      <div className="py-6 space-y-8 max-w-7xl mx-auto px-4">
        
        {/* Daily Focus Spotlight */}
        <DailyFocus
          tasks={tasks}
          dailyFocusId={dailyFocusId}
          onSetDailyFocus={setDailyFocusId}
          onToggleComplete={handleToggleComplete}
          isCollapsed={isFocusCollapsed}
          onToggleCollapse={() => setIsFocusCollapsed(!isFocusCollapsed)}
        />

        {/* Eisenhower 2x2 grid */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-850 p-6 shadow-sm border-l-4 border-l-indigo-500 dark:border-l-indigo-400 transition-all duration-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMatrixCollapsed(!isMatrixCollapsed)}
                  className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer shrink-0"
                  title={isMatrixCollapsed ? "Expand The Eisenhower Matrix" : "Collapse The Eisenhower Matrix"}
                  id="toggle_matrix_collapse"
                >
                  {isMatrixCollapsed ? (
                    <Icons.ChevronRight className="h-5 w-5" />
                  ) : (
                    <Icons.ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Icons.Grid className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight leading-none">
                        The Eisenhower Matrix
                      </h2>
                      {searchQuery.trim() && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-medium leading-none">
                          <span>{filteredTasks.length} Match{filteredTasks.length === 1 ? '' : 'es'} for "{searchQuery}"</span>
                          <button
                            onClick={() => setSearchQuery('')}
                            className="hover:text-amber-700 dark:hover:text-amber-200 transition-colors cursor-pointer"
                            title="Clear filter"
                          >
                            <Icons.X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Calibrate daily urgency. Drag cards or tap arrows to balance priority zones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {!isMatrixCollapsed && (
              <MatrixGrid
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onMoveQuadrant={handleMoveQuadrantDirect}
                onTaskDrop={handleTaskQuadrantChange}
                onEditTask={(t) => setEditingTask(t)}
              />
            )}
          </div>
        </div>

        {/* Weekly Calendar Drop Balancer */}
        <CalendarGrid
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onRescheduleTask={handleRescheduleTask}
          onEditTask={(t) => setEditingTask(t)}
          isCollapsed={isCalendarCollapsed}
          onToggleCollapse={() => setIsCalendarCollapsed(!isCalendarCollapsed)}
          onAddTaskToDay={(dateStr) => {
            // Click empty date slot automatically adds task
            const titleInput = window.prompt("Take a quick planned task title for " + dateStr + ":");
            if (titleInput && titleInput.trim()) {
              handleAddTask({
                title: titleInput.trim(),
                description: '',
                quadrant: 'important-not-urgent',
                color: 'DEFAULT',
                scheduledDate: dateStr,
                tags: ['scheduled'],
              });
            }
          }}
        />

        {/* 7-DAY COMPLETION VELOCITY CHART SECTION */}
        <div className="max-w-7xl mx-auto px-4 mt-8 pb-12">
          <CompletionTrendChart
            tasks={tasks}
            isCollapsed={isVelocityCollapsed}
            onToggleCollapse={() => setIsVelocityCollapsed(!isVelocityCollapsed)}
          />
        </div>
      </div>

      {/* IN-APP ALERTS REMINDERS POPUP */}
      <AnimatePresence>
        {activeReminderTask && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              id="active_reminder_card"
              className="max-w-md w-full bg-amber-50 dark:bg-amber-950 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl text-amber-950 dark:text-amber-100"
            >
              <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-4">
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center animate-bounce">
                  <Icons.BellRing className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base tracking-tight text-amber-900 dark:text-amber-300">Tactical Reminder Alarm!</h4>
                  <p className="text-xs">Your scheduled alarm is calling standard action</p>
                </div>
              </div>

              <h3 className="text-lg font-black">{activeReminderTask.title}</h3>
              {activeReminderTask.description && (
                <p className="text-sm opacity-80 mt-2 bg-amber-100/40 dark:bg-amber-900/40 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                  {activeReminderTask.description}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleToggleComplete(activeReminderTask.id);
                    // Reward bonus reminder completion XP
                    rewardXP(15, 'Completed Reminder Habit');
                    setActiveReminderTask(null);
                  }}
                  id="reminder_complete_btn"
                  className="w-full py-2.5 bg-amber-600 dark:bg-amber-500 scroll-none hover:bg-amber-700 dark:hover:bg-amber-400 text-white font-bold rounded-xl text-sm shadow-xs flex items-center justify-center gap-1"
                >
                  <Icons.CheckCircle className="h-4 w-4" />
                  Complete Now (+40 XP!)
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Move 10 min forward
                      const newReminder = new Date(Date.now() + 10 * 60 * 1000).toISOString();
                      setTasks((prev) =>
                        prev.map((t) => (t.id === activeReminderTask.id ? { ...t, reminder: newReminder, reminderDismissed: false } : t))
                      );
                      setActiveReminderTask(null);
                      triggerToast('Snoozed 10 Minutes');
                    }}
                    id="reminder_snooze_btn"
                    className="py-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold rounded-xl text-xs"
                  >
                    Snooze 10m
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveReminderTask(null);
                      rewardXP(5, 'Dismissed Reminder');
                      triggerToast('Reminder Dismissed +5 XP');
                    }}
                    id="reminder_dismiss_btn"
                    className="py-2.5 bg-transparent border border-amber-600/30 dark:border-amber-400/30 hover:bg-amber-500/10 text-amber-750 dark:text-amber-300 font-bold rounded-xl text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOAT HABIT TOASTER banner notifications in corner */}
      <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {activeToast && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              id="active_toast_card"
              className="pointer-events-auto bg-neutral-900 border border-neutral-800 text-white rounded-xl p-4 shadow-2xl flex items-start gap-3.5 dark:bg-neutral-950 dark:border-neutral-900"
            >
              <div className="p-1.5 rounded-lg bg-amber-500 text-slate-900 shrink-0 mt-0.5">
                <Icons.Flame className="h-4 w-4 fill-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-extrabold text-xs text-neutral-100">{activeToast.message}</h5>
                {activeToast.subMessage && (
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-normal">{activeToast.subMessage}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {endOfDaySummary && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              id="end_of_day_summary_toast"
              className="pointer-events-auto bg-white dark:bg-[#1c1e24] border border-[#E7E0EC] dark:border-[#625B71]/40 text-neutral-900 dark:text-neutral-50 rounded-[16px] p-5 shadow-2xl flex flex-col gap-3 border-l-4 border-l-[#6750A4]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-[#6750A4]/10 dark:bg-[#E7E0EC]/10 text-[#6750A4] dark:text-[#E7E0EC] shrink-0">
                    <Icons.Award className="h-5 w-5" />
                  </span>
                  <div>
                    <h5 className="font-sans font-bold text-sm text-neutral-900 dark:text-neutral-50 leading-tight">
                      🌅 Daily Summary Accomplished!
                    </h5>
                    <p className="font-sans text-[10px] text-neutral-400 dark:text-neutral-500 leading-none mt-1">
                      End of the day stats check
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEndOfDaySummary(null)}
                  className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors cursor-pointer p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="Dismiss Summary"
                >
                  <Icons.X className="h-4 w-4" />
                </button>
              </div>
              <div className="border-t border-[#E7E0EC] dark:border-[#625B71]/30 pt-3">
                <p className="font-sans text-xs text-neutral-700 dark:text-neutral-350 leading-relaxed font-semibold">
                  You successfully cleared <span className="font-black text-[#6750A4] dark:text-[#E7E0EC]">{endOfDaySummary.clearedCount} task{endOfDaySummary.clearedCount === 1 ? '' : 's'}</span> in the current 24-hour cycle.
                </p>
                <p className="font-sans text-[11px] text-[#625B71] dark:text-neutral-400 mt-2 font-medium italic">
                  {endOfDaySummary.clearedCount <= 2 
                    ? "A steady start. Keep balancing your matrix!"
                    : endOfDaySummary.clearedCount <= 5
                    ? "Fantastic momentum today! Making excellent headway."
                    : "Outstanding velocity! You completely owned this 24-hour quest."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* EDIT MODAL DIALOG */}
      <AnimatePresence>
        {editingTask && (
          <TaskEditModal
            task={editingTask}
            onSave={handleSaveEditTask}
            onDelete={handleDeleteTask}
            onClose={() => setEditingTask(null)}
          />
        )}
      </AnimatePresence>

      {/* ACHIEVEMENTS DIALOG SHEET */}
      <AnimatePresence>
        {showAchievementsModal && (
          <AchievementsPanel
            achievements={achievements}
            userStats={userStats}
            onClose={() => setShowAchievementsModal(false)}
          />
        )}
      </AnimatePresence>

      {/* M3 FULL TASK CREATOR DIALOG OVERLAY */}
      <AnimatePresence>
        {isComposerOpen && (
          <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="bg-white dark:bg-[#1c1e24] shadow-2xl rounded-[28px] max-w-2xl w-full border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden relative"
            >
              <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className={`${M3Typography.headlineSmall} text-neutral-950 dark:text-neutral-50`}>
                    Create Tactical Task
                  </h3>
                  <p className={`${M3Typography.bodySmall} text-neutral-450 mt-0.5`}>
                    Add objective to your priority matrix or calendar scheduling
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors cursor-pointer"
                  title="Close Dialog"
                >
                  <Icons.X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[80vh] overflow-y-auto pt-4 pb-6">
                <TaskForm onAddTask={handleAddTask} onCancel={() => setIsComposerOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Scaffold>
  );
}
