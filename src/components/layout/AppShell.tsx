import type { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface AppShellProps {
  children: ReactNode;
  activeTab: 'home' | 'calendar' | 'stats';
  onTabChange: (tab: 'home' | 'calendar' | 'stats') => void;
}

export function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      <main className={`max-w-7xl mx-auto px-4 py-4 ${isMobile ? 'pb-20' : 'pb-8'}`}>
        {children}
      </main>
      {isMobile && <BottomNav activeTab={activeTab} onTabChange={onTabChange} />}
    </div>
  );
}
