import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'restaurant_custom_settings_v1';

export const THEME_PRESETS = {
  orange: {
    id: 'orange',
    name: 'Warm Terracotta',
    primary: 'bg-orange-600',
    primaryHover: 'hover:bg-orange-700',
    textPrimary: 'text-orange-600',
    textPrimaryDark: 'text-orange-700',
    bgLight: 'bg-orange-50',
    borderLight: 'border-orange-200',
    ring: 'focus:ring-orange-500',
    badge: 'bg-orange-100 text-orange-800',
    shadow: 'shadow-orange-200',
    accentHex: '#ea580c',
  },
  emerald: {
    id: 'emerald',
    name: 'Fresh Emerald',
    primary: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    textPrimary: 'text-emerald-600',
    textPrimaryDark: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    ring: 'focus:ring-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800',
    shadow: 'shadow-emerald-200',
    accentHex: '#059669',
  },
  indigo: {
    id: 'indigo',
    name: 'Royal Indigo',
    primary: 'bg-indigo-600',
    primaryHover: 'hover:bg-indigo-700',
    textPrimary: 'text-indigo-600',
    textPrimaryDark: 'text-indigo-700',
    bgLight: 'bg-indigo-50',
    borderLight: 'border-indigo-200',
    ring: 'focus:ring-indigo-500',
    badge: 'bg-indigo-100 text-indigo-800',
    shadow: 'shadow-indigo-200',
    accentHex: '#4f46e5',
  },
  rose: {
    id: 'rose',
    name: 'Crimson Rose',
    primary: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    textPrimary: 'text-rose-600',
    textPrimaryDark: 'text-rose-700',
    bgLight: 'bg-rose-50',
    borderLight: 'border-rose-200',
    ring: 'focus:ring-rose-500',
    badge: 'bg-rose-100 text-rose-800',
    shadow: 'shadow-rose-200',
    accentHex: '#e11d48',
  },
  amber: {
    id: 'amber',
    name: 'Golden Amber',
    primary: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-700',
    textPrimary: 'text-amber-600',
    textPrimaryDark: 'text-amber-700',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    ring: 'focus:ring-amber-500',
    badge: 'bg-amber-100 text-amber-800',
    shadow: 'shadow-amber-200',
    accentHex: '#d97706',
  },
  teal: {
    id: 'teal',
    name: 'Ocean Teal',
    primary: 'bg-teal-600',
    primaryHover: 'hover:bg-teal-700',
    textPrimary: 'text-teal-600',
    textPrimaryDark: 'text-teal-700',
    bgLight: 'bg-teal-50',
    borderLight: 'border-teal-200',
    ring: 'focus:ring-teal-500',
    badge: 'bg-teal-100 text-teal-800',
    shadow: 'shadow-teal-200',
    accentHex: '#0d9488',
  },
  slate: {
    id: 'slate',
    name: 'Midnight Slate',
    primary: 'bg-slate-900',
    primaryHover: 'hover:bg-slate-800',
    textPrimary: 'text-slate-900',
    textPrimaryDark: 'text-slate-950',
    bgLight: 'bg-slate-100',
    borderLight: 'border-slate-300',
    ring: 'focus:ring-slate-900',
    badge: 'bg-slate-200 text-slate-900',
    shadow: 'shadow-slate-300',
    accentHex: '#0f172a',
  },
};

export const CURRENCY_OPTIONS = [
  { code: 'ETB', symbol: 'ETB', name: 'Ethiopian Birr (ETB)' },
  { code: 'USD', symbol: '$', name: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (£)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CA$)' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling (KSh)' },
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal (SAR)' },
];

export const DEFAULT_SETTINGS = {
  restaurantName: 'ITETE BUNA',
  tagline: 'Authentic Single-Origin Buna & Artisanal Dining',
  shortCode: 'IB',
  logoUrl: '/logo.png',
  coverUrl: '',
  customerAppUrl: 'https://restaurant-menu-qr-code-customer.vercel.app',
  currency: 'ETB',
  currencySymbol: 'ETB',
  themeColor: 'orange',
  address: 'Addis Ababa, Ethiopia',
  phone: '+251 911 000 000',
  wifiName: 'IteteBuna_Guest',
  wifiPassword: 'iteteauthentic',
  tableServiceEnabled: true,
  orderingEnabled: true,
  reviewsEnabled: true,
  multiLanguageEnabled: true,
  taxRate: 15,
  serviceFeeRate: 0,
  tableTents: {
    title: 'SCAN TO VIEW MENU & ORDER',
    subtitle: 'Point your camera to browse coffee, dishes & call staff',
    footer: 'Fast Table Service • Free High-Speed WiFi',
  },
};

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  theme: THEME_PRESETS.orange,
  updateSettings: () => {},
  resetSettings: () => {},
  formatPrice: (amount) => '',
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage:', e);
    }
  }, [settings]);

  // Broadcast settings changes across open tabs
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(event.newValue) });
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = typeof newSettings === 'function' ? newSettings(prev) : { ...prev, ...newSettings };
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const theme = THEME_PRESETS[settings.themeColor] || THEME_PRESETS.orange;

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return `${settings.currencySymbol} 0.00`;
    const num = parseFloat(amount);
    return `${settings.currencySymbol} ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        theme,
        updateSettings,
        resetSettings,
        formatPrice,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;

