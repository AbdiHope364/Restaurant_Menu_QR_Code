import React, { useState, useRef } from 'react';
import { qrService } from '../../services/qrService';
import {
  QrCode as QrIcon,
  Loader2,
  Download,
  Printer,
  Wifi,
  ExternalLink,
  X,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useQR } from '../../../hooks/useQR';
import { useSettings } from '@ethio-buna/shared';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export default function QRManagement() {
  const { qrs, loading, refetch } = useQR();
  const { settings, theme } = useSettings();
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedQRForTent, setSelectedQRForTent] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const tentRef = useRef(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      await qrService.create({ name: name.trim() });
      toast.success(`Table "${name.trim()}" QR Code Generated!`, {
        icon: '🏷️',
      });
      setName('');
      await refetch();
    } catch (err) {
      console.error(err);
      toast.error('Could not generate QR code');
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

  const exportTableTentPDF = async () => {
    if (!tentRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(tentRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`TableTent-${selectedQRForTent.name.replace(/\s+/g, '_')}.pdf`);
      toast.success('Print-ready Table Tent PDF downloaded!', { icon: '🖨️' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const getMenuUrl = (shortId) => {
    // Determine customer app URL (Port 3000 default)
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    return `${protocol}//${host}:3000/menu/qr/${shortId}`;
  };

  return (
    <AdminLayout title="QR Codes & Table Stands">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
        {/* TOP FORM */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${theme.bgLight} ${theme.textPrimary} flex items-center justify-center`}>
              <QrIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                Generate Table QR Codes
              </h2>
              <p className="text-xs text-slate-400">
                Create dynamic table destinations with scan tracking & printable acrylic tents.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4 pt-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Table 4 (Balcony), VIP Booth 2, Patio-12, Bar Table A..."
              className={`w-full flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-xs ${theme.ring} focus:ring-2 transition-all`}
              required
            />
            <button
              disabled={isCreating}
              type="submit"
              className={`w-full sm:w-auto ${theme.primary} ${theme.primaryHover} text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg ${theme.shadow} transition-all flex items-center justify-center gap-2 active:scale-95`}
            >
              {isCreating ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <Plus size={16} /> GENERATE QR
                </>
              )}
            </button>
          </form>
        </div>

        {/* QR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <Loader2 className={`animate-spin mx-auto col-span-full mt-20 ${theme.textPrimary}`} size={40} />
          ) : qrs.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
              <QrIcon size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-bold uppercase text-xs">No QR codes generated yet</p>
            </div>
          ) : (
            qrs.map((qr) => {
              const menuUrl = getMenuUrl(qr.shortId);
              return (
                <div
                  key={qr.id}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all space-y-6 relative"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(qr.id, qr.name)}
                    className="absolute top-5 right-5 p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition"
                    title="Delete Table QR"
                  >
                    <Trash2 size={15} />
                  </button>

                  {/* QR ICON / PREVIEW */}
                  <div className="flex flex-col items-center text-center pt-2">
                    <div className={`w-28 h-28 ${theme.bgLight} p-3 rounded-3xl flex items-center justify-center mb-4 border ${theme.borderLight}`}>
                      <QRCodeCanvas
                        id={`qr-canvas-${qr.shortId}`}
                        value={menuUrl}
                        size={88}
                        level="H"
                        includeMargin
                      />
                    </div>

                    <h3 className="font-black text-base text-slate-900 uppercase tracking-tight">
                      {qr.name}
                    </h3>
                    <a
                      href={menuUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[11px] font-bold ${theme.textPrimary} hover:underline flex items-center gap-1 mt-0.5`}
                    >
                      <span>/{qr.shortId}</span>
                      <ExternalLink size={11} />
                    </a>

                    <div className="w-full bg-slate-50 p-4 rounded-2xl mt-4">
                      <p className="text-2xl font-black text-slate-900 leading-none">
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
                      className={`w-full py-3 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white text-xs font-black uppercase tracking-wider transition shadow-md ${theme.shadow} flex items-center justify-center gap-2`}
                    >
                      <Printer size={14} /> Printable Table Tent
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
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl border border-slate-100 relative space-y-6 my-8">
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
                  Print-ready design formatted for table tents & display acrylics.
                </p>
              </div>

              {/* TENT PREVIEW CARD */}
              <div
                ref={tentRef}
                className="bg-gradient-to-b from-white to-slate-50 border-2 border-slate-200 rounded-[2.5rem] p-8 text-center shadow-xl space-y-6 max-w-sm mx-auto"
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
                      {settings.shortCode || 'IC'}
                    </div>
                  )}
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight pt-1">
                    {settings.restaurantName}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {settings.tagline}
                  </p>
                </div>

                {/* TABLE CALLOUT */}
                <div className={`py-2 px-6 rounded-2xl ${theme.bgLight} ${theme.textPrimary} border ${theme.borderLight} inline-block font-black text-sm uppercase tracking-wider`}>
                  📍 {selectedQRForTent.name}
                </div>

                {/* HIGH RES QR */}
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-md inline-block">
                  <QRCodeCanvas
                    value={getMenuUrl(selectedQRForTent.shortId)}
                    size={160}
                    level="H"
                    includeMargin
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    {settings.tableTents?.title || 'SCAN TO VIEW MENU & ORDER'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {settings.tableTents?.subtitle || 'Point your camera to browse dishes, call staff & pay'}
                  </p>
                </div>

                {/* WIFI INFO */}
                {settings.wifiName && (
                  <div className="bg-slate-100/80 p-3 rounded-2xl text-[10px] font-bold text-slate-600 flex items-center justify-center gap-2">
                    <Wifi size={13} className={theme.textPrimary} />
                    <span>WiFi: <span className="text-slate-900">{settings.wifiName}</span></span>
                    {settings.wifiPassword && (
                      <span>• Pass: <span className="font-mono text-slate-900">{settings.wifiPassword}</span></span>
                    )}
                  </div>
                )}
              </div>

              {/* MODAL ACTIONS */}
              <div className="flex gap-3">
                <button
                  onClick={exportTableTentPDF}
                  disabled={isExporting}
                  className={`flex-1 py-4 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs uppercase tracking-widest shadow-xl ${theme.shadow} transition active:scale-95 flex items-center justify-center gap-2`}
                >
                  <Download size={16} />
                  <span>{isExporting ? 'Generating PDF...' : 'Download PDF Table Stand'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
