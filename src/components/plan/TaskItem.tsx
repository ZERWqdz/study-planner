import { motion } from 'framer-motion';
import type { Task } from '@/types';
import { SUBJECT_BY_ID } from '@/utils/constants';
import { Checkbox } from '@/components/ui/Checkbox';

const typeIcon: Record<string, string> = {
  textbook: 'B', 'video-lecture': 'V', exercise: 'E', review: 'R', memorize: 'M', 'mock-exam': 'T',
};

interface TaskItemProps { task: Task; completed: boolean; onToggle: () => void; index: number }

export function TaskItem({ task, completed, onToggle, index }: TaskItemProps) {
  const subj = SUBJECT_BY_ID[task.subjectId];
  const h = Math.floor(task.estimatedMinutes / 60);
  const m = task.estimatedMinutes % 60;
  const time = h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;

  return (
    <motion.div
      className={`flex items-center gap-3 py-2 px-2 rounded-md transition-colors ${
        completed ? 'opacity-55' : 'hover:bg-bg-hover cursor-pointer'
      }`}
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      whileTap={completed ? undefined : { scale: 0.995 }}
    >
      <Checkbox checked={completed} onChange={onToggle} color={subj?.color} size={18} />

      <span className={`flex-1 text-[13px] truncate ${task.carryOver ? 'text-accent-hover' : 'text-text-primary'}`}>
        {task.title}
      </span>

      <span className="text-[11px] text-text-tertiary font-mono flex-shrink-0 ml-2">
        {typeIcon[task.taskType] ?? '·'} {time}
      </span>
    </motion.div>
  );
}
