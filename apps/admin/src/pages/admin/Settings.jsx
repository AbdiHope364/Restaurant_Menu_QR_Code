import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  useSettings,
  THEME_PRESETS,
  CURRENCY_OPTIONS,
} from '@ethio-buna/shared';
import {
  Palette,
  Store,
  DollarSign,
  Wifi,
  Sliders,
  Sparkles,
  Check,
  RotateCcw,
  QrCode,
  Smartphone,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { settings, theme, updateSettings, resetSettings } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      updateSettings(formData);
      toast.success('Restaurant settings updated globally!', {
        icon: '✨',
      });
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all branding and configuration to system defaults?')) {
      resetSettings();
      setFormData(settings);
      toast('Settings reset to default', { icon: '🔄' });
    }
  };

  const activeThemeObj = THEME_PRESETS[formData.themeColor] || theme;

  return (
    <AdminLayout title="Branding & System Customization">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* TOP INTRO BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-bold text-slate-200 border border-white/10">
              <Sparkles size={14} className={activeThemeObj.textPrimary} />
              <span>White-Label Configuration Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              Customize Your Restaurant Brand
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
              Configure restaurant identity, currency, theme palettes, guest Wi-Fi, table ordering features, and printable tent templates. Changes update instantly across both customer & admin views.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN SETTINGS FORM (LEFT 2 COLS) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. RESTAURANT IDENTITY */}
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className={`w-10 h-10 rounded-2xl ${activeThemeObj.bgLight} ${activeThemeObj.textPrimary} flex items-center justify-center`}>
                  <Store size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">
                    Restaurant Identity
                  </h3>
                  <p className="text-xs text-slate-400">Name, slogan, and logo assets</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.restaurantName}
                    onChange={(e) => handleChange('restaurantName', e.target.value)}
                    placeholder="e.g. Gourmet Bistro & Bar"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    placeholder="e.g. Artisanal Dining & Fresh Flavors"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    Short Code / Initials (2-3 chars)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.shortCode}
                    onChange={(e) => handleChange('shortCode', e.target.value.toUpperCase())}
                    placeholder="e.g. GB"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    Logo Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png (leave blank for initials avatar)"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* 2. THEME COLOR PALETTE */}
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className={`w-10 h-10 rounded-2xl ${activeThemeObj.bgLight} ${activeThemeObj.textPrimary} flex items-center justify-center`}>
                  <Palette size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">
                    Brand Color Palette
                  </h3>
                  <p className="text-xs text-slate-400">Choose your restaurant's primary visual theme</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.values(THEME_PRESETS).map((t) => {
                  const isSelected = formData.themeColor === t.id;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => handleChange('themeColor', t.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-6 h-6 rounded-full shadow-inner"
                          style={{ backgroundColor: t.accentHex }}
                        />
                        {isSelected && <Check size={16} className="text-slate-900" />}
                      </div>
                      <p className="text-xs font-black text-slate-900 leading-tight">
                        {t.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. CURRENCY & TAX SETTINGS */}
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className={`w-10 h-10 rounded-2xl ${activeThemeObj.bgLight} ${activeThemeObj.textPrimary} flex items-center justify-center`}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">
                    Currency & Pricing Calculations
                  </h3>
                  <p className="text-xs text-slate-400">Currency symbol, sales tax, and service fees</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => {
                      const selected = CURRENCY_OPTIONS.find((c) => c.code === e.target.value);
                      handleChange('currency', e.target.value);
                      if (selected) handleChange('currencySymbol', selected.symbol);
                    }}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    Custom Symbol
                  </label>
                  <input
                    type="text"
                    value={formData.currencySymbol}
                    onChange={(e) => handleChange('currencySymbol', e.target.value)}
                    placeholder="e.g. $, ETB, €"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.taxRate}
                    onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                    placeholder="15"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. GUEST WI-FI & CONTACT INFO */}
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className={`w-10 h-10 rounded-2xl ${activeThemeObj.bgLight} ${activeThemeObj.textPrimary} flex items-center justify-center`}>
                  <Wifi size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">
                    Guest Wi-Fi & Location
                  </h3>
                  <p className="text-xs text-slate-400">Convenience info shown to customers on the digital menu</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    Wi-Fi Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={formData.wifiName}
                    onChange={(e) => handleChange('wifiName', e.target.value)}
                    placeholder="e.g. Bistro_Free_Guest"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    Wi-Fi Password
                  </label>
                  <input
                    type="text"
                    value={formData.wifiPassword}
                    onChange={(e) => handleChange('wifiPassword', e.target.value)}
                    placeholder="e.g. coffee2026"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="e.g. 100 Main St, Suite 400"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 5. FEATURE TOGGLES */}
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className={`w-10 h-10 rounded-2xl ${activeThemeObj.bgLight} ${activeThemeObj.textPrimary} flex items-center justify-center`}>
                  <Sliders size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">
                    Feature Toggles
                  </h3>
                  <p className="text-xs text-slate-400">Enable or disable features for customer menus</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'orderingEnabled',
                    title: 'Cart & Table Ordering',
                    desc: 'Allow guests to assemble orders & send them directly to the kitchen.',
                  },
                  {
                    id: 'tableServiceEnabled',
                    title: 'Call Waiter & Request Bill',
                    desc: 'Enable floating action pills for immediate staff service.',
                  },
                  {
                    id: 'reviewsEnabled',
                    title: 'Customer Dish Reviews',
                    desc: 'Let customers leave ratings & written feedback on dishes.',
                  },
                  {
                    id: 'multiLanguageEnabled',
                    title: 'Multi-Language Toggle',
                    desc: 'Provide English, Amharic, French, and Spanish translation selector.',
                  },
                ].map((ft) => (
                  <label
                    key={ft.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-100 transition"
                  >
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                        {ft.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        {ft.desc}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!formData[ft.id]}
                      onChange={(e) => handleChange(ft.id, e.target.checked)}
                      className="w-5 h-5 mt-1 rounded-md text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* SAVE / RESET ACTIONS */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className={`flex-1 py-4.5 rounded-2xl ${activeThemeObj.primary} ${activeThemeObj.primaryHover} text-white font-black text-xs uppercase tracking-widest shadow-xl ${activeThemeObj.shadow} transition active:scale-95 flex items-center justify-center gap-2`}
              >
                <Check size={18} />
                <span>Save All Customizations</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="py-4.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest transition flex items-center gap-2"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* LIVE PREVIEW COLUMN (RIGHT 1 COL) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Smartphone size={18} className={activeThemeObj.textPrimary} />
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                    Customer Menu Preview
                  </h3>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  Live
                </span>
              </div>

              {/* MOCK PHONE FRAME */}
              <div className="border-4 border-slate-800 rounded-[2.5rem] p-4 bg-slate-50 shadow-2xl space-y-4">
                {/* Phone Speaker */}
                <div className="w-16 h-1.5 bg-slate-300 rounded-full mx-auto" />

                {/* Mock Header */}
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl ${activeThemeObj.primary} flex items-center justify-center text-white font-black text-xs shrink-0`}
                    >
                      {formData.shortCode || 'RM'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 uppercase truncate">
                        {formData.restaurantName || 'Menu Name'}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase truncate">
                        {formData.tagline || 'Tagline'}
                      </p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 text-[10px]">
                    📶
                  </div>
                </div>

                {/* Mock Category Bar */}
                <div className="flex gap-1.5 overflow-hidden">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black text-white ${activeThemeObj.primary}`}>
                    All
                  </span>
                  <span className="px-3 py-1 rounded-full text-[9px] font-bold bg-white text-slate-600 border border-slate-200">
                    Specials
                  </span>
                  <span className="px-3 py-1 rounded-full text-[9px] font-bold bg-white text-slate-600 border border-slate-200">
                    Drinks
                  </span>
                </div>

                {/* Mock Dish Card */}
                <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm space-y-2">
                  <div className="h-28 bg-slate-200 rounded-xl overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80"
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                    <span className="absolute top-2 left-2 bg-white/90 text-[8px] font-black px-2 py-0.5 rounded-md text-slate-800">
                      Main Course
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">
                        Signature Dish
                      </p>
                      <p className="text-[9px] text-slate-400">Fresh daily ingredients</p>
                    </div>
                    <p className={`text-sm font-black ${activeThemeObj.textPrimary}`}>
                      {formData.currencySymbol} 350.00
                    </p>
                  </div>
                </div>

                {/* Mock Floating Action */}
                {formData.tableServiceEnabled && (
                  <div className="bg-slate-900 text-white rounded-full p-2 text-center text-[9px] font-black uppercase flex justify-center gap-3">
                    <span className={activeThemeObj.textPrimary}>🛎️ Call Waiter</span>
                    <span>•</span>
                    <span className="text-green-400">💳 Request Bill</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="text-[11px] text-slate-400 font-medium">
                  Theme: <span className="font-bold text-slate-700">{activeThemeObj.name}</span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

