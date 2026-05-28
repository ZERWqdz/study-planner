import { motion } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  color?: string;
  size?: number;
}

export function Checkbox({ checked, onChange, color = '#22C55E', size = 24 }: CheckboxProps) {
  return (
    <motion.button
      onClick={onChange}
      className="relative flex-shrink-0 cursor-pointer focus:outline-none"
      style={{ width: size, height: size }}
      aria-label={checked ? '取消完成' : '标记完成'}
      whileTap={{ scale: 0.85 }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 外圈 */}
        <motion.circle
          cx={12} cy={12} r={10}
          stroke={checked ? color : 'rgba(255,255,255,0.15)'}
          strokeWidth={2}
          fill={checked ? color : 'transparent'}
          animate={{
            stroke: checked ? color : 'rgba(255,255,255,0.15)',
            fill: checked ? color : 'transparent',
          }}
          transition={{ duration: 0.3 }}
        />
        {/* 勾选标记 */}
        {checked && (
          <motion.path
            d="M7 12.5L10.5 16L17 9"
            stroke="white"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
          />
        )}
      </svg>
      {/* 涟漪效果 */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={false}
        animate={checked ? { scale: 2.5, opacity: 0 } : {}}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}
