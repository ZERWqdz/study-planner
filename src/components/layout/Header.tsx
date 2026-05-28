import { useStudy } from '@/store/studyStore';
import { getTodayStr, formatDisplayDate, getWeekdayName } from '@/utils/date';
import { ProgressRing } from '@/components/progress/ProgressRing';
import { StreakBadge } from '@/components/progress/StreakBadge';
import { SubjectStats } from '@/components/progress/SubjectStats';
import { useStudyProgress } from '@/hooks/useStudyProgress';
import { Moon, Sun, Gift } from 'lucide-react';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { getFullPlan } from '@/data/planGenerator';
import { useMemo } from 'react';

export function Header() {
  const { state, setTheme } = useStudy();
  const stats = useStudyProgress();
  const isDesktop = useIsDesktop();
  const today = getTodayStr();

  const todayPlan = useMemo(() => {
    const plan = getFullPlan();
    return plan.find((d) => d.date === today);
  }, [today]);

  const todayCompleted = todayPlan ? (state.completionMap[today] ?? []).length : 0;
  const todayTotal = todayPlan?.tasks.length ?? 0;
  const todayProgress = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;
  const overallProgress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 左侧：日期和进度 */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              📚 考研408
              {isDesktop && <span className="text-sm font-normal text-slate-500">学习规划</span>}
            </h1>
            <p className="text-xs text-slate-500">
              {formatDisplayDate(today)} {getWeekdayName(new Date(today + 'T00:00:00').getDay())}
            </p>
          </div>

          {isDesktop && (
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
              <ProgressRing progress={todayProgress} size={36} strokeWidth={3}>
                <span className="text-[10px] font-mono font-bold text-slate-300">{todayProgress}%</span>
              </ProgressRing>
              <div className="text-xs">
                <div className="text-slate-300 font-medium">今日进度</div>
                <div className="text-slate-500">{todayCompleted}/{todayTotal} 项</div>
              </div>
            </div>
          )}
        </div>

        {/* 右侧：统计和操作 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {todayPlan?.isRestDay && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              <Gift size={12} />
              休息日
            </span>
          )}

          <StreakBadge streak={stats.currentStreak} size="sm" />

          {isDesktop && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <ProgressRing progress={overallProgress} size={36} strokeWidth={3} color="#22C55E">
                <span className="text-[10px] font-mono font-bold text-slate-300">{overallProgress}%</span>
              </ProgressRing>
              <span className="text-xs text-slate-500">总进度</span>
            </div>
          )}

          <button
            onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="切换主题"
          >
            {state.theme === 'dark' ? <Sun size={18} className="text-slate-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>
        </div>
      </div>

      {/* 移动端今日进度条 */}
      {!isDesktop && todayPlan && !todayPlan.isRestDay && (
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>今日进度</span>
            <span>{todayProgress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${todayProgress}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
