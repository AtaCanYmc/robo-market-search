import React, { useState, useEffect, useCallback } from 'react';
import { DesktopSidebar } from './components/DesktopSidebar';
import { DesktopHeader } from './components/DesktopHeader';
import { DesktopStatusBar } from './components/DesktopStatusBar';
import { SearchTab } from './components/SearchTab';
import { BatchSearchTab } from './components/BatchSearchTab';
import { CartOptimizerTab } from './components/CartOptimizerTab';
import { AgentTab } from './components/AgentTab';
import { ServerStatusModal } from './components/ServerStatusModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { api } from './services/api';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('search');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('ROBO_SIDEBAR_COLLAPSED') === 'true';
  });
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [justConnected, setJustConnected] = useState(false);
  const { t } = useTheme();

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('ROBO_SIDEBAR_COLLAPSED', String(next));
      return next;
    });
  }, []);

  const handleQuickSearchFocus = useCallback(() => {
    if (activeTab !== 'search') {
      setActiveTab('search');
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('robo:focus-search'));
    }, 50);
  }, [activeTab]);

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

  // Initial healthcheck on load
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Periodic polling while backend is offline
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (apiOnline === false) {
      interval = setInterval(() => {
        checkHealth();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [apiOnline, checkHealth]);

  // Global desktop keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key === '1') {
        e.preventDefault();
        setActiveTab('search');
      } else if (isCmdOrCtrl && e.key === '2') {
        e.preventDefault();
        setActiveTab('batch');
      } else if (isCmdOrCtrl && e.key === '3') {
        e.preventDefault();
        setActiveTab('optimizer');
      } else if (isCmdOrCtrl && e.key === '4') {
        e.preventDefault();
        setActiveTab('agent');
      } else if (isCmdOrCtrl && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        toggleSidebar();
      } else if (isCmdOrCtrl && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        handleQuickSearchFocus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, handleQuickSearchFocus]);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 dark:bg-[#070A0F] text-slate-900 dark:text-slate-100 select-none">
      {/* Desktop Navigation Activity Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        apiOnline={apiOnline}
        onOpenServerModal={() => setIsModalOpen(true)}
        attemptCount={attemptCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-slate-50 dark:bg-[#080C14]">
        {/* Desktop Titlebar / Header Bar */}
        <DesktopHeader
          activeTab={activeTab}
          onQuickSearchFocus={handleQuickSearchFocus}
          apiOnline={apiOnline}
        />

        {/* Content Pane (Independent Scrolling, Selectable Text) */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 min-w-0 selectable-text">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'search' && <SearchTab />}
            {activeTab === 'batch' && <BatchSearchTab />}
            {activeTab === 'optimizer' && <CartOptimizerTab />}
            {activeTab === 'agent' && <AgentTab />}
          </div>
        </main>

        {/* Desktop Application Bottom Status Bar */}
        <DesktopStatusBar
          apiOnline={apiOnline}
          attemptCount={attemptCount}
          onOpenServerModal={() => setIsModalOpen(true)}
        />
      </div>

      {/* Floating Status Pill when modal is closed but server is still offline */}
      {apiOnline === false && !isModalOpen && (
        <div className="fixed bottom-10 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-[#0E131F]/90 border border-rose-500/40 text-xs font-mono text-slate-800 dark:text-slate-200 shadow-xl shadow-black/10 dark:shadow-black/50 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer backdrop-blur-md"
            title={t('serverModalReopenTooltip')}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-semibold text-rose-500 dark:text-rose-400">{t('connecting')}</span>
            {attemptCount > 0 && <span className="text-slate-400 text-[10px]">#{attemptCount}</span>}
            <span className="text-blue-600 dark:text-blue-400 text-[11px] underline ml-0.5">Görüntüle</span>
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
