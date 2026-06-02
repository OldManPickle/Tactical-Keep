import React from 'react';
import { Task } from '../types';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

interface ReminderModalProps {
  task: Task;
  onComplete: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
}

export default function ReminderModal({
  task,
  onComplete,
  onSnooze,
  onDismiss,
}: ReminderModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        id="active_reminder_card"
        className="max-w-md w-full bg-amber-50 dark:bg-amber-950 border-2 border-amber-500 rounded-2xl p-6 shadow-2xl text-amber-950 dark:text-amber-100"
      >
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-4 font-sans">
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center animate-bounce">
            <Icons.BellRing className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base tracking-tight text-amber-900 dark:text-amber-300">Tactical Reminder Alarm!</h4>
            <p className="text-xs">Your scheduled alarm is calling standard action</p>
          </div>
        </div>

        <h3 className="text-lg font-black font-sans">{task.title}</h3>
        {task.description && (
          <p className="text-sm opacity-80 mt-2 bg-amber-100/40 dark:bg-amber-900/40 p-3 rounded-lg leading-relaxed whitespace-pre-wrap font-sans">
            {task.description}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 font-sans">
          <button
            type="button"
            onClick={onComplete}
            id="reminder_complete_btn"
            className="w-full py-2.5 bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-400 text-white font-bold rounded-xl text-sm shadow-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <Icons.CheckCircle className="h-4 w-4" />
            Complete Now (+40 XP!)
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSnooze}
              id="reminder_snooze_btn"
              className="py-2.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold rounded-xl text-xs cursor-pointer"
            >
              Snooze 10m
            </button>
            <button
              type="button"
              onClick={onDismiss}
              id="reminder_dismiss_btn"
              className="py-2.5 bg-transparent border border-amber-600/30 dark:border-amber-400/30 hover:bg-amber-500/10 text-amber-750 dark:text-amber-300 font-bold rounded-xl text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
