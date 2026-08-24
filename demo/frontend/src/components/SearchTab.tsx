import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../context/ThemeContext';

export const SearchTab: React.FC = () => {
  const { t } = useTheme();
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

  const sampleQueries = ['ESP32-WROOM', 'Arduino Uno', 'Relay 5V', 'OLED 0.96', 'L298N', 'STM32F103'];

  const addLog = (msg: string) => {
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    setExecutionLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleSearch = async (e?: React.FormEvent, searchQuery?: string) => {
    if (e) e.preventDefault();
    const q = searchQuery || query;
    if (!q.trim()) return;

    if (searchQuery) {
      setQuery(searchQuery);
    }

    setLoading(true);
    setError(null);
    setSearched(true);
    setExecutionLogs([]);

    addLog(`INITIATING COMPONENT INDEX QUERY FOR '${q.trim().toUpperCase()}'...`);
    addLog(`CONNECTING TO VENDOR CLUSTERS (ROBOTISTAN, ROBOLINK, ROBO90, DIRENCNET)...`);

    try {
      const isPriceAsc = sortBy === 'price_asc';
      const res = await api.search(q.trim(), limit, isPriceAsc, true);

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

  // Auto-execute initial search on mount
  useEffect(() => {
    handleSearch(undefined, 'ESP32-WROOM');
  }, []);

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
          `| ${p.title} | ${p.price.toFixed(2)} TL | ${p.store} | ${
            p.in_stock ? 'IN STOCK' : 'OUT OF STOCK'
          } | [Link](${p.url}) |`
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
    const text = filteredProducts
      .map((p) => `${p.title} - ${p.price.toFixed(2)} TL [${p.store}] -> ${p.url}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowExportMenu(false);
  };

  const storesList = [
    { id: 'robotistan', name: 'ROBOTISTAN' },
    { id: 'robolink', name: 'ROBOLINK' },
    { id: 'robo90', name: 'ROBO90' },
    { id: 'direncnet', name: 'DIRENCNET' },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Hero Headline */}
      <div className="text-center pt-2 pb-1 space-y-1.5 font-mono">
        <div className="inline-flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/30 rounded px-2.5 py-1 text-blue-400 text-xs font-mono font-medium uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" /> {t('searchTitle')}
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 font-mono uppercase tracking-tight">
          {t('searchTitle')}
        </h1>
        <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl mx-auto text-xs font-sans">
          {t('searchSubtitle')}
        </p>
      </div>

      {/* Main Search Form */}
      <form onSubmit={(e) => handleSearch(e)} className="max-w-4xl mx-auto space-y-3 font-mono">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-[#131822] dark:bg-[#131822] light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-lg pl-10 pr-28 py-2.5 text-slate-100 dark:text-slate-100 light:text-slate-900 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500/80 shadow-lg transition-all uppercase tracking-wider"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded transition-all disabled:opacity-50 flex items-center gap-1 shadow cursor-pointer"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            {t('execute')}
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 justify-center font-mono">
          <span className="text-slate-500 text-[10px]">{t('quickIndex')}</span>
          {sampleQueries.map((sq) => (
            <button
              key={sq}
              type="button"
              onClick={() => handleSearch(undefined, sq)}
              className="px-2 py-0.5 rounded bg-[#131822] dark:bg-[#131822] light:bg-slate-200 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-800 text-[11px] hover:border-blue-500/50 hover:text-blue-400 transition-all cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Controls & Filter Bar */}
        <div className="bg-[#131822] dark:bg-[#131822] light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
            {/* Vendor Filter Checkboxes */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3 text-blue-400" /> {t('vendors')}
              </span>
              {storesList.map((s) => {
                const checked = selectedStores.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleStore(s.id)}
                    className={`px-2 py-0.5 rounded border text-[10px] font-bold transition-all cursor-pointer ${
                      checked
                        ? 'bg-blue-600/20 text-blue-400 dark:text-blue-300 light:text-blue-700 border-blue-500/50'
                        : 'bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-100 text-slate-500 dark:text-slate-500 light:text-slate-400 border-slate-800 dark:border-slate-800 light:border-slate-300 line-through'
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>

            {/* Sort & Stock Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-1 cursor-pointer text-slate-300 dark:text-slate-300 light:text-slate-700 text-[11px]">
                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(e) => setStockOnly(e.target.checked)}
                  className="rounded border-slate-800 text-blue-600 focus:ring-0 bg-[#0B0F17]"
                />
                <span>{t('inStockOnly')}</span>
              </label>

              <div className="flex items-center gap-1">
                <span className="text-slate-500 text-[10px] font-bold uppercase">{t('limit')}</span>
                {[5, 10, 20].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLimit(val)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border cursor-pointer ${
                      limit === val
                        ? 'bg-blue-600/20 text-blue-400 dark:text-blue-300 light:text-blue-700 border-blue-500/50 font-bold'
                        : 'border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-500'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded px-2 py-0.5 text-slate-300 dark:text-slate-300 light:text-slate-800 text-[11px] font-mono focus:outline-none"
              >
                <option value="price_asc">{t('priceLowHigh')}</option>
                <option value="price_desc">{t('priceHighLow')}</option>
                <option value="name_asc">{t('nameAZ')}</option>
              </select>
            </div>
          </div>
        </div>
      </form>

      {/* Real-time Execution Log Feed */}
      {executionLogs.length > 0 && (
        <div className="max-w-4xl mx-auto bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-blue-400 space-y-1 shadow-inner">
          <div className="text-[10px] text-slate-500 border-b border-slate-850 pb-1 mb-1 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-slate-400" /> {t('logStream')}
            </span>
            <button onClick={() => setExecutionLogs([])} className="hover:text-slate-300">
              <X className="w-3 h-3" />
            </button>
          </div>
          {executionLogs.map((log, idx) => (
            <div key={idx} className="leading-tight">{log}</div>
          ))}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="max-w-4xl mx-auto p-3.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Matrix Header & Controls */}
      {searched && (
        <div className="max-w-4xl mx-auto space-y-3 font-mono">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
            <div>
              <h2 className="font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                {t('indexResults')} ({filteredProducts.length} {t('recordsFound')})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-[#131822] dark:bg-[#131822] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded p-0.5 font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1 rounded text-xs flex items-center gap-1 cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-blue-600/20 text-blue-400 dark:text-blue-300 light:text-blue-700 font-bold border border-blue-500/30'
                      : 'text-slate-400 dark:text-slate-400 light:text-slate-600'
                  }`}
                  title="Data Grid Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">{t('tableView')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded text-xs flex items-center gap-1 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-blue-600/20 text-blue-400 dark:text-blue-300 light:text-blue-700 font-bold border border-blue-500/30'
                      : 'text-slate-400 dark:text-slate-400 light:text-slate-600'
                  }`}
                  title="Grid Card View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">{t('gridView')}</span>
                </button>
              </div>

              {/* Export Dropdown Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 dark:text-blue-300 light:text-blue-700 border border-blue-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('export')}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-1 w-44 bg-[#131822] dark:bg-[#131822] light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded shadow-xl py-1 z-30 font-mono text-xs">
                    <button
                      onClick={exportAsCSV}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Export CSV
                    </button>
                    <button
                      onClick={exportAsJSON}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" /> Export JSON
                    </button>
                    <button
                      onClick={exportAsMarkdown}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-400" /> Export Markdown
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-800/60 dark:hover:bg-slate-800/60 light:hover:bg-slate-100 flex items-center gap-2 text-slate-300 dark:text-slate-300 light:text-slate-700 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Views */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#131822] dark:bg-[#131822] light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded p-8 text-center text-slate-500 font-mono text-xs">
              {t('noRecords')}
            </div>
          ) : viewMode === 'table' ? (
            /* Enterprise Data Grid Table Matrix */
            <div className="overflow-x-auto border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-white shadow-lg">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-[#131822] dark:bg-[#131822] light:bg-slate-100 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 text-slate-400 dark:text-slate-400 light:text-slate-600 text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3 font-bold">{t('thPartTitle')}</th>
                    <th className="py-2.5 px-3 font-bold">{t('thSupplier')}</th>
                    <th className="py-2.5 px-3 font-bold text-center">{t('thStockStatus')}</th>
                    <th className="py-2.5 px-3 font-bold text-right">{t('thUnitPrice')}</th>
                    <th className="py-2.5 px-3 font-bold text-right">{t('thAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 dark:divide-slate-850 light:divide-slate-200">
                  {filteredProducts.map((product, idx) => {
                    const storeNorm = (product.store || '').toLowerCase();
                    const storeLabel =
                      storeNorm === 'robotistan'
                        ? 'Robotistan'
                        : storeNorm === 'robolink'
                        ? 'Robolink'
                        : storeNorm === 'robo90'
                        ? 'Robo90'
                        : storeNorm === 'direncnet'
                        ? 'Direnç.net'
                        : product.store;

                    return (
                      <tr
                        key={`${product.store}-${idx}`}
                        className="hover:bg-slate-800/40 dark:hover:bg-slate-800/40 light:hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900 max-w-xs sm:max-w-md truncate font-sans">
                          {product.title}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#131822] dark:bg-[#131822] light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-800 border border-slate-800 dark:border-slate-800 light:border-slate-300">
                            {storeLabel}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {product.in_stock ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              {t('inStock')}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                              {t('outOfStock')}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">
                          {product.formatted_price || `${product.price.toFixed(2)} TL`}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 dark:text-blue-300 light:text-blue-700 border border-blue-500/40 text-[10px] font-bold transition-all"
                          >
                            {t('source')} <ExternalLink className="w-3 h-3" />
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
