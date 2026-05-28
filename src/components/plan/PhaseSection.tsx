import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PhaseId } from '@/types';
import { PHASES } from '@/utils/constants';

interface PhaseSectionProps {
  phaseId: PhaseId;
  startDate: string;
  endDate: string;
  completedDays: number;
  totalDays: number;
  children?: React.ReactNode;
}

export function PhaseSection({ phaseId, startDate, endDate, completedDays, totalDays, children }: PhaseSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const phase = PHASES.find((p) => p.id === phaseId);
  if (!phase) return null;

  const pct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return (
    <div className="mb-8">
      {/* Phase header — clickable to collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 py-2 mb-3 group cursor-pointer"
      >
        <span className="text-sm font-semibold text-text-primary tracking-tight">
          {phaseId === 'foundation' ? 'Foundation' : phaseId === 'reinforcement' ? 'Reinforcement' : 'Sprint'}
        </span>
        <span className="text-[11px] text-text-tertiary font-mono">
          {startDate} — {endDate}
        </span>
        <span className="flex-1" />
        <span className="text-[11px] text-text-tertiary font-mono">
          {completedDays}/{totalDays}
        </span>
        <motion.span
          animate={{ rotate: collapsed ? -90 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-text-tertiary text-[10px]"
        >
          ▼
        </motion.span>
      </button>

      {/* Progress bar */}
      <div className="h-px bg-border-primary mb-3">
        <motion.div
          className="h-full bg-text-primary origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct / 100 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Children (day cards) */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
