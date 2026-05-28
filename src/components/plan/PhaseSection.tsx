import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PhaseId } from '@/types';
import { PHASES } from '@/utils/constants';
import { getTodayStr } from '@/utils/date';

interface PhaseSectionProps {
  phaseId: PhaseId;
  startDate: string;
  endDate: string;
  completedDays: number;
  totalDays: number;
  children?: React.ReactNode;
}

function fmtShort(dateStr: string) {
  return dateStr.slice(5).replace('-', '.');
}

export function PhaseSection({ phaseId, startDate, endDate, completedDays, totalDays, children }: PhaseSectionProps) {
  const phase = PHASES.find((p) => p.id === phaseId);
  if (!phase) return null;

  const today = getTodayStr();
  const isCurrent = today >= phase.startDate && today <= phase.endDate;
  const [collapsed, setCollapsed] = useState(!isCurrent);
  const [hovered, setHovered] = useState(false);

  const pct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  const isDone = pct === 100;

  return (
    <section className="mb-14">
      <button
        onClick={() => setCollapsed(!collapsed)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full flex items-center gap-3 py-1.5 -mx-2 px-2 rounded-md transition-colors hover:bg-bg-hover/50"
      >
        <motion.span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: isDone ? 'var(--text-tertiary)' : phase.color }}
          animate={{ scale: hovered ? 1.3 : 1 }}
          transition={{ duration: 0.2 }}
        />

        <span className="text-[15px] font-medium text-text-primary">
          {phase.name}
        </span>

        <span className="text-[12px] text-text-tertiary font-mono tabular-nums">
          {fmtShort(startDate)} — {fmtShort(endDate)}
        </span>

        <span className="flex-1" />

        <motion.span
          className="text-[12px] text-text-tertiary font-mono tabular-nums"
          animate={{ opacity: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          {completedDays}/{totalDays}
        </motion.span>

        <motion.span
          animate={{ rotate: collapsed ? 0 : 180, opacity: hovered ? 1 : 0.55 }}
          transition={{ duration: 0.2 }}
          className="text-text-tertiary text-[10px] w-4 text-center"
        >
          ▾
        </motion.span>
      </button>

      <div className="h-1.5 bg-border-primary rounded-full mt-2 mb-5 overflow-hidden">
        <motion.div
          className="h-full rounded-full origin-left"
          style={{ backgroundColor: isDone ? 'var(--text-tertiary)' : phase.color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct / 100 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
