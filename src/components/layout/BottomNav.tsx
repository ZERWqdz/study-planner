interface BottomNavProps {
  activeTab: 'home' | 'calendar' | 'stats';
  onTabChange: (tab: 'home' | 'calendar' | 'stats') => void;
}

const tabs = [
  { id: 'home' as const, label: 'Today' },
  { id: 'calendar' as const, label: 'Calendar' },
  { id: 'stats' as const, label: 'Stats' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden safe-area-bottom">
      <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-xl border-t border-border-primary" />
      <div className="relative flex items-center justify-around h-14">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`text-[13px] font-medium transition-colors ${
              activeTab === id ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
