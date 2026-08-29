import React, { useState } from 'react';
import { useSettings } from '@ethio-buna/shared';
import { Wifi, Globe, ShoppingBag, Check, Copy, X } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const MenuHeader = ({
  tableName,
  cartCount = 0,
  onOpenCart,
  currentLang = 'en',
  onSelectLang,
}) => {
  const { settings, theme } = useSettings();
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);

  const copyPassword = () => {
    if (settings.wifiPassword) {
      navigator.clipboard.writeText(settings.wifiPassword);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  const selectedLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md pt-5 pb-4 px-4 sm:px-6 sticky top-0 z-40 border-b border-slate-100 shadow-sm transition-colors">
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-3">
          {/* BRANDING SECTION */}
          <div className="flex items-center gap-3 min-w-0">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.restaurantName}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-md shrink-0"
              />
            ) : (
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 ${theme.primary} rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg ${theme.shadow} shrink-0`}
              >
                {settings.shortCode || settings.restaurantName?.substring(0, 2).toUpperCase() || 'RM'}
              </div>
            )}

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight truncate">
                {settings.restaurantName || 'Restaurant Menu'}
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {settings.tagline || 'Digital Table Menu'}
                </p>
                {tableName && (
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${theme.bgLight} ${theme.textPrimary} border ${theme.borderLight} shrink-0`}>
                    {tableName}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* WIFI BUTTON */}
            {settings.wifiName && (
              <button
                onClick={() => setShowWifiModal(true)}
                title="Restaurant Wi-Fi"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition flex items-center gap-1"
              >
                <Wifi size={16} />
              </button>
            )}

            {/* LANGUAGE SELECTOR */}
            {settings.multiLanguageEnabled && (
              <div className="relative">
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1 text-xs font-bold"
                >
                  <span>{selectedLangObj.flag}</span>
                  <span className="hidden sm:inline uppercase text-[10px]">{selectedLangObj.code}</span>
                </button>

                {showLangDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLangDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            if (onSelectLang) onSelectLang(lang.code);
                            setShowLangDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between hover:bg-slate-50 transition ${
                            currentLang === lang.code ? theme.textPrimary : 'text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </span>
                          {currentLang === lang.code && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* CART DRAWER BUTTON */}
            {settings.orderingEnabled && onOpenCart && (
              <button
                onClick={onOpenCart}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs shadow-md ${theme.shadow} transition active:scale-95`}
              >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline uppercase tracking-widest text-[10px]">Cart</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 bg-white text-slate-900 rounded-full flex items-center justify-center text-[10px] font-black shadow">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* WIFI POPUP MODAL */}
      {showWifiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowWifiModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500"
            >
              <X size={16} />
            </button>

            <div className={`w-12 h-12 ${theme.bgLight} ${theme.textPrimary} rounded-2xl flex items-center justify-center mb-4`}>
              <Wifi size={24} />
            </div>

            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">
              Guest Wi-Fi
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Connect to our complimentary high-speed guest network.
            </p>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Network Name (SSID)</p>
                <p className="text-sm font-bold text-slate-800">{settings.wifiName}</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Password</p>
                  <p className="text-sm font-mono font-bold text-slate-800">{settings.wifiPassword || 'None'}</p>
                </div>
                {settings.wifiPassword && (
                  <button
                    onClick={copyPassword}
                    className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl transition ${
                      copiedWifi
                        ? 'bg-green-100 text-green-700'
                        : `${theme.bgLight} ${theme.textPrimary} hover:bg-slate-200`
                    }`}
                  >
                    {copiedWifi ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedWifi ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowWifiModal(false)}
              className={`w-full py-3.5 rounded-2xl ${theme.primary} text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition`}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuHeader;
