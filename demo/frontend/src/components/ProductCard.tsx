import React from 'react';
import { ExternalLink, Check, X, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const storeNormalized = (product.store || '').toLowerCase();

  const storeBadgeColors: Record<string, string> = {
    robotistan: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    robolink: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    robo90: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    direncnet: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  };

  const badgeClass =
    storeBadgeColors[storeNormalized] || 'bg-slate-800 text-slate-300 border-slate-700';

  const storeDisplayName =
    storeNormalized === 'robotistan'
      ? 'Robotistan'
      : storeNormalized === 'robolink'
      ? 'Robolink'
      : storeNormalized === 'robo90'
      ? 'Robo90'
      : storeNormalized === 'direncnet'
      ? 'Direnç.net'
      : product.store;

  return (
    <div className="group bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20">
      <div>
        {/* Header: Store Badge & Stock Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
            {storeDisplayName}
          </span>
          {product.in_stock ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <Check className="w-3 h-3" /> Stokta Var
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400">
              <X className="w-3 h-3" /> Stokta Yok
            </span>
          )}
        </div>

        {/* Product Image Fallback or Display */}
        {product.image_url ? (
          <div className="w-full h-36 mb-3 rounded-xl overflow-hidden bg-slate-950/60 flex items-center justify-center p-2 border border-slate-850">
            <img
              src={product.image_url}
              alt={product.title}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        ) : null}

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2 leading-snug">
          {product.title}
        </h3>
      </div>

      {/* Price & Action Footer */}
      <div className="pt-3 mt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <div>
          <div className="text-xs text-slate-400">Fiyat</div>
          <div className="text-base font-extrabold text-cyan-300">
            {product.formatted_price || `${product.price.toFixed(2)} TL`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              title="Sepete Ekle"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all"
          >
            Mağazaya Git
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
