import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SearchTab } from './components/SearchTab';
import { BatchSearchTab } from './components/BatchSearchTab';
import { CartOptimizerTab } from './components/CartOptimizerTab';
import { AgentTab } from './components/AgentTab';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('search');
  const { t } = useTheme();

  return (
    <div className="min-h-screen bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-900 flex flex-col transition-colors">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {activeTab === 'search' && <SearchTab />}
        {activeTab === 'batch' && <BatchSearchTab />}
        {activeTab === 'optimizer' && <CartOptimizerTab />}
        {activeTab === 'agent' && <AgentTab />}
      </main>

      <footer className="border-t border-slate-800 dark:border-slate-800 light:border-slate-200 py-5 text-center text-xs text-slate-500 font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            © 2026 <span className="text-slate-300 dark:text-slate-300 light:text-slate-700 font-semibold">{t('appName')}</span> — {t('footerCopyright')}
          </div>
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-400 light:text-slate-600">
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              {t('footerDocs')}
            </a>
            <span>•</span>
            <a href="https://github.com/AtaCanYmc/robo-market-search" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              {t('footerGithub')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
};

export default App;
