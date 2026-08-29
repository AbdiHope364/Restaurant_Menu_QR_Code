import { apiClient } from '@ethio-buna/shared';

const QR_STORAGE_KEY = 'restaurant_qr_list_v1';

const INITIAL_QRS = [
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

const getStoredQRs = () => {
  try {
    const saved = localStorage.getItem(QR_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_QRS;
};

const saveStoredQRs = (list) => {
  try {
    localStorage.setItem(QR_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('qr_list_updated', { detail: list }));
  } catch (e) {}
};

export const qrService = {
  // Get all QR codes
  getAll: async () => {
    try {
      const res = await apiClient.get('/qr');
      if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data;
      }
    } catch (e) {}
    return { data: getStoredQRs() };
  },

  // Create a QR code
  create: async (data) => {
    try {
      const res = await apiClient.post('/qr', data);
      return res.data;
    } catch (e) {}

    // Offline / Local Generation
    const rawName = (data.name || 'Table').trim();
    const slug = rawName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const shortId = `${slug || 'table'}-${Math.random().toString(36).substring(2, 6)}`;

    const newQR = {
      id: 'qr-' + Date.now().toString(36),
      name: rawName,
      shortId: shortId,
      _count: { scans: 0 },
      createdAt: new Date().toISOString(),
    };

    const current = getStoredQRs();
    const updated = [newQR, ...current];
    saveStoredQRs(updated);

    return { data: newQR };
  },

  // Get QR image
  getPrintableImage: async (shortId) => {
    try {
      const res = await apiClient.get(`/qr/${shortId}/image`);
      if (res.data?.image) return res.data;
    } catch (e) {}

    return { image: null };
  },

  // Delete QR
  remove: async (id) => {
    try {
      const res = await apiClient.delete(`/qr/${id}`);
      return res.data;
    } catch (e) {}

    const current = getStoredQRs();
    const updated = current.filter((q) => q.id !== id && q.shortId !== id);
    saveStoredQRs(updated);
    return { success: true };
  },
};

export default qrService;
