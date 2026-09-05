import React, { useEffect, useState } from 'react';
import {
  Search,
  Layers,
  ShoppingBag,
  Terminal,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Activity,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiOnline?: boolean | null;
  onOpenServerModal?: () => void;
  attemptCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  apiOnline: externalApiOnline,
  onOpenServerModal,
  attemptCount = 0,
}) => {
  const [internalApiOnline, setInternalApiOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, lang, toggleLang, t } = useTheme();

  const apiOnline = externalApiOnline !== undefined ? externalApiOnline : internalApiOnline;

  useEffect(() => {
    if (externalApiOnline === undefined) {
      api
        .checkHealth()
        .then(() => setInternalApiOnline(true))
        .catch(() => setInternalApiOnline(false));
    }
  }, [externalApiOnline]);

  const navItems = [
    { id: 'search', label: t('navSearch'), icon: Search },
    { id: 'batch', label: t('navBatch'), icon: Layers },
    { id: 'optimizer', label: t('navOptimizer'), icon: ShoppingBag },
    { id: 'agent', label: t('navAgent'), icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 truncate">
                Robo Market <span className="text-blue-600 dark:text-blue-400">Search</span>
              </span>
              <span className="hidden md:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                {t('appVersion')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Top Bar Actions (Lang, Theme, Status, Mobile Toggle) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* System Status LED Indicator */}
            <button
              onClick={onOpenServerModal}
              title={t('serverModalReopenTooltip')}
              type="button"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer hover:opacity-90 active:scale-95 ${
                apiOnline === true
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : apiOnline === false
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span className="hidden sm:inline font-medium">
                {apiOnline === true ? (
                  t('systemOnline')
                ) : apiOnline === false ? (
                  <>
                    {t('systemOffline')}
                    {attemptCount > 0 && <span className="opacity-75 text-[10px] ml-1">#{attemptCount}</span>}
                  </>
                ) : (
                  t('connecting')
                )}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
              title="Dil Değiştir / Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-2.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800/60'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
