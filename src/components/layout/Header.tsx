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
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">408</span>
            <span className="text-sm font-medium text-text-secondary tracking-tight">study plan</span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-[13px] text-text-tertiary">
            <span>{formatDisplayDate(today)}</span>
            <span className="text-text-secondary">|</span>
            <span>{daysLeft} days left</span>
            <span className="text-text-secondary">|</span>
            <span>{totalPct}% complete</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StreakBadge streak={stats.currentStreak} size="sm" />
          <button
            onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-hover transition-colors text-[13px]"
            aria-label="Toggle theme"
          >
            {state.theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>

      {/* Mobile secondary bar */}
      {!isDesktop && (
        <div className="border-t border-border-primary px-5 h-9 flex items-center gap-4 text-[12px] text-text-tertiary">
          <span>{formatDisplayDate(today)}</span>
          <span>{daysLeft}d left</span>
          <span>{totalPct}% done</span>
        </div>
      )}
    </header>
  );
}
