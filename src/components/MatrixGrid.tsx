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
                {viewMode === 'archived' && task.completedAt && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 pb-1 flex items-center gap-1.5 font-semibold leading-none" id={`task_completed_at_${task.id}`}>
                    <Icons.CheckCircle className="h-3 w-3 shrink-0 text-emerald-500 dark:text-emerald-400" />
                    <span>Completed on: {new Date(task.completedAt).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
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

  const quadrantStyle = "border border-neutral-200 dark:border-neutral-800/85 bg-white dark:bg-[#13151b] shadow-xs";

  // Helper to compute background theme color intensity / opacity based on task load
  const getQuadrantBgClass = (count: number, colorKey: 'red' | 'emerald' | 'blue' | 'amber') => {
    if (count === 0) {
      return "bg-white dark:bg-[#13151b]";
    }
    if (colorKey === 'red') {
      if (count <= 1) return "bg-red-500/[0.02] dark:bg-red-500/[0.02]";
      if (count <= 2) return "bg-red-500/[0.05] dark:bg-red-500/[0.04]";
      if (count <= 4) return "bg-red-500/[0.11] dark:bg-red-500/[0.09]";
      return "bg-red-500/[0.18] dark:bg-red-500/[0.15]"; // High / peak congestion
    }
    if (colorKey === 'emerald') {
      if (count <= 1) return "bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]";
      if (count <= 2) return "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.03]";
      if (count <= 4) return "bg-emerald-500/[0.09] dark:bg-emerald-500/[0.07]";
      return "bg-emerald-500/[0.15] dark:bg-emerald-500/[0.12]"; // High / peak congestion
    }
    if (colorKey === 'blue') {
      if (count <= 1) return "bg-blue-500/[0.02] dark:bg-blue-500/[0.01]";
      if (count <= 2) return "bg-blue-500/[0.04] dark:bg-blue-500/[0.03]";
      if (count <= 4) return "bg-blue-500/[0.09] dark:bg-blue-500/[0.07]";
      return "bg-blue-500/[0.15] dark:bg-blue-500/[0.12]"; // High / peak congestion
    }
    // amber
    if (count <= 1) return "bg-amber-500/[0.02] dark:bg-amber-500/[0.01]";
    if (count <= 2) return "bg-amber-500/[0.04] dark:bg-amber-500/[0.03]";
    if (count <= 4) return "bg-amber-500/[0.09] dark:bg-amber-500/[0.07]";
    return "bg-amber-500/[0.15] dark:bg-amber-500/[0.12]"; // High / peak congestion
  };

  // Helper to obtain text and color styles for the intensity monitor legend
  const getIntensityState = (count: number) => {
    if (count === 0) return { label: 'Optimal', colorClass: 'text-neutral-500 dark:text-neutral-450 bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/30' };
    if (count <= 2) return { label: 'Light', colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20' };
    if (count <= 4) return { label: 'Moderate', colorClass: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20' };
    return { label: 'Overloaded', colorClass: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/30 animate-pulse' };
  };

  // Helper to compute overall quadrant completion rate (active vs. completed)
  const getQuadrantCompletionPercentage = (quad: QuadrantType) => {
    const quadTasks = tasks.filter((t) => t.quadrant === quad);
    const total = quadTasks.length;
    if (total === 0) return { total: 0, completed: 0, percent: 0 };
    const completed = quadTasks.filter((t) => t.completed).length;
    return {
      total,
      completed,
      percent: Math.min(Math.round((completed / total) * 100), 100)
    };
  };

  const uiCompStats = getQuadrantCompletionPercentage('urgent-important');
  const inuCompStats = getQuadrantCompletionPercentage('important-not-urgent');
  const uniCompStats = getQuadrantCompletionPercentage('urgent-not-important');
  const nuniCompStats = getQuadrantCompletionPercentage('not-urgent-not-important');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Small Density Intensity Visualizer in Matrix Header */}
      <div id="density_intensity_monitor" className="bg-neutral-50/70 dark:bg-[#15171f]/60 border border-neutral-200/50 dark:border-neutral-800/60 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <span className="p-2 ml-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Icons.Layers className="h-4.5 w-4.5" />
          </span>
          <div>
            <h4 className="text-xs font-black text-neutral-850 dark:text-neutral-100 uppercase tracking-widest leading-none">
              Density Intensity Monitor
            </h4>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold mt-1">
              Quadrant backgrounds change opacity based on active task volume to reveal task overload levels at a glance.
            </p>
          </div>
        </div>

        {/* Live Heat Legend & Feeds */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Do First */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#111217] border border-neutral-200/40 dark:border-neutral-800/60 text-[10px] font-bold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-neutral-450 dark:text-neutral-500">Do First:</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${getIntensityState(UIList.length).colorClass}`}>
              {getIntensityState(UIList.length).label} ({UIList.length})
            </span>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#111217] border border-neutral-200/40 dark:border-neutral-800/60 text-[10px] font-bold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-neutral-450 dark:text-neutral-500">Schedule:</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${getIntensityState(INUList.length).colorClass}`}>
              {getIntensityState(INUList.length).label} ({INUList.length})
            </span>
          </div>

          {/* Delegate */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#111217] border border-neutral-200/40 dark:border-neutral-800/60 text-[10px] font-bold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-neutral-450 dark:text-neutral-500">Delegate:</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${getIntensityState(UNIList.length).colorClass}`}>
              {getIntensityState(UNIList.length).label} ({UNIList.length})
            </span>
          </div>

          {/* Eliminate */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#111217] border border-neutral-200/40 dark:border-neutral-800/60 text-[10px] font-bold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-neutral-450 dark:text-neutral-500">Eliminate:</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${getIntensityState(NUNIList.length).colorClass}`}>
              {getIntensityState(NUNIList.length).label} ({NUNIList.length})
            </span>
          </div>
        </div>
      </div>

      {/* Eisenhower Matrix Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. DO FIRST (Urgent & Important) */}
      <div
        id="quadrant_urgent_important"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'urgent-important')}
        className={`flex flex-col min-h-[300px] rounded-2xl overflow-hidden transition-all duration-300 border border-neutral-200 dark:border-neutral-800/85 shadow-xs ${getQuadrantBgClass(UIList.length, 'red')}`}
      >
        <div className="px-4 py-3 flex items-center justify-between transition-colors border-b border-red-100 dark:border-red-950 bg-red-50/70 dark:bg-red-950/20">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
              <Icons.Flame className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Do First</h3>
                {renderDensityBadge(UIList.length, isUIHighest, 'red')}
              </div>
              <p className="text-[10px] text-red-655/80 dark:text-red-400/60 font-medium leading-none mt-0.5">Urgent & Important</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-red-700 dark:text-red-300 bg-red-100/80 dark:bg-red-900/40 border border-red-200/50 dark:border-red-900/30">
            {UIList.length} Tasks
          </span>
        </div>
        
        {/* Quadrant completion progress bar */}
        <div id="progress_bar_urgent_important" className="px-4 py-2 border-b border-red-100/30 dark:border-red-950/20 bg-red-50/[0.12] dark:bg-red-950/[0.04] flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] font-bold select-none leading-none">
            <span className="text-neutral-550 dark:text-neutral-450 uppercase tracking-wider text-[9px]">Completion Rate</span>
            <span className="font-mono text-red-650 dark:text-red-400 font-bold">{uiCompStats.percent}% ({uiCompStats.completed}/{uiCompStats.total})</span>
          </div>
          <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uiCompStats.percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-red-500 dark:bg-red-600 rounded-full"
            />
          </div>
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
        className={`flex flex-col min-h-[300px] rounded-2xl overflow-hidden transition-all duration-300 border border-neutral-200 dark:border-neutral-800/85 shadow-xs ${getQuadrantBgClass(INUList.length, 'emerald')}`}
      >
        <div className="px-4 py-3 flex items-center justify-between transition-colors border-b border-emerald-100 dark:border-emerald-950 bg-emerald-50/65 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-705 dark:bg-emerald-900/40 dark:text-emerald-300">
              <Icons.Clock className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-350">Schedule It</h3>
                {renderDensityBadge(INUList.length, isINUHighest, 'emerald')}
              </div>
              <p className="text-[10px] text-emerald-655/80 dark:text-emerald-400/60 font-medium leading-none mt-0.5">Important but Not Urgent</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/40 border border-emerald-200/50 dark:border-emerald-900/30">
            {INUList.length} Tasks
          </span>
        </div>
        
        {/* Quadrant completion progress bar */}
        <div id="progress_bar_important_not_urgent" className="px-4 py-2 border-b border-emerald-100/30 dark:border-emerald-950/20 bg-emerald-50/[0.12] dark:bg-emerald-950/[0.04] flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] font-bold select-none leading-none">
            <span className="text-neutral-555 dark:text-neutral-455 uppercase tracking-wider text-[9px]">Completion Rate</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{inuCompStats.percent}% ({inuCompStats.completed}/{inuCompStats.total})</span>
          </div>
          <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${inuCompStats.percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full"
            />
          </div>
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
        className={`flex flex-col min-h-[300px] rounded-2xl overflow-hidden transition-all duration-300 border border-neutral-200 dark:border-neutral-800/85 shadow-xs ${getQuadrantBgClass(UNIList.length, 'blue')}`}
      >
        <div className="px-4 py-3 flex items-center justify-between transition-colors border-b border-blue-100 dark:border-blue-950 bg-blue-50/70 dark:bg-blue-950/20">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-305">
              <Icons.Users className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300">Delegate It</h3>
                {renderDensityBadge(UNIList.length, isUNIHighest, 'blue')}
              </div>
              <p className="text-[10px] text-blue-655/80 dark:text-blue-400/60 font-medium leading-none mt-0.5">Urgent but Not Important</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-blue-700 dark:text-blue-305 bg-blue-100/80 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-900/30">
            {UNIList.length} Tasks
          </span>
        </div>
        
        {/* Quadrant completion progress bar */}
        <div id="progress_bar_urgent_not_important" className="px-4 py-2 border-b border-blue-100/30 dark:border-blue-950/20 bg-blue-50/[0.12] dark:bg-blue-950/[0.04] flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] font-bold select-none leading-none">
            <span className="text-neutral-555 dark:text-neutral-455 uppercase tracking-wider text-[9px]">Completion Rate</span>
            <span className="font-mono text-blue-700 dark:text-blue-400 font-bold">{uniCompStats.percent}% ({uniCompStats.completed}/{uniCompStats.total})</span>
          </div>
          <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uniCompStats.percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-blue-500 dark:bg-blue-600 rounded-full"
            />
          </div>
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
        className={`flex flex-col min-h-[300px] rounded-2xl overflow-hidden transition-all duration-300 border border-neutral-200 dark:border-neutral-800/85 shadow-xs ${getQuadrantBgClass(NUNIList.length, 'amber')}`}
      >
        <div className="px-4 py-3 flex items-center justify-between transition-colors border-b border-amber-100 dark:border-amber-950 bg-amber-50/70 dark:bg-amber-950/20">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-705 dark:bg-amber-900/40 dark:text-amber-300">
              <Icons.Trash2 className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-305">Eliminate It</h3>
                {renderDensityBadge(NUNIList.length, isNUNIHighest, 'amber')}
              </div>
              <p className="text-[10px] text-amber-655/80 dark:text-amber-400/60 font-medium leading-none mt-0.5">Not Urgent & Not Important</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 border border-amber-200/50 dark:border-amber-900/30">
            {NUNIList.length} Tasks
          </span>
        </div>
        
        {/* Quadrant completion progress bar */}
        <div id="progress_bar_not_urgent_not_important" className="px-4 py-2 border-b border-amber-100/30 dark:border-amber-950/20 bg-amber-50/[0.12] dark:bg-amber-950/[0.04] flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] font-bold select-none leading-none">
            <span className="text-neutral-555 dark:text-neutral-455 uppercase tracking-wider text-[9px]">Completion Rate</span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{nuniCompStats.percent}% ({nuniCompStats.completed}/{nuniCompStats.total})</span>
          </div>
          <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${nuniCompStats.percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-amber-500 dark:bg-amber-600 rounded-full"
            />
          </div>
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
