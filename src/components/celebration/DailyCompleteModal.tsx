import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { MOTIVATIONAL_QUOTES } from '@/utils/constants';

interface Props { isOpen: boolean; onClose: () => void; completedTasks: number; totalMinutes: number }

export function DailyCompleteModal({ isOpen, onClose, completedTasks, totalMinutes }: Props) {
  const quote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], []);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="card p-8 text-center border-border-secondary">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <div className="text-4xl mb-4">✦</div>
          <h2 className="text-lg font-semibold text-text-primary mb-1 tracking-tight">Today complete</h2>
          <p className="text-[13px] text-text-tertiary mb-6">Keep the momentum going</p>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-8 mb-6 py-3 border-y border-border-primary"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        >
          <div>
            <div className="text-xl font-semibold text-text-primary font-mono">{completedTasks}</div>
            <div className="text-[11px] text-text-tertiary">tasks done</div>
          </div>
          <div className="w-px h-8 bg-border-primary" />
          <div>
            <div className="text-xl font-semibold text-text-primary font-mono">{h}h{m > 0 ? ` ${m}m` : ''}</div>
            <div className="text-[11px] text-text-tertiary">study time</div>
          </div>
        </motion.div>

        <motion.blockquote
          className="text-[13px] text-text-secondary italic mb-6 leading-relaxed"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >
          "{quote}"
        </motion.blockquote>

        <motion.button
          onClick={onClose}
          className="px-8 py-2.5 rounded-md bg-text-primary text-bg-primary text-[13px] font-medium hover:opacity-90 transition-opacity"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        >
          Continue
        </motion.button>
      </div>
    </Modal>
  );
}
