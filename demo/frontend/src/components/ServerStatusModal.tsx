import React, { useState } from 'react';
import {
  Server,
  Radio,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Copy,
  Check,
  X,
  Cloud,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface ServerStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  isChecking: boolean;
  apiOnline: boolean | null;
  attemptCount: number;
  justConnected: boolean;
}

export const ServerStatusModal: React.FC<ServerStatusModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  isChecking,
  apiOnline,
  attemptCount,
  justConnected,
}) => {
  const { t } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0E131F] border border-slate-300 dark:border-slate-700/80 rounded-2xl shadow-2xl shadow-blue-950/50 overflow-hidden font-mono transition-colors animate-in fade-in zoom-in-95 duration-200">
        {/* Top Status Accent Bar */}
        <div
          className={`h-1.5 w-full ${
            justConnected
              ? 'bg-emerald-500'
              : 'bg-gradient-to-r from-blue-600 via-amber-500 to-blue-600 animate-pulse'
          }`}
        />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${
                justConnected
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-blue-600/20 border border-blue-500/40 text-blue-400'
              }`}
            >
              {justConnected ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <Server className="w-5 h-5 animate-pulse" />
                </>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                {justConnected ? t('serverModalConnected') : t('serverModalTitle')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                {t('serverModalSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('serverModalDismiss')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Radar / Pulse Graphic */}
          <div className="relative py-4 px-4 rounded-xl bg-slate-50 dark:bg-[#090D15] border border-slate-200 dark:border-slate-800/80 flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Visual background ping rings */}
            <div className="relative my-3 flex items-center justify-center">
              {!justConnected && (
                <>
                  <div className="absolute w-28 h-28 rounded-full border border-blue-500/20 animate-ping duration-1000" />
                  <div className="absolute w-20 h-20 rounded-full border border-blue-500/30 animate-pulse" />
                </>
              )}
              <div
                className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                  justConnected
                    ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400'
                    : 'bg-blue-600/20 border-2 border-blue-500/60 text-blue-400'
                }`}
              >
                {justConnected ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <Radio className="w-7 h-7 animate-pulse" />
                )}
              </div>
            </div>

            {/* Live Status Pill */}
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80">
              {justConnected ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {t('serverModalConnected')}
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <RefreshCw
                    className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`}
                  />
                  {t('serverModalConnecting')}
                  <span className="text-slate-500 dark:text-slate-400 font-normal">
                    ({t('serverModalAttempt')} #{attemptCount})
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Context / Helpful Advice Cards */}
          <div className="space-y-2 text-xs">
            {/* Cloud (Render) Hint */}
            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
              <Cloud className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-blue-600 dark:text-blue-400">Render Cloud:</span>{' '}
                {t('serverModalHintCloud')}
              </div>
            </div>

            {/* Local Development Hint */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 space-y-2">
              <div className="flex items-start gap-2.5">
                <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Local Dev:</span>{' '}
                  {t('serverModalHintLocal')}
                </div>
              </div>

              {/* Command Code snippet with 1-click copy */}
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#070A10] border border-slate-300 dark:border-slate-800">
                <code className="text-blue-600 dark:text-blue-400 font-bold font-mono text-[11px]">
                  make run-api
                </code>
                <button
                  onClick={() => handleCopyCommand('make run-api')}
                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-[#090D15] border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            {t('serverModalDismiss')}
          </button>

          <button
            onClick={onRetry}
            disabled={isChecking}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${
              isChecking
                ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 active:scale-95'
            }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`}
            />
            {t('serverModalRetryNow')}
          </button>
        </div>
      </div>
    </div>
  );
};
