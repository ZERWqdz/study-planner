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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F1A2E]/95 backdrop-blur-md border-t border-slate-800 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-full transition-colors ${
                isActive ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
