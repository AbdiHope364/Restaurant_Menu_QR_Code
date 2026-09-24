/**
 * ITETE BUNA - Zero-Dependency Local Mock API Server
 * Provides full REST endpoints on http://localhost:5000/api/v1
 */
import http from 'http';

const PORT = process.env.PORT || 5000;

// Initial Seed Data
const CATEGORIES = [
  { id: 'cat-traditional', name: 'የባህል ምግቦች (Traditional Dishes)' },
  { id: 'cat-buna-hot', name: 'የኢትዮጵያ ቡና እና ትኩስ መጠጦች (Authentic Buna & Hot)' },
  { id: 'cat-fasting', name: 'የጾም ምግቦች (Vegan & Fasting Beyaynetu)' },
  { id: 'cat-breakfast', name: 'የቁርስ ምግቦች (Traditional Breakfasts)' },
  { id: 'cat-cold-tej', name: 'የቀዘቀዙ መጠጦች እና ጠጅ (Cold Beverages & Tej)' },
  { id: 'cat-desserts', name: 'ጣፋጭ ምግቦች (Desserts & Sweet Bites)' },
];

const MENU_ITEMS = [
  {
    id: 'item-101',
    name: 'ልዩ የበሬ ጥብስ (Special Sizzling Beef Tibs)',
    categoryId: 'cat-traditional',
    category: { id: 'cat-traditional', name: 'የባህል ምግቦች (Traditional Dishes)' },
    price: 480,
    oldPrice: 520,
    description:
      'Tender cubes of prime beef sautéed with caramelized onions, fresh rosemary, green jalapeños, and seasoned Ethiopian spiced butter (Niter Kibbeh). Served sizzling on a clay shekla plate with fresh teff injera, awaze, and senafich.',
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
    ingredients: [
      'Prime Beef',
      'Niter Kibbeh',
      'Red Onion',
      'Rosemary',
      'Green Chili',
      'Injera',
      'Awaze',
      'Senafich',
    ],
    allergens: [],
    ratingAverage: 4.9,
    images: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'item-102',
    name: 'የበዓል ዶሮ ወጥ (Traditional Holiday Doro Wat)',
    categoryId: 'cat-traditional',
    category: { id: 'cat-traditional', name: 'የባህል ምግቦች (Traditional Dishes)' },
    price: 550,
    oldPrice: 600,
    description:
      'Slow-simmered tender chicken drumstick cooked in a rich, velvety caramelized red onion and Berbere sauce, infused with garlic, ginger, and cardamom. Served with a hard-boiled egg and warm teff injera.',
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
    ingredients: [
      'Free-Range Chicken',
      'Slow-cooked Red Onions',
      'Authentic Berbere',
      'Niter Kibbeh',
      'Boiled Egg',
      'Korerima',
    ],
    allergens: ['Eggs'],
    ratingAverage: 5.0,
    images: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'item-103',
    name: 'ልዩ የጉራጌ ክትፎ (Gurage Kitfo with Kocho & Ayib)',
    categoryId: 'cat-traditional',
    category: { id: 'cat-traditional', name: 'የባህል ምግቦች (Traditional Dishes)' },
    price: 520,
    oldPrice: 560,
    description:
      'Minced prime lean beef seasoned with pure spiced clarified butter (Niter Kibbeh) and fiery Mitmita chili powder. Served Leb-Leb with fresh homemade herbal cottage cheese (Ayib), steamed Gomen, and traditional fermented Enset Kocho bread.',
    isAvailable: true,
    spicyLevel: 3,
    preparationTime: 12,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    isHalal: true,
    calories: 720,
    protein: 56,
    carbs: 12,
    fat: 42,
    ingredients: [
      'Prime Minced Beef',
      'Niter Kibbeh',
      'Mitmita Spice Blend',
      'Fresh Ayib Cheese',
      'Steamed Gomen Collards',
      'Kocho Bread',
    ],
    allergens: ['Dairy (Ayib)'],
    ratingAverage: 4.95,
    images: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'item-104',
    name: 'የሸክላ ሽሮ ተጋቢኖ (Clay-pot Shiro Tegabino)',
    categoryId: 'cat-fasting',
    category: { id: 'cat-fasting', name: 'የጾም ምግቦች (Vegan & Fasting Beyaynetu)' },
    price: 240,
    oldPrice: 270,
    description:
      'Velvety, seasoned sun-dried chickpea flour stew simmered with garlic, onions, and mild Ethiopian spices. Served bubbling and sizzling hot in a traditional handmade clay pot with 100% teff injera and fresh jalapeños.',
    isAvailable: true,
    spicyLevel: 1,
    preparationTime: 10,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 420,
    protein: 22,
    carbs: 48,
    fat: 14,
    ingredients: [
      'Spiced Roasted Chickpea Flour (Shiro)',
      'Garlic',
      'Red Onion',
      'Sunflower Oil',
      'Green Jalapeño',
      'Teff Injera',
    ],
    allergens: [],
    ratingAverage: 4.85,
    images: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'item-105',
    name: 'የጾም በያይነቱ (10-Variety Fasting Platter)',
    categoryId: 'cat-fasting',
    category: { id: 'cat-fasting', name: 'የጾም ምግቦች (Vegan & Fasting Beyaynetu)' },
    price: 360,
    oldPrice: 400,
    description:
      'A feast of 10 vegan dishes arranged across teff injera: Misir Wat, Kik Alicha, Gomen, Fosolia, Key Sir, Timatim Fitfit, Suf Fitfit, Potato Stew, and Cabbage Salad.',
    isAvailable: true,
    spicyLevel: 2,
    preparationTime: 12,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 580,
    protein: 28,
    carbs: 76,
    fat: 12,
    ingredients: [
      'Red Lentils',
      'Yellow Split Peas',
      'Collard Greens',
      'Green Beans & Carrots',
      'Beetroot',
      'Sunflower Seed Milk',
      'Injera',
    ],
    allergens: [],
    ratingAverage: 4.9,
    images: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'item-106',
    name: 'የኢትዮጵያ የቡና ሥነ-ሥርዓት (Ethiopian Buna Ceremony Set)',
    categoryId: 'cat-buna-hot',
    category: { id: 'cat-buna-hot', name: 'የኢትዮጵያ ቡና እና ትኩስ መጠጦች (Authentic Buna & Hot)' },
    price: 180,
    oldPrice: 200,
    description:
      'Authentic three-round Ethiopian coffee ceremony (Abol, Tona, Bereka) brewed from fresh roasted Yirgacheffe single-origin beans in a clay Jebena. Served with roasting frankincense, fresh popcorn, and Rue herb (Tena’adam).',
    isAvailable: true,
    spicyLevel: 0,
    preparationTime: 15,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 25,
    protein: 1,
    carbs: 4,
    fat: 0,
    ingredients: [
      'Yirgacheffe Arabica Beans',
      'Clay Jebena Brewing',
      'Frankincense Aroma',
      'Fresh Popcorn',
      'Tena’adam Herb',
    ],
    allergens: [],
    ratingAverage: 5.0,
    images: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

const QRS = [
  {
    id: 'qr-tbl-1',
    name: 'Table 1 (Main Hall)',
    shortId: 'table-1',
    _count: { scans: 48 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'qr-tbl-2',
    name: 'Table 2 (Garden Patio)',
    shortId: 'table-2',
    _count: { scans: 32 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'qr-tbl-3',
    name: 'Table 3 (VIP Lounge)',
    shortId: 'table-3',
    _count: { scans: 65 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'qr-tbl-4',
    name: 'Bar Counter A',
    shortId: 'bar-1',
    _count: { scans: 19 },
    createdAt: new Date().toISOString(),
  },
];

const ORDERS = [
  {
    id: 'ord-101',
    tableId: 't1',
    tableName: 'Table 1 (Main Hall)',
    shortId: 'table-1',
    items: [
      {
        id: 'item-101',
        name: 'ልዩ የበሬ ጥብስ (Special Sizzling Beef Tibs)',
        price: 480,
        quantity: 2,
        notes: 'Extra awaze and sizzling hot',
      },
      {
        id: 'item-106',
        name: 'የኢትዮጵያ የቡና ሥነ-ሥርዓት (Buna Ceremony)',
        price: 180,
        quantity: 1,
        notes: 'With popcorn',
      },
    ],
    subtotal: 1140,
    tax: 171,
    total: 1311,
    notes: 'Please bring food together when ready',
    status: 'preparing',
    paymentMethod: 'telebirr',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
];

const RATINGS = [
  {
    id: 'rev-1',
    customerName: 'Yonas Mulugeta',
    rating: 5,
    comment:
      'The Special Sizzling Beef Tibs was sensational! Perfect spiced butter (Niter Kibbeh) and sizzling hot. Traditional Buna was exceptional.',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-2',
    customerName: 'Helen Tesfaye',
    rating: 5,
    comment:
      'Best Fasting Beyaynetu in town. The Shiro Tegabino was boiling hot and fresh. Loved the tri-lingual QR ordering experience!',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
];

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  res.setHeader('Content-Type', 'application/json');

  // Routing
  if (pathname === '/api/v1/menu' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: MENU_ITEMS }));
    return;
  }

  if (pathname === '/api/v1/categories' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: CATEGORIES }));
    return;
  }

  if (pathname === '/api/v1/qr' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: QRS }));
    return;
  }

  if (pathname === '/api/v1/orders' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: ORDERS }));
    return;
  }

  if (pathname === '/api/v1/analytics/overview' && req.method === 'GET') {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        success: true,
        data: {
          todayScans: 84,
          outOfStock: 1,
          totalCategories: CATEGORIES.length,
          totalDishes: MENU_ITEMS.length,
          revenueToday: 18450,
          pendingOrders: 2,
        },
      }),
    );
    return;
  }

  if (pathname === '/api/v1/analytics/live' && req.method === 'GET') {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        success: true,
        data: {
          peakTime: '1:00 PM - 2:30 PM (Lunch)',
          completionRate: 94,
          topDish: 'ልዩ የበሬ ጥብስ (Special Sizzling Beef Tibs)',
          customerSatisfaction: 4.9,
          totalOrdersWeek: 412,
          totalRevenueWeek: 128500,
        },
      }),
    );
    return;
  }

  if (
    (pathname === '/api/v1/ratings/admin/all' || pathname === '/api/v1/ratings') &&
    req.method === 'GET'
  ) {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: RATINGS }));
    return;
  }

  if (pathname === '/api/v1/auth/login' && req.method === 'POST') {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        success: true,
        token: 'mock-jwt-token-admin',
        admin: {
          id: 'usr-admin-1',
          fullName: 'Restaurant Manager',
          email: 'manager@restaurant.com',
          role: 'admin',
        },
      }),
    );
    return;
  }

  // Fallback for any POST/PUT/DELETE
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      let parsed = {};
      try {
        parsed = JSON.parse(body);
      } catch (e) {}
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: 'Processed successfully', data: parsed }));
    });
    return;
  }

  // Default 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`🚀 [ITETE BUNA] Mock Backend API live at http://localhost:${PORT}/api/v1`);
});
