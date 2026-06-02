import React from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

// M3 Design Tokens and typography categories mapping to Tailwind classes
export const M3Typography = {
  // Brand & High-level headings
  displaySmall: "font-sans text-[28px] tracking-normal font-medium text-neutral-900 dark:text-neutral-50 leading-9",
  headlineMedium: "font-sans text-[24px] tracking-normal font-bold text-[#6750A4] dark:text-[#E7E0EC] leading-8",
  headlineSmall: "font-sans text-[20px] tracking-normal font-bold text-neutral-800 dark:text-neutral-100 leading-7",
  
  // Section or item headers
  titleLarge: "font-sans text-[18px] tracking-[0.1px] font-semibold text-neutral-900 dark:text-neutral-50 leading-6",
  titleMedium: "font-sans text-base tracking-[0.15px] font-semibold text-[#625B71] dark:text-[#E7E0EC] leading-5",
  titleSmall: "font-sans text-sm tracking-[0.1px] font-medium text-neutral-850 dark:text-neutral-200 leading-5",
  
  // Body copy
  bodyLarge: "font-sans text-base tracking-[0.5px] font-normal text-neutral-700 dark:text-neutral-200 leading-6",
  bodyMedium: "font-sans text-sm tracking-[0.25px] font-normal text-neutral-600 dark:text-neutral-400 leading-5",
  bodySmall: "font-sans text-xs tracking-[0.4px] font-normal text-neutral-505 dark:text-neutral-500 leading-4",
  
  // Interactive labels & meta
  labelLarge: "font-sans text-sm tracking-[0.1px] font-bold text-[#6750A4] dark:text-[#E7E0EC] leading-5",
  labelMedium: "font-sans text-[11px] tracking-[0.5px] font-bold uppercase text-neutral-400 dark:text-neutral-505 leading-4",
  labelSmall: "font-sans text-[10px] tracking-[0.5px] font-bold uppercase text-neutral-450 dark:text-neutral-550 leading-3"
};

// 1. Scaffold Container Component mimicking Jetpack Compose state & structures
interface ScaffoldProps {
  topBar?: React.ReactNode;
  floatingActionButton?: React.ReactNode;
  children: React.ReactNode;
}

export function Scaffold({
  topBar,
  floatingActionButton,
  children
}: ScaffoldProps) {
  return (
    <div className="relative min-h-screen bg-[#F3F4F6] dark:bg-[#0c0d0f] text-neutral-900 dark:text-neutral-50 flex flex-col selection:bg-[#E7E0EC] dark:selection:bg-[#625B71]">
      {/* M3 App Top Bar slot with Surface Variant style container background */}
      {topBar && (
        <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 dark:bg-[#13151b]/95 backdrop-blur-md border-b border-[#E7E0EC] dark:border-[#625B71]/30 transition-colors duration-300">
          {topBar}
        </header>
      )}

      {/* Main Scaffold Content slot */}
      <main className="flex-1 w-full pb-24 md:pb-28">
        {children}
      </main>

      {/* M3 Explicit Floating Action Button Slot - standard position */}
      {floatingActionButton && (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 select-none">
          {floatingActionButton}
        </div>
      )}
    </div>
  );
}

// 2. M3 Floating Action Button (FAB) styled container (uses Primary color #6750A4)
interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
}

export function FloatingActionButton({
  onClick,
  icon = <Icons.Plus className="h-6 w-6" />,
  label
}: FloatingActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      id="m3_floating_action_btn"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      // Explicit 16.dp large corners (rounded-[16px]) and M3 Primary color (#6750A4)
      className="flex items-center gap-2 px-5 py-4 bg-[#6750A4] text-white font-sans text-sm font-bold rounded-[16px] shadow-[0_4px_14px_rgba(103,80,164,0.3)] hover:shadow-[0_6px_20px_rgba(103,80,164,0.45)] dark:shadow-[0_4px_14px_rgba(103,80,164,0.4)] transition-all ease-out focus:outline-hidden ring-4 ring-[#6750A4]/15 touch-target"
      style={{ minHeight: '48px' }}
      title="Create New Task"
    >
      <span className="flex-shrink-0 text-white">{icon}</span>
      {label && <span className="font-sans font-bold tracking-[0.25px] text-white hidden sm:block">{label}</span>}
    </motion.button>
  );
}

// 3. Elevated M3 Card Component (uses 12.dp medium corners / rounded-[12px] and Surface Variant borders)
interface M3ElevatedCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  id?: string;
  className?: string;
}

export function M3ElevatedCard({
  children,
  onClick,
  id,
  className = ""
}: M3ElevatedCardProps) {
  return (
    <motion.div
      id={id}
      onClick={onClick}
      // Explicit rounded-[12px] (medium corners) and border mapping to Surface Variant or dark secondary line tokens
      className={`relative rounded-[12px] bg-[#FFFFFF] dark:bg-[#13151b] border border-[#E7E0EC] dark:border-[#625B71]/40 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      whileHover={onClick ? { y: -2, transition: { duration: 0.1 } } : undefined}
    >
      {children}
    </motion.div>
  );
}
