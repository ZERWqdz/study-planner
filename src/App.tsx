import { useState } from 'react';
import { StudyProvider } from '@/store/studyStore';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'stats'>('home');

  return (
    <StudyProvider>
      <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'home' && <HomePage />}
        {activeTab !== 'home' && (
          <div className="flex items-center justify-center py-32 text-text-tertiary text-[14px]">
            Coming soon
          </div>
        )}
      </AppShell>
    </StudyProvider>
  );
}
