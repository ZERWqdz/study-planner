import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const sizeMap = { sm: 24, md: 32, lg: 48 };
  const fontSizeMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-lg' };
  const iconSize = sizeMap[size];
  const fontSize = fontSizeMap[size];

  return (
    <motion.div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
    >
      <Flame size={iconSize * 0.6} className="text-amber-400" />
      <span className={`${fontSize} font-bold text-amber-400 font-mono`}>{streak}</span>
      <span className={`${fontSize} text-amber-400/70`}>天</span>
    </motion.div>
  );
}
