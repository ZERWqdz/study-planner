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
        {activeTab === 'calendar' && (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <p>月历视图即将上线</p>
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <p>统计页面即将上线</p>
          </div>
        )}
      </AppShell>
    </StudyProvider>
  );
}
