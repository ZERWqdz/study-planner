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
import { getTodayStr } from '@/utils/date';
import { PHASES, SUBJECTS } from '@/utils/constants';
import type { PhaseId, SubjectId } from '@/types';
import { BookOpen, Filter } from 'lucide-react';

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

  // 检测今日全部完成
  useEffect(() => {
    const complete = isTodayFullyComplete();
    if (complete && !prevTodayComplete.current) {
      setShowConfetti(true);
      setTimeout(() => setShowCelebration(true), 500);
    }
    prevTodayComplete.current = complete;
  }, [state.completionMap]);

  // 按阶段筛选
  const filteredPlan = useMemo(() => {
    let result = plan;
    if (activePhase !== 'all') {
      result = result.filter((d) => d.phaseId === activePhase);
    }
    if (activeSubject !== 'all') {
      result = result.filter((d) => d.tasks.some((t) => t.subjectId === activeSubject));
    }
    return result;
  }, [plan, activePhase, activeSubject]);

  // 阶段分组
  const phaseGroups = useMemo(() => {
    const groups: Record<string, { days: typeof plan; completed: number; total: number }> = {};
    for (const phase of PHASES) {
      const phaseDays = filteredPlan.filter(
        (d) => d.phaseId === phase.id && !d.isRestDay,
      );
      let completed = 0;
      for (const d of phaseDays) {
        const done = state.completionMap[d.date] ?? [];
        if (d.tasks.length > 0 && d.tasks.every((t) => done.includes(t.id))) {
          completed++;
        }
      }
      groups[phase.id] = { days: filteredPlan.filter((d) => d.phaseId === phase.id), completed, total: phaseDays.length };
    }
    return groups;
  }, [filteredPlan, state.completionMap]);

  const todayPlan = useMemo(() => getTodayPlan(), []);
  const todayCompleted = (state.completionMap[today] ?? []).length;
  const todayTotal = todayPlan.tasks.length;
  const todayTotalMinutes = todayPlan.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  const handleCloseCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return (
    <div>
      <ConfettiEffect fire={showConfetti} onComplete={() => setShowConfetti(false)} />
      <DailyCompleteModal
        isOpen={showCelebration}
        onClose={handleCloseCelebration}
        completedTasks={todayTotal}
        totalMinutes={todayTotalMinutes}
      />

      {/* 阶段筛选标签 */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActivePhase('all')}
          className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
            activePhase === 'all'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
          }`}
        >
          全部阶段
        </button>
        {PHASES.map((phase) => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors border ${
              activePhase === phase.id
                ? 'border-current'
                : 'border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
            style={activePhase === phase.id ? { backgroundColor: `${phase.color}20`, color: phase.color } : {}}
          >
            {phase.name}
          </button>
        ))}

        {/* 科目筛选（桌面端） */}
        {isDesktop && (
          <>
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <button
              onClick={() => setActiveSubject('all')}
              className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap transition-colors border flex items-center gap-1 ${
                activeSubject === 'all'
                  ? 'bg-slate-600/30 text-slate-200 border-slate-500'
                  : 'border-slate-700 text-slate-500 hover:border-slate-600'
              }`}
            >
              <BookOpen size={10} />
              全部科目
            </button>
            {SUBJECTS.map((subj) => (
              <button
                key={subj.id}
                onClick={() => setActiveSubject(activeSubject === subj.id ? 'all' : subj.id)}
                className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap transition-colors border ${
                  activeSubject === subj.id ? 'border-current' : 'border-slate-700 text-slate-500 hover:border-slate-600'
                }`}
                style={activeSubject === subj.id ? { backgroundColor: `${subj.color}20`, color: subj.color } : {}}
              >
                {subj.icon} {subj.name}
              </button>
            ))}
          </>
        )}

        {/* 移动端筛选按钮 */}
        {!isDesktop && (
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors border flex items-center gap-1 ${
              showMobileFilter
                ? 'bg-slate-600/30 text-slate-200 border-slate-500'
                : 'border-slate-700 text-slate-500'
            }`}
          >
            <Filter size={10} />
            科目筛选
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
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => { setActiveSubject('all'); setShowMobileFilter(false); }}
                className={`text-xs px-2 py-1 rounded-full font-medium border ${
                  activeSubject === 'all' ? 'bg-slate-600/30 text-slate-200 border-slate-500' : 'border-slate-700 text-slate-500'
                }`}
              >
                全部
              </button>
              {SUBJECTS.map((subj) => (
                <button
                  key={subj.id}
                  onClick={() => { setActiveSubject(subj.id); setShowMobileFilter(false); }}
                  className="text-xs px-2 py-1 rounded-full font-medium border"
                  style={
                    activeSubject === subj.id
                      ? { backgroundColor: `${subj.color}20`, color: subj.color, borderColor: subj.color }
                      : { borderColor: '#334155', color: '#94A3B8' }
                  }
                >
                  {subj.icon} {subj.shortName}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 今日卡片 */}
      {activePhase === 'all' && activeSubject === 'all' && (
        <div className="mb-6">
          <DayCard day={todayPlan} isToday={true} />
        </div>
      )}

      {/* 按阶段分组的计划列表 */}
      {PHASES.map((phase) => {
        const group = phaseGroups[phase.id];
        if (!group || group.days.length === 0) return null;
        return (
          <div key={phase.id} className="mb-6">
            <PhaseSection
              phaseId={phase.id}
              startDate={phase.startDate}
              endDate={phase.endDate}
              completedDays={group.completed}
              totalDays={group.total}
            />
            <div className={isDesktop ? 'grid grid-cols-2 xl:grid-cols-3 gap-3' : 'space-y-2'}>
              {group.days.map((day) => (
                <DayCard key={day.date} day={day} isToday={day.date === today} />
              ))}
            </div>
          </div>
        );
      })}

      {/* 空结果 */}
      {filteredPlan.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">没有匹配的学习计划</p>
          <p className="text-sm mt-1">请调整筛选条件</p>
        </div>
      )}
    </div>
  );
}
