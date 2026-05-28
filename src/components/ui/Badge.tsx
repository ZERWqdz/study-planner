import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ children, color = '#3B82F6', variant = 'filled', size = 'sm' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  if (variant === 'filled') {
    return (
      <span
        className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
        style={{ backgroundColor: `${color}20`, color }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${sizeClasses}`}
      style={{ borderColor: `${color}40`, color }}
    >
      {children}
    </span>
  );
}
