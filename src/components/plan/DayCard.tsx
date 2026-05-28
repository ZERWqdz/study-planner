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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`card overflow-hidden group ${
        isToday ? 'ring-1 ring-amber-500/40 shadow-lg shadow-amber-500/5' : ''
      } ${allComplete ? 'ring-1 ring-green-500/30' : ''}`}
    >
      {/* 顶部进度条 */}
      {!day.isRestDay && (
        <div className="h-0.5 bg-white/[0.04]">
          <motion.div
            className="h-full"
            style={{
              background: allComplete
                ? 'linear-gradient(90deg, #22C55E, #10B981)'
                : `linear-gradient(90deg, ${phase?.color ?? '#475569'}, ${phase?.color ?? '#475569'}88)`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(progressPct, 3)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* 头部 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-2.5">
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">
                {formatDisplayDate(day.date)}
              </span>
              <span className="text-[11px] text-slate-600">{getWeekdayName(day.dayOfWeek)}</span>
              {isToday && (
                <span className="text-[10px] px-1.5 py-px rounded-md bg-amber-500/15 text-amber-400 font-semibold">
                  今天
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {allComplete && <Trophy size={13} className="text-amber-400" />}
          {hasMockExam && <Sparkles size={13} className="text-blue-400" />}
          {day.isRestDay ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-medium">休息</span>
          ) : (
            day.tasks.length > 0 && (
              <span
                className={`text-[11px] font-mono font-semibold ${
                  allComplete ? 'text-green-400' : 'text-slate-500'
                }`}
              >
                {completedCount}/{day.tasks.length}
              </span>
            )
          )}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={15} className="text-slate-600" />
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
            <div className="px-4 pb-3 pt-0.5 space-y-0.5">
              {day.isRestDay ? (
                <div className="py-6 text-center">
                  <div className="text-3xl mb-2">🌴</div>
                  <p className="text-sm text-slate-500">{day.note}</p>
                </div>
              ) : (
                <>
                  {/* 标签 */}
                  <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                    {phase && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-lg font-semibold"
                        style={{ backgroundColor: `${phase.color}12`, color: phase.color }}
                      >
                        {phase.name}
                      </span>
                    )}
                    {hasMockExam && (
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-blue-500/12 text-blue-400 font-semibold">
                        模拟考试
                      </span>
                    )}
                  </div>

                  {day.tasks.map((task, idx) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      completed={completedIds.includes(task.id)}
                      onToggle={() => toggleTask(day.date, task.id)}
                      index={idx}
                    />
                  ))}

                  {day.note && (
                    <p className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-white/[0.04] leading-relaxed">
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
