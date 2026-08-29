import React, { useState } from 'react';
import { BellRing, Receipt, Check, X, AlertCircle } from 'lucide-react';
import { useSettings } from '@ethio-buna/shared';
import toast from 'react-hot-toast';

const QuickActions = ({ tableId, tableName, onRequestService }) => {
  const { theme, settings } = useSettings();
  const [modalType, setModalType] = useState(null); // 'waiter' | 'bill' | null
  const [billMethod, setBillMethod] = useState('card');
  const [isCalling, setIsCalling] = useState(false);

  if (!settings.tableServiceEnabled) return null;

  const handleCallWaiter = async () => {
    setIsCalling(true);
    try {
      if (onRequestService) {
        await onRequestService({
          tableId: tableId || 'table-direct',
          tableName: tableName || 'Current Table',
          type: 'call_waiter',
          details: 'Customer requested assistance at table',
        });
      }
      toast.success('Waiter notified! Someone will assist you shortly.', {
        icon: '🛎️',
        duration: 4000,
      });
      setModalType(null);
    } catch (e) {
      toast.error('Failed to notify staff');
    } finally {
      setIsCalling(false);
    }
  };

  const handleRequestBill = async () => {
    setIsCalling(true);
    try {
      if (onRequestService) {
        await onRequestService({
          tableId: tableId || 'table-direct',
          tableName: tableName || 'Current Table',
          type: 'request_bill',
          details: `Bill requested (${billMethod.toUpperCase()} payment)`,
        });
      }
      toast.success(`Bill requested via ${billMethod.toUpperCase()}! The staff is on their way.`, {
        icon: '💳',
        duration: 4000,
      });
      setModalType(null);
    } catch (e) {
      toast.error('Failed to request bill');
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <>
      {/* FLOATING ACTION PILL AT BOTTOM */}
      <div className="fixed bottom-6 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-lg text-white p-1.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-1 pointer-events-auto max-w-sm">
          <button
            onClick={() => setModalType('waiter')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-white/10 text-xs font-bold transition active:scale-95 text-slate-200 hover:text-white"
          >
            <BellRing size={15} className={theme.textPrimary} />
            <span>Call Waiter</span>
          </button>

          <div className="w-[1px] h-4 bg-white/20" />

          <button
            onClick={() => setModalType('bill')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-white/10 text-xs font-bold transition active:scale-95 text-slate-200 hover:text-white"
          >
            <Receipt size={15} className="text-green-400" />
            <span>Request Bill</span>
          </button>
        </div>
      </div>

      {/* SERVICE MODAL */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
            >
              <X size={16} />
            </button>

            {modalType === 'waiter' ? (
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${theme.bgLight} ${theme.textPrimary} flex items-center justify-center`}>
                  <BellRing size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    Call Waiter to Table
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Need extra napkins, water, or recommendations for <span className="font-bold text-slate-700">{tableName || 'your table'}</span>?
                  </p>
                </div>
                <button
                  onClick={handleCallWaiter}
                  disabled={isCalling}
                  className={`w-full py-3.5 rounded-2xl ${theme.primary} ${theme.primaryHover} text-white font-black text-xs uppercase tracking-widest shadow-lg ${theme.shadow} transition active:scale-95 flex items-center justify-center gap-2`}
                >
                  {isCalling ? 'Alerting...' : 'Yes, Call Waiter'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                  <Receipt size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    Request Bill for {tableName || 'Table'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select your preferred payment method so your server brings the appropriate terminal.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBillMethod('card')}
                    className={`p-3 rounded-2xl border text-xs font-black uppercase text-center transition ${
                      billMethod === 'card'
                        ? `${theme.bgLight} ${theme.textPrimary} ${theme.borderLight} ring-2 ring-orange-500/20`
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    💳 Card / POS
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillMethod('cash')}
                    className={`p-3 rounded-2xl border text-xs font-black uppercase text-center transition ${
                      billMethod === 'cash'
                        ? `${theme.bgLight} ${theme.textPrimary} ${theme.borderLight} ring-2 ring-orange-500/20`
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    💵 Cash
                  </button>
                </div>

                <button
                  onClick={handleRequestBill}
                  disabled={isCalling}
                  className="w-full py-3.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-green-600/20 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  {isCalling ? 'Requesting...' : 'Request Check'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;

