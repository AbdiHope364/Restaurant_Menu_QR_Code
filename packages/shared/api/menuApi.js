import apiClient from './apiClient';

const INITIAL_CATEGORIES = [
  { id: 'cat-traditional', name: 'የባህል ምግቦች (Traditional Dishes)' },
  { id: 'cat-buna-hot', name: 'የኢትዮጵያ ቡና እና ትኩስ መጠጦች (Authentic Buna & Hot)' },
  { id: 'cat-fasting', name: 'የጾም ምግቦች (Vegan & Fasting Beyaynetu)' },
  { id: 'cat-breakfast', name: 'የቁርስ ምግቦች (Traditional Breakfasts)' },
  { id: 'cat-cold-tej', name: 'የቀዘቀዙ መጠጦች እና ጠጅ (Cold Beverages & Tej)' },
  { id: 'cat-desserts', name: 'ጣፋጭ ምግቦች (Desserts & Sweet Bites)' },
];

const INITIAL_MENU_ITEMS = [
  {
    id: 'item-101',
    name: 'ልዩ የበሬ ጥብስ (Special Sizzling Beef Tibs)',
    categoryId: 'cat-traditional',
    category: { id: 'cat-traditional', name: 'የባህል ምግቦች (Traditional Dishes)' },
    price: 480,
    oldPrice: 520,
    description: 'Tender cubes of prime beef sautéed with caramelized onions, fresh rosemary, green jalapeños, and seasoned Ethiopian spiced butter (Niter Kibbeh). Served sizzling on a clay shekla plate with fresh teff injera, awaze, and senafich.',
    isAvailable: true,
    spicyLevel: 2,
    preparationTime: 15,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isHalal: true,
    calories: 640,
    protein: 48,
    carbs: 10,
    fat: 32,
    ingredients: ['Prime Beef', 'Niter Kibbeh', 'Red Onion', 'Rosemary', 'Green Chili', 'Injera', 'Awaze', 'Senafich'],
    allergens: [],
    ratingAverage: 4.9,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-102',
    name: 'የበዓል ዶሮ ወጥ (Traditional Holiday Doro Wat)',
    categoryId: 'cat-traditional',
    category: { id: 'cat-traditional', name: 'የባህል ምግቦች (Traditional Dishes)' },
    price: 550,
    oldPrice: 600,
    description: 'Slow-simmered tender chicken drumstick cooked in a rich, velvety caramelized red onion and Berbere sauce, infused with garlic, ginger, and cardamom. Served with a hard-boiled egg and warm teff injera.',
    isAvailable: true,
    spicyLevel: 3,
    preparationTime: 20,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isHalal: true,
    calories: 680,
    protein: 52,
    carbs: 22,
    fat: 28,
    ingredients: ['Free-Range Chicken', 'Slow-cooked Red Onions', 'Authentic Berbere', 'Niter Kibbeh', 'Boiled Egg', 'Korerima'],
    allergens: ['Eggs'],
    ratingAverage: 5.0,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-103',
    name: 'ልዩ የጉራጌ ክትፎ (Special Gurage Kitfo with Ayib & Gomen)',
    categoryId: 'cat-traditional',
    category: { id: 'cat-traditional', name: 'የባህል ምግቦች (Traditional Dishes)' },
    price: 520,
    oldPrice: 560,
    description: 'Finely minced lean beef warmed with infused spiced butter (Niter Kibbeh) and aromatic Mitmita pepper. Served with seasoned cottage cheese (Ayib), spiced collard greens (Gomen Kitfo), and Kocho.',
    isAvailable: true,
    spicyLevel: 3,
    preparationTime: 12,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isHalal: true,
    calories: 710,
    protein: 56,
    carbs: 14,
    fat: 36,
    ingredients: ['Lean Minced Beef', 'Mitmita Pepper', 'Niter Kibbeh', 'Ayib (Cottage Cheese)', 'Gomen Kitfo', 'Kocho'],
    allergens: ['Dairy'],
    ratingAverage: 4.9,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-104',
    name: 'ክክ ሽሮ ተጋቢኖ (Shiro Tegabino Clay Pot)',
    categoryId: 'cat-fasting',
    category: { id: 'cat-fasting', name: 'የጾም ምግቦች (Vegan & Fasting Beyaynetu)' },
    price: 240,
    oldPrice: 270,
    description: 'Spiced powdered chickpeas and split peas simmered with garlic, ginger, red onions, and hot oil in a bubbling earthenware clay pot. Served sizzling with fresh injera.',
    isAvailable: true,
    spicyLevel: 2,
    preparationTime: 10,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 430,
    protein: 20,
    carbs: 60,
    fat: 12,
    ingredients: ['Shiro Powder', 'Garlic', 'Ginger', 'Berbere', 'Red Onion', 'Green Pepper', 'Injera'],
    allergens: [],
    ratingAverage: 4.9,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-105',
    name: 'የጾም በያይነቱ (Full Vegan Fasting Beyaynetu - 8 Dishes)',
    categoryId: 'cat-fasting',
    category: { id: 'cat-fasting', name: 'የጾም ምግቦች (Vegan & Fasting Beyaynetu)' },
    price: 380,
    oldPrice: 420,
    description: 'A vibrant, colorful traditional platter featuring 8 vegan specialties: Misir Wat (Red Lentils), Kik Alicha (Yellow Split Peas), Gomen (Collard Greens), Fosolia (Green Beans & Carrots), Tikil Gomen (Cabbage & Potato), Shiro, Key Sir (Beetroot), and Tomato Salad on fresh injera.',
    isAvailable: true,
    spicyLevel: 2,
    preparationTime: 12,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 590,
    protein: 26,
    carbs: 85,
    fat: 14,
    ingredients: ['Misir Wat', 'Kik Alicha', 'Gomen', 'Fosolia', 'Tikil Gomen', 'Beetroot', 'Injera', 'Salata'],
    allergens: [],
    ratingAverage: 5.0,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-106',
    name: 'የኢትዮጵያ ጀበና ቡና ስነ-ስርዓት (Authentic Buna Ceremony)',
    categoryId: 'cat-buna-hot',
    category: { id: 'cat-buna-hot', name: 'የኢትዮጵያ ቡና እና ትኩስ መጠጦች (Authentic Buna & Hot)' },
    price: 180,
    description: 'Complete traditional Ethiopian coffee ceremony: freshly roasted Yirgacheffe Arabica beans brewed in a clay Jebena pot. Served with fresh hot popcorn (Fendisha), Tena Adam (Rue herb), and aromatic burning frankincense.',
    isAvailable: true,
    spicyLevel: 0,
    preparationTime: 8,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 50,
    protein: 1,
    carbs: 4,
    fat: 0,
    ingredients: ['Single-Origin Yirgacheffe Beans', 'Spring Water', 'Fresh Popcorn', 'Tena Adam', 'Frankincense'],
    allergens: [],
    ratingAverage: 5.0,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-107',
    name: 'የአቦል፣ ቶና እና በረካ ቡና (Abol, Tona & Bereka 3-Cup Tasting)',
    categoryId: 'cat-buna-hot',
    category: { id: 'cat-buna-hot', name: 'የኢትዮጵያ ቡና እና ትኩስ መጠጦች (Authentic Buna & Hot)' },
    price: 120,
    description: 'Experience the 3 traditional rounds of Ethiopian coffee: Abol (the first strong brew), Tona (the second harmonious brew), and Bereka (the third blessing brew).',
    isAvailable: true,
    spicyLevel: 0,
    preparationTime: 6,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 30,
    protein: 0,
    carbs: 2,
    fat: 0,
    ingredients: ['Sidama Organic Coffee Beans', 'Spring Water', 'Cinnamon Stick (Optional)'],
    allergens: [],
    ratingAverage: 4.8,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-108',
    name: 'ጨጨብሳ በማር እና ቅቤ (Chechebsa / Kita Firfir with Honey & Butter)',
    categoryId: 'cat-breakfast',
    category: { id: 'cat-breakfast', name: 'የቁርስ ምግቦች (Traditional Breakfasts)' },
    price: 260,
    oldPrice: 290,
    description: 'Shredded pan-baked flatbread pan-fried in rich Ethiopian spiced butter (Niter Kibbeh) and Berbere, drizzled with pure highland honey and served with fresh plain yogurt.',
    isAvailable: true,
    spicyLevel: 1,
    preparationTime: 12,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isHalal: true,
    calories: 540,
    protein: 12,
    carbs: 68,
    fat: 24,
    ingredients: ['Wheat Flour Flatbread (Kita)', 'Niter Kibbeh', 'Berbere', 'Highland Honey', 'Yogurt (Ergo)'],
    allergens: ['Dairy', 'Gluten'],
    ratingAverage: 4.9,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-109',
    name: 'ቋንጣ ፍርፍር (Quanta Firfir - Dried Spiced Beef & Injera)',
    categoryId: 'cat-breakfast',
    category: { id: 'cat-breakfast', name: 'የቁርስ ምግቦች (Traditional Breakfasts)' },
    price: 340,
    oldPrice: 380,
    description: 'Crispy sun-dried spiced beef jerky simmered in an aromatic Berbere, garlic, and onion stew, tossed with rolled injera pieces. Served with fresh boiled egg and jalapeño.',
    isAvailable: true,
    spicyLevel: 3,
    preparationTime: 14,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isHalal: true,
    calories: 610,
    protein: 42,
    carbs: 48,
    fat: 26,
    ingredients: ['Dried Spiced Beef (Quanta)', 'Injera', 'Berbere', 'Niter Kibbeh', 'Garlic', 'Boiled Egg'],
    allergens: ['Eggs'],
    ratingAverage: 4.8,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-110',
    name: 'ልዩ ስፕሪስ ጁስ (Special Tri-Layered Spris Juice)',
    categoryId: 'cat-cold-tej',
    category: { id: 'cat-cold-tej', name: 'የቀዘቀዙ መጠጦች እና ጠጅ (Cold Beverages & Tej)' },
    price: 190,
    description: 'Famous Ethiopian layered fruit smoothie featuring thick creamy avocado, fresh sweet mango, and tropical papaya, topped with fresh squeezed lime juice and pure honey (Vimto dash optional).',
    isAvailable: true,
    spicyLevel: 0,
    preparationTime: 5,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 270,
    protein: 4,
    carbs: 46,
    fat: 12,
    ingredients: ['Fresh Hass Avocado', 'Ripe Mango', 'Red Papaya', 'Fresh Lime', 'Pure Honey'],
    allergens: [],
    ratingAverage: 4.9,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-111',
    name: 'የማር ጠጅ በብርሌ (Traditional Honey Tej in Berele Glass)',
    categoryId: 'cat-cold-tej',
    category: { id: 'cat-cold-tej', name: 'የቀዘቀዙ መጠጦች እና ጠጅ (Cold Beverages & Tej)' },
    price: 220,
    description: 'Authentic fermented Ethiopian honey wine brewed with pure Gesho leaves and organic forest honey. Served chilled in traditional long-necked Berele glassware.',
    isAvailable: true,
    spicyLevel: 0,
    preparationTime: 2,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: false,
    calories: 180,
    protein: 0,
    carbs: 18,
    fat: 0,
    ingredients: ['Forest Honey', 'Gesho (Rhamnus prinoides)', 'Spring Water'],
    allergens: [],
    ratingAverage: 4.9,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-112',
    name: 'የምስር ሳምቡሳ በአዋዜ (Crispy Lentil Sambusa with Awaze Dip - 3 Pcs)',
    categoryId: 'cat-fasting',
    category: { id: 'cat-fasting', name: 'የጾም ምግቦች (Vegan & Fasting Beyaynetu)' },
    price: 130,
    description: 'Golden-fried crispy pastry shells generously filled with seasoned green lentils, caramelized onions, jalapeño peppers, and Ethiopian herbs. Served with spicy Awaze dipping sauce.',
    isAvailable: true,
    spicyLevel: 1,
    preparationTime: 8,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    isHalal: true,
    calories: 320,
    protein: 11,
    carbs: 40,
    fat: 14,
    ingredients: ['Whole Lentils', 'Pastry Shell', 'Onion', 'Jalapeño', 'Cumin', 'Awaze'],
    allergens: ['Gluten'],
    ratingAverage: 4.8,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' }],
  },
  {
    id: 'item-113',
    name: 'የማር ባክላቫ በፒስታቺዮ (Ethiopian Spiced Honey Baklava)',
    categoryId: 'cat-desserts',
    category: { id: 'cat-desserts', name: 'ጣፋጭ ምግቦች (Desserts & Sweet Bites)' },
    price: 170,
    description: 'Delicate crispy layers of golden filo dough filled with roasted crushed pistachios and almonds, soaked in cardamom and clove spiced pure honey syrup.',
    isAvailable: true,
    spicyLevel: 0,
    preparationTime: 3,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    isHalal: true,
    calories: 390,
    protein: 7,
    carbs: 50,
    fat: 21,
    ingredients: ['Filo Pastry', 'Pistachios', 'Almonds', 'Pure Honey', 'Niter Kibbeh', 'Cardamom'],
    allergens: ['Nuts', 'Gluten', 'Dairy'],
    ratingAverage: 4.9,
    images: [{ imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80' }],
  },
];

const MENU_STORAGE_KEY = 'restaurant_menu_items_store_v2';
const CATS_STORAGE_KEY = 'restaurant_categories_store_v2';

const getStoredMenu = () => {
  try {
    const saved = localStorage.getItem(MENU_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_MENU_ITEMS;
};

const getStoredCategories = () => {
  try {
    const saved = localStorage.getItem(CATS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
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
    return { data: updated.find((i) => i.id === id) };
  },

  // Delete dish
  delete: async (id) => {
    try {
      await apiClient.delete(`/menu/${id}`);
      return { success: true };
    } catch (e) {}

    const current = getStoredMenu();
    const updated = current.filter((i) => i.id !== id);
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('menu_updated', { detail: updated }));
    } catch (err) {}
    return { success: true };
  },

  // Get categories
  getCategories: async () => {
    try {
      const res = await apiClient.get('/categories');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
    } catch (e) {}
    return { data: getStoredCategories() };
  },

  // Create Category
  createCategory: async (categoryData) => {
    try {
      const res = await apiClient.post('/categories', categoryData);
      return res.data;
    } catch (e) {}

    const newCat = {
      id: 'cat-' + Date.now().toString(36),
      ...categoryData,
    };
    const current = getStoredCategories();
    const updated = [...current, newCat];
    try {
      localStorage.setItem(CATS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('categories_updated', { detail: updated }));
    } catch (err) {}
    return { data: newCat };
  },

  // Delete Category
  deleteCategory: async (id) => {
    try {
      await apiClient.delete(`/categories/${id}`);
      return { success: true };
    } catch (e) {}

    const current = getStoredCategories();
    const updated = current.filter((c) => c.id !== id);
    try {
      localStorage.setItem(CATS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('categories_updated', { detail: updated }));
    } catch (err) {}
    return { success: true };
  },
};
