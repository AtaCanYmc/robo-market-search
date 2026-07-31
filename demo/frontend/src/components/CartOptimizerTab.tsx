import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Calculator,
  CheckCircle2,
  Truck,
  Sliders,
  RotateCcw,
  Check,
} from 'lucide-react';
import { api } from '../services/api';

interface Thresholds {
  robotistan: number;
  robolink: number;
  robo90: number;
  direncnet: number;
  shippingFee: number;
}

const DEFAULT_THRESHOLDS: Thresholds = {
  robotistan: 1500,
  robolink: 1500,
  robo90: 1500,
  direncnet: 1500,
  shippingFee: 60,
};

export const CartOptimizerTab: React.FC = () => {
  const [items, setItems] = useState<string[]>([
    'ESP32-WROOM',
    '5V Çift Kanal Röle Kartı',
    '0.96 inç OLED Ekran',
  ]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any | null>(null);

  // User-configurable shipping thresholds
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);
  const [showSettings, setShowSettings] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ROBO_SHIPPING_THRESHOLDS');
    if (saved) {
      try {
        setThresholds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveThresholds = (newT: Thresholds) => {
    setThresholds(newT);
    localStorage.setItem('ROBO_SHIPPING_THRESHOLDS', JSON.stringify(newT));
  };

  const resetThresholds = () => {
    saveThresholds(DEFAULT_THRESHOLDS);
  };

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

  const stores = [
    { id: 'robotistan', name: 'Robotistan', color: 'text-blue-400 border-blue-500/30' },
    { id: 'robolink', name: 'Robolink', color: 'text-orange-400 border-orange-500/30' },
    { id: 'robo90', name: 'Robo90', color: 'text-purple-400 border-purple-500/30' },
    { id: 'direncnet', name: 'Direnç.net', color: 'text-emerald-400 border-emerald-500/30' },
  ];

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
          Gerekli parçalarınız için özel kargo sınırlarınızı ayarlayın ve en ucuz sepet kombinasyonunu hesaplayın.
        </p>
      </div>

      {/* Customizable Free Shipping Thresholds Accordion */}
      <div className="max-w-3xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-slate-200 text-xs sm:text-sm">
              Mağaza Ücretsiz Kargo Limitleri & Ücret Ayarları
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetThresholds}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-850 transition-all"
              title="Varsayılan Sınırları Yükle"
            >
              <RotateCcw className="w-3 h-3" /> Sıfırla
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 transition-all"
            >
              <Sliders className="w-3.5 h-3.5" />
              {showSettings ? 'Ayarları Gizle' : 'Limitleri Düzenle'}
            </button>
          </div>
        </div>

        {/* Editable Inputs */}
        {showSettings && (
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            {stores.map((s) => (
              <div key={s.id} className="space-y-1 bg-slate-950/70 p-2.5 rounded-xl border border-slate-850">
                <label className="text-[11px] font-semibold text-slate-300 block truncate">
                  {s.name} Ücretsiz Kargo:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={thresholds[s.id as keyof Thresholds]}
                    onChange={(e) =>
                      saveThresholds({
                        ...thresholds,
                        [s.id]: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">TL</span>
                </div>
              </div>
            ))}

            <div className="space-y-1 bg-slate-950/70 p-2.5 rounded-xl border border-slate-850">
              <label className="text-[11px] font-semibold text-slate-300 block truncate">
                Sabit Kargo Ücreti:
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={thresholds.shippingFee}
                  onChange={(e) =>
                    saveThresholds({
                      ...thresholds,
                      shippingFee: Math.max(0, parseFloat(e.target.value) || 0),
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">TL</span>
              </div>
            </div>
          </div>
        )}

        {/* Current Active Thresholds Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400">Aktif Limitler:</span>
          {stores.map((s) => (
            <span
              key={s.id}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-950 border ${s.color}`}
            >
              {s.name}: {thresholds[s.id as keyof Thresholds]} TL
            </span>
          ))}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-950 border text-slate-300 border-slate-700">
            Kargo: {thresholds.shippingFee} TL
          </span>
        </div>
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
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                  <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Kargo Sınırları Analizi:
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Belirlediğiniz kargo limitlerine ({thresholds.robotistan} TL Robotistan, {thresholds.robolink} TL Robolink, {thresholds.robo90} TL Robo90, {thresholds.direncnet} TL Direnç.net) göre sepetiniz bölümlendirildi.
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
