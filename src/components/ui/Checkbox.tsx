import { motion } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  color?: string;
  size?: number;
}

export function Checkbox({ checked, onChange, color = '#30a46c', size = 20 }: CheckboxProps) {
  return (
    <motion.button
      onClick={onChange}
      className="relative flex-shrink-0 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
      style={{ width: 44, height: 44 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      aria-label={checked ? '标记为未完成' : '标记为已完成'}
      aria-pressed={checked}
    >
      {/* 视觉图标居中，触控区域 44px */}
      <span className="absolute inset-0 flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <motion.rect
            x={1} y={1} width={16} height={16} rx={3}
            stroke={checked ? color : 'var(--border-secondary)'}
            strokeWidth={1.5}
            fill={checked ? color : 'transparent'}
            animate={{ fill: checked ? color : 'transparent', stroke: checked ? color : 'var(--border-secondary)' }}
            transition={{ duration: 0.15 }}
          />
          {checked && (
            <motion.path
              d="M5 9l2.5 2.5L13 6"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          )}
        </svg>
      </span>
    </motion.button>
  );
}
