import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Star,
  Info,
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
  const { theme, formatPrice, settings } = useSettings();
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
    if (!path) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
    if (path.startsWith('http')) return path;
    const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    return `${backendUrl}/${path.replace(/\\/g, '/')}`;
  };

  const discount =
    item.oldPrice && parseFloat(item.oldPrice) > parseFloat(item.price)
      ? Math.round(((parseFloat(item.oldPrice) - parseFloat(item.price)) / parseFloat(item.oldPrice)) * 100)
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
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-2xl h-[92vh] md:h-auto md:max-h-[90vh] rounded-t-[3rem] md:rounded-[3.5rem] overflow-hidden flex flex-col z-10 shadow-2xl relative"
      >
        {/* SECTION 1: INTERACTIVE CAROUSEL */}
        <div className="relative h-72 md:h-[380px] shrink-0 bg-slate-100 group">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIdx}
              src={getImgUrl(images[activeIdx]?.imageUrl)}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover"
              alt={item.name}
            />
          </AnimatePresence>

          {/* Top Floating Badges */}
          <div className="absolute top-5 left-5 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-sm border border-white/40">
              <p className={`text-[10px] font-black uppercase tracking-wider ${theme.textPrimary}`}>
                {item.category?.name || 'Dish'}
              </p>
            </div>
            {discount > 0 && (
              <div className="bg-green-500 text-white px-3 py-1 rounded-xl shadow-lg flex items-center gap-1 animate-bounce">
                <TrendingDown size={14} />
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  {discount}% OFF
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-full text-white z-20 transition"
          >
            <X size={20} />
          </button>

          {/* Carousel Nav Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveIdx((prev) => (prev - 1 + images.length) % images.length)}
                className={`absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 backdrop-blur-md rounded-full text-white hover:${theme.primary} transition`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setActiveIdx((prev) => (prev + 1) % images.length)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/30 backdrop-blur-md rounded-full text-white hover:${theme.primary} transition`}
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIdx ? `${theme.primary} w-8` : 'bg-white/60 w-2'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* SECTION 2: SCROLLABLE INFO BODY */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-28 custom-scrollbar">
          {/* Main Identity */}
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                {item.name}
              </h2>
              <div className="flex flex-wrap gap-2.5 items-center">
                {item.preparationTime && (
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-wider">
                    <Clock size={12} /> {item.preparationTime} MINS
                  </div>
                )}
                {item.spicyLevel > 0 && (
                  <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full text-[10px] font-black text-red-600 uppercase">
                    <Flame size={12} className="fill-current" /> SPICE LVL {item.spicyLevel}
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full text-[10px] font-black text-amber-700 uppercase tracking-wider">
                  <Star size={12} className="fill-current text-amber-500" />
                  {item.ratingAverage ? parseFloat(item.ratingAverage).toFixed(1) : '5.0'}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-2xl md:text-3xl font-black ${theme.textPrimary}`}>
                {formatPrice(item.price)}
              </p>
              {item.oldPrice && parseFloat(item.oldPrice) > parseFloat(item.price) && (
                <p className="text-xs text-slate-300 line-through font-bold">
                  {formatPrice(item.oldPrice)}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <Info size={13} /> Description
            </h4>
            <p className={`text-slate-600 leading-relaxed font-medium text-sm italic border-l-4 ${theme.borderLight} pl-4 py-1`}>
              "{item.description || 'Crafted with premium ingredients for an unforgettable culinary experience.'}"
            </p>
          </div>

          {/* SPECIAL INSTRUCTIONS */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare size={13} /> Special Request / Note for Kitchen
            </label>
            <input
              type="text"
              placeholder="e.g. No onions, sauce on side, extra crispy..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none ${theme.ring} focus:ring-2`}
            />
          </div>

          {/* NUTRITION PROFILE (IF AVAILABLE) */}
          {(item.calories || item.protein || item.carbs || item.fat) && (
            <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-center mb-4">
                Nutrition Profile
              </h4>
              <div className="grid grid-cols-4 gap-4 relative z-10">
                {[
                  { label: 'Calories', val: item.calories ? `${item.calories} kcal` : '--' },
                  { label: 'Protein', val: item.protein ? `${item.protein}g` : '--' },
                  { label: 'Carbs', val: item.carbs ? `${item.carbs}g` : '--' },
                  { label: 'Fat', val: item.fat ? `${item.fat}g` : '--' },
                ].map((n, i) => (
                  <div key={i} className="text-center">
                    <p className={`text-lg font-black text-white ${theme.textPrimary}`}>
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
                <Leaf size={13} className="text-green-500" /> Ingredients
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
                  <p className="text-xs text-slate-400 italic">Fresh market ingredients</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert size={13} /> Allergen Info
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
                  <p className="text-xs text-green-600 font-bold">No common allergens listed</p>
                )}
              </div>
            </div>
          </div>

          {/* RATE DISH BUTTON */}
          {settings.reviewsEnabled && (
            <button
              onClick={onRate}
              className={`w-full py-3.5 rounded-2xl border border-dashed ${theme.borderLight} ${theme.bgLight} ${theme.textPrimary} font-black uppercase text-xs flex items-center justify-center gap-2 hover:opacity-90 transition`}
            >
              <Star size={14} className="fill-current" /> Leave a Review for this Dish
            </button>
          )}
        </div>

        {/* SECTION 3: FIXED BOTTOM ORDER ACTION BAR */}
        {settings.orderingEnabled && (
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
                <span>Add to Order</span>
              </span>
              <span className="text-sm font-black">{formatPrice(totalPrice)}</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ItemDetailModal;
