import React, { useState } from 'react';
import { ExternalLink, Check, X, ShoppingBag, Cpu, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: Product;
  isBestPrice?: boolean;
  onAddToCart?: (product: Product) => void;
}

const STORE_CONFIG: Record<string, { name: string; domain: string; dotColor: string }> = {
  robotistan: { name: 'Robotistan', domain: 'https://www.robotistan.com', dotColor: 'bg-rose-500' },
  robolink: { name: 'Robolink', domain: 'https://www.robolinkmarket.com', dotColor: 'bg-sky-500' },
  robo90: { name: 'Robo90', domain: 'https://www.robo90.com', dotColor: 'bg-teal-500' },
  direncnet: { name: 'Direnç.net', domain: 'https://www.direnc.net', dotColor: 'bg-orange-500' },
  ozdisan: { name: 'Özdisan', domain: 'https://www.ozdisan.com', dotColor: 'bg-blue-600' },
  motorobit: { name: 'Motorobit', domain: 'https://www.motorobit.com', dotColor: 'bg-amber-500' },
};

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
    const config = STORE_CONFIG[s];
    return config?.domain ? `${config.domain}${trimmed}` : trimmed;
  }

  return trimmed;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isBestPrice = false, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);
  const { t } = useTheme();

  const storeKey = (product.store || '').toLowerCase();
  const storeInfo = STORE_CONFIG[storeKey] || {
    name: product.store || 'Market',
    domain: '',
    dotColor: 'bg-slate-400',
  };

  const rawImage = product.image_url;
  const imageUrl = normalizeImageUrl(rawImage, product.store);
  const titleClean = (product.title || '').split('||')[0].trim();

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <article className="group relative bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/40 dark:hover:border-blue-500/40 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-150 shadow-xs hover:shadow-md dark:hover:shadow-black/40">
      <div>
        {/* Header: Vendor Badge & Stock Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
            <span className={`w-1.5 h-1.5 rounded-full ${storeInfo.dotColor}`} />
            {storeInfo.name}
          </div>

          <div className="flex items-center gap-1.5">
            {isBestPrice && product.in_stock && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="w-2.5 h-2.5" /> En İyi Fiyat
              </span>
            )}
            {product.in_stock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <Check className="w-3 h-3" /> {t('inStock')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                <X className="w-3 h-3" /> {t('outOfStock')}
              </span>
            )}
          </div>
        </div>

        {/* Product Image Container */}
        <div className="w-full h-32 mb-2.5 rounded-lg bg-slate-50 dark:bg-[#0B0F17] flex items-center justify-center p-2.5 border border-slate-100 dark:border-slate-800/60 relative overflow-hidden">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={titleClean}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain filter group-hover:scale-102 transition-transform duration-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-1 select-none">
              <Cpu className="w-6 h-6 text-slate-300 dark:text-slate-700" />
              <span className="text-[10px] uppercase font-mono tracking-wider">{t('noImage')}</span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <h3
          title={titleClean}
          className="text-xs font-medium text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1.5 leading-snug"
        >
          {titleClean}
        </h3>
      </div>

      {/* Price & Action Footer */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
            {t('thUnitPrice')}
          </div>
          <div className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 truncate">
            {product.formatted_price || `${product.price.toFixed(2)} TL`}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onAddToCart && (
            <button
              onClick={handleAddToCart}
              type="button"
              title={added ? 'Eklendi!' : 'Sepete Ekle'}
              aria-label={added ? 'Eklendi' : 'Sepete Ekle'}
              className={`p-2 rounded-lg transition-all border cursor-pointer ${
                added
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            </button>
          )}

          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-2xs transition-all active:scale-98"
          >
            <span>{t('source')}</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
};
