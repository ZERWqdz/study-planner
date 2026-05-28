import { motion } from 'framer-motion';
import type { Task } from '@/types';
import { SUBJECT_BY_ID } from '@/utils/constants';
import { Checkbox } from '@/components/ui/Checkbox';
import { Clock, BookOpen, Video, Edit3, RotateCcw, Brain, FileText } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  completed: boolean;
  onToggle: () => void;
  index: number;
}

const typeIcons: Record<string, typeof BookOpen> = {
  textbook: BookOpen,
  'video-lecture': Video,
  exercise: Edit3,
  review: RotateCcw,
  memorize: Brain,
  'mock-exam': FileText,
};

const typeLabels: Record<string, string> = {
  textbook: '教材',
  'video-lecture': '视频',
  exercise: '练习',
  review: '复习',
  memorize: '背诵',
  'mock-exam': '模考',
};

export function TaskItem({ task, completed, onToggle, index }: TaskItemProps) {
  const subject = SUBJECT_BY_ID[task.subjectId];
  const Icon = typeIcons[task.taskType] ?? BookOpen;
  const hours = Math.floor(task.estimatedMinutes / 60);
  const mins = task.estimatedMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ''}` : `${mins}m`;

  return (
    <motion.div
      className="flex items-center gap-3 py-3 px-2 rounded-xl transition-colors hover:bg-white/[0.03] group"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Checkbox checked={completed} onChange={onToggle} color={subject?.color} />

      <div className="flex-1 min-w-0">
        <motion.p
          className={`text-sm font-medium truncate transition-all duration-300 ${
            completed ? 'line-through text-slate-500' : 'text-slate-200'
          }`}
        >
          {task.title}
        </motion.p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md"
          style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
        >
          <Icon size={10} />
          <span className="hidden sm:inline">{typeLabels[task.taskType]}</span>
        </span>

        <span className="flex items-center gap-0.5 text-xs text-slate-500">
          <Clock size={10} />
          {timeStr}
        </span>
      </div>
    </motion.div>
  );
}
