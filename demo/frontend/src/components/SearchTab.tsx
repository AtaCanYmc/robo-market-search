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
  PackageCheck,
  ShoppingBag,
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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
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

  const sampleQueries = ['ESP32-WROOM', 'Arduino Uno', '5V Röle', 'OLED 0.96', 'L298N', 'STM32F103'];

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
    const headers = ['Ürün Adı', 'Birim Fiyat (TL)', 'Mağaza', 'Stok', 'URL'];
    const rows = filteredProducts.map((p) => [
      `"${(p.title || '').replace(/"/g, '""')}"`,
      p.price,
      `"${p.store}"`,
      p.in_stock ? 'VAR' : 'YOK',
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
      `# Arama Sonuçları — "${query.trim()}"`,
      ``,
      `| Ürün Adı | Fiyat | Mağaza | Stok | Link |`,
      `| --- | --- | --- | --- | --- |`,
      ...filteredProducts.map(
        (p) =>
          `| ${p.title} | ${p.price.toFixed(2)} TL | ${p.store} | ${
            p.in_stock ? 'Stokta Var' : 'Stokta Yok'
          } | [İncele](${p.url}) |`
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
    { id: 'robotistan', name: 'Robotistan', color: 'bg-blue-500' },
    { id: 'robolink', name: 'Robolink', color: 'bg-emerald-500' },
    { id: 'robo90', name: 'Robo90', color: 'bg-purple-500' },
    { id: 'direncnet', name: 'Direnç.net', color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Clean, Human Headline */}
      <div className="text-center pt-2 pb-1 space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t('searchTitle')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          {t('searchSubtitle')}
        </p>
      </div>

      {/* Main Search Form (Mobile-First responsive flex) */}
      <form onSubmit={(e) => handleSearch(e)} className="max-w-3xl mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0 active:scale-98"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{t('execute')}</span>
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center text-xs">
          <span className="text-slate-500 dark:text-slate-400">{t('quickIndex')}</span>
          {sampleQueries.map((sq) => (
            <button
              key={sq}
              type="button"
              onClick={() => handleSearch(undefined, sq)}
              className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-mono transition-all cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Filters Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 space-y-3 shadow-xs">
          {/* Store Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {t('vendors')}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {storesList.map((s) => {
                const checked = selectedStores.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleStore(s.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      checked
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${s.color} ${checked ? 'opacity-100' : 'opacity-40'}`} />
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Controls: Stock, Limit, Sort */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-0"
              />
              <span>{t('inStockOnly')}</span>
            </label>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 dark:text-slate-400">{t('limit')}</span>
                {[5, 10, 20].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLimit(val)}
                    className={`px-2 py-0.5 rounded text-xs font-mono border cursor-pointer ${
                      limit === val
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
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
        <div className="max-w-3xl mx-auto p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Header & Views */}
      {searched && (
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t('indexResults')}</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({filteredProducts.length} {t('recordsFound')})
              </span>
            </h2>

            <div className="flex items-center gap-2">
              {/* View Mode Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 cursor-pointer transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium shadow-xs'
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
                  className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 cursor-pointer transition-all ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium shadow-xs'
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
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{t('export')}</span>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-30 py-1 text-xs">
                    <button
                      onClick={exportAsCSV}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> CSV Olarak İndir
                    </button>
                    <button
                      onClick={exportAsJSON}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-blue-500" /> JSON Olarak İndir
                    </button>
                    <button
                      onClick={exportAsMarkdown}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-purple-500" /> Markdown Olarak İndir
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                      <span>{copied ? 'Kopyalandı!' : 'Panoya Kopyala'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Views */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500 text-sm">
              {t('noRecords')}
            </div>
          ) : viewMode === 'grid' ? (
            /* Modern Responsive Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={`${product.store}-${idx}`} product={product} />
              ))}
            </div>
          ) : (
            /* Clean Responsive Table with Safe Horizontal Overflow Container */
            <div className="overflow-x-auto w-full border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-3.5 font-semibold">{t('thPartTitle')}</th>
                    <th className="py-3 px-3 font-semibold">{t('thSupplier')}</th>
                    <th className="py-3 px-3 font-semibold text-center">{t('thStockStatus')}</th>
                    <th className="py-3 px-3 font-semibold text-right">{t('thUnitPrice')}</th>
                    <th className="py-3 px-3.5 font-semibold text-right">{t('thAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-slate-100 max-w-xs sm:max-w-sm md:max-w-md truncate">
                          {product.title}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {storeLabel}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {product.in_stock ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-md">
                              {t('inStock')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-2 py-0.5 rounded-md">
                              {t('outOfStock')}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {product.formatted_price || `${product.price.toFixed(2)} TL`}
                        </td>
                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 text-xs font-medium transition-all"
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
