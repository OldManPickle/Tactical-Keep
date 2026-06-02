import React from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastContainerProps {
  activeToast: { message: string; subMessage?: string } | null;
  endOfDaySummary: { clearedCount: number; timestamp: string } | null;
  onDismissSummary: () => void;
}

export default function ToastContainer({
  activeToast,
  endOfDaySummary,
  onDismissSummary,
}: ToastContainerProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full flex flex-col gap-3 pointer-events-none font-sans">
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
                onClick={onDismissSummary}
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
  );
}
