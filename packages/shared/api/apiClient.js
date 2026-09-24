import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
const useBackendEnv = import.meta.env.VITE_USE_BACKEND;

// True only if an external backend URL is provided or explicitly enabled via VITE_USE_BACKEND=true
const isExplicitBackend =
  useBackendEnv === 'true' ||
  (Boolean(rawApiUrl) &&
    !rawApiUrl.includes('localhost:5000') &&
    (rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://')));

const baseURL = isExplicitBackend
  ? rawApiUrl
  : 'http://localhost:5000/api/v1';

// Smart offline connectivity manager
const backendState = {
  // If no live backend is explicitly configured, default to standalone client-first mode
  // to avoid noisy browser ERR_CONNECTION_REFUSED logs on localhost:5000.
  isOffline: !isExplicitBackend,
  lastFailure: !isExplicitBackend ? Infinity : 0,
};

const PROBE_INTERVAL_MS = 30000;

export const apiClient = axios.create({
  baseURL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  // Short-circuit quietly when operating in standalone mode or when backend is unreachable
  if (
    backendState.isOffline &&
    Date.now() - backendState.lastFailure < PROBE_INTERVAL_MS
  ) {
    const offlineErr = new Error(
      'Operating in standalone client mode with offline storage.',
    );
    offlineErr.isOfflineSilent = true;
    return Promise.reject(offlineErr);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    backendState.isOffline = false;
    return response;
  },
  (error) => {
    if (
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED'
    ) {
      backendState.isOffline = true;
      backendState.lastFailure = Date.now();
    }

    if (
      error.response?.status === 401 &&
      !window.location.pathname.startsWith('/q/') &&
      !window.location.pathname.startsWith('/menu')
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const isBackendOnline = () => !backendState.isOffline;
export const setBackendMode = (enable) => {
  backendState.isOffline = !enable;
  backendState.lastFailure = enable ? 0 : Infinity;
};

export default apiClient;
