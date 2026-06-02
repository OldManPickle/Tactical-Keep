import React from 'react';
import Header from './components/Header';
import MatrixGrid from './components/MatrixGrid';
import CalendarGrid from './components/CalendarGrid';
import AchievementsPanel from './components/AchievementsPanel';
import TaskEditModal from './components/TaskEditModal';
import DailyFocus from './components/DailyFocus';
import CompletionTrendChart from './components/CompletionTrendChart';
import { Scaffold, FloatingActionButton } from './components/Material3Components';
import * as Icons from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useAppState } from './hooks/useAppState';
import ReminderModal from './components/ReminderModal';
import ToastContainer from './components/ToastContainer';
import TaskCreateModal from './components/TaskCreateModal';

export default function App() {
  const {
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
    setActiveReminderTask,
    setEditingTask,
    setShowAchievementsModal,
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
  } = useAppState();

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
      <div className="py-6 space-y-8 max-w-7xl mx-auto px-4 font-sans">
        
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
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
                            type="button"
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

              {/* Sort Matrix Actions / Active Board vs Archive */}
              {!isMatrixCollapsed && (
                <div className="flex flex-wrap items-center gap-3">
                  {/* Select View Mode Toggle */}
                  <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/60 p-1 rounded-xl border border-neutral-200/50 dark:border-neutral-750/30">
                    <button
                      type="button"
                      onClick={() => setMatrixViewMode('active')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                        matrixViewMode === 'active'
                          ? 'bg-indigo-500 text-white shadow-xs font-black'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                      }`}
                      title="Show active tasks inside the matrix quadrants (excludes completed archive items)"
                      id="opt_active_matrix"
                    >
                      <Icons.LayoutGrid className="h-3 w-3" />
                      <span>Active Board ({tasks.filter((t) => !t.completed).length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatrixViewMode('archived')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                        matrixViewMode === 'archived'
                          ? 'bg-emerald-500 text-white shadow-xs font-black'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                      }`}
                      title="Show completed task archive history"
                      id="opt_archive_matrix"
                    >
                      <Icons.Archive className="h-3 w-3" />
                      <span>Archive History ({tasks.filter((t) => t.completed).length})</span>
                    </button>
                  </div>

                  {/* Matrix Sorting Controls */}
                  <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800/60 p-1 rounded-xl border border-neutral-200/50 dark:border-neutral-750/30">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500 px-2 select-none">Sort:</span>
                    <button
                      type="button"
                      onClick={() => setMatrixSortBy('priority')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                        matrixSortBy === 'priority'
                          ? 'bg-indigo-500 text-white shadow-xs'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                      }`}
                      title="Sort Matrix by Priority level (highest first)"
                      id="sort_by_priority"
                    >
                      <Icons.Sliders className="h-3 w-3" />
                      <span>Priority</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatrixSortBy('title')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                        matrixSortBy === 'title'
                          ? 'bg-indigo-500 text-white shadow-xs'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                      }`}
                      title="Sort Matrix tasks alphabetically by Title (A-Z)"
                      id="sort_by_title"
                    >
                      <Icons.Type className="h-3 w-3" />
                      <span>Title</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatrixSortBy('date')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                        matrixSortBy === 'date'
                          ? 'bg-indigo-500 text-white shadow-xs'
                          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50'
                      }`}
                      title="Sort Matrix tasks by Planned/Scheduled Date"
                      id="sort_by_date"
                    >
                      <Icons.Calendar className="h-3 w-3" />
                      <span>Date</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {!isMatrixCollapsed && (
              <MatrixGrid
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onMoveQuadrant={handleMoveQuadrantDirect}
                onTaskDrop={handleTaskQuadrantChange}
                onEditTask={(t) => setEditingTask(t)}
                sortBy={matrixSortBy}
                viewMode={matrixViewMode}
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
          <ReminderModal
            task={activeReminderTask}
            onComplete={() => {
              handleToggleComplete(activeReminderTask.id);
              rewardXP(15, 'Completed Reminder Habit');
              setActiveReminderTask(null);
            }}
            onSnooze={() => {
              const newReminder = new Date(Date.now() + 10 * 60 * 1000).toISOString();
              setTasks((prev) =>
                prev.map((t) => (t.id === activeReminderTask.id ? { ...t, reminder: newReminder, reminderDismissed: false } : t))
              );
              setActiveReminderTask(null);
              triggerToast('Snoozed 10 Minutes');
            }}
            onDismiss={() => {
              setActiveReminderTask(null);
              rewardXP(5, 'Dismissed Reminder');
              triggerToast('Reminder Dismissed +5 XP');
            }}
          />
        )}
      </AnimatePresence>

      {/* FLOAT HABIT TOASTER banner notifications in corner */}
      <ToastContainer
        activeToast={activeToast}
        endOfDaySummary={endOfDaySummary}
        onDismissSummary={() => setEndOfDaySummary(null)}
      />

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
          <TaskCreateModal
            isOpen={isComposerOpen}
            onClose={() => setIsComposerOpen(false)}
            onAddTask={handleAddTask}
          />
        )}
      </AnimatePresence>
    </Scaffold>
  );
}
