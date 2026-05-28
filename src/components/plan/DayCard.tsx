import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DayPlan } from '@/types';
import { TaskItem } from './TaskItem';
import { useStudy } from '@/store/studyStore';
import { formatDisplayDate, getWeekdayName } from '@/utils/date';
import { getMilestonesForDate } from '@/data/milestones';

interface DayCardProps { day: DayPlan; isToday: boolean }

export function DayCard({ day, isToday }: DayCardProps) {
  const { state, toggleTask } = useStudy();
  const [open, setOpen] = useState(isToday);
  const [hovered, setHovered] = useState(false);
  const doneIds = state.completionMap[day.date] ?? [];
  const allDone = day.tasks.length > 0 && day.tasks.every((t) => doneIds.includes(t.id));
  const doneN = day.tasks.filter((t) => doneIds.includes(t.id)).length;
  const milestones = useMemo(() => getMilestonesForDate(day.date), [day.date]);
  const hasMock = milestones.some((m) => m.type === 'mock-exam');

  return (
    <motion.div
      className={`${isToday ? 'card-today' : 'card'} overflow-hidden`}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.15 }}
    >
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left group"
      >
        <span className="text-[13px] font-medium text-text-primary">
          {formatDisplayDate(day.date)}
        </span>
        <span className="text-[12px] text-text-tertiary">{getWeekdayName(day.dayOfWeek)}</span>
        {isToday && (
          <span className="text-[10px] font-semibold text-text-primary bg-bg-hover px-1.5 py-0.5 rounded">
            Today
          </span>
        )}
        {hasMock && <span className="text-[10px] text-text-tertiary">Mock</span>}
        <span className="flex-1" />
        {day.isRestDay ? (
          <span className="text-[11px] text-text-tertiary">Rest</span>
        ) : (
          <motion.span
            className={`text-[11px] font-mono tabular-nums ${allDone ? 'text-[#30a46c]' : 'text-text-tertiary'}`}
            animate={{ opacity: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.15 }}
          >
            {doneN}/{day.tasks.length}
          </motion.span>
        )}
        <motion.span
          animate={{ rotate: open ? 180 : 0, opacity: hovered ? 1 : 0.55 }}
          transition={{ duration: 0.15 }}
          className="text-text-tertiary text-[10px] w-4 text-center"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 border-t border-border-primary">
              {day.isRestDay ? (
                <div className="py-6 text-center text-[13px] text-text-tertiary">{day.note}</div>
              ) : (
                <div className="pt-2 space-y-0.5">
                  {day.tasks.map((task, i) => (
                    <TaskItem key={task.id} task={task} completed={doneIds.includes(task.id)} onToggle={() => toggleTask(day.date, task.id)} index={i} />
                  ))}
                  {day.note && <p className="text-[11px] text-text-tertiary mt-2 pt-2 border-t border-border-primary">{day.note}</p>}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
