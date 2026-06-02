import React from 'react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import TaskForm from './TaskForm';
import { M3Typography } from './Material3Components';
import { QuadrantType } from '../types';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (newTaskData: {
    title: string;
    description: string;
    quadrant: QuadrantType;
    color: string;
    reminder?: string;
    scheduledDate?: string;
    tags: string[];
  }) => void;
}

export default function TaskCreateModal({
  isOpen,
  onClose,
  onAddTask,
}: TaskCreateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="bg-white dark:bg-[#1c1e24] shadow-2xl rounded-[28px] max-w-2xl w-full border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden relative font-sans"
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
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors cursor-pointer"
            title="Close Dialog"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto pt-4 pb-6">
          <TaskForm onAddTask={onAddTask} onCancel={onClose} />
        </div>
      </motion.div>
    </div>
  );
}
