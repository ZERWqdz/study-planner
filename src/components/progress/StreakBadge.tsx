import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const sizeMap = { sm: 26, md: 34, lg: 52 };
  const fontSizeMap = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-base' };
  const iconSize = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const flameActive = streak > 0;

  return (
    <motion.div
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border transition-all duration-500 ${
        flameActive
          ? 'bg-amber-500/10 border-amber-500/20'
          : 'bg-white/[0.02] border-white/[0.04]'
      }`}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={flameActive ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Flame
          size={iconSize * 0.55}
          className={flameActive ? 'text-amber-400' : 'text-slate-700'}
        />
      </motion.div>
      <span
        className={`${fontSize} font-bold font-mono ${
          flameActive ? 'text-amber-400' : 'text-slate-600'
        }`}
      >
        {streak}
      </span>
      <span className={`${fontSize} ${flameActive ? 'text-amber-400/60' : 'text-slate-600'}`}>
        天
      </span>
    </motion.div>
  );
}
