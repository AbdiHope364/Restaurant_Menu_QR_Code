import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  CheckCircle2,
  CreditCard,
  Banknote,
  Utensils,
  Smartphone,
  Users,
  HeartHandshake,
  RotateCcw,
} from 'lucide-react';
import { useSettings } from '@ethio-buna/shared';
import toast from 'react-hot-toast';

const CartDrawer = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder,
  tableId,
  tableName,
  activeOrder,
  onCancelOrder,
}) => {
  const { theme, formatPrice, settings } = useSettings();
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('telebirr'); // 'telebirr' | 'chapa' | 'card' | 'cash'
  const [tipPercent, setTipPercent] = useState(0); // 0 | 5 | 10 | 15
  const [splitCount, setSplitCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cancellation grace period timer (2 mins)
  const [cancelTimeLeft, setCancelTimeLeft] = useState(120);

  useEffect(() => {
    if (!activeOrder) {
      setCancelTimeLeft(120);
      return;
    }
    const timer = setInterval(() => {
      setCancelTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeOrder]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price || 0) * (item.quantity || 1),
    0,
  );
  const taxAmount = (subtotal * (settings.taxRate || 0)) / 100;
  const serviceFee = (subtotal * (settings.serviceFeeRate || 0)) / 100;
  const tipAmount = (subtotal * tipPercent) / 100;
  const grandTotal = subtotal + taxAmount + serviceFee + tipAmount;
  const perPersonAmount = grandTotal / (splitCount || 1);

  const handleCheckout = async () => {
    if (cartItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmitOrder({
        items: cartItems,
        subtotal,
        tax: taxAmount,
        serviceFee,
        tip: tipAmount,
        splitCount,
        total: grandTotal,
        notes: orderNotes,
        paymentMethod,
        tableId: tableId || 'table-direct',
        tableName: tableName || 'Unassigned Table',
        estimatedPrepTime: '15-20 mins',
      });
      toast.success('Order sent to kitchen & cashier!', { icon: '👨‍🍳' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
        >
          {/* HEADER */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl ${theme.bgLight} ${theme.textPrimary} flex items-center justify-center`}>
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight text-base">
                  Your Table Order
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {tableName || 'Table QR'} • {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* ACTIVE ORDER BANNER & CANCEL GRACE PERIOD */}
          {activeOrder && (
            <div className={`p-4 mx-4 mt-4 rounded-2xl border ${theme.borderLight} ${theme.bgLight} space-y-2`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${theme.textPrimary} flex items-center gap-1.5`}>
                  <Clock size={12} className="animate-spin" /> Active Order #{activeOrder.id?.slice(-4) || 'LIVE'}
                </span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${theme.primary} text-white`}>
                  {activeOrder.status || 'PREPARING'}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                Estimated kitchen prep time: <span className="font-black text-slate-900">~15–20 mins</span>
              </p>

              {cancelTimeLeft > 0 && onCancelOrder && (
                <div className="flex items-center justify-between pt-1 border-t border-orange-200/50">
                  <span className="text-[10px] text-slate-500">
                    Change of mind? Cancel window: <strong className="text-orange-600">{formatSeconds(cancelTimeLeft)}</strong>
                  </span>
                  <button
                    onClick={() => {
                      onCancelOrder(activeOrder.id);
                      toast('Order Cancelled', { icon: '↩️' });
                    }}
                    className="text-[10px] font-black uppercase text-red-500 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw size={11} /> Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* BODY / CART ITEMS */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Utensils size={28} />
                </div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                  Your Cart is Empty
                </h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  Explore our authentic buna, dishes & beverages, then tap + to add items.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartId || item.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
                          {item.name}
                        </h4>
                        <p className={`text-xs font-black ${theme.textPrimary} mt-0.5`}>
                          {formatPrice(item.price)}
                        </p>
                        {item.notes && (
                          <p className="text-[10px] text-slate-400 italic mt-1 line-clamp-1">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl shrink-0">
                        <button
                          onClick={() => onUpdateQuantity(item.cartId || item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 text-xs font-bold"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center font-black text-xs text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartId || item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 text-xs font-bold"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.cartId || item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="text-right">
                  <button
                    onClick={onClearCart}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider transition"
                  >
                    Clear All Items
                  </button>
                </div>

                {/* ORDER NOTES */}
                <div className="pt-2 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Special Kitchen / Table Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Extra hot water with Buna, sugar on side, spicy awaze..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                {/* GRATUITY / TIP SELECTION */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <HeartHandshake size={12} className={theme.textPrimary} /> Staff Gratuity / Tip
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">
                      {tipPercent > 0 ? `${tipPercent}% (+${formatPrice(tipAmount)})` : 'None'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 5, 10, 15].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTipPercent(pct)}
                        className={`p-2 rounded-xl text-[11px] font-black uppercase transition border ${
                          tipPercent === pct
                            ? `${theme.primary} text-white shadow-sm border-transparent`
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pct === 0 ? 'No Tip' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SPLIT BILL CALCULATOR */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Users size={12} className={theme.textPrimary} /> Group Table Bill Splitter
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">
                      {splitCount > 1 ? `${formatPrice(perPersonAmount)} / guest` : 'Single Bill'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSplitCount(num)}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-black transition ${
                          splitCount === num
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {num === 1 ? '1 Person' : `${num} Ways`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PAYMENT METHOD SELECTION */}
                <div className="pt-2 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Payment Gateway & Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('telebirr')}
                      className={`p-3 rounded-2xl border text-xs font-black uppercase flex items-center justify-center gap-2 transition ${
                        paymentMethod === 'telebirr'
                          ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Smartphone size={14} /> Telebirr Wallet
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('chapa')}
                      className={`p-3 rounded-2xl border text-xs font-black uppercase flex items-center justify-center gap-2 transition ${
                        paymentMethod === 'chapa'
                          ? 'bg-green-50 text-green-700 border-green-300 ring-2 ring-green-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <CreditCard size={14} /> Chapa / CBE
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border text-xs font-black uppercase flex items-center justify-center gap-2 transition ${
                        paymentMethod === 'card'
                          ? `${theme.bgLight} ${theme.textPrimary} ${theme.borderLight} ring-2 ring-orange-500/20`
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <CreditCard size={14} /> Card at Table
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 rounded-2xl border text-xs font-black uppercase flex items-center justify-center gap-2 transition ${
                        paymentMethod === 'cash'
                          ? `${theme.bgLight} ${theme.textPrimary} ${theme.borderLight} ring-2 ring-orange-500/20`
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Banknote size={14} /> Cash at Table
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* FOOTER / CHECKOUT */}
          {cartItems.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {settings.taxRate > 0 && (
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Tax ({settings.taxRate}%)</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>
                )}
                {settings.serviceFeeRate > 0 && (
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Service Charge ({settings.serviceFeeRate}%)</span>
                    <span>{formatPrice(serviceFee)}</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Staff Tip ({tipPercent}%)</span>
                    <span>+{formatPrice(tipAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <div>
                    <span>Total</span>
                    {splitCount > 1 && (
                      <span className="block text-[10px] font-normal text-slate-400">
                        {splitCount} guests ({formatPrice(perPersonAmount)} each)
                      </span>
                    )}
                  </div>
                  <span className={theme.textPrimary}>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs uppercase tracking-widest shadow-xl ${theme.shadow} flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting to Kitchen...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Send Order to Kitchen ({formatPrice(grandTotal)})</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CartDrawer;
