import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '@ethio-buna/shared';
import { QrCode, ArrowRight, Utensils } from 'lucide-react';

const ScanQR = () => {
  const navigate = useNavigate();
  const { settings, theme } = useSettings();

  useEffect(() => {
    let scanner = null;
    try {
      scanner = new Html5QrcodeScanner('reader', {
        fps: 10,
        qrbox: { width: 220, height: 220 },
      });

      let scanned = false;

      scanner.render(
        (decodedText) => {
          if (scanned) return;
          scanned = true;

          try {
            scanner.clear();
          } catch (e) {}

          try {
            if (decodedText.includes('/menu/qr/')) {
              const parts = decodedText.split('/menu/qr/');
              const shortId = parts[1]?.split(/[?#/]/)[0] || 'table-1';
              navigate(`/menu/qr/${shortId}`);
            } else if (decodedText.startsWith('http')) {
              const url = new URL(decodedText);
              const shortId = url.pathname.split('/').pop() || 'table-1';
              navigate(`/menu/qr/${shortId}`);
            } else {
              navigate(`/menu/qr/${decodedText.trim()}`);
            }
          } catch (e) {
            navigate('/menu');
          }
        },
        () => {},
      );
    } catch (e) {}

    return () => {
      if (scanner) {
        try {
          scanner.clear();
        } catch (e) {}
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10">
      {/* HEADER */}
      <div className="text-center space-y-2 max-w-sm mx-auto pt-4">
        {settings.logoUrl ? (
          <img
            src={settings.logoUrl}
            alt={settings.restaurantName}
            className="w-16 h-16 rounded-2xl object-cover border border-white/20 mx-auto shadow-lg mb-2"
          />
        ) : (
          <div className={`w-14 h-14 ${theme.primary} rounded-2xl flex items-center justify-center font-black text-xl mx-auto shadow-lg ${theme.shadow} mb-2`}>
            {settings.shortCode || 'IB'}
          </div>
        )}
        <h1 className="text-2xl font-black uppercase tracking-tight">
          {settings.restaurantName || 'ITETE BUNA'}
        </h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Point camera at your table stand to view menu
        </p>
      </div>

      {/* SCANNER CONTAINER */}
      <div className="w-full max-w-sm mx-auto bg-slate-800/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 shadow-2xl my-6">
        <div id="reader" className="overflow-hidden rounded-2xl text-slate-900" />
      </div>

      {/* DIRECT MENU FALLBACK */}
      <div className="max-w-sm mx-auto w-full space-y-3 pb-4 text-center">
        <Link
          to="/menu"
          className={`w-full py-4 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs uppercase tracking-widest shadow-xl ${theme.shadow} transition flex items-center justify-center gap-2 active:scale-95`}
        >
          <Utensils size={16} />
          <span>Browse Full Digital Menu</span>
          <ArrowRight size={16} />
        </Link>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          Or view items directly without camera scan
        </p>
      </div>
    </div>
  );
};

export default ScanQR;
