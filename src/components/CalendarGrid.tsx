import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Task, QuadrantType } from '../types';
import { COLOR_OPTIONS } from '../utils';

interface CalendarGridProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onRescheduleTask: (taskId: string, targetDateString: string | undefined) => void;
  onAddTaskToDay: (dateString: string) => void;
  onEditTask?: (task: Task) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function CalendarGrid({
  tasks,
  onToggleComplete,
  onRescheduleTask,
  onAddTaskToDay,
  onEditTask,
  isCollapsed,
  onToggleCollapse,
}: CalendarGridProps) {
  // Let's generate the 5 days of the current week (Monday-Friday) to exclude Saturday and Sunday
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sun, 1 is Mon...
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + distanceToMonday + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDayTasks = (dateString: string) => {
    return tasks.filter((t) => t.scheduledDate === dateString);
  };

  // Drag and drop calendar columns
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnDay = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onRescheduleTask(taskId, targetDateStr);
    }
  };

  const getQuadrantColorIcon = (quad: QuadrantType) => {
    switch (quad) {
      case 'urgent-important':
        return 'bg-red-500';
      case 'important-not-urgent':
        return 'bg-blue-500';
      case 'urgent-not-important':
        return 'bg-amber-500';
      case 'not-urgent-not-important':
        return 'bg-neutral-500';
      default:
        return 'bg-neutral-200';
    }
  };

  const getColumnWidthPercent = () => {
    // Standard row layout
    return 'w-full md:flex-1 min-w-[135px]';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-850 p-6 shadow-sm border-l-4 border-l-emerald-500 dark:border-l-emerald-400 transition-all duration-200">
        {/* Calendar Grid Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer shrink-0"
              title={isCollapsed ? "Expand Weekly Workload Balancer" : "Collapse Weekly Workload Balancer"}
              id="toggle_calendar_collapse"
            >
              {isCollapsed ? (
                <Icons.ChevronRight className="h-5 w-5" />
              ) : (
                <Icons.ChevronDown className="h-5 w-5" />
              )}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Icons.CalendarRange className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight leading-snug">
                  Weekly Workload Balancer
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Drag items directly onto day columns to schedule them. Balance item counts across the week!
                </p>
              </div>
            </div>
          </div>

        {!isCollapsed && (
          <div className="flex items-center gap-4 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200/50 dark:border-neutral-800">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Do First
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Plan
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Delegate
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-neutral-400" /> Less priority
            </span>
          </div>
        )}
      </div>

      {/* Week days columns row */}
      {!isCollapsed && (
        <div id="calendar_grid_scroll" className="flex flex-col md:flex-row gap-3.5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-200">
        {weekDates.map((date) => {
          const dateStr = formatDateString(date);
          const dayTasks = getDayTasks(dateStr);
          const isToday = formatDateString(new Date()) === dateStr;
          
          const dayName = date.toLocaleDateString([], { weekday: 'short' }); 
          const dayNum = date.getDate();

          return (
            <div
              key={dateStr}
              id={`calendar_day_col_${dateStr}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnDay(e, dateStr)}
              className={`flex flex-col p-3 rounded-xl border transition-all min-h-[160px] ${getColumnWidthPercent()} ${
                isToday
                  ? 'bg-amber-50/20 border-amber-300 dark:bg-amber-950/5 dark:border-amber-800 ring-1 ring-amber-300 dark:ring-amber-800/50'
                  : 'bg-white border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold uppercase tracking-wide ${isToday ? 'text-amber-600 dark:text-amber-400' : 'text-neutral-400'}`}>
                    {dayName}
                  </span>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${
                    isToday
                      ? 'bg-amber-500 text-white font-black'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}>
                    {dayNum}
                  </span>
                </div>


              </div>

              {/* Day Tasks Stack */}
              <div className="flex-1 space-y-2 items-stretch min-h-[100px]">
                <AnimatePresence mode="popLayout">
                  {dayTasks.length > 0 ? (
                    dayTasks.map((task) => {
                      const activeColor = COLOR_OPTIONS.find((c) => c.name.toUpperCase() === task.color.toUpperCase()) || COLOR_OPTIONS[0];
                      return (
                        <motion.div
                          key={task.id}
                          layout
                          layoutId={`task-${task.id}`}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', task.id);
                          }}
                          onClick={() => onEditTask?.(task)}
                          id={`calendar_task_card_${task.id}`}
                          className={`p-2 rounded-lg border text-left cursor-pointer hover:shadow-xs group text-xs flex flex-col justify-between ${
                            activeColor.light
                          } dark:${activeColor.dark} ${
                            task.completed ? 'opacity-50 line-through' : ''
                          }`}
                          initial={{ opacity: 0, scale: 0.95, y: 8 }}
                          animate={{ opacity: task.completed ? 0.5 : 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                          }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {/* Task priority visual dot */}
                          <div className="flex items-center justify-between gap-1 mb-1" onClick={(e) => e.stopPropagation()}>
                            <span className={`h-1.5 w-1.5 rounded-full ${getQuadrantColorIcon(task.quadrant)}`} />
                            
                            {/* Unschedule mini-button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRescheduleTask(task.id, undefined);
                              }}
                              title="Unschedule (Send to matrix inbox)"
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-red-500 rounded-sm"
                            >
                              <Icons.CalendarX className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Text */}
                          <span className="font-semibold truncate text-neutral-800 dark:text-neutral-200 mb-1 leading-tight">
                            {task.title}
                          </span>

                          {/* Small trigger checkbox */}
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => onToggleComplete(task.id)}
                                className={`relative h-3.5 w-3.5 rounded-xs border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                  task.completed 
                                    ? 'border-emerald-500 bg-emerald-500 dark:border-emerald-400 dark:bg-emerald-400' 
                                    : 'border-neutral-300 dark:border-neutral-700 bg-transparent hover:border-neutral-400 dark:hover:border-neutral-500'
                                }`}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-2.5 w-2.5 text-white"
                                >
                                  <motion.path
                                    d="M20 6L9 17L4 12"
                                    initial={false}
                                    animate={{ pathLength: task.completed ? 1 : 0 }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                                  />
                                </svg>

                                {/* Micro-Confetti Burst */}
                                {task.completed && (
                                  <div className="absolute pointer-events-none inset-0 flex items-center justify-center overflow-visible">
                                    {[...Array(4)].map((_, i) => {
                                      const angle = (i * 360) / 4;
                                      const angleRad = (angle * Math.PI) / 180;
                                      const x = Math.cos(angleRad) * 10;
                                      const y = Math.sin(angleRad) * 10;
                                      return (
                                        <motion.span
                                          key={i}
                                          className="absolute h-0.5 w-0.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
                                          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                          animate={{
                                            scale: [0, 1.4, 0],
                                            x: [0, x],
                                            y: [0, y],
                                            opacity: [1, 1, 0],
                                          }}
                                          transition={{ duration: 0.38, ease: "easeOut" }}
                                        />
                                      );
                                    })}
                                  </div>
                                )}
                              </button>
                              <span className="text-[9px] text-neutral-400 font-semibold select-none">
                                {task.completed ? 'Done' : 'Do'}
                              </span>
                            </div>
                            
                            {task.reminder && (
                              <Icons.Bell className="h-2.5 w-2.5 text-amber-500" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <motion.div
                      key={`empty-day-${dateStr}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      exit={{ opacity: 0 }}
                      className="h-full min-h-[80px] flex items-center justify-center border-2 border-dashed border-neutral-100 dark:border-neutral-800/40 rounded-lg"
                    >
                      <span className="text-[10px] text-neutral-400">Empty day</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
        </div>
      )}


      </div>
    </div>
  );
}
