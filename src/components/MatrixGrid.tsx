import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Task, QuadrantType } from '../types';
import { COLOR_OPTIONS } from '../utils';
import { M3Typography, M3ElevatedCard } from './Material3Components';

interface MatrixGridProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onMoveQuadrant: (id: string, newQuad: QuadrantType) => void;
  onTaskDrop: (taskId: string, quadrant: QuadrantType) => void;
  onEditTask: (task: Task) => void;
  sortBy?: 'priority' | 'title' | 'date';
  viewMode?: 'active' | 'archived';
}

export default function MatrixGrid({
  tasks,
  onToggleComplete,
  onDeleteTask,
  onMoveQuadrant,
  onTaskDrop,
  onEditTask,
  sortBy = 'priority',
  viewMode = 'active',
}: MatrixGridProps) {
  // Group tasks by quadrant
  const getQuadrantTasks = (quad: QuadrantType) => {
    const isArchivedMode = viewMode === 'archived';
    const quadrantTasks = tasks.filter((t) => t.quadrant === quad && (isArchivedMode ? t.completed : !t.completed));
    if (sortBy === 'title') {
      return quadrantTasks.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'date') {
      return quadrantTasks.sort((a, b) => {
        if (a.scheduledDate && b.scheduledDate) {
          return a.scheduledDate.localeCompare(b.scheduledDate);
        }
        if (a.scheduledDate) return -1;
        if (b.scheduledDate) return 1;
        return b.priority - a.priority;
      });
    }
    // Default to priority
    return quadrantTasks.sort((a, b) => b.priority - a.priority);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetQuadrant: QuadrantType) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onTaskDrop(taskId, targetQuadrant);
    }
  };

  // Render individual card helper
  const renderCard = (task: Task) => {
    const activeColor = COLOR_OPTIONS.find((c) => c.name.toUpperCase() === task.color.toUpperCase()) || COLOR_OPTIONS[0];

    let quadrantBorderClass = 'border-l-4 ';
    if (task.quadrant === 'urgent-important') {
      quadrantBorderClass += 'border-l-red-500 dark:border-l-red-400';
    } else if (task.quadrant === 'important-not-urgent') {
      quadrantBorderClass += 'border-l-emerald-500 dark:border-l-emerald-400';
    } else if (task.quadrant === 'urgent-not-important') {
      quadrantBorderClass += 'border-l-blue-500 dark:border-l-blue-400';
    } else if (task.quadrant === 'not-urgent-not-important') {
      quadrantBorderClass += 'border-l-amber-500 dark:border-l-amber-400';
    }

    return (
      <motion.div
        key={task.id}
        layout
        layoutId={`task-${task.id}`}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onClick={() => onEditTask(task)}
        id={`task_card_${task.id}`}
        className={`group relative flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-[#13151b] border border-neutral-200/40 dark:border-neutral-800/50 shadow-xs hover:shadow-md transition-all cursor-pointer ${quadrantBorderClass} ${
          activeColor.light
        } dark:${activeColor.dark} ${
          task.completed && viewMode !== 'archived' ? 'opacity-55 scale-[0.98]' : 'scale-100'
        }`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: task.completed && viewMode !== 'archived' ? 0.55 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 32,
        }}
        whileHover={{ y: -2, transition: { duration: 0.1 } }}
      >
        {/* Card Header & Checkbox */}
        <div>
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-3 max-w-[85%]">
              <div onClick={(e) => e.stopPropagation()} className="inline-flex shrink-0 mt-0.5">
                <button
                  type="button"
                  onClick={() => onToggleComplete(task.id)}
                  id={`task_checkbox_${task.id}`}
                  className={`relative h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all focus:outline-hidden cursor-pointer ${
                    task.completed 
                      ? 'border-emerald-500 bg-emerald-500 dark:border-emerald-400 dark:bg-emerald-400' 
                      : 'border-neutral-300 dark:border-neutral-700 bg-transparent hover:border-neutral-400 dark:hover:border-neutral-500'
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
                      animate={{ pathLength: task.completed ? 1 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                  </svg>

                  {/* Confetti Micro-Burst */}
                  {task.completed && (
                    <div className="absolute pointer-events-none inset-0 flex items-center justify-center overflow-visible">
                      {[...Array(6)].map((_, i) => {
                        const angle = (i * 360) / 6;
                        const angleRad = (angle * Math.PI) / 180;
                        const x = Math.cos(angleRad) * 16;
                        const y = Math.sin(angleRad) * 16;
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
                            transition={{ duration: 0.45, ease: "easeOut" }}
                          />
                        );
                      })}
                    </div>
                  )}
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`${M3Typography.titleMedium} block leading-snug break-words ${
                  task.completed ? 'text-neutral-400 dark:text-neutral-500 line-through' : 'text-neutral-900 dark:text-neutral-50'
                }`}>
                  {task.title}
                </span>
                {task.description && (
                  <p className={`${M3Typography.bodyMedium} text-neutral-500 dark:text-neutral-400 mt-1 pb-1 line-clamp-3 leading-normal break-words whitespace-pre-line`}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Editing Button / Options */}
            <button
              id={`edit_task_btn_${task.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onEditTask(task);
              }}
              className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-opacity"
            >
              <Icons.Edit3 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {task.tags.map((tg, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 text-[10px] bg-neutral-900/5 dark:bg-white/10 rounded-sm text-neutral-600 dark:text-neutral-300 font-medium font-mono"
                >
                  #{tg}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer controls */}
        <div className="mt-3.5 pt-2 border-t border-neutral-200/30 dark:border-neutral-700/30 flex items-center justify-between gap-2 text-xs">
          {/* Calendar Scheduled Badge / Reminder indicator */}
          <div className="flex flex-col gap-0.5 min-w-0">
            {task.reminder && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                <Icons.Bell className="h-2.5 w-2.5" />
                <span className="truncate max-w-[90px]">
                  {new Date(task.reminder).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            )}
            {task.scheduledDate && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                <Icons.Calendar className="h-2.5 w-2.5" />
                <span className="truncate max-w-[90px]">
                  {new Date(task.scheduledDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </span>
            )}
          </div>

          {/* Quick move trigger controls for Touch/Mobile (Alternative to drag & drop) */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <span className="text-[9px] text-neutral-400 font-medium mr-0.5 select-none hidden sm:inline sm:group-hover:inline">Move:</span>
            {task.quadrant !== 'urgent-important' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveQuadrant(task.id, 'urgent-important');
                }}
                title="Move to Do First"
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 text-red-500 rounded-sm"
              >
                <Icons.Flame className="h-3 w-3" />
              </button>
            )}
            {task.quadrant !== 'important-not-urgent' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveQuadrant(task.id, 'important-not-urgent');
                }}
                title="Move to Schedule It"
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 text-blue-500 rounded-sm"
              >
                <Icons.Clock className="h-3 w-3" />
              </button>
            )}
            {task.quadrant !== 'urgent-not-important' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveQuadrant(task.id, 'urgent-not-important');
                }}
                title="Move to Delegate It"
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 text-amber-500 rounded-sm"
              >
                <Icons.Users className="h-3 w-3" />
              </button>
            )}
            {task.quadrant !== 'not-urgent-not-important' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveQuadrant(task.id, 'not-urgent-not-important');
                }}
                title="Move to Eliminate It"
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-500 rounded-sm"
              >
                <Icons.Trash2 className="h-3 w-3" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
              id={`delete_task_btn_${task.id}`}
              title="Delete Task"
              className="p-1 text-neutral-400 hover:text-red-500 rounded-sm opacity-60 hover:opacity-100 transition-opacity ml-1"
            >
              <Icons.Trash className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const UIList = getQuadrantTasks('urgent-important');
  const INUList = getQuadrantTasks('important-not-urgent');
  const UNIList = getQuadrantTasks('urgent-not-important');
  const NUNIList = getQuadrantTasks('not-urgent-not-important');

  // Density visualization calculations
  const maxCount = Math.max(UIList.length, INUList.length, UNIList.length, NUNIList.length);
  const totalTasks = UIList.length + INUList.length + UNIList.length + NUNIList.length;

  const isUIHighest = maxCount > 0 && UIList.length === maxCount;
  const isINUHighest = maxCount > 0 && INUList.length === maxCount;
  const isUNIHighest = maxCount > 0 && UNIList.length === maxCount;
  const isNUNIHighest = maxCount > 0 && NUNIList.length === maxCount;

  // Render a subtle premium density status indicator
  const renderDensityBadge = (count: number, isHighest: boolean, themeColor: string) => {
    if (count === 0 || totalTasks === 0) return null;
    const percentage = Math.round((count / totalTasks) * 100);

    if (isHighest) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider animate-pulse border border-amber-500/20">
          <Icons.Activity className="h-2.5 w-2.5" />
          <span>Peak Load ({percentage}%)</span>
        </span>
      );
    }

    return (
      <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono font-semibold">
        Density: {percentage}%
      </span>
    );
  };

  const uiStyle = isUIHighest
    ? "border-2 border-red-500 dark:border-red-600/70 bg-red-500/[0.04] dark:bg-red-500/[0.03] ring-4 ring-red-500/5 dark:ring-red-950/10 shadow-xs"
    : maxCount > 0
      ? "border border-red-200/40 dark:border-red-950/20 bg-red-50/[0.01] dark:bg-red-950/[0.01] opacity-60"
      : "border border-red-200 dark:border-red-950/40 bg-red-50/5 dark:bg-red-950/5";

  const inuStyle = isINUHighest
    ? "border-2 border-emerald-500 dark:border-emerald-600/70 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.03] ring-4 ring-emerald-500/5 dark:ring-emerald-950/10 shadow-xs"
    : maxCount > 0
      ? "border border-emerald-200/40 dark:border-emerald-950/20 bg-emerald-50/[0.01] dark:bg-emerald-950/[0.01] opacity-60"
      : "border border-emerald-250 dark:border-emerald-950/40 bg-emerald-50/5 dark:bg-emerald-950/5";

  const uniStyle = isUNIHighest
    ? "border-2 border-blue-500 dark:border-blue-600/70 bg-blue-500/[0.04] dark:bg-blue-500/[0.03] ring-4 ring-blue-500/5 dark:ring-blue-950/10 shadow-xs"
    : maxCount > 0
      ? "border border-blue-200/40 dark:border-blue-950/20 bg-blue-50/[0.01] dark:bg-blue-950/[0.01] opacity-60"
      : "border border-blue-250 dark:border-blue-950/40 bg-blue-50/5 dark:bg-blue-950/5";

  const nuniStyle = isNUNIHighest
    ? "border-2 border-amber-500 dark:border-amber-600/70 bg-amber-500/[0.04] dark:bg-amber-500/[0.03] ring-4 ring-amber-500/5 dark:ring-amber-950/10 shadow-xs"
    : maxCount > 0
      ? "border border-amber-200/40 dark:border-amber-950/20 bg-amber-50/[0.01] dark:bg-amber-950/[0.01] opacity-60"
      : "border border-amber-250 dark:border-amber-950/40 bg-amber-50/5 dark:bg-amber-950/5";

  const activeDoFirst = viewMode === 'archived' ? UIList.length : UIList.filter(t => !t.completed).length;
  const activeSchedule = viewMode === 'archived' ? INUList.length : INUList.filter(t => !t.completed).length;
  const activeDelegate = viewMode === 'archived' ? UNIList.length : UNIList.filter(t => !t.completed).length;
  const activeEliminate = viewMode === 'archived' ? NUNIList.length : NUNIList.filter(t => !t.completed).length;
  const totalActive = activeDoFirst + activeSchedule + activeDelegate + activeEliminate;

  // Generate dynamic recommendation insights based on maximum loading zone
  let recommendation = viewMode === 'archived'
    ? "Clean slate achieved! Your historic archive records all your finished tasks."
    : "All clear! No active tasks across any quadrants. Great job!";
  let borderHighlightClass = "border-l-4 border-l-neutral-300 dark:border-l-neutral-700";
  
  if (totalActive > 0) {
    if (viewMode === 'archived') {
      recommendation = "Impressive record of accomplishment. You can restore any task back to the active board by checking its status again.";
      borderHighlightClass = "border-l-4 border-l-emerald-500 dark:border-l-emerald-400";
    } else {
      const maxActive = Math.max(activeDoFirst, activeSchedule, activeDelegate, activeEliminate);
      if (activeDoFirst === maxActive) {
        recommendation = "Critical Focus: Urgent fires dominate your load. Deal with Do First objectives immediately.";
        borderHighlightClass = "border-l-4 border-l-red-500 dark:border-l-red-400";
      } else if (activeSchedule === maxActive) {
        recommendation = "Steady Planning: Most of your focus is scheduled. Invest in calm, proactive deep-work sessions today.";
        borderHighlightClass = "border-l-4 border-l-emerald-500 dark:border-l-emerald-400";
      } else if (activeDelegate === maxActive) {
        recommendation = "Optimizing: High volume of busywork. Try to delegate, automate, or decline to protect your calendar.";
        borderHighlightClass = "border-l-4 border-l-blue-500 dark:border-l-blue-400";
      } else {
        recommendation = "Declutter: Non-value tasks are piling up. Purge or eliminate these distractions from your list.";
        borderHighlightClass = "border-l-4 border-l-amber-500 dark:border-l-amber-400";
      }
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* M3 Elevated Workload Distribution Summary Card */}
      <M3ElevatedCard className={`p-5 bg-white dark:bg-[#13151b] overflow-hidden ${borderHighlightClass}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0EC] dark:border-[#625B71]/30 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#6750A4]/10 dark:bg-[#E7E0EC]/10 text-[#6750A4] dark:text-[#E7E0EC] shrink-0">
              {viewMode === 'archived' ? (
                <Icons.Archive className="h-5 w-5 text-emerald-500" />
              ) : (
                <Icons.BarChart3 className="h-5 w-5" />
              )}
            </span>
            <div>
              <h3 className={`${M3Typography.titleMedium} text-neutral-900 dark:text-neutral-50`}>
                {viewMode === 'archived' ? "Completed Task History & Statistics" : "Workload Distribution Summary"}
              </h3>
              <p className={`${M3Typography.bodySmall} text-neutral-500 dark:text-neutral-400 mt-0.5`}>
                {viewMode === 'archived' 
                  ? "Historic distribution pattern of all completed tasks in your priority archive"
                  : "Immediate visual breakdown of active task counts in each prioritization quadrant"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl shrink-0">
            <span className={`${M3Typography.labelLarge} text-neutral-700 dark:text-neutral-300`}>
              {viewMode === 'archived' ? "Total Completed:" : "Total Active:"}
            </span>
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full select-none text-white ${
              viewMode === 'archived' ? 'bg-emerald-600 dark:bg-emerald-700' : 'bg-[#6750A4] dark:bg-[#625B71]'
            }`}>
              {totalActive} task{totalActive === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* 4 Quadrants Summary Horizontal Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Do First */}
          <div className="p-3.5 bg-red-500/[0.03] dark:bg-red-500/[0.02] border border-red-500/10 dark:border-red-500/[0.15] rounded-[12px] flex flex-col justify-between min-h-[90px] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <Icons.Flame className="h-3.5 w-3.5" />
                Do First
              </span>
              <span className="text-xl font-black text-red-700 dark:text-red-400">
                {activeDoFirst}
              </span>
            </div>
            <div className="mt-2.5">
              <div className="w-full bg-neutral-200/40 dark:bg-neutral-800/40 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalActive > 0 ? (activeDoFirst / totalActive) * 105 : 0}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-450 dark:text-neutral-500 mt-1.5 font-mono">
                {totalActive > 0 ? Math.round((activeDoFirst / totalActive) * 100) : 0}% of active workload
              </p>
            </div>
          </div>

          {/* Schedule It */}
          <div className="p-3.5 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.02] border border-emerald-500/10 dark:border-emerald-500/[0.15] rounded-[12px] flex flex-col justify-between min-h-[90px] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Icons.Clock className="h-3.5 w-3.5" />
                Schedule It
              </span>
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {activeSchedule}
              </span>
            </div>
            <div className="mt-2.5">
              <div className="w-full bg-neutral-200/40 dark:bg-neutral-800/40 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalActive > 0 ? (activeSchedule / totalActive) * 105 : 0}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-450 dark:text-neutral-500 mt-1.5 font-mono">
                {totalActive > 0 ? Math.round((activeSchedule / totalActive) * 100) : 0}% of active workload
              </p>
            </div>
          </div>

          {/* Delegate It */}
          <div className="p-3.5 bg-blue-500/[0.03] dark:bg-blue-500/[0.02] border border-blue-500/10 dark:border-blue-500/[0.15] rounded-[12px] flex flex-col justify-between min-h-[90px] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Icons.Users className="h-3.5 w-3.5" />
                Delegate It
              </span>
              <span className="text-xl font-black text-blue-700 dark:text-blue-400">
                {activeDelegate}
              </span>
            </div>
            <div className="mt-2.5">
              <div className="w-full bg-neutral-200/40 dark:bg-neutral-800/40 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalActive > 0 ? (activeDelegate / totalActive) * 105 : 0}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-450 dark:text-neutral-500 mt-1.5 font-mono">
                {totalActive > 0 ? Math.round((activeDelegate / totalActive) * 100) : 0}% of active workload
              </p>
            </div>
          </div>

          {/* Eliminate It */}
          <div className="p-3.5 bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border border-amber-500/10 dark:border-amber-500/[0.15] rounded-[12px] flex flex-col justify-between min-h-[90px] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-[#E2A23B] flex items-center gap-1.5">
                <Icons.Trash2 className="h-3.5 w-3.5" />
                Eliminate It
              </span>
              <span className="text-xl font-black text-amber-700 dark:text-[#E2A23B]">
                {activeEliminate}
              </span>
            </div>
            <div className="mt-2.5">
              <div className="w-full bg-neutral-200/40 dark:bg-neutral-800/40 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-550 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalActive > 0 ? (activeEliminate / totalActive) * 105 : 0}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-450 dark:text-neutral-500 mt-1.5 font-mono">
                {totalActive > 0 ? Math.round((activeEliminate / totalActive) * 100) : 0}% of active workload
              </p>
            </div>
          </div>
        </div>

        {/* M3 Active Recommendation Banner footer */}
        <div className="mt-4 pt-3.5 border-t border-[#E7E0EC] dark:border-[#625B71]/30 flex items-center gap-2.5">
          <span className="p-1 rounded-md bg-[#6750A4]/10 dark:bg-[#E7E0EC]/10 text-[#6750A4] dark:text-[#E7E0EC]">
            <Icons.Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className={`${M3Typography.bodyMedium} text-neutral-700 dark:text-neutral-300 font-medium`}>
            {recommendation}
          </span>
        </div>
      </M3ElevatedCard>

      {/* Eisenhower Matrix Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. DO FIRST (Urgent & Important) */}
      <div
        id="quadrant_urgent_important"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'urgent-important')}
        className={`flex flex-col min-h-[300px] rounded-2xl overflow-hidden transition-all duration-300 ${uiStyle}`}
      >
        <div className={`border-b border-red-100 dark:border-red-950/20 px-4 py-3 flex items-center justify-between transition-colors ${
          isUIHighest ? 'bg-red-500/[0.12] dark:bg-red-950/40 border-b-2' : 'bg-red-50 dark:bg-red-950/20'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${
              isUIHighest ? 'bg-red-600 text-white shadow-xs' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
            }`}>
              <Icons.Flame className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Do First</h3>
                {renderDensityBadge(UIList.length, isUIHighest, 'red')}
              </div>
              <p className="text-[10px] text-red-600/70 dark:text-red-400/60 font-medium leading-none mt-0.5">Urgent & Important</p>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isUIHighest ? 'text-white bg-red-600' : 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/60'
          }`}>
            {UIList.length} Tasks
          </span>
        </div>
        <div className="p-4 flex-1 space-y-3.5 overflow-y-auto max-h-[400px]">
          <AnimatePresence mode="popLayout">
            {UIList.length > 0 ? (
              UIList.map(renderCard)
            ) : (
              <motion.div
                key="empty-ui"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <Icons.CheckSquare className="h-10 w-10 text-red-300 dark:text-red-800 mb-2" />
                <p className="text-xs font-medium text-neutral-500">
                  {viewMode === 'archived' ? "No archived urgent tasks. Keep making progress!" : "No urgent fires. Balanced and serene."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. SCHEDULE IT (Important, Not Urgent) */}
      <div
        id="quadrant_important_not_urgent"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'important-not-urgent')}
        className={`flex flex-col min-h-[300px] rounded-2xl overflow-hidden transition-all duration-300 ${inuStyle}`}
      >
        <div className={`border-b border-emerald-100 dark:border-emerald-950/20 px-4 py-3 flex items-center justify-between transition-colors ${
          isINUHighest ? 'bg-emerald-500/[0.12] dark:bg-emerald-950/40 border-b-2' : 'bg-emerald-50 dark:bg-emerald-950/20'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${
              isINUHighest ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-100 text-emerald-705 dark:bg-emerald-950 dark:text-emerald-400'
            }`}>
              <Icons.Clock className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Schedule It</h3>
                {renderDensityBadge(INUList.length, isINUHighest, 'emerald')}
              </div>
              <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60 font-medium leading-none mt-0.5">Important but Not Urgent</p>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isINUHighest ? 'text-white bg-emerald-600' : 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60'
          }`}>
            {INUList.length} Tasks
          </span>
        </div>
        <div className="p-4 flex-1 space-y-3.5 overflow-y-auto max-h-[400px]">
          <AnimatePresence mode="popLayout">
            {INUList.length > 0 ? (
              INUList.map(renderCard)
            ) : (
              <motion.div
                key="empty-inu"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <Icons.CalendarRange className="h-10 w-10 text-emerald-300 dark:text-emerald-800 mb-2" />
                <p className="text-xs font-medium text-neutral-500">
                  {viewMode === 'archived' ? "No archived planned objectives." : "All planned work scheduled. Way ahead!"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. DELEGATE IT (Urgent, Not Important) */}
      <div
        id="quadrant_urgent_not_important"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'urgent-not-important')}
        className={`flex flex-col min-h-[300px] rounded-2xl overflow-hidden transition-all duration-300 ${uniStyle}`}
      >
        <div className={`border-b border-blue-100 dark:border-blue-950/20 px-4 py-3 flex items-center justify-between transition-colors ${
          isUNIHighest ? 'bg-blue-500/[0.12] dark:bg-blue-950/40 border-b-2' : 'bg-blue-50 dark:bg-blue-950/20'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${
              isUNIHighest ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-105 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
            }`}>
              <Icons.Users className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300">Delegate It</h3>
                {renderDensityBadge(UNIList.length, isUNIHighest, 'blue')}
              </div>
              <p className="text-[10px] text-blue-600/70 dark:text-blue-400/60 font-medium leading-none mt-0.5">Urgent but Not Important</p>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isUNIHighest ? 'text-white bg-blue-600' : 'text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60'
          }`}>
            {UNIList.length} Tasks
          </span>
        </div>
        <div className="p-4 flex-1 space-y-3.5 overflow-y-auto max-h-[400px]">
          <AnimatePresence mode="popLayout">
            {UNIList.length > 0 ? (
              UNIList.map(renderCard)
            ) : (
              <motion.div
                key="empty-uni"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <Icons.Shuffle className="h-10 w-10 text-blue-300 dark:text-blue-800 mb-2" />
                <p className="text-xs font-medium text-neutral-500">
                  {viewMode === 'archived' ? "No archived delegated tasks." : "Unburdened. Everything delegated smoothly."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. ELIMINATE IT (Neither) */}
      <div
        id="quadrant_not_urgent_not_important"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'not-urgent-not-important')}
        className={`flex flex-col min-h-[300px] rounded-2xl overflow-hidden transition-all duration-300 ${nuniStyle}`}
      >
        <div className={`border-b border-amber-100 dark:border-amber-950/20 px-4 py-3 flex items-center justify-between transition-colors ${
          isNUNIHighest ? 'bg-amber-500/[0.12] dark:bg-amber-950/40 border-b-2' : 'bg-amber-50 dark:bg-amber-950/20'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${
              isNUNIHighest ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-100 text-amber-705 dark:bg-amber-950 dark:text-amber-305'
            }`}>
              <Icons.Trash2 className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">Eliminate It</h3>
                {renderDensityBadge(NUNIList.length, isNUNIHighest, 'amber')}
              </div>
              <p className="text-[10px] text-amber-600/70 dark:text-amber-400/60 font-medium leading-none mt-0.5">Not Urgent & Not Important</p>
            </div>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isNUNIHighest ? 'text-white bg-amber-650' : 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60'
          }`}>
            {NUNIList.length} Tasks
          </span>
        </div>
        <div className="p-4 flex-1 space-y-3.5 overflow-y-auto max-h-[400px]">
          <AnimatePresence mode="popLayout">
            {NUNIList.length > 0 ? (
              NUNIList.map(renderCard)
            ) : (
              <motion.div
                key="empty-nuni"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <Icons.Sparkles className="h-10 w-10 text-amber-300 dark:text-amber-700 mb-2" />
                <p className="text-xs font-medium text-neutral-500">
                  {viewMode === 'archived' ? "No archived bypassed distractions." : "Space clean of non-value distractions!"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </div>
  );
}
