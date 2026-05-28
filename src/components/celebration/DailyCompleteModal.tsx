import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Trophy, Star, ArrowRight } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '@/utils/constants';
import { useMemo } from 'react';

interface DailyCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasks: number;
  totalMinutes: number;
}

export function DailyCompleteModal({ isOpen, onClose, completedTasks, totalMinutes }: DailyCompleteModalProps) {
  const quote = useMemo(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)], []);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <Modal isOpen={isOpen} onClose={onClose} showClose={false}>
      <div className="card p-6 text-center relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center"
        >
          <Trophy size={32} className="text-amber-400" />
        </motion.div>

        <motion.h2
          className="text-xl font-bold text-slate-100 mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          太棒了！今日任务全部完成！
        </motion.h2>

        <motion.div
          className="flex items-center justify-center gap-4 my-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{completedTasks}</div>
            <div className="text-xs text-slate-500">完成项</div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {hours > 0 ? `${hours}h${mins > 0 ? mins + 'm' : ''}` : `${mins}m`}
            </div>
            <div className="text-xs text-slate-500">学习时长</div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className="text-center">
            <Star size={24} className="text-amber-400 mx-auto mb-0.5" />
            <div className="text-xs text-slate-500">连续打卡</div>
          </div>
        </motion.div>

        <motion.blockquote
          className="text-sm text-slate-400 italic my-4 px-4 py-2 border-l-2 border-amber-500/50 bg-white/[0.02] rounded-r"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          "{quote}"
        </motion.blockquote>

        <motion.button
          onClick={onClose}
          className="mt-2 px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm transition-colors inline-flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          继续加油
          <ArrowRight size={16} />
        </motion.button>
      </div>
    </Modal>
  );
}
