import { motion } from 'framer-motion';
import { Home, Calendar, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'calendar' | 'stats';
  onTabChange: (tab: 'home' | 'calendar' | 'stats') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: 'home' | 'calendar' | 'stats'; label: string; Icon: typeof Home }[] = [
    { id: 'home', label: '今日', Icon: Home },
    { id: 'calendar', label: '月历', Icon: Calendar },
    { id: 'stats', label: '统计', Icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* 玻璃背景 */}
      <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-2xl border-t border-white/[0.06]" />

      <div className="relative flex items-center justify-around h-16 safe-area-bottom">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[72px] h-full transition-all duration-300 ${
                isActive ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              {/* 活跃指示器 */}
              {isActive && (
                <motion.div
                  layoutId="bottomNav"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: 'var(--gradient-hero)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
