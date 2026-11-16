import React from 'react';
import { Activity, Radio } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface DesktopStatusBarProps {
  apiOnline?: boolean | null;
  attemptCount?: number;
  onOpenServerModal?: () => void;
}

export const DesktopStatusBar: React.FC<DesktopStatusBarProps> = ({
  apiOnline,
  attemptCount = 0,
  onOpenServerModal,
}) => {
  const { t } = useTheme();

  return (
    <footer
      data-tauri-drag-region
      className="window-drag-region h-7 border-t border-slate-200/80 dark:border-slate-800/70 bg-white/95 dark:bg-[#0B0F17]/95 px-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 select-none z-20 shrink-0"
    >
      {/* Left: Backend Service Status Pill */}
      <button
        onClick={onOpenServerModal}
        type="button"
        title={t('serverModalReopenTooltip')}
        className="window-no-drag flex items-center gap-2 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors"
      >
        <span className="flex h-1.5 w-1.5 relative">
          {apiOnline === true ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </>
          ) : apiOnline === false ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
          )}
        </span>
        <span className="font-medium">
          {apiOnline === true ? '127.0.0.1:8000' : '127.0.0.1:8000 (Offline)'}
        </span>
        {attemptCount > 0 && apiOnline === false && (
          <span className="text-rose-500 text-[10px]">#{attemptCount}</span>
        )}
      </button>

      {/* Center: Live Store Scrapers Indicator */}
      <div className="hidden sm:flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px]">
        <Radio className="w-3 h-3 text-emerald-500" />
        <span>6 Mağaza Motoru Hazır (Robotistan, Robolink, Robo90, Direnç, Özdisan, Motorobit)</span>
      </div>

      {/* Right: Keyboard Shortcuts Hint */}
      <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
        <span className="hidden md:inline">⌘1-4 Görünüm</span>
        <span>•</span>
        <span>⌘K Arama</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">⌘B Panel</span>
      </div>
    </footer>
  );
};
