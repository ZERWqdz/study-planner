import { motion } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  color?: string;
  size?: number;
}

export function Checkbox({ checked, onChange, color = '#22C55E', size = 24 }: CheckboxProps) {
  return (
    <button
      onClick={onChange}
      className="relative flex-shrink-0 cursor-pointer focus:outline-none"
      style={{ width: size, height: size }}
      aria-label={checked ? '取消完成' : '标记完成'}
    >
      {/* 外圈 */}
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <motion.circle
          cx={12}
          cy={12}
          r={10}
          stroke={checked ? color : '#475569'}
          strokeWidth={2}
          animate={{ stroke: checked ? color : '#475569' }}
          transition={{ duration: 0.3 }}
        />
        {/* 勾选标记 */}
        {checked && (
          <motion.path
            d="M7 12.5L10.5 16L17 9"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </svg>
      {/* 点击涟漪 */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
    </button>
  );
}
