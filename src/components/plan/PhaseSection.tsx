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
      className="flex items-center gap-4 px-4 py-2 mb-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="text-2xl">{emoji}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-bold" style={{ color: phase.color }}>
            {phase.name}
          </span>
          <span className="text-xs text-slate-500">
            {startDate} — {endDate}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: phase.color }}
            initial={{ width: 0 }}
            animate={{ width: `${ratio}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
      <span className="text-xs font-mono text-slate-400">{completedDays}/{totalDays}天</span>
    </motion.div>
  );
}
