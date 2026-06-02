import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Task, QuadrantType } from '../types';
import { COLOR_OPTIONS } from '../utils';
import { motion } from 'motion/react';

interface TaskEditModalProps {
  task: Task;
  onSave: (id: string, updatedFields: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function TaskEditModal({
  task,
  onSave,
  onDelete,
  onClose,
}: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [quadrant, setQuadrant] = useState<QuadrantType>(task.quadrant);
  const [color, setColor] = useState(task.color.toUpperCase());
  const [reminder, setReminder] = useState(
    task.reminder ? new Date(task.reminder).toISOString().substring(0, 16) : ''
  );
  const [scheduledDate, setScheduledDate] = useState(task.scheduledDate || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(task.tags || []);
  const [completed, setCompleted] = useState(task.completed);

  const handleSave = () => {
    onSave(task.id, {
      title: title.trim() || 'Untitled Task',
      description: description.trim(),
      quadrant,
      color,
      reminder: reminder ? new Date(reminder).toISOString() : undefined,
      scheduledDate: scheduledDate || undefined,
      tags,
      completed,
    });
    onClose();
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const keepColorMap: Record<string, { bg: string; border: string; text: string }> = {
    'DEFAULT': { 
      bg: 'bg-white dark:bg-neutral-900', 
      border: 'border-neutral-200 dark:border-neutral-800', 
      text: 'text-neutral-900 dark:text-neutral-50' 
    },
    'RED': { 
      bg: 'bg-[#faf0f0] dark:bg-[#2b1b1b]', 
      border: 'border-red-200 dark:border-red-900/60', 
      text: 'text-red-950 dark:text-red-100' 
    },
    'GREEN': { 
      bg: 'bg-[#f0faf2] dark:bg-[#1a2b1e]', 
      border: 'border-emerald-200 dark:border-emerald-900/60', 
      text: 'text-emerald-950 dark:text-emerald-100' 
    },
    'BLUE': { 
      bg: 'bg-[#f0f4fa] dark:bg-[#1a222b]', 
      border: 'border-blue-200 dark:border-blue-900/60', 
      text: 'text-blue-950 dark:text-blue-100' 
    },
  };

  const activeKeepColor = keepColorMap[color] || keepColorMap['DEFAULT'];

  return (
    <div id="edit_modal_overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        id="edit_modal_card"
        className={`w-full max-w-xl rounded-xl border p-6 shadow-xl transition-all duration-300 ${activeKeepColor.bg} ${activeKeepColor.border} ${activeKeepColor.text}`}
      >
        {/* Top Header Row / Close icon */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Created: {new Date(task.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <Icons.X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Note Body (Google Keep borderless style) */}
        <div className="space-y-4">
          {/* Title - Borderless with Google Keep style circular toggle checkbox */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCompleted(!completed)}
              id="edit_toggle_completed_binary"
              className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                completed
                  ? 'bg-neutral-800 border-transparent text-white dark:bg-neutral-200 dark:text-neutral-900 shadow-xs'
                  : 'bg-transparent border-neutral-300 dark:border-neutral-600 hover:border-neutral-450 dark:hover:border-neutral-550'
              }`}
              title={completed ? "Mark note active" : "Mark note completed"}
            >
              {completed && <Icons.Check className="h-3 w-3 stroke-[3px]" />}
            </button>
            <input
              type="text"
              placeholder="Title"
              id="edit_title_input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full bg-transparent border-none placeholder-neutral-400 dark:placeholder-neutral-500 text-lg font-bold focus:outline-hidden focus:ring-0 p-0 transition-opacity duration-300 ${
                completed ? 'line-through opacity-45' : ''
              }`}
            />
          </div>

          {/* Description/Note - Borderless/Clean */}
          <div>
            <textarea
              placeholder="Note"
              id="edit_desc_input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full bg-transparent border-none placeholder-neutral-450 dark:placeholder-neutral-550 text-sm focus:outline-hidden focus:ring-0 p-0 resize-none min-h-[100px] transition-opacity duration-300 ${
                completed ? 'line-through opacity-45' : ''
              }`}
            />
          </div>

          {/* Labels Row / Saved Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 mr-1 select-none">
              <Icons.Tag className="h-3.5 w-3.5" />
              <span>Labels:</span>
            </div>
            {tags.map((tg, index) => (
              <span key={index} className="inline-flex items-center gap-1 bg-black/5 dark:bg-white/10 text-[11px] font-bold px-2.5 py-0.5 rounded-full text-neutral-600 dark:text-neutral-300">
                #{tg}
                <button type="button" onClick={() => removeTag(index)} className="hover:text-red-500 opacity-60 hover:opacity-100 transition-colors">
                  <Icons.X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            <input
              type="text"
              id="edit_tag_input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="+ Add Label"
              className="bg-transparent focus:outline-hidden text-xs text-neutral-500 dark:text-neutral-400 px-1 py-0.5 min-w-[100px]"
            />
          </div>

          {/* Keep Tools Grid */}
          <div className="space-y-3.5 pt-4">
            
            {/* Eisenhower Quadrant Row */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 mr-2 select-none">
                <Icons.Flame className="h-3.5 w-3.5" />
                <span>Priority:</span>
              </div>
              {[
                { id: 'urgent-important', label: 'Do First', color: 'bg-red-500' },
                { id: 'important-not-urgent', label: 'Schedule', color: 'bg-blue-500' },
                { id: 'urgent-not-important', label: 'Delegate', color: 'bg-amber-500' },
                { id: 'not-urgent-not-important', label: 'Eliminate', color: 'bg-neutral-500' },
              ].map((quad) => (
                <button
                  key={quad.id}
                  type="button"
                  onClick={() => setQuadrant(quad.id as QuadrantType)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                    quadrant === quad.id
                      ? 'bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-950 border-transparent shadow-xs'
                      : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border-neutral-200/50 dark:border-neutral-800 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1 ${quad.color}`} />
                  {quad.label}
                </button>
              ))}
            </div>

            {/* Schedulers & Reminders Inline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Set Reminder */}
              <div className="flex items-center gap-2">
                <Icons.Bell className="h-4 w-4 text-neutral-450 dark:text-neutral-400 shrink-0" />
                <input
                  type="datetime-local"
                  id="edit_reminder_dt"
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 rounded-lg px-2.5 py-1 focus:outline-hidden text-xs text-neutral-700 dark:text-neutral-300 font-semibold transition-all"
                  placeholder="Set reminder alert"
                />
              </div>

              {/* Set Calendar Booking */}
              <div className="flex items-center gap-2">
                <Icons.Calendar className="h-4 w-4 text-neutral-450 dark:text-neutral-400 shrink-0" />
                <input
                  type="date"
                  id="edit_calendar_dt"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 rounded-lg px-2.5 py-1 focus:outline-hidden text-xs text-neutral-700 dark:text-neutral-300 font-semibold transition-all"
                />
              </div>
            </div>

            {/* Color Wallpaper Icons */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 mr-2 select-none">
                <Icons.Palette className="h-3.5 w-3.5" />
                <span>Theme Color:</span>
              </div>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map((co) => {
                  const isSelected = color === co.name.toUpperCase();
                  const colorSampleMap: Record<string, string> = {
                    'DEFAULT': 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600',
                    'RED': 'bg-red-400 dark:bg-red-500/70 border-red-500',
                    'GREEN': 'bg-emerald-400 dark:bg-emerald-500/70 border-emerald-500',
                    'BLUE': 'bg-blue-400 dark:bg-blue-500/70 border-blue-500',
                  };
                  const dotColor = colorSampleMap[co.name.toUpperCase()] || 'bg-white border';
                  return (
                    <button
                      key={co.name}
                      type="button"
                      onClick={() => setColor(co.name.toUpperCase())}
                      title={co.name}
                      className={`h-5 w-5 rounded-full border transition-transform hover:scale-110 active:scale-95 relative ${dotColor} ${
                        isSelected ? 'ring-2 ring-neutral-900 dark:ring-neutral-100 scale-105' : ''
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-neutral-800 dark:text-neutral-200 font-black">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Footer controls (Seamless clean bottom) */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/5 dark:border-white/5">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this task?')) {
                onDelete(task.id);
                onClose();
              }
            }}
            id="delete_edit_task_btn"
            title="Delete task note permanently"
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-neutral-400 hover:text-red-500 transition-colors"
          >
            <Icons.Trash className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {/* Complete/Reopen Note button */}
            <button
              type="button"
              onClick={() => setCompleted(!completed)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                completed
                  ? 'bg-amber-100/80 hover:bg-amber-150 text-amber-805 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 dark:text-amber-300 border border-transparent'
                  : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 dark:text-emerald-305 border border-transparent'
              }`}
            >
              {completed ? (
                <>
                  <Icons.Undo2 className="h-3.5 w-3.5 stroke-[2.5]" />
                  Reopen Note
                </>
              ) : (
                <>
                  <Icons.CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                  Complete Note
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              id="save_edit_task_btn"
              className="px-5 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-white text-xs font-bold transition-all shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
