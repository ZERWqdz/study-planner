import { motion } from 'framer-motion';
import { Database, Cpu, Monitor, Globe, Calculator, BookOpen, Landmark, type LucideIcon } from 'lucide-react';
import type { StudyStats, SubjectId } from '@/types';
import { SUBJECTS } from '@/utils/constants';

const SubjectIcon: Record<SubjectId, LucideIcon> = {
  'data-structure': Database,
  'computer-organization': Cpu,
  'operating-system': Monitor,
  'computer-network': Globe,
  math: Calculator,
  english: BookOpen,
  politics: Landmark,
};

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
        const Icon = SubjectIcon[subject.id];
        return (
          <div key={subject.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-text-primary flex items-center gap-1.5">
                {Icon && <Icon size={14} strokeWidth={1.5} />}
                {subject.name}
              </span>
              <span className="text-[11px] font-mono text-text-tertiary tabular-nums">
                {data.completed}/{data.total}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-border-primary overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: subject.color }}
                initial={{ width: 0 }}
                animate={{ width: `${ratio}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
