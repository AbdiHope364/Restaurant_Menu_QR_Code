import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Star,
  ShieldAlert,
  TrendingDown,
  Leaf,
  Plus,
  Minus,
  ShoppingBag,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@ethio-buna/shared';

const ItemDetailModal = ({ item, onClose, onRate, onAddToCart }) => {
  const { theme, formatPrice, settings, t } = useSettings();
  const [activeIdx, setActiveIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const images = item?.images || [];

  useEffect(() => {
    if (!item || images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, item]);

  if (!item) return null;

  const getImgUrl = (path) => {
    if (!path)
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
    if (path.startsWith('http')) return path;
    const backendUrl =
      import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}/${path.replace(/\\/g, '/')}`;
  };

  const discount =
    item.oldPrice && parseFloat(item.oldPrice) > parseFloat(item.price)
      ? Math.round(
          ((parseFloat(item.oldPrice) - parseFloat(item.price)) /
            parseFloat(item.oldPrice)) *
            100,
        )
      : 0;

  const totalPrice = parseFloat(item.price || 0) * quantity;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(item, quantity, notes);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-2xl h-[92vh] md:h-auto md:max-h-[90vh] rounded-t-[3rem] md:rounded-[3.5rem] overflow-hidden flex flex-col z-10 shadow-2xl relative"
      >
        {/* SECTION 1: INTERACTIVE CAROUSEL */}
        <div className="relative h-64 sm:h-72 md:h-80 bg-slate-900 overflow-hidden shrink-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIdx}
              src={getImgUrl(images[activeIdx]?.imageUrl)}
              alt={item.name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md text-white rounded-2xl transition shadow-lg z-20"
          >
            <X size={20} />
          </button>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-5 left-5 bg-red-600 text-white px-3 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1 z-20">
              <TrendingDown size={14} />
              <span>{discount}% OFF</span>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1,
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-md text-white rounded-full transition z-20"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-md text-white rounded-full transition z-20"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Carousel Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeIdx === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: SCROLLABLE DETAILS */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 pb-28">
          {/* Header & Meta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${theme.bgLight} ${theme.textPrimary}`}
                >
                  {item.category?.name || 'Ethiopian Traditional'}
                </span>
                {item.preparationTime && (
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {item.preparationTime} {t('mins')}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="text-right">
                <p
                  className={`text-2xl font-black ${theme.textPrimary} leading-none`}
                >
                  {formatPrice(item.price)}
                </p>
                {item.oldPrice &&
                  parseFloat(item.oldPrice) > parseFloat(item.price) && (
                    <p className="text-xs text-slate-300 line-through font-bold mt-0.5">
                      {formatPrice(item.oldPrice)}
                    </p>
                  )}
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              {item.name}
            </h2>

            <p
              className={`text-slate-600 leading-relaxed font-medium text-sm italic border-l-4 ${theme.borderLight} pl-4 py-1`}
            >
              "
              {item.description ||
                'Crafted with premium authentic Ethiopian ingredients.'}
              "
            </p>
          </div>

          {/* Rating Display */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={
                      s <= Math.round(item.ratingAverage || 5)
                        ? 'fill-current'
                        : 'text-slate-200'
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-black text-slate-800">
                {item.ratingAverage
                  ? parseFloat(item.ratingAverage).toFixed(1)
                  : '5.0'}
              </span>
            </div>

            {onRate && (
              <button
                onClick={onRate}
                className={`text-xs font-black ${theme.textPrimary} hover:underline uppercase tracking-wider`}
              >
                ★ Rate this dish
              </button>
            )}
          </div>

          {/* NUTRITION PROFILE */}
          {(item.calories || item.protein || item.carbs || item.fat) && (
            <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-center mb-4">
                {t('nutrition')}
              </h4>
              <div className="grid grid-cols-4 gap-4 relative z-10">
                {[
                  {
                    label: t('calories'),
                    val: item.calories ? `${item.calories} kcal` : '--',
                  },
                  {
                    label: t('protein'),
                    val: item.protein ? `${item.protein}g` : '--',
                  },
                  {
                    label: t('carbs'),
                    val: item.carbs ? `${item.carbs}g` : '--',
                  },
                  {
                    label: t('fat'),
                    val: item.fat ? `${item.fat}g` : '--',
                  },
                ].map((n, i) => (
                  <div key={i} className="text-center">
                    <p
                      className={`text-lg font-black text-white ${theme.textPrimary}`}
                    >
                      {n.val}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                      {n.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INGREDIENTS & ALLERGENS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Leaf size={13} className="text-green-500" /> {t('ingredients')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients?.length > 0 ? (
                  item.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-100 rounded-xl text-[11px] font-bold text-slate-700"
                    >
                      {ing}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Fresh authentic ingredients
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert size={13} /> {t('allergens')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.allergens?.length > 0 ? (
                  item.allergens.map((all, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded-xl text-[11px] font-black border border-red-100"
                    >
                      {all}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-green-600 font-bold">
                    No common allergens listed
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: BOTTOM ACTION BAR */}
        {settings.orderingEnabled ? (
          <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-4 md:p-5 border-t border-slate-100 flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-xl bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 transition active:scale-95 shadow-sm"
              >
                <Minus size={14} />
              </button>
              <span className="w-7 text-center font-black text-sm text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-xl bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 transition active:scale-95 shadow-sm"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to Order Button */}
            <button
              onClick={handleAdd}
              className={`flex-1 py-4 px-6 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs uppercase tracking-widest shadow-xl ${theme.shadow} flex items-center justify-between transition active:scale-95`}
            >
              <span className="flex items-center gap-2">
                <ShoppingBag size={16} />
                <span>{t('addToCart')}</span>
              </span>
              <span className="text-sm font-black">
                {formatPrice(totalPrice)}
              </span>
            </button>
          </div>
        ) : (
          <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Price / ዋጋ
              </p>
              <p className={`text-xl font-black ${theme.textPrimary}`}>
                {formatPrice(item.price)}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`py-3.5 px-8 rounded-2xl ${theme.primary} text-white font-black text-xs uppercase tracking-wider hover:opacity-90 transition active:scale-95 shadow-md ${theme.shadow}`}
            >
              {t('closeModal')}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ItemDetailModal;
