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
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header />
      <main className={`px-5 py-6 ${isMobile ? 'pb-20' : 'pb-12'}`}>
        {children}
      </main>
      {isMobile && <BottomNav activeTab={activeTab} onTabChange={onTabChange} />}
    </div>
  );
}
