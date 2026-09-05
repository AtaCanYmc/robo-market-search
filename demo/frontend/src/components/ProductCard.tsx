import React, { useState } from 'react';
import { ExternalLink, Check, X, ShoppingBag, Cpu } from 'lucide-react';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

function normalizeImageUrl(url: string | undefined, store: string): string | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();

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
  const { t } = useTheme();
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
    <div className="group bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-lg p-3.5 flex flex-col justify-between transition-all duration-150 shadow-sm hover:shadow-md dark:hover:shadow-blue-950/20 font-sans">
      <div>
        {/* Header: Supplier & Stock Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0B0F17] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            {storeDisplayName}
          </span>
          {product.in_stock ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <Check className="w-3 h-3" /> {t('inStock')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
              <X className="w-3 h-3" /> {t('outOfStock')}
            </span>
          )}
        </div>

        {/* Product Image Container */}
        <div className="w-full h-32 mb-2.5 rounded bg-slate-50 dark:bg-[#0B0F17] flex items-center justify-center p-2 border border-slate-100 dark:border-slate-800/60 relative overflow-hidden">
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
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-1 select-none">
              <Cpu className="w-6 h-6 text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors" />
              <span className="text-[10px] uppercase tracking-wider">{t('noImage')}</span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-xs font-medium text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1.5 leading-snug">
          {titleClean}
        </h3>
      </div>

      {/* Price & Action Footer */}
      <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">{t('thUnitPrice')}</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-blue-400">
            {product.formatted_price || `${product.price.toFixed(2)} TL`}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              title="Sepete Ekle"
              className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:hover:bg-blue-600/30 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40 transition-all"
          >
            {t('source')}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
