import { useMemo } from 'react';
import type { StudyStats, SubjectId, PhaseId } from '@/types';
import { getFullPlan } from '@/data/planGenerator';
import { loadState } from '@/utils/storage';
import { getTodayStr } from '@/utils/date';

export function useStudyProgress(): StudyStats {
  const plan = useMemo(() => getFullPlan(), []);
  const state = useMemo(() => loadState(), []);

  return useMemo(() => {
    const initialBySubject: Record<string, { total: number; completed: number }> = {};
    const initialByPhase: Record<string, { total: number; completed: number }> = {};

    let totalTasks = 0;
    let completedTasks = 0;
    let completedDays = 0;

    for (const day of plan) {
      if (day.isRestDay) continue;

      const dayCompleted = day.tasks.map((t) => t.id);
      const done = state.completionMap[day.date] ?? [];
      const allDone = day.tasks.length > 0 && day.tasks.every((t) => done.includes(t.id));

      if (allDone) completedDays++;

      for (const task of day.tasks) {
        totalTasks++;
        if (done.includes(task.id)) completedTasks++;

        if (!initialBySubject[task.subjectId]) {
          initialBySubject[task.subjectId] = { total: 0, completed: 0 };
        }
        initialBySubject[task.subjectId].total++;
        if (done.includes(task.id)) {
          initialBySubject[task.subjectId].completed++;
        }

        if (!initialByPhase[day.phaseId]) {
          initialByPhase[day.phaseId] = { total: 0, completed: 0 };
        }
        initialByPhase[day.phaseId].total++;
        if (done.includes(task.id)) {
          initialByPhase[day.phaseId].completed++;
        }
      }
    }

    // 计算连续打卡
    const today = getTodayStr();
    let streak = 0;
    let checkDate = today;
    while (true) {
      const dayPlan = plan.find((d) => d.date === checkDate);
      if (!dayPlan) break;
      if (dayPlan.isRestDay) {
        checkDate = new Date(new Date(checkDate + 'T00:00:00').getTime() - 86400000).toISOString().slice(0, 10);
        continue;
      }
      const done = state.completionMap[checkDate] ?? [];
      if (dayPlan.tasks.length > 0 && dayPlan.tasks.every((t) => done.includes(t.id))) {
        streak++;
        checkDate = new Date(new Date(checkDate + 'T00:00:00').getTime() - 86400000).toISOString().slice(0, 10);
      } else {
        break;
      }
    }

    return {
      totalDays: plan.filter((d) => !d.isRestDay).length,
      completedDays,
      totalTasks,
      completedTasks,
      bySubject: initialBySubject as Record<SubjectId, { total: number; completed: number }>,
      byPhase: initialByPhase as Record<PhaseId, { total: number; completed: number }>,
      currentStreak: streak,
      bestStreak: Math.max(state.streak, streak),
    };
  }, [plan, state]);
}

export function getTodayCompletionRatio(): number {
  const plan = getFullPlan();
  const today = getTodayStr();
  const state = loadState();

  const dayPlan = plan.find((d) => d.date === today);
  if (!dayPlan || dayPlan.isRestDay || dayPlan.tasks.length === 0) return 1;

  const done = state.completionMap[today] ?? [];
  return done.length / dayPlan.tasks.length;
}

export function isTodayFullyComplete(): boolean {
  const plan = getFullPlan();
  const today = getTodayStr();
  const state = loadState();

  const dayPlan = plan.find((d) => d.date === today);
  if (!dayPlan || dayPlan.isRestDay) return false;
  if (dayPlan.tasks.length === 0) return false;

  const done = state.completionMap[today] ?? [];
  return dayPlan.tasks.every((t) => done.includes(t.id));
}
