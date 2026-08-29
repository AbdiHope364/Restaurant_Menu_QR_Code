import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { menuApi, ordersService, useSettings } from '@ethio-buna/shared';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import MenuHeader from '../../components/customer/MenuHeader';
import CategoryFilter from '../../components/customer/CategoryFilter';
import FoodCard from '../../components/customer/FoodCard';
import ItemDetailModal from '../../components/customer/ItemDetailModal';
import RatingModal from '../../components/customer/RatingModal';
import SearchBar from '../../components/customer/SearchBar';
import CartDrawer from '../../components/customer/CartDrawer';
import QuickActions from '../../components/customer/QuickActions';
import { categoryService } from '../../services/categoryService';

const DIETARY_FILTERS = [
  { id: 'all', label: 'All Items', emoji: '🍽️' },
  { id: 'veg', label: 'Vegetarian', emoji: '🌱' },
  { id: 'vegan', label: 'Vegan', emoji: '🌿' },
  { id: 'gluten_free', label: 'Gluten-Free', emoji: '🌾' },
  { id: 'halal', label: 'Halal', emoji: '☪️' },
  { id: 'spicy', label: 'Spicy', emoji: '🌶️' },
];

const CustomerMenu = () => {
  const { shortId } = useParams();
  const { theme, settings } = useSettings();

  // --- States ---
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDietary, setActiveDietary] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [tableName, setTableName] = useState('');
  const [currentLang, setCurrentLang] = useState('en');

  // --- Cart & Order States ---
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('customer_cart_' + (shortId || 'default'));
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // --- Modal States ---
  const [selectedItem, setSelectedItem] = useState(null);
  const [ratingItem, setRatingItem] = useState(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem('customer_cart_' + (shortId || 'default'), JSON.stringify(cart));
    } catch (e) {}
  }, [cart, shortId]);

  useEffect(() => {
    const init = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        setLoading(true);

        if (shortId) {
          // Fetch table menu + table name
          try {
            const [menuRes, categoryRes] = await Promise.all([
              menuApi.getByQr(shortId),
              categoryService.getAll(),
            ]);

            const itemsArray = Array.isArray(menuRes.data)
              ? menuRes.data
              : Array.isArray(menuRes)
              ? menuRes
              : [];
            const catsArray = Array.isArray(categoryRes.data)
              ? categoryRes.data
              : Array.isArray(categoryRes)
              ? categoryRes
              : [];

            setMenu(itemsArray);
            setCategories(catsArray);
            if (menuRes.qr?.name) {
              setTableName(menuRes.qr.name);
            } else {
              setTableName(`Table ${shortId.toUpperCase()}`);
            }
          } catch (err) {
            console.error('Menu Load Error:', err);
            // Fallback fetch
            const allItems = await menuApi.getAll();
            const cats = await categoryService.getAll();
            setMenu(Array.isArray(allItems.data) ? allItems.data : []);
            setCategories(Array.isArray(cats.data) ? cats.data : []);
            setTableName(`Table ${shortId.toUpperCase()}`);
          }
        } else {
          // Direct menu access
          const [allRes, catRes] = await Promise.all([
            menuApi.getAll(),
            categoryService.getAll(),
          ]);
          setMenu(Array.isArray(allRes.data) ? allRes.data : []);
          setCategories(Array.isArray(catRes.data) ? catRes.data : []);
          setTableName('Guest Table');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [shortId]);

  // --- Cart Operations ---
  const handleAddToCart = (item, quantity = 1, notes = '') => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (ci) => ci.id === item.id && (ci.notes || '') === (notes || ''),
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          ...item,
          cartId: 'cart-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          quantity,
          notes,
        },
      ];
    });

    toast.success(`Added ${quantity}x ${item.name} to order!`, {
      icon: '🛍️',
    });
  };

  const handleUpdateQuantity = (cartId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => ((item.cartId || item.id) === cartId ? { ...item, quantity: newQty } : item)),
    );
  };

  const handleRemoveItem = (cartId) => {
    setCart((prev) => prev.filter((item) => (item.cartId || item.id) !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
    toast('Cart cleared', { icon: '🗑️' });
  };

  const handleSubmitOrder = async (orderData) => {
    const placed = await ordersService.placeOrder({
      ...orderData,
      shortId: shortId || 'DIRECT',
    });
    setActiveOrder(placed);
    setCart([]);
    setIsCartOpen(false);
    toast.success('Order received by kitchen!', {
      icon: '👨‍🍳',
      duration: 5000,
    });
  };

  const handleServiceRequest = async (reqData) => {
    return await ordersService.requestService({
      ...reqData,
      shortId: shortId || 'DIRECT',
    });
  };

  // --- Dynamic Filtering ---
  const filtered = menu.filter((item) => {
    // 1. Category filter
    const matchCat =
      activeCategory === 'all' || item.categoryId === activeCategory;

    // 2. Search match
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());

    // 3. Dietary match
    let matchDiet = true;
    if (activeDietary === 'veg') matchDiet = !!item.isVegetarian;
    if (activeDietary === 'vegan') matchDiet = !!item.isVegan;
    if (activeDietary === 'gluten_free') matchDiet = !!item.isGlutenFree;
    if (activeDietary === 'halal') matchDiet = !!item.isHalal;
    if (activeDietary === 'spicy') matchDiet = (item.spicyLevel || 0) > 0;

    return matchCat && matchSearch && matchDiet;
  });

  const cartTotalCount = cart.reduce((acc, curr) => acc + (curr.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#fafafc] pb-32 overflow-x-hidden">
      {/* BRANDING HEADER */}
      <MenuHeader
        tableName={tableName}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
      />

      {/* SEARCH SECTION */}
      <div className="px-4 sm:px-6 max-w-7xl mx-auto mt-4 mb-3">
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* DIETARY FILTER PILLS */}
      <div className="px-4 sm:px-6 max-w-7xl mx-auto mb-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 pb-1">
          {DIETARY_FILTERS.map((df) => {
            const isActive = activeDietary === df.id;
            return (
              <button
                key={df.id}
                onClick={() => setActiveDietary(df.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all ${
                  isActive
                    ? `${theme.primary} text-white shadow-md ${theme.shadow}`
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{df.emoji}</span>
                <span>{df.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CATEGORY NAV */}
      <div className="max-w-7xl mx-auto">
        <CategoryFilter
          categories={categories}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex h-96 flex-col items-center justify-center space-y-4">
            <div className={`w-10 h-10 border-4 ${theme.textPrimary} border-t-transparent rounded-full animate-spin`} />
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
              Preparing freshness...
            </p>
          </div>
        ) : (
          <>
            {filtered.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-6 mt-6"
              >
                {filtered.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                    onQuickAdd={(it) => handleAddToCart(it, 1)}
                    isInCart={cart.some((ci) => ci.id === item.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-24 px-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
                  🔍
                </div>
                <h3 className="text-slate-800 font-black uppercase text-base">
                  No Matching Dishes
                </h3>
                <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
                  We couldn't find anything matching your filters. Try selecting another category or clearing filters.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setActiveDietary('all');
                    setSearch('');
                  }}
                  className={`mt-4 px-5 py-2 rounded-xl ${theme.bgLight} ${theme.textPrimary} font-bold text-xs`}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* FLOATING TABLE ACTIONS (Call Waiter / Request Bill) */}
      <QuickActions
        tableId={shortId}
        tableName={tableName}
        onRequestService={handleServiceRequest}
      />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onSubmitOrder={handleSubmitOrder}
        tableId={shortId}
        tableName={tableName}
        activeOrder={activeOrder}
      />

      {/* --- MODAL SYSTEM --- */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAddToCart={handleAddToCart}
            onRate={() => {
              setRatingItem(selectedItem);
              setSelectedItem(null);
            }}
          />
        )}

        {ratingItem && (
          <RatingModal
            item={ratingItem}
            tableId={shortId}
            onClose={() => setRatingItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerMenu;
