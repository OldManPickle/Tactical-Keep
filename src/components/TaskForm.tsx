import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { QuadrantType } from '../types';
import { COLOR_OPTIONS } from '../utils';
import { motion, AnimatePresence } from 'motion/react';

interface TaskFormProps {
  onAddTask: (task: {
    title: string;
    description: string;
    quadrant: QuadrantType;
    color: string;
    reminder?: string;
    scheduledDate?: string;
    tags: string[];
  }) => void;
  onCancel?: () => void;
}

export default function TaskForm({ onAddTask, onCancel }: TaskFormProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quadrant, setQuadrant] = useState<QuadrantType>('urgent-important');
  const [selectedColor, setSelectedColor] = useState('DEFAULT'); // Matches index or key in COLOR_OPTIONS
  const [reminder, setReminder] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (!title.trim() && !description.trim()) {
      return;
    }

    onAddTask({
      title: title.trim() || 'Untitled Task',
      description: description.trim(),
      quadrant,
      color: selectedColor,
      reminder: reminder ? new Date(reminder).toISOString() : undefined,
      scheduledDate: scheduledDate || undefined,
      tags: tags,
    });

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setQuadrant('urgent-important');
    setSelectedColor('DEFAULT');
    setReminder('');
    setScheduledDate('');
    setTags([]);
    setTagInput('');
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

  // Find active color style classes from configuration options
  const activeColorObject = COLOR_OPTIONS.find(c => c.name.toUpperCase() === selectedColor.toUpperCase()) || COLOR_OPTIONS[0];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-10" ref={formRef}>
      <motion.div
        layout
        className={`rounded-xl border transition-all shadow-sm ${
          isExpanded 
            ? `${activeColorObject.light} dark:${activeColorObject.dark} shadow-md border-neutral-300 dark:border-neutral-700` 
            : 'bg-white border-neutral-200 hover:shadow-md dark:bg-neutral-900 dark:border-neutral-800'
        }`}
      >
        <div className="p-4">
          {/* Main Input - Title or Quick Input */}
          <div className="flex items-center gap-3">
            {!isExpanded && (
              <Icons.PlusCircle className="text-neutral-400 h-5 w-5 shrink-0" />
            )}
            <input
              type="text"
              id="task_title_input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder={isExpanded ? "Task Priority Title" : "Take a tactical task..."}
              className={`w-full bg-transparent focus:outline-hidden font-medium text-neutral-800 dark:text-neutral-100 ${
                isExpanded ? 'text-base' : 'text-sm cursor-pointer'
              }`}
            />
            {!isExpanded && (
              <div className="flex items-center gap-2 text-neutral-400">
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(true);
                    setQuadrant('urgent-important');
                  }}
                  title="Do First (Urgent & Important)"
                  className="hover:text-red-500 p-1"
                >
                  <Icons.AlertTriangle className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  title="Options"
                  className="hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
                >
                  <Icons.MoreVertical className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Expanded Options */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/50 space-y-4"
              >
                {/* Description Textarea */}
                <div>
                  <textarea
                    id="task_desc_input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description or notes..."
                    rows={2}
                    className="w-full bg-transparent focus:outline-hidden text-sm text-neutral-700 dark:text-neutral-300 resize-none"
                  />
                </div>

                {/* Eisenhower Quadrant Grid - 2x2 Selector */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                    Eisenhower Priority Matrix Quadrant
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      id="quad_ui_btn"
                      onClick={() => setQuadrant('urgent-important')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                        quadrant === 'urgent-important'
                          ? 'bg-red-500 text-white border-red-600 shadow-sm'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Icons.Flame className="h-3.5 w-3.5 shrink-0" />
                      <div>
                        <div className="font-bold">Do First</div>
                        <div className="text-[9px] opacity-80 font-normal">Urgent & Important</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="quad_inu_btn"
                      onClick={() => setQuadrant('important-not-urgent')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                        quadrant === 'important-not-urgent'
                          ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Icons.Calendar className="h-3.5 w-3.5 shrink-0" />
                      <div>
                        <div className="font-bold">Schedule It</div>
                        <div className="text-[9px] opacity-80 font-normal">Important, Not Urgent</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="quad_uni_btn"
                      onClick={() => setQuadrant('urgent-not-important')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                        quadrant === 'urgent-not-important'
                          ? 'bg-amber-500 text-slate-900 border-amber-600 shadow-sm'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Icons.Users className="h-3.5 w-3.5 shrink-0" />
                      <div>
                        <div className="font-bold">Delegate It</div>
                        <div className="text-[9px] opacity-80 font-normal">Urgent & Not Important</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      id="quad_nuni_btn"
                      onClick={() => setQuadrant('not-urgent-not-important')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                        quadrant === 'not-urgent-not-important'
                          ? 'bg-neutral-600 text-white border-neutral-700 shadow-sm'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Icons.Trash2 className="h-3.5 w-3.5 shrink-0" />
                      <div>
                        <div className="font-bold">Eliminate It</div>
                        <div className="text-[9px] opacity-80 font-normal">Not Urgent & Not Important</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Schedulers & Reminders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                      Set Reminder
                    </span>
                    <div className="flex items-center bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-700/60 rounded-lg px-2.5 py-1.5 focus-within:border-neutral-400">
                      <Icons.Bell className="h-3.5 w-3.5 text-neutral-400 mr-2 shrink-0" />
                      <input
                        type="datetime-local"
                        id="reminder_dt"
                        value={reminder}
                        onChange={(e) => setReminder(e.target.value)}
                        className="w-full bg-transparent focus:outline-hidden text-neutral-700 dark:text-neutral-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                      Schedule on Calendar
                    </span>
                    <div className="flex items-center bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-700/60 rounded-lg px-2.5 py-1.5 focus-within:border-neutral-400">
                      <Icons.CalendarDays className="h-3.5 w-3.5 text-neutral-400 mr-2 shrink-0" />
                      <input
                        type="date"
                        id="scheduled_date_picker"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full bg-transparent focus:outline-hidden text-neutral-700 dark:text-neutral-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Tags Section */}
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                    Tags (Press Enter to add tag)
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-750 rounded-lg">
                    {tags.map((tg, index) => (
                      <span key={index} className="inline-flex items-center gap-1 bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-medium px-2 py-0.5 rounded-full">
                        #{tg}
                        <button type="button" onClick={() => removeTag(index)} className="hover:text-red-500 text-neutral-400">
                          <Icons.X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      id="tag_input"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      placeholder="work, personal, workout..."
                      className="bg-transparent focus:outline-hidden text-xs text-neutral-700 dark:text-neutral-300 px-1 py-0.5 min-w-[100px] flex-1"
                    />
                  </div>
                </div>

                {/* Footer Icons & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  {/* Keep Page Color Select Group */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide mr-1 hidden sm:inline">Color</span>
                    <div className="flex items-center gap-1">
                      {COLOR_OPTIONS.map((co) => {
                        const colorSampleMap: Record<string, string> = {
                          'DEFAULT': 'bg-neutral-100 border border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700',
                          'RED': 'bg-red-500 border border-red-600',
                          'GREEN': 'bg-emerald-500 border border-emerald-600',
                          'BLUE': 'bg-blue-500 border border-blue-600',
                        };
                        const sampleBg = colorSampleMap[co.name.toUpperCase()] || 'bg-neutral-100 border border-neutral-300';
                        return (
                          <button
                            key={co.name}
                            type="button"
                            onClick={() => setSelectedColor(co.name.toUpperCase())}
                            title={co.name}
                            className={`h-5 w-5 rounded-full transition-transform active:scale-90 hover:scale-110 shrink-0 ${sampleBg} ${
                              selectedColor.toUpperCase() === co.name.toUpperCase() ? 'ring-2 ring-neutral-700 dark:ring-neutral-250 scale-110' : ''
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Submission triggers */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      id="reset_task_composer_btn"
                      onClick={() => {
                        resetForm();
                        onCancel?.();
                      }}
                      className="px-3 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      id="submit_task_composer_btn"
                      onClick={handleSubmit}
                      className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      Task Matrix Added
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
