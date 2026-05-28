import { motion } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  color?: string;
  size?: number;
}

export function Checkbox({ checked, onChange, color = '#30a46c', size = 18 }: CheckboxProps) {
  return (
    <button
      onClick={onChange}
      className="relative flex-shrink-0 cursor-pointer focus:outline-none"
      style={{ width: size, height: size }}
      aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
    >
      <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <rect
          x={1} y={1} width={16} height={16} rx={3}
          stroke={checked ? color : 'var(--border-secondary)'}
          strokeWidth={1.5}
          fill={checked ? color : 'transparent'}
          style={{ transition: 'fill 150ms ease, stroke 150ms ease' }}
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
    </button>
  );
}
