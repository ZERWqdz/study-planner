import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ children, color = '#3B82F6', variant = 'filled', size = 'sm' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  if (variant === 'filled') {
    return (
      <span
        className={`inline-flex items-center rounded-lg font-semibold ${sizeClasses} transition-all`}
        style={{ backgroundColor: `${color}14`, color }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg font-semibold border ${sizeClasses} transition-all`}
      style={{ borderColor: `${color}30`, color }}
    >
      {children}
    </span>
  );
}
