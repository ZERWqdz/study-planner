import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DayPlan } from '@/types';
import { TaskItem } from './TaskItem';
import { useStudy } from '@/store/studyStore';
import { formatDisplayDate, getWeekdayName } from '@/utils/date';
import { PHASES } from '@/utils/constants';
import { getMilestonesForDate } from '@/data/milestones';
import { ChevronDown, Trophy, Sparkles } from 'lucide-react';

interface DayCardProps {
  day: DayPlan;
  isToday: boolean;
}

export function DayCard({ day, isToday }: DayCardProps) {
  const { state, toggleTask } = useStudy();
  const [expanded, setExpanded] = useState(isToday);
  const completedIds = state.completionMap[day.date] ?? [];

  const allComplete = day.tasks.length > 0 && day.tasks.every((t) => completedIds.includes(t.id));
  const completedCount = day.tasks.filter((t) => completedIds.includes(t.id)).length;
  const progressPct = day.tasks.length > 0 ? Math.round((completedCount / day.tasks.length) * 100) : 0;
  const phase = PHASES.find((p) => p.id === day.phaseId);
  const milestones = useMemo(() => getMilestonesForDate(day.date), [day.date]);
  const hasMockExam = milestones.some((m) => m.type === 'mock-exam');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card overflow-hidden ${isToday ? 'ring-2 ring-amber-500/50' : ''} ${
        allComplete ? 'animate-glow' : ''
      }`}
    >
      {/* 顶部状态条 */}
      <div
        className="h-1 rounded-t-2xl transition-all duration-500"
        style={{
          backgroundColor: allComplete ? '#22C55E' : phase?.color ?? '#475569',
          width: day.isRestDay ? '100%' : `${Math.max(progressPct, 5)}%`,
        }}
      />

      {/* 头部 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100">
                {formatDisplayDate(day.date)}
              </span>
              <span className="text-xs text-slate-500">{getWeekdayName(day.dayOfWeek)}</span>
              {isToday && (
                <span className="text-[10px] px-1.5 py-px rounded-full bg-amber-500/20 text-amber-400 font-medium">
                  今天
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {allComplete && <Trophy size={14} className="text-amber-400" />}
          {hasMockExam && <Sparkles size={14} className="text-blue-400" />}
          {!day.isRestDay && day.tasks.length > 0 && (
            <span
              className="text-xs font-mono font-medium"
              style={{ color: allComplete ? '#22C55E' : '#94A3B8' }}
            >
              {completedCount}/{day.tasks.length}
            </span>
          )}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={16} className="text-slate-500" />
          </motion.div>
        </div>
      </button>

      {/* 展开内容 */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-0.5">
              {day.isRestDay ? (
                <div className="py-6 text-center">
                  <div className="text-4xl mb-2">🌴</div>
                  <p className="text-sm text-slate-400">{day.note}</p>
                </div>
              ) : (
                <>
                  {/* 标签 */}
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    {phase && (
                      <span
                        className="text-[10px] px-2 py-px rounded-full font-medium"
                        style={{ backgroundColor: `${phase.color}20`, color: phase.color }}
                      >
                        {phase.name}
                      </span>
                    )}
                    {hasMockExam && (
                      <span className="text-[10px] px-2 py-px rounded-full bg-blue-500/20 text-blue-400 font-medium">
                        模拟考试
                      </span>
                    )}
                  </div>

                  {/* 任务列表 */}
                  {day.tasks.map((task, idx) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      completed={completedIds.includes(task.id)}
                      onToggle={() => toggleTask(day.date, task.id)}
                      index={idx}
                    />
                  ))}

                  {/* 备注 */}
                  {day.note && (
                    <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-800">
                      {day.note}
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
