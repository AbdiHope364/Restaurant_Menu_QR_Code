import React, { useState, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useQR } from '../../../hooks/useQR';
import { qrService } from '../../services/qrService';
import { useSettings } from '@ethio-buna/shared';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import {
  QrCode as QrIcon,
  Download,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  Printer,
  Wifi,
  Sparkles,
  X,
  Eye,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function QRManagement() {
  const { theme, settings, updateSettings } = useSettings();
  const { qrList: rawQrList, qrs: rawQrs, loading, refetch } = useQR();
  const qrList = Array.isArray(rawQrList) && rawQrList.length > 0 
    ? rawQrList 
    : (Array.isArray(rawQrs) ? rawQrs : []);
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedQRForTent, setSelectedQRForTent] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsCreating(true);
    try {
      await qrService.create(name.trim());
      toast.success(`Generated QR for "${name}"`);
      setName('');
      await refetch();
    } catch (err) {
      toast.error('Failed to create QR');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id, qrName) => {
    if (!window.confirm(`Delete QR code for "${qrName}"?`)) return;
    try {
      await qrService.remove(id);
      toast.success(`Deleted ${qrName}`);
      await refetch();
    } catch (err) {
      toast.error('Failed to delete QR');
    }
  };

  const downloadStandardQR = (shortId, qrName) => {
    try {
      const canvas = document.getElementById(`qr-canvas-${shortId}`);
      if (canvas) {
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `QR-${qrName.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloaded QR for ${qrName}`);
      } else {
        toast.error('Could not capture QR canvas');
      }
    } catch (err) {
      console.error(err);
      toast.error('Download failed');
    }
  };

  const exportTableTentPDF = () => {
    if (!selectedQRForTent) return;
    setIsExporting(true);
    try {
      const qrCanvas = document.getElementById('modal-qr-canvas');
      if (!qrCanvas) throw new Error('QR canvas not ready');
      const qrImgData = qrCanvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5',
      });

      const pageWidth = pdf.internal.pageSize.getWidth(); // 148 mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 210 mm

      // Warm background
      pdf.setFillColor(254, 250, 246);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Outer border
      pdf.setDrawColor(234, 88, 12);
      pdf.setLineWidth(1.2);
      pdf.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 5, 5, 'S');

      // Inner border
      pdf.setDrawColor(254, 215, 170);
      pdf.setLineWidth(0.4);
      pdf.roundedRect(10.5, 10.5, pageWidth - 21, pageHeight - 21, 4, 4, 'S');

      // Header: Restaurant Name
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(15, 23, 42);
      pdf.text(settings.restaurantName || 'ITETE BUNA', pageWidth / 2, 26, { align: 'center' });

      // Tagline
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      pdf.text(settings.tagline || 'Authentic Single-Origin Buna & Artisanal Dining', pageWidth / 2, 33, { align: 'center' });

      // Table badge box
      pdf.setFillColor(234, 88, 12);
      pdf.roundedRect(pageWidth / 2 - 36, 40, 72, 10, 3, 3, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`📍 ${selectedQRForTent.name.toUpperCase()}`, pageWidth / 2, 46.5, { align: 'center' });

      // QR Box Background
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.6);
      pdf.roundedRect(pageWidth / 2 - 40, 56, 80, 80, 4, 4, 'FD');

      // Sharp QR Image
      pdf.addImage(qrImgData, 'PNG', pageWidth / 2 - 36, 60, 72, 72);

      // Call to action text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(15, 23, 42);
      pdf.text(settings.tableTents?.title || 'SCAN TO VIEW MENU & ORDER', pageWidth / 2, 146, { align: 'center' });

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 116, 139);
      pdf.text(settings.tableTents?.subtitle || 'Point your smartphone camera to browse dishes, call staff & pay', pageWidth / 2, 152, { align: 'center' });

      // Wi-Fi details box
      if (settings.wifiName) {
        pdf.setFillColor(241, 245, 249);
        pdf.roundedRect(pageWidth / 2 - 45, 160, 90, 13, 3, 3, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(51, 65, 85);
        const wifiTxt = `Free Wi-Fi: ${settings.wifiName} ${settings.wifiPassword ? `• Pass: ${settings.wifiPassword}` : ''}`;
        pdf.text(wifiTxt, pageWidth / 2, 168, { align: 'center' });
      }

      // Footer
      pdf.setFontSize(7);
      pdf.setTextColor(148, 163, 184);
      pdf.text('Fast Table Ordering • ITETE BUNA Platform', pageWidth / 2, 194, { align: 'center' });

      pdf.save(`TableStand_${selectedQRForTent.name.replace(/\s+/g, '_')}.pdf`);
      toast.success('High-Resolution Table Stand PDF Downloaded!', { icon: '🖨️' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  const getMenuUrl = (shortId) => {
    const base =
      settings.customerAppUrl && settings.customerAppUrl.trim()
        ? settings.customerAppUrl.replace(/\/+$/, '')
        : 'https://restaurant-menu-qr-code-customer.vercel.app';
    return `${base}/menu/qr/${shortId}`;
  };

  const [customerDomainInput, setCustomerDomainInput] = useState(
    settings.customerAppUrl || 'https://restaurant-menu-qr-code-customer.vercel.app',
  );
  const [showDomainConfig, setShowDomainConfig] = useState(false);

  const handleSaveDomain = () => {
    updateSettings({ customerAppUrl: customerDomainInput.trim() });
    toast.success('Customer Menu Destination URL Updated!');
  };

  return (
    <AdminLayout title="QR Codes & Table Stands">
      {/* ================= DEDICATED PRINT STYLESHEET ================= */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-table-tent, #printable-table-tent * {
            visibility: visible !important;
          }
          #printable-table-tent {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 380px !important;
            max-width: 90vw !important;
            border: 3px solid #ea580c !important;
            border-radius: 2rem !important;
            padding: 2.5rem 2rem !important;
            background: #ffffff !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
        {/* TOP FORM */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl ${theme.bgLight} ${theme.textPrimary} flex items-center justify-center`}>
                <QrIcon size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                  Generate Table QR Codes
                </h2>
                <p className="text-xs text-slate-400">
                  Scanned by guests to navigate directly to their table's digital menu.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDomainConfig(!showDomainConfig)}
              className="text-xs font-black uppercase text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition self-start sm:self-auto"
            >
              ⚙️ {showDomainConfig ? 'Hide Domain Setup' : 'Live Customer Domain'}
            </button>
          </div>

          {/* LIVE CUSTOMER DOMAIN CONFIG */}
          {showDomainConfig && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in duration-200">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Live Customer Web App URL (Base Destination)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={customerDomainInput}
                  onChange={(e) => setCustomerDomainInput(e.target.value)}
                  placeholder="e.g. https://restaurant-menu-qr-code-customer.vercel.app"
                  className="flex-1 p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-slate-300"
                />
                <button
                  type="button"
                  onClick={handleSaveDomain}
                  className={`px-6 py-3.5 rounded-xl ${theme.primary} text-white font-black text-xs uppercase tracking-wider shadow`}
                >
                  Save URL
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                All generated QR codes and printable acrylic table stands will point to this live customer URL.
              </p>
            </div>
          )}

          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4 pt-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Table 1 (Buna Corner), Shekla VIP 3, Balcony 4, Patio 2..."
              className={`w-full flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-xs ${theme.ring} focus:ring-2 transition-all`}
              required
            />
            <button
              type="submit"
              disabled={isCreating}
              className={`px-8 py-4 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs uppercase tracking-wider shadow-lg ${theme.shadow} transition flex items-center justify-center gap-2 active:scale-95 shrink-0`}
            >
              {isCreating ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
              <span>Generate Table QR</span>
            </button>
          </form>
        </div>

        {/* QR GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20 font-black text-slate-400 uppercase tracking-widest text-xs">
              Loading Table QR Codes...
            </div>
          ) : qrList.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center space-y-2">
              <QrIcon size={40} className="mx-auto text-slate-300" />
              <h3 className="font-black text-slate-800 uppercase text-sm">No Table QR Codes Yet</h3>
              <p className="text-xs text-slate-400">
                Type a table name above to generate dynamic codes for your restaurant tables.
              </p>
            </div>
          ) : (
            qrList.map((qr) => {
              const targetUrl = getMenuUrl(qr.shortId);
              return (
                <div
                  key={qr.id}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-black text-base text-slate-900 uppercase tracking-tight">
                        {qr.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Table Slug: {qr.shortId}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(qr.id, qr.name)}
                      className="p-2 text-slate-300 hover:text-red-500 rounded-xl transition"
                      title="Delete Table"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* QR CANVAS PREVIEW */}
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                      <QRCodeCanvas
                        id={`qr-canvas-${qr.shortId}`}
                        value={targetUrl}
                        size={150}
                        level="H"
                        includeMargin
                      />
                    </div>

                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-orange-600 hover:underline mt-3 flex items-center gap-1"
                    >
                      <span>/{qr.shortId}</span>
                      <ExternalLink size={11} />
                    </a>

                    <div className="w-full bg-slate-100 p-3 rounded-xl mt-3 text-center">
                      <p className="text-xl font-black text-slate-900 leading-none">
                        {qr._count?.scans || 0}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Total Customer Scans
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedQRForTent(qr)}
                      className={`w-full py-3.5 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white text-xs font-black uppercase tracking-wider transition shadow-md ${theme.shadow} flex items-center justify-center gap-2 active:scale-95`}
                    >
                      <Printer size={15} /> Printable Table Stand
                    </button>

                    <button
                      onClick={() => downloadStandardQR(qr.shortId, qr.name)}
                      className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2"
                    >
                      <Download size={14} /> Download PNG
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PRINTABLE TABLE TENT MODAL */}
        {selectedQRForTent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6 my-8">
              <button
                onClick={() => setSelectedQRForTent(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
              >
                <X size={18} />
              </button>

              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  Acrylic Table Stand Preview
                </h3>
                <p className="text-xs text-slate-400">
                  Formatted for acrylic display stands and table tents.
                </p>
              </div>

              {/* TENT PREVIEW CARD (MARKED FOR PRINTING) */}
              <div
                id="printable-table-tent"
                className="bg-gradient-to-b from-white to-slate-50 border-2 border-orange-500/40 rounded-[2.5rem] p-7 text-center shadow-xl space-y-5 max-w-sm mx-auto"
              >
                {/* RESTAURANT HEADER */}
                <div className="space-y-1">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt={settings.restaurantName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 mx-auto shadow-md"
                    />
                  ) : (
                    <div className={`w-12 h-12 ${theme.primary} text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto shadow-md ${theme.shadow}`}>
                      {settings.shortCode || 'IB'}
                    </div>
                  )}
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight pt-1">
                    {settings.restaurantName || 'ITETE BUNA'}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {settings.tagline || 'Authentic Single-Origin Buna & Artisanal Dining'}
                  </p>
                </div>

                {/* TABLE CALLOUT */}
                <div className={`py-2 px-6 rounded-2xl ${theme.bgLight} ${theme.textPrimary} border ${theme.borderLight} inline-block font-black text-sm uppercase tracking-wider`}>
                  📍 {selectedQRForTent.name}
                </div>

                {/* HIGH RES QR CANVAS */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-md inline-block">
                  <QRCodeCanvas
                    id="modal-qr-canvas"
                    value={getMenuUrl(selectedQRForTent.shortId)}
                    size={170}
                    level="H"
                    includeMargin
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    {settings.tableTents?.title || 'SCAN TO VIEW MENU & ORDER'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {settings.tableTents?.subtitle || 'Point your camera to browse dishes, call staff & pay'}
                  </p>
                </div>

                {/* WIFI INFO */}
                {settings.wifiName && (
                  <div className="bg-slate-100 p-3 rounded-2xl text-[10px] font-bold text-slate-700 flex items-center justify-center gap-2 border border-slate-200">
                    <Wifi size={13} className={theme.textPrimary} />
                    <span>WiFi: <strong className="text-slate-900">{settings.wifiName}</strong></span>
                    {settings.wifiPassword && (
                      <span>• Pass: <strong className="font-mono text-slate-900">{settings.wifiPassword}</strong></span>
                    )}
                  </div>
                )}
              </div>

              {/* MODAL ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleBrowserPrint}
                  className="py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Printer size={16} />
                  <span>Print Stand</span>
                </button>

                <button
                  onClick={exportTableTentPDF}
                  disabled={isExporting}
                  className={`py-4 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs uppercase tracking-wider shadow-lg ${theme.shadow} transition active:scale-95 flex items-center justify-center gap-2`}
                >
                  <Download size={16} />
                  <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
