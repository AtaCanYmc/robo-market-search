import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  PackageCheck,
  X,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const STORES_LIST = [
  { id: 'robotistan', name: 'Robotistan', dotColor: 'bg-rose-500' },
  { id: 'robolink', name: 'Robolink', dotColor: 'bg-sky-500' },
  { id: 'robo90', name: 'Robo90', dotColor: 'bg-teal-500' },
  { id: 'direncnet', name: 'Direnç.net', dotColor: 'bg-orange-500' },
  { id: 'ozdisan', name: 'Özdisan', dotColor: 'bg-blue-600' },
  { id: 'motorobit', name: 'Motorobit', dotColor: 'bg-amber-500' },
];

export const SearchTab: React.FC = () => {
  const { t } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('ESP32-WROOM');
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc'>('price_asc');
  const [stockOnly, setStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedStores, setSelectedStores] = useState<string[]>([
    'robotistan',
    'robolink',
    'robo90',
    'direncnet',
    'ozdisan',
    'motorobit',
  ]);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleQueries = ['ESP32-S3', 'Raspberry Pi 5', 'STM32F401', 'OLED 0.96', 'TB6612FNG', 'BME280', '10K Direnç'];

  // Global hotkey: '/' or 'Cmd+K' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (e?: React.FormEvent, searchQuery?: string) => {
    if (e) e.preventDefault();
    const q = searchQuery !== undefined ? searchQuery : query;
    if (!q.trim()) return;

    if (searchQuery !== undefined) {
      setQuery(searchQuery);
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const isPriceAsc = sortBy === 'price_asc';
      const res = await api.search(q.trim(), limit, isPriceAsc, true);

      if (res.success && res.products) {
        setProducts(res.products);
      } else {
        setError(res.error || 'Arama sırasında bir hata oluştu.');
      }
    } catch (err: any) {
      setError(err.message || 'REST API sunucusuna bağlanılamadı.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial search
  useEffect(() => {
    handleSearch(undefined, 'ESP32-WROOM');
  }, []);

  const toggleStore = (storeId: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeId) ? prev.filter((s) => s !== storeId) : [...prev, storeId]
    );
  };

  const selectAllStores = () => {
    setSelectedStores(STORES_LIST.map((s) => s.id));
  };

  const clearStores = () => {
    setSelectedStores([]);
  };

  // Count products by store before store filter
  const storeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      const s = (p.store || '').toLowerCase();
      counts[s] = (counts[s] || 0) + 1;
    }
    return counts;
  }, [products]);

  // Filter products locally by selected stores and stock
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const pStore = (p.store || '').toLowerCase();
      if (selectedStores.length > 0 && !selectedStores.includes(pStore)) {
        return false;
      }
      if (stockOnly && !p.in_stock) {
        return false;
      }
      return true;
    });

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  }, [products, selectedStores, stockOnly, sortBy]);

  // Best Price calculation
  const bestPrice = useMemo(() => {
    const inStock = filteredProducts.filter((p) => p.in_stock && p.price > 0);
    if (inStock.length === 0) return null;
    return Math.min(...inStock.map((p) => p.price));
  }, [filteredProducts]);

  // Export helpers
  const exportAsCSV = () => {
    const headers = ['Ürün Adı', 'Mağaza', 'Fiyat (TL)', 'Stok Durumu', 'Ürün Linki'];
    const rows = filteredProducts.map((p) => [
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${p.store}"`,
      p.price.toFixed(2),
      p.in_stock ? 'Stokta' : 'Tükendi',
      `"${p.url}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robo-search-${query.trim().toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsJSON = () => {
    const jsonStr = JSON.stringify(filteredProducts, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robo-search-${query.trim().toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsMarkdown = () => {
    const lines = [
      `# Arama Sonuçları: ${query}`,
      '',
      '| Parça Adı | Mağaza | Fiyat (TL) | Stok Durumu | Link |',
      '| :--- | :--- | :--- | :--- | :--- |',
      ...filteredProducts.map(
        (p) =>
          `| ${(p.title || '').replace(/\|/g, '-')} | ${p.store} | ${p.price.toFixed(2)} TL | ${
            p.in_stock ? 'Stokta' : 'Tükendi'
          } | [İncele](${p.url}) |`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robo-search-${query.trim().toLowerCase()}.md`;
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

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="text-center pt-2 pb-1 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t('searchTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t('searchSubtitle')}
        </p>
      </div>

      {/* Main Search Bar & Quick Chips */}
      <form onSubmit={(e) => handleSearch(e)} className="max-w-4xl mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder') || 'Ürün Ara'}
              className="w-full h-12 pl-10 pr-20 rounded-xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Aramayı Temizle"
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 select-none">
              /
            </kbd>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0 active:scale-98"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{t('execute')}</span>
          </button>
        </div>

        {/* Quick Sample Query Chips */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">{t('quickIndex')}</span>
          {sampleQueries.map((sq) => (
            <button
              key={sq}
              type="button"
              onClick={() => handleSearch(undefined, sq)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-mono text-xs transition-all cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Filter Panel */}
        <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 space-y-3.5 shadow-xs">
          {/* Store Pills & Batch Actions */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {t('vendors')}
              </span>
              <span className="text-[11px] text-slate-400">
                ({selectedStores.length}/{STORES_LIST.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllStores}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Tümü
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                type="button"
                onClick={clearStores}
                className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                Temizle
              </button>
            </div>
          </div>

          {/* Store Toggle Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {STORES_LIST.map((s) => {
              const checked = selectedStores.includes(s.id);
              const count = storeCounts[s.id] ?? 0;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleStore(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    checked
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/70 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${s.dotColor} ${checked ? 'opacity-100' : 'opacity-40'}`} />
                  <span>{s.name}</span>
                  {searched && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/80 dark:bg-slate-800/80 font-mono text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Stock Only, Limit, Sorting */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className="font-medium">{t('inStockOnly')}</span>
            </label>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 dark:text-slate-400">{t('limit')}</span>
                {[5, 10, 20].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLimit(val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border cursor-pointer transition-all ${
                      limit === val
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sıralama Seçimi / Sort Order"
                className="h-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="price_asc">{t('priceLowHigh')}</option>
                <option value="price_desc">{t('priceHighLow')}</option>
                <option value="name_asc">{t('nameAZ')}</option>
              </select>
            </div>
          </div>
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="max-w-4xl mx-auto p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Header & Views */}
      {searched && (
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Summary Strip */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t('indexResults')}</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  ({filteredProducts.length} {t('recordsFound')})
                </span>
              </h2>

              {bestPrice !== null && (
                <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium border border-emerald-500/20">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>En Düşük: {bestPrice.toFixed(2)} TL</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-[#111726] text-slate-900 dark:text-slate-100 font-medium shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Kart Görünümü"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">{t('gridView')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-[#111726] text-slate-900 dark:text-slate-100 font-medium shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Tablo Görünümü"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">{t('tableView')}</span>
                </button>
              </div>

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{t('export')}</span>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 py-1.5 text-xs">
                    <button
                      onClick={exportAsCSV}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> CSV Olarak İndir
                    </button>
                    <button
                      onClick={exportAsJSON}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-blue-500" /> JSON Olarak İndir
                    </button>
                    <button
                      onClick={exportAsMarkdown}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-purple-500" /> Markdown Olarak İndir
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                      <span>{copied ? 'Kopyalandı!' : 'Panoya Kopyala'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Render */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
              {t('noRecords')}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={`${product.store}-${idx}`}
                  product={product}
                  isBestPrice={Boolean(bestPrice !== null && product.in_stock && product.price > 0 && product.price === bestPrice)}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto w-full border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-[#111726] shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-mono tracking-wider">
                    <th className="py-3 px-4 font-semibold">{t('thPartTitle')}</th>
                    <th className="py-3 px-3 font-semibold">{t('thSupplier')}</th>
                    <th className="py-3 px-3 font-semibold text-center">{t('thStockStatus')}</th>
                    <th className="py-3 px-3 font-semibold text-right">{t('thUnitPrice')}</th>
                    <th className="py-3 px-4 font-semibold text-right">{t('thAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredProducts.map((product, idx) => {
                    const storeNorm = (product.store || '').toLowerCase();
                    const storeObj = STORES_LIST.find((s) => s.id === storeNorm);
                    const isLowest = Boolean(bestPrice !== null && product.in_stock && product.price > 0 && product.price === bestPrice);

                    return (
                      <tr
                        key={`${product.store}-${idx}`}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 max-w-xs sm:max-w-md truncate">
                          <div className="flex items-center gap-2">
                            {isLowest && (
                              <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <Sparkles className="w-2.5 h-2.5" /> En İyi
                              </span>
                            )}
                            <span className="truncate" title={product.title}>
                              {product.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            <span className={`w-1.5 h-1.5 rounded-full ${storeObj?.dotColor || 'bg-slate-400'}`} />
                            {storeObj?.name || product.store}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {product.in_stock ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                              {t('inStock')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                              {t('outOfStock')}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {product.formatted_price || `${product.price.toFixed(2)} TL`}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-2xs transition-all active:scale-98"
                          >
                            <span>{t('source')}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
