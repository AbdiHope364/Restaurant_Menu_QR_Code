import apiClient from './apiClient';

const INITIAL_CATEGORIES = [
  { id: 'cat-main', name: 'Main Courses' },
  { id: 'cat-hot-drinks', name: 'Hot Drinks & Coffee' },
  { id: 'cat-cold-drinks', name: 'Cold Beverages & Juices' },
  { id: 'cat-appetizers', name: 'Appetizers & Starters' },
  { id: 'cat-desserts', name: 'Desserts & Sweets' },
  { id: 'cat-specials', name: 'Chef Specials' },
];

const INITIAL_MENU_ITEMS = [
  {
    id: 'item-101',
    name: 'Special Sizzling Tibs',
    categoryId: 'cat-main',
    category: { id: 'cat-main', name: 'Main Courses' },
    price: 450,
    oldPrice: 500,
    description: 'Tender beef cubes sautéed with onions, rosemary, jalapeños, and spiced clarified butter (niter kibbeh). Served sizzling with fresh injera.',
    isAvailable: true,
    spicyLevel: 2,
    preparationTime: 20,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isHalal: true,
    calories: 620,
    protein: 45,
    carbs: 12,
    fat: 28,
    ingredients: ['Prime Beef', 'Red Onion', 'Rosemary', 'Green Chili', 'Injera', 'Awaze'],
    allergens: [],
    ratingAverage: 4.9,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-102',
    name: 'Traditional Shiro Tegabino',
    categoryId: 'cat-main',
    category: { id: 'cat-main', name: 'Main Courses' },
    price: 220,
    oldPrice: 250,
    description: 'Slow-cooked spiced powdered chickpeas simmered in a traditional clay pot with garlic, ginger, and berbere.',
    isAvailable: true,
    spicyLevel: 1,
    preparationTime: 15,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 410,
    protein: 18,
    carbs: 58,
    fat: 10,
    ingredients: ['Chickpea Flour', 'Garlic', 'Ginger', 'Berbere', 'Olive Oil'],
    allergens: [],
    ratingAverage: 4.8,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-103',
    name: 'Traditional Buna Ceremony Set',
    categoryId: 'cat-hot-drinks',
    category: { id: 'cat-hot-drinks', name: 'Hot Drinks & Coffee' },
    price: 150,
    description: 'Freshly roasted Ethiopian single-origin Arabica coffee brewed in a clay jebena pot, served with frankincense aroma and fresh popcorn.',
    isAvailable: true,
    spicyLevel: 0,
    preparationTime: 10,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 45,
    protein: 1,
    carbs: 2,
    fat: 0,
    ingredients: ['Yirgacheffe Coffee Beans', 'Spring Water', 'Fresh Popcorn'],
    allergens: [],
    ratingAverage: 5.0,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-104',
    name: 'Fresh Mango & Avocado Spris',
    categoryId: 'cat-cold-drinks',
    category: { id: 'cat-cold-drinks', name: 'Cold Beverages & Juices' },
    price: 180,
    description: 'Layered fresh tropical mango and creamy avocado smoothie topped with lime essence and natural honey.',
    isAvailable: true,
    spicyLevel: 0,
    preparationTime: 8,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 260,
    protein: 4,
    carbs: 42,
    fat: 11,
    ingredients: ['Ripe Mango', 'Hass Avocado', 'Lime Juice'],
    allergens: [],
    ratingAverage: 4.9,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-105',
    name: 'Crispy Sambusa Platter (3 pcs)',
    categoryId: 'cat-appetizers',
    category: { id: 'cat-appetizers', name: 'Appetizers & Starters' },
    price: 120,
    description: 'Golden, crispy pastry pockets filled with seasoned lentils, caramelized onions, herbs, and green chilies.',
    isAvailable: true,
    spicyLevel: 1,
    preparationTime: 12,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    isHalal: true,
    calories: 310,
    protein: 10,
    carbs: 38,
    fat: 14,
    ingredients: ['Pastry Dough', 'Lentils', 'Onion', 'Jalapeño', 'Cumin'],
    allergens: ['Gluten'],
    ratingAverage: 4.7,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-106',
    name: 'Honey Baklava with Pistachios',
    categoryId: 'cat-desserts',
    category: { id: 'cat-desserts', name: 'Desserts & Sweets' },
    price: 160,
    description: 'Crispy layers of golden filo pastry layered with crushed roasted pistachios, soaked in fragrant spiced honey syrup.',
    isAvailable: true,
    spicyLevel: 0,
    preparationTime: 5,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isHalal: true,
    calories: 380,
    protein: 6,
    carbs: 48,
    fat: 20,
    ingredients: ['Filo Pastry', 'Pistachios', 'Pure Honey', 'Butter', 'Cardamom'],
    allergens: ['Nuts', 'Dairy', 'Gluten'],
    ratingAverage: 4.9,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80' }],
  },
];

const MENU_STORAGE_KEY = 'restaurant_menu_items_store_v1';
const CATS_STORAGE_KEY = 'restaurant_categories_store_v1';

const getStoredMenu = () => {
  try {
    const saved = localStorage.getItem(MENU_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_MENU_ITEMS;
};

const getStoredCategories = () => {
  try {
    const saved = localStorage.getItem(CATS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INITIAL_CATEGORIES;
};

export const menuApi = {
  // Get all dishes (Supports filtering by category/search)
  getAll: async (params) => {
    try {
      const res = await apiClient.get('/menu', { params });
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
    } catch (e) {}
    return { data: getStoredMenu() };
  },

  // Get a single dish for the Detail Popup
  getById: async (id) => {
    try {
      const res = await apiClient.get(`/menu/${id}`);
      if (res.data) return res.data;
    } catch (e) {}
    const items = getStoredMenu();
    return { data: items.find((i) => i.id === id) || items[0] };
  },

  // Get menu for a specific table (Used by Customer)
  getByQr: async (shortId) => {
    try {
      const res = await apiClient.get(`/menu/qr/${shortId}`);
      if (res.data?.data) return res.data;
    } catch (e) {}
    return {
      data: getStoredMenu(),
      qr: { id: shortId, name: `Table ${shortId.toUpperCase()}`, shortId },
    };
  },

  // Create new dish (Used by Admin)
  create: async (formData) => {
    try {
      const res = await apiClient.post('/menu', formData);
      return res.data;
    } catch (e) {}

    const newItem = {
      id: 'item-' + Date.now().toString(36),
      isAvailable: true,
      ratingAverage: 5.0,
      images: [{ imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' }],
      ...formData,
    };
    const current = getStoredMenu();
    const updated = [newItem, ...current];
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('menu_updated', { detail: updated }));
    } catch (err) {}
    return { data: newItem };
  },

  // Update dish (Used by Admin)
  update: async (id, formData) => {
    try {
      const res = await apiClient.put(`/menu/${id}`, formData);
      return res.data;
    } catch (e) {}

    const current = getStoredMenu();
    const updated = current.map((i) => (i.id === id ? { ...i, ...formData } : i));
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('menu_updated', { detail: updated }));
    } catch (err) {}
    return { data: updated.find((i) => i.id === id) };
  },

  // Toggle switch (In-Stock / Out-of-Stock / Hide)
  toggle: async (id, isAvailable) => {
    try {
      const res = await apiClient.patch(`/menu/${id}/toggle`, { isAvailable });
      return res.data;
    } catch (e) {}

    const current = getStoredMenu();
    const updated = current.map((i) => (i.id === id ? { ...i, isAvailable } : i));
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('menu_updated', { detail: updated }));
    } catch (err) {}
    return { success: true, isAvailable };
  },

  // Permanent Delete (Used by Admin)
  remove: async (id) => {
    try {
      const res = await apiClient.delete(`/menu/${id}`);
      return res.data;
    } catch (e) {}

    const current = getStoredMenu();
    const updated = current.filter((i) => i.id !== id);
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('menu_updated', { detail: updated }));
    } catch (err) {}
    return { success: true };
  },

  // =========================
  // CATEGORY METHODS
  // =========================
  getCategories: async () => {
    try {
      const res = await apiClient.get('/categories');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
    } catch (e) {}
    return { data: getStoredCategories() };
  },

  createCategory: async (name) => {
    try {
      const res = await apiClient.post('/categories', { name });
      return res.data;
    } catch (e) {}

    const newCat = { id: 'cat-' + Date.now().toString(36), name };
    const current = getStoredCategories();
    const updated = [...current, newCat];
    try {
      localStorage.setItem(CATS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {}
    return { data: newCat };
  },

  updateCategory: async (id, name) => {
    try {
      const res = await apiClient.patch(`/categories/${id}`, { name });
      return res.data;
    } catch (e) {}

    const current = getStoredCategories();
    const updated = current.map((c) => (c.id === id ? { ...c, name } : c));
    try {
      localStorage.setItem(CATS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {}
    return { data: updated.find((c) => c.id === id) };
  },

  deleteCategory: async (id) => {
    try {
      const res = await apiClient.delete(`/categories/${id}`);
      return res.data;
    } catch (e) {}

    const current = getStoredCategories();
    const updated = current.filter((c) => c.id !== id);
    try {
      localStorage.setItem(CATS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {}
    return { success: true };
  },
};

export default menuApi;
