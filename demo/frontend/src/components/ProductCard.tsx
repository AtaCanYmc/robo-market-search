import React, { useState } from 'react';
import { ExternalLink, Check, X, ShoppingBag, Cpu } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

function normalizeImageUrl(url: string | undefined, store: string): string | null {
  if (!url || !url.trim()) return null;
  let trimmed = url.trim();

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://');
  }

  if (trimmed.startsWith('/')) {
    const s = (store || '').toLowerCase();
    const domain =
      s === 'robotistan'
        ? 'https://www.robotistan.com'
        : s === 'robolink'
        ? 'https://www.robolinkmarket.com'
        : s === 'robo90'
        ? 'https://www.robo90.com'
        : s === 'direncnet'
        ? 'https://www.direnc.net'
        : '';
    return domain ? `${domain}${trimmed}` : trimmed;
  }

  return trimmed;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);
  const storeNormalized = (product.store || '').toLowerCase();

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

  const rawImage = product.image_url;
  const imageUrl = normalizeImageUrl(rawImage, product.store);
  const titleClean = (product.title || '').split('||')[0].trim();

  return (
    <div className="group bg-[#131822] border border-slate-800/80 hover:border-blue-500/50 rounded-lg p-3.5 flex flex-col justify-between transition-all duration-150 hover:shadow-lg hover:shadow-blue-950/20 font-sans">
      <div>
        {/* Header: Supplier & Stock Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
            {storeDisplayName}
          </span>
          {product.in_stock ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Check className="w-3 h-3" /> IN STOCK
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <X className="w-3 h-3" /> OUT OF STOCK
            </span>
          )}
        </div>

        {/* Product Image Container */}
        <div className="w-full h-32 mb-2.5 rounded bg-[#0B0F17] flex items-center justify-center p-2 border border-slate-800/60 relative">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={titleClean}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain filter group-hover:brightness-105 transition-all"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-600 gap-1 select-none font-mono">
              <Cpu className="w-6 h-6 text-slate-700 group-hover:text-blue-400/50 transition-colors" />
              <span className="text-[9px] uppercase tracking-wider">No Image Data</span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 transition-colors line-clamp-2 mb-1.5 leading-snug">
          {titleClean}
        </h3>
      </div>

      {/* Price & Action Footer */}
      <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 font-mono">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">UNIT PRICE</div>
          <div className="text-sm font-bold text-blue-400">
            {product.formatted_price || `${product.price.toFixed(2)} TL`}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              title="Add to Procurement Cart"
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-mono font-medium px-2.5 py-1.5 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition-all"
          >
            SOURCE
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
