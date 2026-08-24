import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Loader2,
  AlertCircle,
  Download,
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
  ChevronDown,
  LayoutGrid,
  Table as TableIcon,
  ExternalLink,
  Terminal,
  X,
  Cpu,
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { api } from '../services/api';

export const SearchTab: React.FC = () => {
  const [query, setQuery] = useState('ESP32-WROOM');
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc'>('price_asc');
  const [stockOnly, setStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedStores, setSelectedStores] = useState<string[]>([
    'robotistan',
    'robolink',
    'robo90',
    'direncnet',
  ]);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

  const sampleQueries = ['ESP32-WROOM', 'Arduino Uno', 'Relay 5V', 'OLED 0.96', 'L298N Motor Sürücü', 'STM32F103C8T6'];

  const addLog = (msg: string) => {
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    setExecutionLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setExecutionLogs([]);

    addLog(`INITIATING COMPONENT INDEX QUERY FOR '${query.trim().toUpperCase()}'...`);
    addLog(`CONNECTING TO VENDOR CLUSTERS (ROBOTISTAN, ROBOLINK, ROBO90, DIRENCNET)...`);

    try {
      const isPriceAsc = sortBy === 'price_asc';
      const res = await api.search(query.trim(), limit, isPriceAsc, true);

      if (res.success && res.products) {
        addLog(`QUERY EXECUTED SUCCESSFULLY. ${res.products.length} MPN RECORD(S) RETRIEVED.`);
        setProducts(res.products);
      } else {
        addLog(`QUERY FAILED: ${res.error || 'UNSPECIFIED VENDOR ERROR'}`);
        setError(res.error || 'Arama sırasında bir hata oluştu.');
      }
    } catch (err: any) {
      addLog(`FATAL CLUSTER ERROR: ${err.message || 'REST API UNREACHABLE'}`);
      setError(err.message || 'REST API sunucusuna bağlanılamadı.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStore = (store: string) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  // Filter products locally by selected stores and stock
  let filteredProducts = products.filter((p) => {
    const pStore = (p.store || '').toLowerCase();
    if (selectedStores.length > 0 && !selectedStores.includes(pStore)) {
      return false;
    }
    if (stockOnly && !p.in_stock) {
      return false;
    }
    return true;
  });

  // Client-side sorting
  if (sortBy === 'price_desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name_asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  }

  // Export handlers
  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(filteredProducts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robo-market-search-${query.trim().toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsCSV = () => {
    const headers = ['Part Title', 'Unit Price (TRY)', 'Supplier', 'Stock Status', 'URL'];
    const rows = filteredProducts.map((p) => [
      `"${(p.title || '').replace(/"/g, '""')}"`,
      p.price,
      `"${p.store}"`,
      p.in_stock ? 'IN_STOCK' : 'OUT_OF_STOCK',
      `"${p.url}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robo-market-search-${query.trim().toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsMarkdown = () => {
    const lines = [
      `# Global Component Index Export — "${query.trim()}"`,
      ``,
      `| Part Title | Unit Price (TRY) | Supplier | Stock Status | URL |`,
      `| --- | --- | --- | --- | --- |`,
      ...filteredProducts.map(
        (p) =>
          `| ${(p.title || '').replace(/\|/g, '-')} | ${p.formatted_price || `${p.price} TL`} | ${p.store} | ${
            p.in_stock ? 'IN_STOCK' : 'OUT_OF_STOCK'
          } | [Source Link](${p.url}) |`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robo-market-search-${query.trim().toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const copyToClipboard = () => {
    const lines = [
      `Robo Market Search Index — "${query.trim()}"`,
      ...filteredProducts.map(
        (p) => `- ${p.title} | ${p.formatted_price || `${p.price} TL`} | ${p.store} | ${p.url}`
      ),
    ].join('\n');
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Hero Headline */}
      <div className="text-center pt-2 pb-1 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/30 rounded px-2.5 py-1 text-blue-400 text-xs font-mono font-medium uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" /> GLOBAL COMPONENT INDEX & MPN MATRICES
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono uppercase tracking-tight">
          INDUSTRIAL COMPONENT SOURCING MATRIX
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-xs font-sans">
          Real-time multi-vendor index querying across Robotistan, Robolink, Robo90, and Direnç.net.
        </p>
      </div>

      {/* Main Search Form */}
      <form onSubmit={handleSearch} className="max-w-4xl mx-auto space-y-3 font-mono">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ENTER MPN OR PART KEYWORD (e.g. ESP32-WROOM, STM32F103, RELAY 5V)..."
            className="w-full bg-[#131822] border border-slate-800 rounded-lg pl-11 pr-32 py-3 text-slate-100 text-xs font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500/80 shadow-lg shadow-black/40 transition-all uppercase tracking-wider"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-2 rounded transition-all disabled:opacity-50 flex items-center gap-1.5 shadow"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            EXECUTE
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400 justify-center font-mono">
          <span className="text-slate-500 text-[11px]">QUICK INDEX:</span>
          {sampleQueries.map((sq) => (
            <button
              key={sq}
              type="button"
              onClick={() => {
                setQuery(sq);
              }}
              className="px-2 py-0.5 rounded bg-[#131822] border border-slate-800 text-slate-300 text-[11px] hover:border-blue-500/50 hover:text-blue-300 transition-all"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-[#131822] border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Left: Store Checkboxes */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" /> VENDORS:
            </span>
            {[
              { id: 'robotistan', name: 'ROBOTISTAN' },
              { id: 'robolink', name: 'ROBOLINK' },
              { id: 'robo90', name: 'ROBO90' },
              { id: 'direncnet', name: 'DIRENCNET' },
            ].map((store) => (
              <label key={store.id} className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300 select-none text-[11px]">
                <input
                  type="checkbox"
                  checked={selectedStores.includes(store.id)}
                  onChange={() => toggleStore(store.id)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500/20 bg-[#0B0F17]"
                />
                <span>{store.name}</span>
              </label>
            ))}
          </div>

          {/* Right: Limits & Sorting */}
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">LIMIT:</span>
              <div className="flex gap-1">
                {[5, 10, 20].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLimit(val)}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] border transition-all ${
                      limit === val
                        ? 'bg-blue-600/20 border-blue-500/60 text-blue-300 font-bold'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0B0F17] border border-slate-800 rounded px-2 py-0.5 text-slate-300 focus:outline-none focus:border-blue-500 text-[11px] font-mono"
              >
                <option value="price_asc">PRICE: LOW ➔ HIGH</option>
                <option value="price_desc">PRICE: HIGH ➔ LOW</option>
                <option value="name_asc">TITLE: A ➔ Z</option>
              </select>
            </div>

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300 select-none text-[11px]">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-blue-500/20 bg-[#0B0F17]"
              />
              <span>IN STOCK ONLY</span>
            </label>
          </div>
        </div>
      </form>

      {/* Terminal Execution Logs */}
      {executionLogs.length > 0 && (
        <div className="max-w-4xl mx-auto bg-[#0B0F17] border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-blue-400 space-y-1 shadow-inner">
          <div className="text-[10px] text-slate-500 border-b border-slate-850 pb-1 mb-1 font-bold flex items-center gap-1">
            <Terminal className="w-3 h-3 text-slate-400" /> EXECUTION STREAM LOGS:
          </div>
          {executionLogs.map((log, i) => (
            <div key={i} className="leading-tight">{log}</div>
          ))}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="max-w-4xl mx-auto p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="max-w-4xl mx-auto space-y-2">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="bg-[#131822] border border-slate-800 rounded-lg p-3 h-12 animate-pulse flex items-center justify-between">
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-4 bg-slate-800 rounded w-1/6" />
              <div className="h-4 bg-slate-800 rounded w-1/6" />
            </div>
          ))}
        </div>
      )}

      {/* Product Results Data Grid Matrix */}
      {!loading && searched && (
        <div className="max-w-4xl mx-auto space-y-3 font-sans">
          {/* Header & Controls */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 font-mono">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                INDEX RESULTS ({filteredProducts.length} RECORDS FOUND)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-[#131822] border border-slate-800 rounded p-0.5 font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1 rounded text-xs flex items-center gap-1 ${
                    viewMode === 'table' ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Data Grid Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">TABLE</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded text-xs flex items-center gap-1 ${
                    viewMode === 'grid' ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Grid Card View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">GRID</span>
                </button>
              </div>

              {filteredProducts.length > 0 && (
                <div className="relative font-mono">
                  <button
                    type="button"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#131822] border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-300 text-xs font-medium transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    EXPORT
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>

                  {/* Export Dropdown Menu */}
                  {showExportMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-[#131822] border border-slate-800 rounded shadow-2xl z-50 py-1 text-xs text-slate-200 font-mono">
                      <button
                        onClick={exportAsCSV}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                        Excel / CSV (.csv)
                      </button>
                      <button
                        onClick={exportAsJSON}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        JSON (.json)
                      </button>
                      <button
                        onClick={exportAsMarkdown}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-400" />
                        Markdown Table (.md)
                      </button>
                      <div className="border-t border-slate-800 my-1" />
                      <button
                        onClick={copyToClipboard}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center gap-2 transition-colors text-blue-400"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'COPIED TO CLIPBOARD' : 'COPY TO CLIPBOARD'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-[#131822] border border-slate-800 rounded-lg font-mono">
              <p className="text-slate-400 text-xs">NO COMPONENT RECORDS MATCHING SPECIFIED CONSTRAINTS.</p>
            </div>
          ) : viewMode === 'table' ? (
            /* Enterprise Data Grid Matrix (Table View) */
            <div className="overflow-x-auto border border-slate-800 rounded-lg bg-[#131822] font-mono">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0B0F17] border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3 font-bold">Part Description / Title</th>
                    <th className="py-2.5 px-3 font-bold">Supplier</th>
                    <th className="py-2.5 px-3 font-bold text-center">Stock Status</th>
                    <th className="py-2.5 px-3 font-bold text-right">Unit Price</th>
                    <th className="py-2.5 px-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProducts.map((product, idx) => {
                    const titleClean = (product.title || '').split('||')[0].trim();
                    const storeNorm = (product.store || '').toUpperCase();
                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-200 line-clamp-1 font-sans text-xs">{titleClean}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold">
                            {storeNorm}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {product.in_stock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              IN STOCK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                              OUT OF STOCK
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-400">
                          {product.formatted_price || `${product.price.toFixed(2)} TL`}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-bold transition-all"
                          >
                            SOURCE <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid Card View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={`${product.store}-${idx}`} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
