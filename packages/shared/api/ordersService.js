import apiClient from './apiClient';

const ORDERS_STORAGE_KEY = 'restaurant_orders_store_v1';
const SERVICE_REQUESTS_KEY = 'restaurant_service_requests_v1';

// Seed sample active orders if none exist
const getInitialOrders = () => {
  try {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  return [
    {
      id: 'ord-101',
      tableId: 't1',
      tableName: 'Table 3 (Patio)',
      shortId: 'T3-PATIO',
      items: [
        { id: 'item-1', name: 'Special Tibs', price: 420, quantity: 2, notes: 'Medium well, extra awaze' },
        { id: 'item-2', name: 'Traditional Shiro', price: 210, quantity: 1, notes: 'Extra injera' },
        { id: 'item-3', name: 'Buna Ceremony Set', price: 150, quantity: 1, notes: 'With popcorn' },
      ],
      subtotal: 1200,
      tax: 180,
      total: 1380,
      notes: 'Please bring food together when ready',
      status: 'preparing', // 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
      paymentMethod: 'card',
      createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    },
    {
      id: 'ord-102',
      tableId: 't2',
      tableName: 'Table 7 (VIP Lounge)',
      shortId: 'VIP-07',
      items: [
        { id: 'item-4', name: 'Beyaynetu Platter', price: 340, quantity: 2, notes: 'All vegan items' },
        { id: 'item-5', name: 'Avocado Salad', price: 180, quantity: 2, notes: 'Lemon dressing' },
      ],
      subtotal: 1040,
      tax: 156,
      total: 1196,
      notes: 'Extra napkins please',
      status: 'pending',
      paymentMethod: 'cash',
      createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    },
  ];
};

const getInitialServiceRequests = () => {
  try {
    const saved = localStorage.getItem(SERVICE_REQUESTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  return [
    {
      id: 'req-201',
      tableId: 't3',
      tableName: 'Table 2 (Window)',
      type: 'request_bill', // 'call_waiter' | 'request_bill'
      details: 'Cash payment requested',
      createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      resolved: false,
    },
  ];
};

export const ordersService = {
  getOrders: async () => {
    try {
      const res = await apiClient.get('/orders');
      if (res.data?.data) return res.data.data;
    } catch (e) {
      // Fallback to local store
    }
    return getInitialOrders();
  },

  placeOrder: async (orderPayload) => {
    const newOrder = {
      id: 'ord-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...orderPayload,
    };

    // Try backend API first
    try {
      await apiClient.post('/orders', newOrder);
    } catch (e) {
      // Fallback to local storage store
    }

    const current = getInitialOrders();
    const updated = [newOrder, ...current];
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('orders_updated', { detail: updated }));
    } catch (err) {}

    return newOrder;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
    } catch (e) {}

    const current = getInitialOrders();
    const updated = current.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('orders_updated', { detail: updated }));
    } catch (err) {}

    return updated;
  },

  deleteOrder: async (orderId) => {
    try {
      await apiClient.delete(`/orders/${orderId}`);
    } catch (e) {}

    const current = getInitialOrders();
    const updated = current.filter((ord) => ord.id !== orderId);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('orders_updated', { detail: updated }));
    } catch (err) {}

    return updated;
  },

  // Service Requests (Call Waiter / Bill Request)
  getServiceRequests: async () => {
    return getInitialServiceRequests();
  },

  requestService: async ({ tableId, tableName, type, details }) => {
    const newReq = {
      id: 'req-' + Date.now().toString(36),
      tableId: tableId || 'unknown',
      tableName: tableName || 'Unassigned Table',
      type,
      details: details || '',
      createdAt: new Date().toISOString(),
      resolved: false,
    };

    try {
      await apiClient.post('/service-requests', newReq);
    } catch (e) {}

    const current = getInitialServiceRequests();
    const updated = [newReq, ...current];
    try {
      localStorage.setItem(SERVICE_REQUESTS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('service_requests_updated', { detail: updated }));
    } catch (err) {}

    return newReq;
  },

  resolveServiceRequest: async (reqId) => {
    const current = getInitialServiceRequests();
    const updated = current.filter((r) => r.id !== reqId);
    try {
      localStorage.setItem(SERVICE_REQUESTS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('service_requests_updated', { detail: updated }));
    } catch (err) {}
    return updated;
  },
};

export default ordersService;

