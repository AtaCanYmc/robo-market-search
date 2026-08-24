import React, { useEffect, useState } from 'react';
import { Search, Layers, ShoppingBag, Terminal, Cpu, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import { api } from '../services/api';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .checkHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  const navItems = [
    { id: 'search', label: 'Global Component Index', icon: Search },
    { id: 'batch', label: 'Multi-MPN Matrix', icon: Layers },
    { id: 'optimizer', label: 'Procurement Matrix', icon: ShoppingBag },
    { id: 'agent', label: 'Autonomous Sourcing Engine', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/90 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Sub-header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shadow-inner">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-100 tracking-tight font-mono uppercase">
                  Robo Market <span className="text-blue-400">Search</span>
                </span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  v1.3 PRO
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 tracking-wider uppercase">
                Enterprise Sourcing & Hardware Procurement Terminal
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#131822] border border-slate-800 rounded-lg p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* System Status Indicator */}
          <div className="flex items-center gap-2 font-mono">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] ${
                apiOnline === true
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : apiOnline === false
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Activity className="w-3 h-3 animate-pulse" />
              <span className="hidden sm:inline text-slate-500">SYSTEM:</span>
              {apiOnline === true ? (
                <span className="flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ONLINE
                </span>
              ) : apiOnline === false ? (
                <span className="flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3 h-3 text-rose-400" /> OFFLINE
                </span>
              ) : (
                'CONNECTING...'
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Links */}
        <div className="flex md:hidden border-t border-slate-800/80 py-2 overflow-x-auto gap-1 font-mono">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
