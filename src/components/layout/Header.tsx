import { useStudy } from '@/store/studyStore';
import { getTodayStr, formatDisplayDate, getWeekdayName, daysBetween } from '@/utils/date';
import { ProgressRing } from '@/components/progress/ProgressRing';
import { StreakBadge } from '@/components/progress/StreakBadge';
import { useStudyProgress } from '@/hooks/useStudyProgress';
import { Moon, Sun, Timer } from 'lucide-react';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useMemo } from 'react';
import { EXAM_DATE } from '@/utils/constants';

export function Header() {
  const { state, setTheme } = useStudy();
  const stats = useStudyProgress();
  const isDesktop = useIsDesktop();
  const today = getTodayStr();

  const daysLeft = useMemo(() => {
    const remaining = daysBetween(today, EXAM_DATE);
    return remaining > 0 ? remaining : 0;
  }, [today]);

  const overallProgress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <header className="sticky top-0 z-50">
      {/* 玻璃拟态背景 */}
      <div className="absolute inset-0 glass-strong border-b border-white/[0.06]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：品牌 + 日期 */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Logo */}
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-xl">📚</span>
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                考研
                <span className="text-gradient ml-1.5">408</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {formatDisplayDate(today)} · {getWeekdayName(new Date(today + 'T00:00:00').getDay())}
              </p>
            </div>

            {/* 桌面端：倒计时 */}
            {isDesktop && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/[0.08]">
                <Timer size={14} className="text-amber-400" />
                <span className="text-xs text-slate-400">
                  距考研还有 <span className="text-amber-400 font-bold text-sm">{daysLeft}</span> 天
                </span>
              </div>
            )}
          </div>

          {/* 右侧：统计 + 操作 */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* 移动端倒计时 */}
            {!isDesktop && (
              <span className="text-[10px] text-slate-500 font-mono bg-white/[0.04] px-2 py-1 rounded-lg border border-white/[0.06]">
                {daysLeft}天
              </span>
            )}

            <StreakBadge streak={stats.currentStreak} size="sm" />

            {isDesktop && (
              <div className="flex items-center gap-2 pl-3 border-l border-white/[0.08]">
                <ProgressRing progress={overallProgress} size={34} strokeWidth={3} color="#F59E0B">
                  <span className="text-[10px] font-bold text-slate-300 font-mono">{overallProgress}%</span>
                </ProgressRing>
              </div>
            )}

            {/* 主题切换 */}
            <button
              onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl hover:bg-white/[0.06] transition-all duration-300 active:scale-90"
              aria-label="切换主题"
            >
              {state.theme === 'dark'
                ? <Sun size={17} className="text-slate-400" />
                : <Moon size={17} className="text-slate-600" />
              }
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
