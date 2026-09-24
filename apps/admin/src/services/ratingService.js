import { apiClient } from '@ethio-buna/shared';

const RATINGS_STORAGE_KEY = 'restaurant_feedback_list_v1';

const INITIAL_RATINGS = [
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
  {
    id: 'rev-3',
    customerName: 'Dawit Bekele',
    rating: 5,
    comment:
      'Authentic Doro Wat with tender chicken and balanced Berbere. Quick table service and smooth digital menu.',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

const getStoredRatings = () => {
  try {
    const saved = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_RATINGS;
};

const saveStoredRatings = (list) => {
  try {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('ratings_updated', { detail: list }));
  } catch (e) {}
};

export const ratingService = {
  // Fetch full guest reviews (Names + Comments)
  getAdminFeedback: async () => {
    try {
      const res = await apiClient.get('/ratings/admin/all');
      if (res.data?.data) return res.data;
      if (Array.isArray(res.data)) return { data: res.data };
    } catch (e) {}

    return { data: getStoredRatings() };
  },

  // Delete a review if it is inappropriate
  removeFeedback: async (id) => {
    try {
      const res = await apiClient.delete(`/ratings/${id}`);
      return res.data;
    } catch (e) {}

    const current = getStoredRatings();
    const updated = current.filter((r) => r.id !== id);
    saveStoredRatings(updated);
    return { success: true };
  },
};

export default ratingService;
