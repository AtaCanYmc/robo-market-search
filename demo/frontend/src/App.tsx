import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SearchTab } from './components/SearchTab';
import { BatchSearchTab } from './components/BatchSearchTab';
import { CartOptimizerTab } from './components/CartOptimizerTab';
import { AgentTab } from './components/AgentTab';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('search');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'search' && <SearchTab />}
        {activeTab === 'batch' && <BatchSearchTab />}
        {activeTab === 'optimizer' && <CartOptimizerTab />}
        {activeTab === 'agent' && <AgentTab />}
      </main>

      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            © 2026 <span className="text-slate-300 font-semibold">Robo Market Search</span> — Apache 2.0 Lisansı ile Açık Kaynak
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              REST API Swagger Docs
            </a>
            <span>•</span>
            <a href="https://github.com/AtaCanYmc/robo-market-search" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              GitHub Reposu
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
