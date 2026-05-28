import type { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { BackgroundEffect } from './BackgroundEffect';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface AppShellProps {
  children: ReactNode;
  activeTab: 'home' | 'calendar' | 'stats';
  onTabChange: (tab: 'home' | 'calendar' | 'stats') => void;
}

export function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen text-text-primary">
      <BackgroundEffect />
      <div className="relative z-10">
        <Header />
        <main className={`px-5 py-6 ${isMobile ? 'pb-20' : 'pb-12'}`}>
          {children}
        </main>
        {isMobile && <BottomNav activeTab={activeTab} onTabChange={onTabChange} />}
      </div>
    </div>
  );
}
