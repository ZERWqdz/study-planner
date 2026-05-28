import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getDynamicPlan, getTodayPlan } from '@/data/planGenerator';
import { useStudy } from '@/store/studyStore';
import { DayCard } from '@/components/plan/DayCard';
import { PhaseSection } from '@/components/plan/PhaseSection';
import { ConfettiEffect } from '@/components/celebration/ConfettiEffect';
import { DailyCompleteModal } from '@/components/celebration/DailyCompleteModal';
import { useStudyProgress, isTodayFullyComplete } from '@/hooks/useStudyProgress';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { getTodayStr, formatDisplayDate, getWeekdayName, daysBetween } from '@/utils/date';
import { PHASES, SUBJECTS, EXAM_DATE } from '@/utils/constants';
import type { PhaseId, SubjectId, Task } from '@/types';
import { Checkbox } from '@/components/ui/Checkbox';
import { SUBJECT_BY_ID } from '@/utils/constants';

function TodayTask({ task, completed, onToggle }: { task: Task; completed: boolean; onToggle: () => void }) {
  const subj = SUBJECT_BY_ID[task.subjectId];
  const h = Math.floor(task.estimatedMinutes / 60);
  const m = task.estimatedMinutes % 60;
  const time = h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;

  return (
    <div
      className={`flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors ${
        completed ? 'opacity-55' : 'hover:bg-bg-hover cursor-pointer'
      }`}
      onClick={completed ? undefined : onToggle}
    >
      <Checkbox checked={completed} onChange={onToggle} color={subj?.color} size={18} />
      <span className={`flex-1 text-[14px] ${completed ? 'line-through text-text-tertiary' : task.carryOver ? 'text-accent-hover' : 'text-text-primary'}`}>
        {task.title}
      </span>
      <span className="text-[12px] text-text-tertiary font-mono">{time}</span>
    </div>
  );
}

export function HomePage() {
  const { state, toggleTask } = useStudy();
  const isDesktop = useIsDesktop();
  const stats = useStudyProgress();
  const [activePhase, setActivePhase] = useState<PhaseId | 'all'>('all');
  const [activeSubject, setActiveSubject] = useState<SubjectId | 'all'>('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevTodayComplete = useRef(false);

  const plan = useMemo(() => getDynamicPlan(state.completionMap), [state.completionMap]);
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
    <div className="max-w-5xl mx-auto animate-in">
      <ConfettiEffect fire={showConfetti} onComplete={() => setShowConfetti(false)} />
      <DailyCompleteModal isOpen={showCelebration} onClose={handleClose} completedTasks={todayTotal} totalMinutes={todayMins} />

      {/* Today */}
      {activePhase === 'all' && activeSubject === 'all' && (
        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h2 className="text-[22px] font-semibold text-text-primary tracking-tight">
                {formatDisplayDate(today)}
              </h2>
              <p className="text-[13px] text-text-tertiary mt-0.5">
                {getWeekdayName(new Date(today + 'T00:00:00').getDay())}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[28px] font-semibold text-text-primary font-mono tabular-nums">{daysLeft}</span>
              <span className="text-[13px] text-text-tertiary ml-2">days left</span>
            </div>
          </div>

          <div className="card-today p-5">
            {todayPlan.isRestDay ? (
              <div className="py-8 text-center text-text-tertiary text-[14px]">{todayPlan.note}</div>
            ) : (
              <>
                <div className="flex items-center gap-5 mb-3 text-[13px]">
                  <span className={`font-mono font-medium tabular-nums ${todayAllDone ? 'text-[#30a46c]' : 'text-text-primary'}`}>
                    {todayDoneN}/{todayTotal}
                  </span>
                  <span className="text-text-tertiary font-mono">
                    {todayH}h{todayM > 0 ? ` ${todayM}m` : ''}
                  </span>
                  <span className="text-text-tertiary">{overallPct}% done</span>
                </div>

                {/* Overall progress */}
                <div className="h-1.5 bg-border-primary rounded-full mb-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-text-primary rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: overallPct / 100 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>

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
        </section>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-1 mb-10 overflow-x-auto scrollbar-hide">
        <FilterPill active={activePhase === 'all'} onClick={() => setActivePhase('all')}>All</FilterPill>
        {PHASES.map((p) => (
          <FilterPill
            key={p.id}
            active={activePhase === p.id}
            onClick={() => setActivePhase(p.id)}
          >
            {p.name}
          </FilterPill>
        ))}
        <span className="w-px h-4 bg-border-primary mx-2 flex-shrink-0" />
        <FilterPill active={activeSubject === 'all'} onClick={() => setActiveSubject('all')}>All</FilterPill>
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

      {/* Phase list */}
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
            <div className={isDesktop ? 'grid grid-cols-3 gap-2' : 'space-y-1.5'}>
              {g.days.map((day) => (
                <DayCard key={day.date} day={day} isToday={day.date === today} />
              ))}
            </div>
          </PhaseSection>
        );
      })}

      <div className="h-20" />
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`text-[12px] px-2.5 py-1 rounded font-medium whitespace-nowrap transition-all duration-200 ${
        active
          ? 'bg-text-primary text-bg-primary'
          : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-hover'
      }`}
    >
      {children}
    </motion.button>
  );
}
