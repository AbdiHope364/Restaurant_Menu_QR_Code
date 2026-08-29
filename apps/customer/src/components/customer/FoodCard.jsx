import React from 'react';
import { Star, Flame, Plus, Check, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '@ethio-buna/shared';

const FoodCard = ({ item, onClick, onQuickAdd, isInCart = false }) => {
  const { theme, formatPrice } = useSettings();
  const primaryImage = item.images?.[0];
  const isOutOfStock = item.isAvailable === false;

  const getImgUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
    if (path.startsWith('http')) return path;
    const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}/${path.replace(/\\/g, '/')}`;
  };

  const discountPercent =
    item.oldPrice && parseFloat(item.oldPrice) > parseFloat(item.price)
      ? Math.round(((parseFloat(item.oldPrice) - parseFloat(item.price)) / parseFloat(item.oldPrice)) * 100)
      : 0;

  return (
    <motion.div
      layout
      className={`bg-white rounded-[2.5rem] p-4 sm:p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-200 group flex flex-col justify-between relative ${
        isOutOfStock ? 'opacity-75 grayscale-[30%]' : ''
      }`}
    >
      <div onClick={onClick} className="cursor-pointer">
        {/* 1. IMAGE SECTION */}
        <div className="relative h-56 sm:h-64 w-full rounded-[2rem] overflow-hidden mb-4 bg-slate-100">
          <img
            src={getImgUrl(primaryImage?.imageUrl)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt={item.name}
            loading="lazy"
          />

          {/* Category Tag */}
          <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-xl shadow-sm border border-white/40">
            <p className={`text-[10px] font-black uppercase tracking-wider ${theme.textPrimary}`}>
              {item.category?.name || 'Dish'}
            </p>
          </div>

          {/* Sold Out Overlay Badge */}
          {isOutOfStock ? (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-600 text-white font-black text-xs uppercase px-4 py-2 rounded-2xl shadow-xl tracking-wider">
                Sold Out
              </span>
            </div>
          ) : discountPercent > 0 ? (
            <div className="absolute top-3.5 right-3.5 bg-red-500 text-white px-2.5 py-1 rounded-xl text-[10px] font-black uppercase shadow-md">
              -{discountPercent}%
            </div>
          ) : null}

          {/* Spicy Level Badge */}
          {item.spicyLevel > 0 && (
            <div className="absolute bottom-3.5 left-3.5 bg-red-600/90 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-lg flex items-center gap-1">
              <Flame size={13} className="text-white fill-current" />
              <span className="text-[10px] font-black text-white">
                {item.spicyLevel > 1 ? `${item.spicyLevel}x` : 'Spicy'}
              </span>
            </div>
          )}
        </div>

        {/* 2. CONTENT SECTION */}
        <div className="px-1 space-y-2.5">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-black text-slate-900 text-lg sm:text-xl uppercase tracking-tight leading-snug line-clamp-1 flex-1">
              {item.name}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100 shrink-0">
              <Star size={13} className="text-amber-500 fill-current" />
              <span className="text-xs font-black text-amber-800">
                {item.ratingAverage ? parseFloat(item.ratingAverage).toFixed(1) : '5.0'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
            {item.description || 'Delicious dish crafted with fresh, premium ingredients.'}
          </p>

          {/* Dietary Flags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.isVegetarian && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200">
                🌱 Veg
              </span>
            )}
            {item.isVegan && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                🌿 Vegan
              </span>
            )}
            {item.isGlutenFree && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                🌾 GF
              </span>
            )}
            {item.isHalal && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Halal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. PRICE & QUICK ACTION SECTION */}
      <div className="flex items-center justify-between pt-4 px-1 border-t border-slate-50 mt-3">
        <div>
          <p className={`text-xl sm:text-2xl font-black ${theme.textPrimary} leading-none`}>
            {formatPrice(item.price)}
          </p>
          {item.oldPrice && parseFloat(item.oldPrice) > parseFloat(item.price) && (
            <p className="text-[11px] text-slate-300 line-through font-bold mt-1">
              {formatPrice(item.oldPrice)}
            </p>
          )}
        </div>

        {onQuickAdd && (
          <button
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onQuickAdd(item);
            }}
            title={isOutOfStock ? 'Item is currently sold out' : isInCart ? 'Added to Cart' : 'Add to Order'}
            className={`p-3 rounded-2xl transition-all shadow-md active:scale-90 flex items-center justify-center ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : isInCart
                ? 'bg-green-600 text-white shadow-green-200'
                : `${theme.primary} ${theme.primaryHover} text-white ${theme.shadow}`
            }`}
          >
            {isOutOfStock ? <Ban size={18} /> : isInCart ? <Check size={18} /> : <Plus size={18} />}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default FoodCard;
