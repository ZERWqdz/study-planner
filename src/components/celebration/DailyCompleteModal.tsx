import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Trophy, Star, Zap } from 'lucide-react';
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
      <div className="card-hero p-6 sm:p-8 text-center relative">
        {/* 背景光晕 */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'var(--gradient-glow)', filter: 'blur(40px)' }}
        />

        <div className="relative z-10">
          {/* 奖杯 */}
          <motion.div
            className="mx-auto mb-5"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Trophy size={36} className="text-amber-400" />
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap size={12} className="text-black" />
              </motion.div>
            </div>
          </motion.div>

          <motion.h2
            className="text-xl sm:text-2xl font-bold text-slate-100 mb-1 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            今日任务全部完成！
          </motion.h2>
          <motion.p
            className="text-sm text-slate-500 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            继续保持，考研必胜
          </motion.p>

          {/* 数据面板 */}
          <motion.div
            className="grid grid-cols-3 gap-3 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass p-3 rounded-xl">
              <div className="text-lg font-bold text-slate-100 font-mono">{completedTasks}</div>
              <div className="text-[10px] text-slate-500">完成项</div>
            </div>
            <div className="glass p-3 rounded-xl">
              <div className="text-lg font-bold text-green-400 font-mono">
                {hours > 0 ? `${hours}h` : `${mins}m`}
              </div>
              <div className="text-[10px] text-slate-500">学习时长</div>
            </div>
            <div className="glass p-3 rounded-xl flex flex-col items-center justify-center">
              <Star size={18} className="text-amber-400 mb-0.5" />
              <div className="text-[10px] text-slate-500">打卡成功</div>
            </div>
          </motion.div>

          {/* 励志语录 */}
          <motion.blockquote
            className="text-sm text-slate-400 italic mb-5 px-4 py-3 border-l-2 border-amber-500/30 bg-white/[0.02] rounded-r-lg text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            "{quote}"
          </motion.blockquote>

          <motion.button
            onClick={onClose}
            className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'var(--gradient-hero)',
              color: '#000',
              boxShadow: '0 4px 20px var(--accent-glow)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            继续加油
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}
