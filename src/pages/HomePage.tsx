import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFullPlan, getTodayPlan } from '@/data/planGenerator';
import { useStudy } from '@/store/studyStore';
import { DayCard } from '@/components/plan/DayCard';
import { PhaseSection } from '@/components/plan/PhaseSection';
import { ConfettiEffect } from '@/components/celebration/ConfettiEffect';
import { DailyCompleteModal } from '@/components/celebration/DailyCompleteModal';
import { useStudyProgress, isTodayFullyComplete } from '@/hooks/useStudyProgress';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { getTodayStr, formatDisplayDate, getWeekdayName, daysBetween } from '@/utils/date';
import { PHASES, SUBJECTS, EXAM_DATE } from '@/utils/constants';
import type { PhaseId, SubjectId } from '@/types';
import { Timer, Zap, Target, Filter, CheckCircle2 } from 'lucide-react';
import { ProgressRing } from '@/components/progress/ProgressRing';

export function HomePage() {
  const { state, toggleTask } = useStudy();
  const isDesktop = useIsDesktop();
  const stats = useStudyProgress();
  const [activePhase, setActivePhase] = useState<PhaseId | 'all'>('all');
  const [activeSubject, setActiveSubject] = useState<SubjectId | 'all'>('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const prevTodayComplete = useRef(false);

  const plan = useMemo(() => getFullPlan(), []);
  const today = getTodayStr();

  const daysLeft = useMemo(() => {
    const remaining = daysBetween(today, EXAM_DATE);
    return remaining > 0 ? remaining : 0;
  }, [today]);

  const todayPlan = useMemo(() => getTodayPlan(), []);
  const completedIds = state.completionMap[today] ?? [];
  const todayCompleted = completedIds.length;
  const todayTotal = todayPlan.tasks.length;
  const todayAllDone = todayTotal > 0 && todayPlan.tasks.every((t) => completedIds.includes(t.id));
  const todayTotalMinutes = todayPlan.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const todayProgress = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  const overallProgress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  // 检测今日全部完成
  useEffect(() => {
    const complete = isTodayFullyComplete();
    if (complete && !prevTodayComplete.current) {
      setShowConfetti(true);
      setTimeout(() => setShowCelebration(true), 500);
    }
    prevTodayComplete.current = complete;
  }, [state.completionMap]);

  // 按阶段+科目筛选
  const filteredPlan = useMemo(() => {
    let result = plan;
    if (activePhase !== 'all') result = result.filter((d) => d.phaseId === activePhase);
    if (activeSubject !== 'all') result = result.filter((d) => d.tasks.some((t) => t.subjectId === activeSubject));
    return result;
  }, [plan, activePhase, activeSubject]);

  const phaseGroups = useMemo(() => {
    const groups: Record<string, { days: typeof plan; completed: number; total: number }> = {};
    for (const phase of PHASES) {
      const phaseDays = filteredPlan.filter((d) => d.phaseId === phase.id && !d.isRestDay);
      let completed = 0;
      for (const d of phaseDays) {
        const done = state.completionMap[d.date] ?? [];
        if (d.tasks.length > 0 && d.tasks.every((t) => done.includes(t.id))) completed++;
      }
      groups[phase.id] = { days: filteredPlan.filter((d) => d.phaseId === phase.id), completed, total: phaseDays.length };
    }
    return groups;
  }, [filteredPlan, state.completionMap]);

  const handleCloseCelebration = useCallback(() => setShowCelebration(false), []);

  return (
    <div className="animate-fade-in">
      <ConfettiEffect fire={showConfetti} onComplete={() => setShowConfetti(false)} />
      <DailyCompleteModal
        isOpen={showCelebration}
        onClose={handleCloseCelebration}
        completedTasks={todayTotal}
        totalMinutes={todayTotalMinutes}
      />

      {/* ========== 今日Hero卡片 ========== */}
      {activePhase === 'all' && activeSubject === 'all' && (
        <motion.div
          className="mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero标题区 */}
          <div className="mb-4 sm:mb-5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <Zap size={12} className="text-amber-400" />
              </div>
              <span className="text-xs font-semibold text-amber-400 tracking-widest uppercase">Today's Mission</span>
              {todayAllDone && (
                <motion.span
                  className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium flex items-center gap-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <CheckCircle2 size={10} /> 已完成
                </motion.span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              {formatDisplayDate(today)}
              <span className="text-slate-500 font-medium text-lg sm:text-xl ml-2">
                {getWeekdayName(new Date(today + 'T00:00:00').getDay())}
              </span>
            </h2>
            {todayPlan.isRestDay && (
              <p className="text-sm text-indigo-400/80 mt-1">休息日 · 劳逸结合，恢复精力</p>
            )}
          </div>

          {/* Hero卡片：今日待办 */}
          <div className={`card-hero ${todayAllDone ? 'animate-glow-pulse' : ''}`}>
            <div className="relative z-10 p-4 sm:p-6">
              {/* 顶部信息栏 */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* 进度环 */}
                  <div className="relative">
                    {/* 背景光晕 */}
                    {!todayAllDone && todayTotal > 0 && (
                      <div
                        className="absolute inset-0 rounded-full opacity-20 blur-xl"
                        style={{ background: 'var(--gradient-hero)' }}
                      />
                    )}
                    <ProgressRing
                      progress={todayPlan.isRestDay ? 100 : todayProgress}
                      size={isDesktop ? 64 : 52}
                      strokeWidth={4}
                      color={todayAllDone ? '#22C55E' : '#F59E0B'}
                      bgColor="rgba(255,255,255,0.06)"
                    >
                      <span className="text-sm sm:text-base font-bold text-slate-100 font-mono">
                        {todayPlan.isRestDay ? '💤' : `${todayProgress}%`}
                      </span>
                    </ProgressRing>
                  </div>

                  {/* 统计数字 */}
                  <div className="flex gap-4 sm:gap-6">
                    <div>
                      <div className="text-lg sm:text-2xl font-bold text-slate-100 font-mono">
                        {todayCompleted}<span className="text-slate-600 text-sm">/{todayTotal}</span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500">今日任务</div>
                    </div>
                    <div>
                      <div className="text-lg sm:text-2xl font-bold text-slate-100 font-mono">
                        {Math.floor(todayTotalMinutes / 60)}<span className="text-slate-600 text-sm">h</span>
                        {todayTotalMinutes % 60 > 0 && (
                          <span className="text-slate-600 text-sm"> {todayTotalMinutes % 60}m</span>
                        )}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500">预计时长</div>
                    </div>
                    <div>
                      <div className="text-lg sm:text-2xl font-bold text-amber-400 font-mono">{daysLeft}</div>
                      <div className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                        <Timer size={10} /> 剩余天数
                      </div>
                    </div>
                  </div>
                </div>

                {/* 总进度（桌面端） */}
                {isDesktop && (
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <ProgressRing progress={overallProgress} size={36} strokeWidth={3} color="#22C55E">
                      <span className="text-[10px] font-bold text-slate-300 font-mono">{overallProgress}%</span>
                    </ProgressRing>
                    <div className="text-xs">
                      <div className="text-slate-300 font-medium">总进度</div>
                      <div className="text-slate-500">{stats.completedTasks}/{stats.totalTasks}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 任务列表 */}
              {todayPlan.isRestDay ? (
                <div className="py-8 text-center">
                  <motion.div
                    className="text-5xl mb-3"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🌴
                  </motion.div>
                  <p className="text-slate-400 text-sm">{todayPlan.note}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {todayPlan.tasks.map((task, idx) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.4 }}
                    >
                      <HeroTaskItem
                        task={task}
                        completed={completedIds.includes(task.id)}
                        onToggle={() => toggleTask(today, task.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 移动端总进度条 */}
          {!isDesktop && (
            <div className="mt-3 px-1">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1"><Target size={10} /> 总进度</span>
                <span className="font-mono">{overallProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'var(--gradient-hero)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ========== 筛选栏 ========== */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActivePhase('all')}
          className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
            activePhase === 'all'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/25'
              : 'bg-white/[0.04] text-slate-400 border border-white/[0.08] hover:border-white/[0.15] hover:text-slate-300'
          }`}
        >
          全部
        </button>
        {PHASES.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 border ${
              activePhase === phase.id
                ? 'border-current shadow-lg'
                : 'border-white/[0.08] text-slate-500 hover:border-white/[0.15] hover:text-slate-400'
            }`}
            style={activePhase === phase.id
              ? { backgroundColor: `${phase.color}18`, color: phase.color, boxShadow: `0 0 16px ${phase.color}20` }
              : {}
            }
          >
            {phase.name}
          </button>
        ))}

        {isDesktop && (
          <>
            <div className="w-px h-5 bg-white/[0.08] mx-1" />
            <button
              onClick={() => setActiveSubject('all')}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 border ${
                activeSubject === 'all'
                  ? 'bg-white/[0.08] text-slate-200 border-white/[0.2]'
                  : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12]'
              }`}
            >
              全部科目
            </button>
            {SUBJECTS.map((subj) => (
              <button
                key={subj.id}
                onClick={() => setActiveSubject(activeSubject === subj.id ? 'all' : subj.id)}
                className={`text-xs px-2.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 border ${
                  activeSubject === subj.id ? 'border-current' : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12]'
                }`}
                style={activeSubject === subj.id
                  ? { backgroundColor: `${subj.color}15`, color: subj.color }
                  : {}
                }
              >
                {subj.icon} {subj.name}
              </button>
            ))}
          </>
        )}

        {!isDesktop && (
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 border flex items-center gap-1 ${
              showMobileFilter
                ? 'bg-white/[0.08] text-slate-200 border-white/[0.2]'
                : 'border-white/[0.08] text-slate-500'
            }`}
          >
            <Filter size={10} />
            筛选
          </button>
        )}
      </div>

      {/* 移动端科目筛选 */}
      <AnimatePresence>
        {showMobileFilter && !isDesktop && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="flex flex-wrap gap-1.5 pb-2">
              {SUBJECTS.map((subj) => (
                <button
                  key={subj.id}
                  onClick={() => { setActiveSubject(subj.id); setShowMobileFilter(false); }}
                  className="text-[11px] px-2.5 py-1.5 rounded-full font-semibold border transition-all"
                  style={activeSubject === subj.id
                    ? { backgroundColor: `${subj.color}15`, color: subj.color, borderColor: subj.color }
                    : { borderColor: 'rgba(255,255,255,0.08)', color: '#94A3B8' }
                  }
                >
                  {subj.icon} {subj.shortName}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== 阶段分组列表 ========== */}
      {PHASES.map((phase) => {
        const group = phaseGroups[phase.id];
        if (!group || group.days.length === 0) return null;
        return (
          <div key={phase.id} className="mb-8">
            <PhaseSection
              phaseId={phase.id}
              startDate={phase.startDate}
              endDate={phase.endDate}
              completedDays={group.completed}
              totalDays={group.total}
            />
            <div className={isDesktop ? 'grid grid-cols-2 xl:grid-cols-3 gap-3' : 'space-y-2.5'}>
              {group.days.map((day) => (
                <DayCard key={day.date} day={day} isToday={day.date === today} />
              ))}
            </div>
          </div>
        );
      })}

      {filteredPlan.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-medium">没有匹配的学习计划</p>
          <p className="text-sm mt-1 text-slate-600">请调整筛选条件</p>
        </div>
      )}

      {/* 底部留白 */}
      <div className="h-8" />
    </div>
  );
}

// ====== Hero任务项 ======
import type { Task } from '@/types';
import { SUBJECT_BY_ID } from '@/utils/constants';
import { Checkbox } from '@/components/ui/Checkbox';
import { Clock, BookOpen, Video, Edit3, RotateCcw, Brain, FileText } from 'lucide-react';

const typeIcons: Record<string, typeof BookOpen> = {
  textbook: BookOpen, 'video-lecture': Video, exercise: Edit3,
  review: RotateCcw, memorize: Brain, 'mock-exam': FileText,
};
const typeLabels: Record<string, string> = {
  textbook: '教材', 'video-lecture': '视频', exercise: '练习',
  review: '复习', memorize: '背诵', 'mock-exam': '模考',
};

function HeroTaskItem({ task, completed, onToggle }: { task: Task; completed: boolean; onToggle: () => void }) {
  const subject = SUBJECT_BY_ID[task.subjectId];
  const Icon = typeIcons[task.taskType] ?? BookOpen;
  const hours = Math.floor(task.estimatedMinutes / 60);
  const mins = task.estimatedMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;

  return (
    <motion.div
      className={`flex items-center gap-3 py-3 px-3 rounded-xl transition-all duration-300 ${
        completed ? 'bg-white/[0.02]' : 'bg-white/[0.03] hover:bg-white/[0.05]'
      }`}
      whileHover={{ x: 4 }}
    >
      <Checkbox checked={completed} onChange={onToggle} color={subject?.color} size={22} />
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <motion.span
          className={`text-sm font-medium truncate transition-all duration-300 ${
            completed ? 'line-through text-slate-600' : 'text-slate-200'
          }`}
        >
          {task.title}
        </motion.span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium"
          style={{ backgroundColor: `${subject?.color}15`, color: subject?.color }}
        >
          <Icon size={10} />
          {typeLabels[task.taskType]}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
          <Clock size={10} />
          {timeStr}
        </span>
      </div>
    </motion.div>
  );
}
