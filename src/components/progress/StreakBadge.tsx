import { Flame } from 'lucide-react';

interface StreakBadgeProps { streak: number; size?: 'sm' | 'md' | 'lg' }

export function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const sz = { sm: 'text-[11px] gap-1 px-2 py-0.5', md: 'text-xs gap-1.5 px-2.5 py-1', lg: 'text-sm gap-2 px-3 py-1.5' }[size];
  const active = streak > 0;

  return (
    <span className={`inline-flex items-center rounded-md font-mono font-medium transition-colors ${sz} ${
      active ? 'bg-accent-muted text-accent' : 'text-text-tertiary'
    }`}>
      <Flame size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} strokeWidth={1.5} className={active ? 'text-accent' : 'text-text-tertiary'} />
      {streak}d
    </span>
  );
}
