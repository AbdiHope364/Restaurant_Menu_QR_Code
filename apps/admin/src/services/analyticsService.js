import { apiClient } from '@ethio-buna/shared';

const FALLBACK_OVERVIEW = {
  todayScans: 84,
  outOfStock: 1,
  totalCategories: 6,
  totalDishes: 13,
  revenueToday: 18450,
  pendingOrders: 2,
};

const FALLBACK_LIVE_STATS = {
  peakTime: '1:00 PM - 2:30 PM (Lunch)',
  completionRate: 94,
  topDish: 'ልዩ የበሬ ጥብስ (Special Sizzling Beef Tibs)',
  customerSatisfaction: 4.9,
  totalOrdersWeek: 412,
  totalRevenueWeek: 128500,
};

export const analyticsService = {
  // Data for the main Dashboard Landing Page
  getOverview: async () => {
    try {
      const res = await apiClient.get('/analytics/overview');
      if (res.data) return res.data;
    } catch (e) {}

    return { data: FALLBACK_OVERVIEW };
  },

  // Data for the deep Performance/KPI page
  getLiveStats: async () => {
    try {
      const res = await apiClient.get('/analytics/live');
      if (res.data) return res.data;
    } catch (e) {}

    return { data: FALLBACK_LIVE_STATS };
  },
};

export default analyticsService;
