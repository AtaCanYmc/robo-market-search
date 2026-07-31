import React, { useState } from 'react';
import { Search, SlidersHorizontal, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { api } from '../services/api';

export const SearchTab: React.FC = () => {
  const [query, setQuery] = useState('ESP32');
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc'>('price_asc');
  const [stockOnly, setStockOnly] = useState(false);
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

  const sampleQueries = ['ESP32-WROOM', 'Arduino Uno', 'Relay 5V', 'OLED 0.96', 'L298N Motor Sürücü'];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const isPriceAsc = sortBy === 'price_asc';
      const res = await api.search(query.trim(), limit, isPriceAsc, true);

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

  return (
    <div className="space-y-6">
      {/* Hero Headline */}
      <div className="text-center pt-4 pb-2">
        <div className="inline-flex items-center gap-2 mb-3 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-medium px-3.5 py-1.5">
          <Sparkles className="w-3.5 h-3.5" /> 4 Markette Canlı Fiyat Karşılaştırma
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight leading-tight">
          Türkiye'nin Elektronik <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Arama Motoru</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-xs sm:text-sm mt-2">
          Robotistan, Robolink, Robo90 ve Direnç.net mağazalarını tek komutla eşzamanlı tarayın.
        </p>
      </div>

      {/* Main Search Form */}
      <form onSubmit={handleSearch} className="max-w-3xl mx-auto space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bileşen adı veya parça numarası... (örn. ESP32, Relay 5V)"
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-12 pr-32 py-3.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 shadow-lg shadow-slate-950/60 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Ara
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 justify-center">
          <span className="text-slate-500">Örnekler:</span>
          {sampleQueries.map((sq) => (
            <button
              key={sq}
              type="button"
              onClick={() => {
                setQuery(sq);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-all"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Left: Store Checkboxes */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /> Mağazalar:
            </span>
            {[
              { id: 'robotistan', name: 'Robotistan' },
              { id: 'robolink', name: 'Robolink' },
              { id: 'robo90', name: 'Robo90' },
              { id: 'direncnet', name: 'Direnç.net' },
            ].map((store) => (
              <label key={store.id} className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={selectedStores.includes(store.id)}
                  onChange={() => toggleStore(store.id)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20 bg-slate-950"
                />
                <span>{store.name}</span>
              </label>
            ))}
          </div>

          {/* Right: Limits & Sorting */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Limit:</span>
              <div className="flex gap-1">
                {[5, 10, 20].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLimit(val)}
                    className={`px-2.5 py-0.5 rounded-md font-medium border text-[11px] transition-all ${
                      limit === val
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sıralama:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="price_asc">Fiyat: Artan (En Ucuz)</option>
                <option value="price_desc">Fiyat: Azalan (En Pahalı)</option>
                <option value="name_asc">Ürün Adı: A-Z</option>
              </select>
            </div>

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300 select-none">
              <input
                type="checkbox"
                checked={stockOnly}
                onChange={(e) => setStockOnly(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500/20 bg-slate-950"
              />
              <span>Stoktakiler</span>
            </label>
          </div>
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 h-48 animate-pulse flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
              <div className="h-8 bg-slate-800 rounded w-full mt-4" />
            </div>
          ))}
        </div>
      )}

      {/* Product Results */}
      {!loading && searched && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300">
              Arama Sonuçları ({filteredProducts.length} Ürün Bulundu)
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 border border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-sm">Seçilen filtrelere uygun ürün bulunamadı.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
