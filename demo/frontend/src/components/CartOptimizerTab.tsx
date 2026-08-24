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
    { id: 'robotistan', name: 'ROBOTISTAN', color: 'text-blue-400 border-blue-500/30' },
    { id: 'robolink', name: 'ROBOLINK', color: 'text-orange-400 border-orange-500/30' },
    { id: 'robo90', name: 'ROBO90', color: 'text-purple-400 border-purple-500/30' },
    { id: 'direncnet', name: 'DIRENCNET', color: 'text-emerald-400 border-emerald-500/30' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="text-center pt-2 pb-1 space-y-1.5 font-mono">
        <div className="inline-flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/30 rounded px-2.5 py-1 text-blue-400 text-xs uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5" /> MULTI-VENDOR PROCUREMENT ALLOCATION & FREIGHT OPTIMIZER
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 uppercase tracking-tight">
          PROCUREMENT CART MATRIX
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-xs font-sans">
          Configure custom vendor freight thresholds and compute mathematically optimal multi-store procurement splits.
        </p>
      </div>

      {/* Customizable Free Shipping Thresholds Accordion */}
      <div className="max-w-4xl mx-auto bg-[#131822] border border-slate-800 rounded-lg p-4 space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              VENDOR FREIGHT THRESHOLDS & SHIPPING PARAMETERS
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetThresholds}
              className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded bg-[#0B0F17] border border-slate-800 transition-all uppercase"
              title="Reset Default Thresholds"
            >
              <RotateCcw className="w-3 h-3" /> RESET
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 px-3 py-1 rounded bg-blue-600/20 border border-blue-500/40 transition-all uppercase"
            >
              <Sliders className="w-3.5 h-3.5" />
              {showSettings ? 'HIDE SETTINGS' : 'EDIT THRESHOLDS'}
            </button>
          </div>
        </div>

        {/* Editable Inputs */}
        {showSettings && (
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
            {stores.map((s) => (
              <div key={s.id} className="space-y-1 bg-[#0B0F17] p-2 rounded border border-slate-800">
                <label className="text-[10px] font-bold text-slate-400 block truncate uppercase">
                  {s.name} FREE MIN:
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
                    className="w-full bg-[#131822] border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">TRY</span>
                </div>
              </div>
            ))}

            <div className="space-y-1 bg-[#0B0F17] p-2 rounded border border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 block truncate uppercase">
                FLAT FREIGHT FEE:
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
                  className="w-full bg-[#131822] border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs font-mono focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">TRY</span>
              </div>
            </div>
          </div>
        )}

        {/* Current Active Thresholds Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
          <span className="text-slate-500 uppercase">ACTIVE CONSTRAINTS:</span>
          {stores.map((s) => (
            <span
              key={s.id}
              className="font-bold px-2 py-0.5 rounded bg-[#0B0F17] border border-slate-800 text-slate-300"
            >
              {s.name}: {thresholds[s.id as keyof Thresholds]} TRY
            </span>
          ))}
          <span className="font-bold px-2 py-0.5 rounded bg-[#0B0F17] border border-slate-800 text-blue-300">
            FREIGHT: {thresholds.shippingFee} TRY
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Component List */}
        <div className="bg-[#131822] border border-slate-800 rounded-lg p-4 space-y-3 font-mono">
          <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            PROCUREMENT MANIFEST LIST
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
              placeholder="ENTER MPN OR PART NAME..."
              className="flex-1 bg-[#0B0F17] border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 uppercase"
            />
            <button
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-2 rounded transition-all flex items-center gap-1 shadow"
            >
              <Plus className="w-3.5 h-3.5" /> ADD
            </button>
          </div>

          <div className="space-y-1.5">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-2.5 rounded bg-[#0B0F17] border border-slate-800 text-xs text-slate-200 font-sans"
              >
                <span className="font-mono text-xs">{item}</span>
                <button onClick={() => removeItem(item)} className="text-slate-500 hover:text-rose-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleOptimize}
            disabled={loading || items.length === 0}
            className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            OPTIMIZE PROCUREMENT MATRIX
          </button>
        </div>

        {/* Right: Optimization Results */}
        <div className="bg-[#131822] border border-slate-800 rounded-lg p-4 space-y-3 font-mono">
          <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            OPTIMIZATION METRICS SUMMARY
          </h3>

          {optimizationResult ? (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded bg-[#0B0F17] border border-slate-800 text-emerald-300 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider">OPTIMAL GRAND TOTAL COST</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {optimizationResult.total_cost
                      ? `${optimizationResult.total_cost.toFixed(2)} TL`
                      : 'CALCULATED'}
                  </div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="p-3 rounded bg-[#0B0F17] border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> FREIGHT CONSTRAINTS EVALUATED:
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
                    Procurement list evaluated against active free shipping thresholds ({thresholds.robotistan} TL Robotistan, {thresholds.robolink} TL Robolink, {thresholds.robo90} TL Robo90, {thresholds.direncnet} TL Direnç.net).
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 border border-dashed border-slate-800 rounded flex flex-col items-center justify-center text-center p-4">
              <p className="text-slate-500 text-xs font-mono">
                ADD MANIFEST ITEMS ON THE LEFT PANEL AND CLICK <strong>"OPTIMIZE PROCUREMENT MATRIX"</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
