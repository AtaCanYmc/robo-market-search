import React, { useState } from 'react';
import { Layers, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { api } from '../services/api';

export const BatchSearchTab: React.FC = () => {
  const [queries, setQueries] = useState<string[]>(['ESP32', 'Relay 5V', 'OLED 0.96']);
  const [newQuery, setNewQuery] = useState('');
  const [limit, setLimit] = useState(5);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, Product[]>>({});
  const [error, setError] = useState<string | null>(null);

  const addQuery = () => {
    if (newQuery.trim() && !queries.includes(newQuery.trim())) {
      setQueries([...queries, newQuery.trim()]);
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
    <div className="space-y-6">
      <div className="text-center pt-4 pb-2">
        <div className="inline-flex items-center gap-2 mb-3 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-medium px-3.5 py-1.5">
          <Layers className="w-3.5 h-3.5" /> Çoklu Parça Araması
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
          Toplu Parça <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Araması</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-xs sm:text-sm mt-2">
          Birden fazla donanım elemanını listeye ekleyin ve tüm mağazalarda paralel olarak aratın.
        </p>
      </div>

      {/* Query Input Box & Tags */}
      <div className="max-w-3xl mx-auto bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQuery())}
            placeholder="Bileşen adı ekle (örn. LM2596 Voltaj Regülatörü)..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="button"
            onClick={addQuery}
            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" /> Ekle
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {queries.map((q) => (
            <span
              key={q}
              className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium px-3 py-1 rounded-xl"
            >
              {q}
              <button onClick={() => removeQuery(q)} className="hover:text-rose-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Action button */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Market başına limit:</span>
            {[3, 5, 10].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setLimit(val)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                  limit === val
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'border-slate-800 text-slate-400'
                }`}
              >
                {val}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleBatchSearch}
            disabled={loading || queries.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            Toplu Arama Başlat ({queries.length} Parça)
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Grouped Results */}
      {Object.keys(results).length > 0 && (
        <div className="space-y-8">
          {Object.entries(results).map(([q, prods]) => (
            <div key={q} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Sorgu: <span className="text-purple-300">"{q}"</span>
                </h3>
                <span className="text-xs text-slate-400">{prods.length} Sonuç Bulundu</span>
              </div>

              {prods.length === 0 ? (
                <p className="text-slate-500 text-xs py-4">Bu sorgu için sonuç bulunamadı.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
