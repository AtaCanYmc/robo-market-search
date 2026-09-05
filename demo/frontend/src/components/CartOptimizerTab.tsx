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
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

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
  const { t } = useTheme();
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
    { id: 'robotistan', name: 'Robotistan' },
    { id: 'robolink', name: 'Robolink' },
    { id: 'robo90', name: 'Robo90' },
    { id: 'direncnet', name: 'Direnç.net' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="text-center pt-2 pb-1 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded px-2.5 py-1 text-blue-600 dark:text-blue-400 text-xs font-medium">
          <ShoppingBag className="w-3.5 h-3.5" /> {t('cartTitle')}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t('cartTitle')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
          {t('cartSubtitle')}
        </p>
      </div>

      {/* Customizable Free Shipping Thresholds Accordion */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
              {t('freightTitle')}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetThresholds}
              className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
              title="Varsayılan Değerlere Dön"
            >
              <RotateCcw className="w-3 h-3" /> {t('reset')}
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1 px-3 py-1 rounded bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/40 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              {showSettings ? t('hideSettings') : t('editThresholds')}
            </button>
          </div>
        </div>

        {/* Editable Inputs */}
        {showSettings && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
            {stores.map((s) => (
              <div
                key={s.id}
                className="space-y-1 bg-slate-50 dark:bg-[#0B0F17] p-2.5 rounded border border-slate-200 dark:border-slate-800"
              >
                <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block truncate">
                  {s.name} Alt Limit
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
                    className="w-full bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                    TL
                  </span>
                </div>
              </div>
            ))}

            <div className="space-y-1 bg-slate-50 dark:bg-[#0B0F17] p-2.5 rounded border border-slate-200 dark:border-slate-800">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block truncate">
                Sabit Kargo Ücreti
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
                  className="w-full bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                  TL
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Current Active Thresholds Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="text-slate-500">{t('activeConstraints')}:</span>
          {stores.map((s) => (
            <span
              key={s.id}
              className="font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]"
            >
              {s.name}: {thresholds[s.id as keyof Thresholds]} TL
            </span>
          ))}
          <span className="font-medium px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 font-mono text-[10px]">
            Kargo: {thresholds.shippingFee} TL
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Component List */}
        <div className="bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-500" />
            {t('manifestTitle')}
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
              placeholder={t('addMpnPlaceholder')}
              className="flex-1 bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded transition-all flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" /> {t('add')}
            </button>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
              >
                <span className="font-mono text-xs">{item}</span>
                <button
                  onClick={() => removeItem(item)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer p-0.5"
                  title={`${item} sil`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleOptimize}
            disabled={loading || items.length === 0}
            className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
            {t('optimizeCart')}
          </button>
        </div>

        {/* Right: Optimization Results */}
        <div className="bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 shadow-sm">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-500" />
            {t('optimizationSummary')}
          </h3>

          {optimizationResult ? (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider font-mono">
                    {t('optimalCost')}
                  </div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {optimizationResult.total_cost
                      ? `${optimizationResult.total_cost.toFixed(2)} TL`
                      : 'HESAPLANDI'}
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
              </div>

              <div className="p-3 rounded bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> {t('freightEvaluated')}
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                  {t('freightEvaluatedDesc')} ({thresholds.robotistan} TL Robotistan, {thresholds.robolink} TL Robolink, {thresholds.robo90} TL Robo90, {thresholds.direncnet} TL Direnç.net).
                </p>
              </div>
            </div>
          ) : (
            <div className="h-48 border border-dashed border-slate-200 dark:border-slate-800 rounded flex flex-col items-center justify-center text-center p-4">
              <p className="text-slate-400 dark:text-slate-500 text-xs">
                {t('optimizerPrompt')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
