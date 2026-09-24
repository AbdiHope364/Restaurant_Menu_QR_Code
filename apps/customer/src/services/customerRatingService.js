import { apiClient } from '@ethio-buna/shared';

const RATINGS_STORAGE_KEY = 'restaurant_feedback_list_v1';

export const customerRatingService = {
  submitFeedback: async (feedbackData) => {
    const newFeedback = {
      id: 'rev-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      ...feedbackData,
    };

    try {
      const res = await apiClient.post('/ratings', newFeedback);
      if (res.data) return res.data;
    } catch (e) {}

    try {
      const saved = localStorage.getItem(RATINGS_STORAGE_KEY);
      const list = saved ? JSON.parse(saved) : [];
      const updated = [newFeedback, ...list];
      localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent('ratings_updated', { detail: updated }),
      );
    } catch (err) {}

    return { success: true, data: newFeedback };
  },
};

export default customerRatingService;
