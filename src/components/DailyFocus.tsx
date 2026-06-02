import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Task } from '../types';
import { COLOR_OPTIONS } from '../utils';

interface DailyFocusProps {
  tasks: Task[];
  dailyFocusId: string | null;
  onSetDailyFocus: (id: string | null) => void;
  onToggleComplete: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DailyFocus({
  tasks,
  dailyFocusId,
  onSetDailyFocus,
  onToggleComplete,
  isCollapsed,
  onToggleCollapse,
}: DailyFocusProps) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  // Filter incomplete Urgent & Important tasks
  const urgentImportantTasks = tasks.filter(
    (t) => t.quadrant === 'urgent-important' && !t.completed
  );

  // Find current daily focus task
  const currentFocusTask = tasks.find((t) => t.id === dailyFocusId);

  // Fallback if current focus task was deleted or moved, we should clear it
  React.useEffect(() => {
    if (dailyFocusId && !tasks.some((t) => t.id === dailyFocusId)) {
      onSetDailyFocus(null);
    }
  }, [tasks, dailyFocusId, onSetDailyFocus]);

  const handleSelect = (taskId: string) => {
    onSetDailyFocus(taskId);
    setIsOpenDropdown(false);
  };

  const activeColor = currentFocusTask
    ? COLOR_OPTIONS.find((c) => c.name.toUpperCase() === currentFocusTask.color.toUpperCase()) || COLOR_OPTIONS[0]
    : COLOR_OPTIONS[0];

  return (
    <div className="max-w-7xl mx-auto px-4" id="daily_focus_section">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-850 p-6 shadow-sm border-l-4 border-l-rose-500 dark:border-l-rose-400 rounded-2xl transition-all duration-200">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer shrink-0"
              title={isCollapsed ? "Expand Today's Singular Focus" : "Collapse Today's Singular Focus"}
              id="toggle_focus_collapse"
            >
              {isCollapsed ? (
                <Icons.ChevronRight className="h-5 w-5" />
              ) : (
                <Icons.ChevronDown className="h-5 w-5" />
              )}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Icons.Target className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight leading-snug">Today's Singular Focus</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Commit to one vital objective from the Urgent & Important sector</p>
              </div>
            </div>
          </div>

          {/* Quick Dropdown Picker if not set, or to change it */}
          {!isCollapsed && (
            <div className="relative shrink-0">
              {urgentImportantTasks.length > 0 && (
                <>
                  <button
                    onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                    id="focus_select_dropdown_toggle"
                    className="w-full sm:w-auto flex items-center justify-between gap-2 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950/40 dark:hover:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-850 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-all"
                  >
                    <Icons.Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>{currentFocusTask ? 'Change Focus Goal' : 'Choose Singular Focus'}</span>
                    <Icons.ChevronDown className={`h-3 w-3 transition-transform ${isOpenDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpenDropdown && (
                      <>
                        {/* Close overlay */}
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpenDropdown(false)} />
                        
                        <motion.ul
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.12 }}
                          id="focus_select_dropdown_menu"
                          className="absolute right-0 mt-1 w-full sm:w-80 max-h-60 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl shadow-xl z-20 py-1.5 divide-y divide-neutral-100 dark:divide-neutral-850"
                        >
                          {urgentImportantTasks.map((t) => (
                            <li key={t.id}>
                              <button
                                onClick={() => handleSelect(t.id)}
                                className="w-full text-left px-3.5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-950/40 text-[11px] font-medium text-neutral-800 dark:text-neutral-300 transition-colors flex items-start gap-2"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                <div className="min-w-0">
                                  <p className="font-semibold truncate">{t.title}</p>
                                  {t.description && (
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate mt-0.5">{t.description}</p>
                                  )}
                                </div>
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Display */}
        {!isCollapsed && (
          <AnimatePresence mode="wait">
          {currentFocusTask ? (
            <motion.div
              key={currentFocusTask.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`p-4.5 rounded-xl border relative overflow-hidden transition-all duration-200 group ${activeColor.light} dark:${activeColor.dark}`}
            >
              {/* Subtle background glow effect */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <Icons.Target className="h-24 w-24 text-neutral-500" />
              </div>

              <div className="flex items-start gap-4 justify-between relative z-10">
                {/* Checkbox + Title / Desc block */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="flex items-center justify-center shrink-0 mt-0.5 relative">
                    <button
                      type="button"
                      onClick={() => onToggleComplete(currentFocusTask.id)}
                      id="daily_focus_chk"
                      className={`relative h-5.5 w-5.5 rounded-lg border-2 flex items-center justify-center transition-all focus:outline-hidden cursor-pointer ${
                        currentFocusTask.completed 
                          ? 'border-emerald-500 bg-emerald-500 dark:border-emerald-400 dark:bg-emerald-400' 
                          : 'border-neutral-300 dark:border-neutral-600 bg-transparent hover:border-neutral-450 dark:hover:border-neutral-500'
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5 text-white"
                      >
                        <motion.path
                          d="M20 6L9 17L4 12"
                          initial={false}
                          animate={{ pathLength: currentFocusTask.completed ? 1 : 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        />
                      </svg>

                      {/* Confetti Micro-Burst */}
                      {currentFocusTask.completed && (
                        <div className="absolute pointer-events-none inset-0 flex items-center justify-center overflow-visible">
                          {[...Array(8)].map((_, i) => {
                            const angle = (i * 360) / 8;
                            const angleRad = (angle * Math.PI) / 180;
                            const x = Math.cos(angleRad) * 20;
                            const y = Math.sin(angleRad) * 20;
                            return (
                              <motion.span
                                key={i}
                                className="absolute h-1 w-1 rounded-full bg-emerald-500 dark:bg-emerald-400"
                                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                animate={{
                                  scale: [0, 1.4, 0],
                                  x: [0, x],
                                  y: [0, y],
                                  opacity: [1, 1, 0],
                                }}
                                transition={{ duration: 0.48, ease: "easeOut" }}
                              />
                            );
                          })}
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-sm font-black tracking-tight leading-tight transition-all uppercase ${
                      currentFocusTask.completed ? 'line-through opacity-55' : 'text-neutral-900 dark:text-neutral-50'
                    }`}>
                      {currentFocusTask.title}
                    </h4>
                    {currentFocusTask.description && (
                      <p className={`text-xs mt-1 leading-relaxed opacity-85 font-medium whitespace-pre-wrap ${
                        currentFocusTask.completed ? 'opacity-40' : ''
                      }`}>
                        {currentFocusTask.description}
                      </p>
                    )}

                    {/* Meta tags and information */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/25 text-red-650 dark:text-red-400 text-[9px] font-extrabold uppercase tracking-wider">
                        <span className="h-1 w-1 rounded-full bg-red-500" />
                        Urgent & Important
                      </span>

                      {currentFocusTask.tags && currentFocusTask.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-neutral-400 dark:text-neutral-500 bg-neutral-100/60 dark:bg-neutral-850/60 px-1.5 py-0.5 rounded-md border border-neutral-200/40 dark:border-neutral-800/40">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Actions (Snooze title or remove Focus focus tag) */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSetDailyFocus(null)}
                    id="clear_daily_focus_goal"
                    title="Clear focus objective"
                    className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-350 hover:bg-neutral-100/40 dark:hover:bg-neutral-800/35 rounded-lg transition-all"
                  >
                    <Icons.XCircle className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              {/* Celebrating Completed Focus state inside card */}
              {currentFocusTask.completed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="focus_success_banner"
                  className="absolute inset-0 bg-emerald-500/90 dark:bg-emerald-950/95 flex flex-col items-center justify-center text-center p-4 text-white z-20 backdrop-blur-xs"
                >
                  <Icons.PartyPopper className="h-6 w-6 mb-1 text-yellow-350 dark:text-yellow-400 animate-bounce" />
                  <p className="font-bold text-xs uppercase tracking-wider">Focus Target Destroyed!</p>
                  <p className="text-[10px] opacity-80 mt-0.5 max-w-xs">You successfully balanced today's critical fire. +25 XP Claimed.</p>
                  <button
                    onClick={() => onSetDailyFocus(null)}
                    id="focus_complete_reset_btn"
                    className="mt-2 px-3 py-1 bg-white hover:bg-neutral-100 text-emerald-800 font-extrabold text-[10px] uppercase rounded-lg shadow-sm transition-all active:scale-95"
                  >
                    Set Next Focus Goal
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty-focus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-2 border-dashed border-neutral-150 dark:border-neutral-850 rounded-xl p-6 text-center flex flex-col items-center justify-center"
            >
              {urgentImportantTasks.length > 0 ? (
                <>
                  <Icons.Target className="h-7 w-7 text-neutral-300 dark:text-neutral-700 mb-1.5" />
                  <p className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Zero focus locked.</p>
                  <p className="text-[10px] text-neutral-400 mb-2.5 max-w-sm leading-relaxed">
                    Choose one of your {urgentImportantTasks.length} Urgent & Important tasks to elevate below:
                  </p>
                  
                  {/* Quick-list of up to 3 urgent tasks */}
                  <div className="flex flex-col gap-1.5 w-full max-w-md" id="quick_focus_picks">
                    {urgentImportantTasks.slice(0, 3).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelect(t.id)}
                        className="w-full text-left px-3 py-2 bg-neutral-50/60 hover:bg-neutral-100 dark:bg-neutral-950/20 dark:hover:bg-neutral-950/60 border border-neutral-200/50 dark:border-neutral-850 rounded-lg text-[11px] transition-all flex items-center justify-between group/pick"
                      >
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300 truncate mr-2 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                          {t.title}
                        </span>
                        <span className="text-[9px] font-extrabold text-amber-500 flex items-center gap-0.5 opacity-0 group-hover/pick:opacity-100 transition-opacity shrink-0">
                          Focus <Icons.ArrowRight className="h-3 w-3" />
                        </span>
                      </button>
                    ))}
                    {urgentImportantTasks.length > 3 && (
                      <button
                        onClick={() => setIsOpenDropdown(true)}
                        className="text-[10px] text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 font-extrabold transition-colors mt-1"
                      >
                        Show all {urgentImportantTasks.length} tasks
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Icons.CheckCircle className="h-6 w-6 text-emerald-400 mb-1" />
                  <p className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">The battleground is quiet</p>
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-500 leading-normal max-w-xs">
                    You have no active Urgent & Important tasks remaining. Create high-priority items so you can dedicate special focus to them.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>
    </div>
  );
}
