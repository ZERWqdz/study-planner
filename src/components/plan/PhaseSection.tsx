import { motion } from 'framer-motion';
import type { PhaseId } from '@/types';
import { PHASES } from '@/utils/constants';

interface PhaseSectionProps {
  phaseId: PhaseId;
  startDate: string;
  endDate: string;
  completedDays: number;
  totalDays: number;
}

export function PhaseSection({ phaseId, startDate, endDate, completedDays, totalDays }: PhaseSectionProps) {
  const phase = PHASES.find((p) => p.id === phaseId);
  if (!phase) return null;

  const ratio = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  const emoji = phaseId === 'foundation' ? '🌱' : phaseId === 'reinforcement' ? '🔥' : '🚀';

  return (
    <motion.div
      className="flex items-center gap-3 px-1 py-1.5 mb-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div
        className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
        style={{ backgroundColor: `${phase.color}12` }}
      >
        <span className="text-base">{emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold" style={{ color: phase.color }}>
            {phase.name}
          </span>
          <span className="text-[10px] text-slate-600 font-mono">
            {startDate} — {endDate}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full transition-all duration-700"
            style={{
              background: `linear-gradient(90deg, ${phase.color}, ${phase.color}88)`,
              boxShadow: `0 0 8px ${phase.color}30`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(ratio, 2)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
      <span className="text-[11px] font-mono text-slate-500 flex-shrink-0">{completedDays}/{totalDays}</span>
    </motion.div>
  );
}
