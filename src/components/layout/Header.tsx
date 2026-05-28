import { motion } from 'framer-motion';
import { Sun, Moon, GraduationCap } from 'lucide-react';
import { useStudy } from '@/store/studyStore';
import { getTodayStr, formatDisplayDate, daysBetween } from '@/utils/date';
import { StreakBadge } from '@/components/progress/StreakBadge';
import { useStudyProgress } from '@/hooks/useStudyProgress';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useMemo } from 'react';
import { EXAM_DATE } from '@/utils/constants';

export function Header() {
  const { state, setTheme } = useStudy();
  const stats = useStudyProgress();
  const isDesktop = useIsDesktop();
  const today = getTodayStr();

  const daysLeft = useMemo(() => Math.max(daysBetween(today, EXAM_DATE), 0), [today]);
  const totalPct = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border-primary">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-text-primary" strokeWidth={1.5} />
            <span className="text-[15px] font-semibold text-text-primary tracking-tight">408 Study Plan</span>
          </div>
          {isDesktop && (
            <div className="flex items-center gap-4 text-[12px] text-text-tertiary font-mono">
              <span>{formatDisplayDate(today)}</span>
              <span className="text-border-secondary">/</span>
              <span>{daysLeft}d left</span>
              <span className="text-border-secondary">/</span>
              <span>{totalPct}%</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <StreakBadge streak={stats.currentStreak} size="sm" />
          <motion.button
            onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 flex items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors"
            aria-label={state.theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {state.theme === 'dark' ? <Sun size={17} strokeWidth={1.5} /> : <Moon size={17} strokeWidth={1.5} />}
          </motion.button>
        </div>
      </div>

      {!isDesktop && (
        <div className="border-t border-border-primary px-5 h-9 flex items-center gap-4 text-[12px] text-text-tertiary font-mono">
          <span>{formatDisplayDate(today)}</span>
          <span>{daysLeft}d left</span>
          <span>{totalPct}%</span>
        </div>
      )}
    </header>
  );
}
