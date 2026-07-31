import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Calculator, CheckCircle2, Truck } from 'lucide-react';
import { api } from '../services/api';

export const CartOptimizerTab: React.FC = () => {
  const [items, setItems] = useState<string[]>([
    'ESP32-WROOM',
    '5V Çift Kanal Röle Kartı',
    '0.96 inç OLED Ekran',
  ]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any | null>(null);

  const addItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (item: string) => {
    setItems(items.filter((i) => i !== item));
  };

  const handleOptimize = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await api.optimizeCart(items);
      if (res.success) {
        setOptimizationResult(res);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center pt-4 pb-2">
        <div className="inline-flex items-center gap-2 mb-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium px-3.5 py-1.5">
          <ShoppingBag className="w-3.5 h-3.5" /> Akıllı Sepet Bölüşümü & Kargo Limiti
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
          Sepet <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Optimizasyonu</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-xs sm:text-sm mt-2">
          Gerekli parçalarınız için mağazalar arası kargo barajlarını (ücretsiz kargo limitlerini) analiz ederek en ucuz sepet kombinasyonunu hesaplar.
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Component List */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            Alınacak Bileşen Listesi
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
              placeholder="Parça ekle..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={addItem}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Ekle
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs text-slate-200"
              >
                <span>{item}</span>
                <button onClick={() => removeItem(item)} className="text-slate-500 hover:text-rose-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleOptimize}
            disabled={loading || items.length === 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Sepet Maliyetini Optimize Et
          </button>
        </div>

        {/* Right: Optimization Results */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            Optimizasyon Özeti
          </h3>

          {optimizationResult ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-[11px]">Tahmini En Optimum Maliyet</div>
                  <div className="text-xl font-extrabold text-emerald-400">
                    {optimizationResult.total_cost
                      ? `${optimizationResult.total_cost.toFixed(2)} TL`
                      : 'Hesaplandı'}
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850">
                  <div className="font-semibold text-slate-200 mb-1">Mağaza Bölüşüm Stratejisi:</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Ürünler Robotistan ve Robolink mağazaları arasında bölünerek ücretsiz kargo limitlerini aşacak şekilde gruplandırıldı.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-center p-4">
              <p className="text-slate-500 text-xs">
                Sol taraftan parçalarınızı ekleyip <strong>"Sepet Maliyetini Optimize Et"</strong> butonuna basın.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
