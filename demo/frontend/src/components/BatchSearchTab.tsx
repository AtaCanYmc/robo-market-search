import React, { useState } from 'react';
import { Layers, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export const BatchSearchTab: React.FC = () => {
  const { t } = useTheme();
  const [queries, setQueries] = useState<string[]>(['ESP32-WROOM', 'RELAY 5V', 'OLED 0.96']);
  const [newQuery, setNewQuery] = useState('');
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, Product[]>>({});
  const [error, setError] = useState<string | null>(null);

  const addQuery = () => {
    if (newQuery.trim() && !queries.includes(newQuery.trim().toUpperCase())) {
      setQueries([...queries, newQuery.trim().toUpperCase()]);
      setNewQuery('');
    }
  };

  const removeQuery = (q: string) => {
    setQueries(queries.filter((item) => item !== q));
  };

  const handleBatchSearch = async () => {
    if (queries.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.batchSearch(queries, limit);
      if (res.success && res.results) {
        setResults(res.results);
      } else {
        setError(res.message || 'Toplu arama başarısız oldu.');
      }
    } catch (err: any) {
      setError(err.message || 'REST API sunucusuna bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="text-center pt-2 pb-1 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded px-2.5 py-1 text-blue-600 dark:text-blue-400 text-xs font-medium">
          <Layers className="w-3.5 h-3.5" /> {t('batchTitle')}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t('batchTitle')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
          {t('batchSubtitle')}
        </p>
      </div>

      {/* Query Input Box & Tags */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 shadow-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQuery())}
            placeholder={t('batchPlaceholder')}
            className="flex-1 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase font-mono"
          />
          <button
            type="button"
            onClick={addQuery}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" /> {t('queueMpn')}
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {queries.map((q) => (
            <span
              key={q}
              className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-semibold font-mono px-2.5 py-1 rounded"
            >
              {q}
              <button
                type="button"
                onClick={() => removeQuery(q)}
                className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer p-0.5"
                title={`${q} kaldır`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Action controls */}
        <div className="pt-3 flex items-center justify-between flex-wrap gap-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>{t('limitPerVendor')}:</span>
            <div className="flex gap-1">
              {[3, 5, 10].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLimit(val)}
                  className={`px-2 py-0.5 rounded font-mono text-xs border cursor-pointer transition-colors ${
                    limit === val
                      ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-300 dark:border-blue-500/60 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleBatchSearch}
            disabled={loading || queries.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded transition-all disabled:opacity-50 shadow-sm cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            {t('executeBatch')} ({queries.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto p-3 rounded bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grouped Results */}
      {Object.keys(results).length > 0 && (
        <div className="max-w-7xl mx-auto space-y-6">
          {Object.entries(results).map(([q, prods]) => (
            <div
              key={q}
              className="bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  {t('queryTarget')}{' '}
                  <span className="text-blue-600 dark:text-blue-400 font-mono">"{q}"</span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {prods.length} {t('recordsFound')}
                </span>
              </div>

              {prods.length === 0 ? (
                <p className="text-slate-500 text-xs py-2">{t('noRecords')}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {prods.map((product, idx) => (
                    <ProductCard key={`${q}-${idx}`} product={product} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
