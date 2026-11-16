import React from 'react';
import {
  Search,
  Layers,
  ShoppingBag,
  Terminal,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface DesktopHeaderProps {
  activeTab: string;
  onQuickSearchFocus: () => void;
  apiOnline?: boolean | null;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  activeTab,
  onQuickSearchFocus,
}) => {
  const { t } = useTheme();

  const tabTitles: Record<string, { title: string; icon: React.ComponentType<{ className?: string }> }> = {
    search: { title: t('navSearch'), icon: Search },
    batch: { title: t('navBatch'), icon: Layers },
    optimizer: { title: t('navOptimizer'), icon: ShoppingBag },
    agent: { title: t('navAgent'), icon: Terminal },
  };

  const current = tabTitles[activeTab] || tabTitles.search;
  const TabIcon = current.icon;

  return (
    <header
      data-tauri-drag-region
      className="window-drag-region h-14 border-b border-slate-200/80 dark:border-slate-800/70 bg-white/70 dark:bg-[#0B0F17]/70 backdrop-blur-md px-5 flex items-center justify-between shrink-0 select-none z-20"
    >
      {/* Breadcrumb / Current View */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
          RoboMarket
        </span>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
          <TabIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{current.title}</span>
        </div>
      </div>

      {/* Global Command / Quick Search & External Links */}
      <div className="flex items-center gap-3">
        {/* Global Quick Search Pill (Cmd+K) */}
        <button
          onClick={onQuickSearchFocus}
          type="button"
          className="window-no-drag flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-blue-400/50 transition-all cursor-pointer shadow-2xs group"
          title="Odaklan: ⌘K veya /"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <span className="hidden sm:inline">{t('quickSearchPlaceholder')}</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* External Docs & GitHub Links */}
        <div className="hidden md:flex items-center gap-1 border-l border-slate-200/80 dark:border-slate-800/80 pl-3">
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="window-no-drag p-1.5 rounded-md text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title="REST API Swagger Docs"
            aria-label="Swagger Docs"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://github.com/AtaCanYmc/robo-market-search"
            target="_blank"
            rel="noopener noreferrer"
            className="window-no-drag p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            title="GitHub Repository"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
