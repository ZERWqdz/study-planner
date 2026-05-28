import { motion } from 'framer-motion';
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

interface TaskItemProps {
  task: Task;
  completed: boolean;
  onToggle: () => void;
  index: number;
}

export function TaskItem({ task, completed, onToggle, index }: TaskItemProps) {
  const subject = SUBJECT_BY_ID[task.subjectId];
  const Icon = typeIcons[task.taskType] ?? BookOpen;
  const hours = Math.floor(task.estimatedMinutes / 60);
  const mins = task.estimatedMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ''}` : `${mins}m`;

  return (
    <motion.div
      className={`flex items-center gap-2.5 py-2.5 px-2.5 rounded-xl transition-all duration-300 ${
        completed ? 'opacity-60' : 'hover:bg-white/[0.03]'
      }`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={completed ? {} : { x: 3 }}
    >
      <Checkbox checked={completed} onChange={onToggle} color={subject?.color} size={20} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {/* 科目色点 */}
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: subject?.color }} />
          <motion.span
            className={`text-[13px] font-medium truncate transition-all duration-300 ${
              completed ? 'line-through text-slate-600' : 'text-slate-300'
            }`}
          >
            {task.title}
          </motion.span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span
          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-lg font-medium"
          style={{ backgroundColor: `${subject?.color}10`, color: subject?.color }}
        >
          <Icon size={9} />
          <span className="hidden sm:inline">{typeLabels[task.taskType]}</span>
        </span>
        <span className="text-[10px] text-slate-600 font-mono flex items-center gap-0.5">
          <Clock size={9} />
          {timeStr}
        </span>
      </div>
    </motion.div>
  );
}
