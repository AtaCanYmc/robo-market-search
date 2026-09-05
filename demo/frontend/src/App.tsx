import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SearchTab } from './components/SearchTab';
import { BatchSearchTab } from './components/BatchSearchTab';
import { CartOptimizerTab } from './components/CartOptimizerTab';
import { AgentTab } from './components/AgentTab';
import { ServerStatusModal } from './components/ServerStatusModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { api } from './services/api';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('search');
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [justConnected, setJustConnected] = useState(false);
  const { t } = useTheme();

  const checkHealth = useCallback(async () => {
    setIsChecking(true);
    try {
      await api.checkHealth();
      setApiOnline((prev) => {
        if (prev === false) {
          setJustConnected(true);
          setTimeout(() => {
            setIsModalOpen(false);
            setJustConnected(false);
          }, 1300);
        }
        return true;
      });
    } catch {
      setApiOnline(false);
      setAttemptCount((prev) => prev + 1);
      setIsModalOpen(true);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Initial healthcheck on page load
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Periodic polling every 3 seconds while backend is offline
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (apiOnline === false) {
      interval = setInterval(() => {
        checkHealth();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [apiOnline, checkHealth]);

  return (
    <div className="min-h-screen bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 text-slate-100 dark:text-slate-100 light:text-slate-900 flex flex-col transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiOnline={apiOnline}
        onOpenServerModal={() => setIsModalOpen(true)}
        attemptCount={attemptCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {activeTab === 'search' && <SearchTab />}
        {activeTab === 'batch' && <BatchSearchTab />}
        {activeTab === 'optimizer' && <CartOptimizerTab />}
        {activeTab === 'agent' && <AgentTab />}
      </main>

      {/* Floating Status Pill when modal is closed but server is still offline */}
      {apiOnline === false && !isModalOpen && (
        <div className="fixed bottom-5 right-5 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0E131F]/90 dark:bg-[#0E131F]/90 light:bg-white/95 border border-rose-500/40 text-xs font-mono text-slate-200 dark:text-slate-200 light:text-slate-800 shadow-xl shadow-black/50 hover:border-blue-500 hover:text-blue-400 transition-all cursor-pointer backdrop-blur-md"
            title={t('serverModalReopenTooltip')}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-semibold text-rose-400">{t('connecting')}</span>
            {attemptCount > 0 && <span className="text-slate-500 text-[10px]">#{attemptCount}</span>}
            <span className="text-blue-400 text-[11px] underline ml-0.5">Görüntüle</span>
          </button>
        </div>
      )}

      {/* Server Status Modal */}
      <ServerStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRetry={checkHealth}
        isChecking={isChecking}
        apiOnline={apiOnline}
        attemptCount={attemptCount}
        justConnected={justConnected}
      />

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
