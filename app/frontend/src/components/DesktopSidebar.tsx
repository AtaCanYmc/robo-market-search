import React from 'react';
import {
  Search,
  Layers,
  ShoppingBag,
  Terminal,
  Cpu,
  PanelLeftClose,
  PanelLeft,
  Globe,
  Sun,
  Moon,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DesktopSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  apiOnline?: boolean | null;
  onOpenServerModal?: () => void;
  attemptCount?: number;
}

const STORES = [
  { id: 'robotistan', name: 'Robotistan', dot: 'bg-rose-500' },
  { id: 'robolink', name: 'Robolink', dot: 'bg-sky-500' },
  { id: 'robo90', name: 'Robo90', dot: 'bg-teal-500' },
  { id: 'direncnet', name: 'Direnç.net', dot: 'bg-orange-500' },
  { id: 'ozdisan', name: 'Özdisan', dot: 'bg-blue-600' },
  { id: 'motorobit', name: 'Motorobit', dot: 'bg-amber-500' },
];

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  onToggleCollapse,
  apiOnline,
  onOpenServerModal,
  attemptCount = 0,
}) => {
  const { theme, toggleTheme, lang, toggleLang, t } = useTheme();

  const navItems = [
    { id: 'search', label: t('navSearch'), icon: Search, shortcut: '⌘1' },
    { id: 'batch', label: t('navBatch'), icon: Layers, shortcut: '⌘2' },
    { id: 'optimizer', label: t('navOptimizer'), icon: ShoppingBag, shortcut: '⌘3' },
    { id: 'agent', label: t('navAgent'), icon: Terminal, shortcut: '⌘4' },
  ];

  return (
    <aside
      className={`h-screen border-r border-slate-200/80 dark:border-slate-800/70 bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-xl flex flex-col justify-between shrink-0 transition-all duration-200 select-none z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Section: App Branding & Window Controls Clearance */}
      <div className="flex flex-col">
        {/* Header Bar / Drag Region */}
        <div
          data-tauri-drag-region
          className="window-drag-region h-14 flex items-center justify-between px-3.5 border-b border-slate-200/60 dark:border-slate-800/50"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs tracking-tight text-slate-900 dark:text-slate-100 truncate">
                    Robo Market <span className="text-blue-600 dark:text-blue-400">Search</span>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  Desktop Edition
                </span>
              </div>
            )}
          </div>

          {/* Toggle Sidebar Button */}
          <button
            onClick={onToggleCollapse}
            title={collapsed ? t('sidebarExpand') : t('sidebarCollapse')}
            aria-label={collapsed ? t('sidebarExpand') : t('sidebarCollapse')}
            type="button"
            className="window-no-drag p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            {collapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-2 space-y-1">
          {!collapsed && (
            <div className="px-2 pt-2 pb-1 text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 font-mono">
              {t('desktopViews')}
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                type="button"
                title={`${item.label} (${item.shortcut})`}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200/80 dark:border-blue-800/60 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700/60">
                      {item.shortcut}
                    </kbd>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Stores Section (Expanded only) */}
        {!collapsed && (
          <div className="px-3 py-3 border-t border-slate-200/60 dark:border-slate-800/50 mt-2">
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 font-mono">
                {t('desktopStores')} ({STORES.length})
              </span>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {STORES.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/40 text-[11px] text-slate-600 dark:text-slate-400"
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                  <span className="truncate">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: API Status, Utility Switches, Version */}
      <div className="p-2 border-t border-slate-200/70 dark:border-slate-800/60 space-y-2">
        {/* API Server Status Widget */}
        <button
          onClick={onOpenServerModal}
          type="button"
          title={t('serverModalReopenTooltip')}
          className={`w-full flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer hover:border-blue-400/50 ${
            apiOnline === true
              ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : apiOnline === false
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-400 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500'
          } ${collapsed ? 'justify-center p-2' : ''}`}
        >
          <div className="relative shrink-0 flex items-center justify-center">
            {apiOnline === true ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : apiOnline === false ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            ) : (
              <Activity className="w-3.5 h-3.5 animate-spin text-slate-400" />
            )}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold truncate">
                  {apiOnline === true
                    ? t('systemOnline')
                    : apiOnline === false
                    ? t('systemOffline')
                    : t('connecting')}
                </span>
                {attemptCount > 0 && apiOnline === false && (
                  <span className="text-[10px] font-mono opacity-80">#{attemptCount}</span>
                )}
              </div>
              <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">
                127.0.0.1:8000
              </p>
            </div>
          )}
        </button>

        {/* Action Controls: Lang & Theme */}
        <div className={`flex items-center gap-1.5 ${collapsed ? 'flex-col' : 'justify-between'}`}>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleLang}
              className="flex items-center justify-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              title="Dil Değiştir / Toggle Language"
              aria-label="Dil Değiştir / Toggle Language"
              type="button"
            >
              <Globe className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              title={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
              aria-label={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
              type="button"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>
          </div>

          {!collapsed && (
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 px-1">
              {t('appVersion')}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
