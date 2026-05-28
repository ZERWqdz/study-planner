import { motion } from 'framer-motion';
import type { StudyStats } from '@/types';
import { SUBJECTS } from '@/utils/constants';

interface SubjectStatsProps {
  stats: StudyStats;
}

export function SubjectStats({ stats }: SubjectStatsProps) {
  return (
    <div className="space-y-3">
      {SUBJECTS.map((subject) => {
        const data = stats.bySubject[subject.id];
        if (!data || data.total === 0) return null;
        const ratio = Math.round((data.completed / data.total) * 100);
        return (
          <div key={subject.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300 flex items-center gap-1.5">
                <span>{subject.icon}</span>
                {subject.name}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {data.completed}/{data.total}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: subject.color }}
                initial={{ width: 0 }}
                animate={{ width: `${ratio}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
