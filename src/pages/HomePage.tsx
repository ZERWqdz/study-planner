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
import { Checkbox } from '@/components/ui/Checkbox';
import { SUBJECT_BY_ID } from '@/utils/constants';
import type { Task } from '@/types';

// -- Today's task line --
function TodayTask({ task, completed, onToggle }: { task: Task; completed: boolean; onToggle: () => void }) {
  const subj = SUBJECT_BY_ID[task.subjectId];
  const h = Math.floor(task.estimatedMinutes / 60);
  const m = task.estimatedMinutes % 60;
  const time = h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;

  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors ${
      completed ? 'opacity-40' : 'hover:bg-bg-hover cursor-pointer'
    }`} onClick={completed ? undefined : onToggle}>
      <Checkbox checked={completed} onChange={onToggle} color={subj?.color} size={18} />
      <span className={`flex-1 text-[14px] ${completed ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>
        {task.title}
      </span>
      <span className="text-[12px] text-text-tertiary font-mono">{time}</span>
    </div>
  );
}

// -- Home --
export function HomePage() {
  const { state, toggleTask } = useStudy();
  const isDesktop = useIsDesktop();
  const stats = useStudyProgress();
  const [activePhase, setActivePhase] = useState<PhaseId | 'all'>('all');
  const [activeSubject, setActiveSubject] = useState<SubjectId | 'all'>('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevTodayComplete = useRef(false);

  const plan = useMemo(() => getFullPlan(), []);
  const today = getTodayStr();
  const daysLeft = useMemo(() => Math.max(daysBetween(today, EXAM_DATE), 0), [today]);

  const todayPlan = useMemo(() => getTodayPlan(), []);
  const doneIds = state.completionMap[today] ?? [];
  const todayDoneN = doneIds.length;
  const todayTotal = todayPlan.tasks.length;
  const todayAllDone = todayTotal > 0 && todayPlan.tasks.every((t) => doneIds.includes(t.id));
  const todayMins = todayPlan.tasks.reduce((s, t) => s + t.estimatedMinutes, 0);
  const todayH = Math.floor(todayMins / 60);
  const todayM = todayMins % 60;
  const overallPct = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  useEffect(() => {
    const complete = isTodayFullyComplete();
    if (complete && !prevTodayComplete.current) {
      setShowConfetti(true);
      setTimeout(() => setShowCelebration(true), 500);
    }
    prevTodayComplete.current = complete;
  }, [state.completionMap]);

  const filteredPlan = useMemo(() => {
    let r = plan;
    if (activePhase !== 'all') r = r.filter((d) => d.phaseId === activePhase);
    if (activeSubject !== 'all') r = r.filter((d) => d.tasks.some((t) => t.subjectId === activeSubject));
    return r;
  }, [plan, activePhase, activeSubject]);

  const phaseGroups = useMemo(() => {
    const g: Record<string, { days: typeof plan; completed: number; total: number }> = {};
    for (const p of PHASES) {
      const days = filteredPlan.filter((d) => d.phaseId === p.id);
      const nonRest = days.filter((d) => !d.isRestDay);
      let c = 0;
      for (const d of nonRest) {
        const done = state.completionMap[d.date] ?? [];
        if (d.tasks.length > 0 && d.tasks.every((t) => done.includes(t.id))) c++;
      }
      g[p.id] = { days, completed: c, total: nonRest.length };
    }
    return g;
  }, [filteredPlan, state.completionMap]);

  const handleClose = useCallback(() => setShowCelebration(false), []);

  return (
    <div className="max-w-3xl mx-auto animate-in">
      <ConfettiEffect fire={showConfetti} onComplete={() => setShowConfetti(false)} />
      <DailyCompleteModal isOpen={showCelebration} onClose={handleClose} completedTasks={todayTotal} totalMinutes={todayMins} />

      {/* ========== Today ========== */}
      {activePhase === 'all' && activeSubject === 'all' && (
        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-1">Today</p>
              <h2 className="text-xl font-semibold text-text-primary tracking-tight">
                {formatDisplayDate(today)} <span className="text-text-tertiary font-normal">{getWeekdayName(new Date(today + 'T00:00:00').getDay())}</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="text-2xl font-semibold text-text-primary font-mono">{daysLeft}</span>
              <span className="text-[13px] text-text-tertiary ml-1">days left</span>
            </div>
          </div>

          {/* Today card */}
          <div className="card-today p-5">
            {todayPlan.isRestDay ? (
              <div className="py-6 text-center text-text-tertiary text-[14px]">{todayPlan.note}</div>
            ) : (
              <>
                {/* Stats row */}
                <div className="flex items-center gap-6 mb-4 text-[13px]">
                  <span className={`font-mono font-medium ${todayAllDone ? 'text-green' : 'text-accent'}`}>
                    {todayDoneN}/{todayTotal} tasks
                  </span>
                  <span className="text-text-tertiary font-mono">{todayH}h{todayM > 0 ? ` ${todayM}m` : ''} planned</span>
                  <span className="text-text-tertiary">{overallPct}% overall</span>
                </div>

                {/* Tasks */}
                <div className="border-t border-border-primary pt-3 space-y-0.5">
                  {todayPlan.tasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <TodayTask
                        task={task}
                        completed={doneIds.includes(task.id)}
                        onToggle={() => toggleTask(today, task.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========== Filter bar ========== */}
      <div className="flex items-center gap-1.5 mb-8 overflow-x-auto scrollbar-hide pb-0.5">
        <FilterPill active={activePhase === 'all'} onClick={() => setActivePhase('all')}>All</FilterPill>
        {PHASES.map((p) => (
          <FilterPill
            key={p.id}
            active={activePhase === p.id}
            onClick={() => setActivePhase(p.id)}
          >
            {p.id === 'foundation' ? 'Foundation' : p.id === 'reinforcement' ? 'Reinforce' : 'Sprint'}
          </FilterPill>
        ))}
        <span className="text-text-tertiary mx-2 text-[10px]">·</span>
        <FilterPill active={activeSubject === 'all'} onClick={() => setActiveSubject('all')}>All subjects</FilterPill>
        {SUBJECTS.slice(0, isDesktop ? 7 : 4).map((s) => (
          <FilterPill
            key={s.id}
            active={activeSubject === s.id}
            onClick={() => setActiveSubject(activeSubject === s.id ? 'all' : s.id)}
          >
            {s.shortName}
          </FilterPill>
        ))}
      </div>

      {/* ========== Phase sections ========== */}
      {PHASES.map((p) => {
        const g = phaseGroups[p.id];
        if (!g || g.days.length === 0) return null;
        return (
          <PhaseSection
            key={p.id}
            phaseId={p.id}
            startDate={p.startDate}
            endDate={p.endDate}
            completedDays={g.completed}
            totalDays={g.total}
          >
            <div className={isDesktop ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
              {g.days.map((day) => (
                <DayCard key={day.date} day={day} isToday={day.date === today} />
              ))}
            </div>
          </PhaseSection>
        );
      })}

      <div className="h-16" />
    </div>
  );
}

// -- Filter pill --
function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-[12px] px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-text-primary text-bg-primary'
          : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-hover'
      }`}
    >
      {children}
    </button>
  );
}
