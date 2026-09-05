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
    <header className="sticky top-0 z-50 bg-[#0B0F17]/90 dark:bg-[#0B0F17]/90 light:bg-white/90 backdrop-blur-md border-b border-slate-800 dark:border-slate-800 light:border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shadow-inner">
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight font-mono uppercase">
                  ROBO MARKET <span className="text-blue-500 dark:text-blue-400">SEARCH</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 dark:bg-slate-900 light:bg-slate-100 text-slate-400 dark:text-slate-400 light:text-slate-600 border border-slate-800 dark:border-slate-800 light:border-slate-300">
                  {t('appVersion')}
                </span>
              </div>
              <span className="hidden sm:inline-block text-[9px] font-mono text-slate-500 dark:text-slate-500 light:text-slate-600 tracking-wider uppercase">
                {t('appSubtitle')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-mono">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-blue-400 dark:text-blue-400 light:text-blue-600 font-bold bg-blue-500/10 border border-blue-500/30'
                      : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200 dark:hover:text-slate-200 light:hover:text-slate-900 hover:bg-slate-800/30 dark:hover:bg-slate-800/30 light:hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Top Bar Actions (Lang, Theme, Status, Mobile Toggle) */}
          <div className="flex items-center gap-2 font-mono">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#131822] dark:bg-[#131822] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-[11px] font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 hover:border-blue-500/50 transition-all cursor-pointer"
              title="Toggle Language (TR/EN)"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded bg-[#131822] dark:bg-[#131822] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:border-blue-500/50 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-blue-600" />
              )}
            </button>

            {/* System Status LED Indicator */}
            <button
              onClick={onOpenServerModal}
              title={t('serverModalReopenTooltip')}
              type="button"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] transition-all cursor-pointer hover:brightness-110 active:scale-95 ${
                apiOnline === true
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : apiOnline === false
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Activity className="w-3 h-3 animate-pulse" />
              {apiOnline === true ? (
                <span className="flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> {t('systemOnline')}
                </span>
              ) : apiOnline === false ? (
                <span className="flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-2.5 h-2.5 text-rose-400" /> {t('systemOffline')}
                  {attemptCount > 0 && <span className="text-[9px] opacity-80">(#{attemptCount})</span>}
                </span>
              ) : (
                <span className="font-semibold">{t('connecting')}</span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded bg-[#131822] dark:bg-[#131822] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 dark:border-slate-800 light:border-slate-200 py-2 space-y-1 font-mono">
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
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 dark:text-blue-300 light:text-blue-700 font-bold border border-blue-500/30'
                      : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile Navigation Scrollbar Bar (Always visible on medium/small mobile) */}
        <div className="flex lg:hidden border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 py-1.5 overflow-x-auto gap-1 font-mono">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 dark:text-blue-300 light:text-blue-700 border border-blue-500/40 font-semibold'
                    : 'text-slate-400 dark:text-slate-400 light:text-slate-600'
                }`}
              >
                <Icon className="w-3 h-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
