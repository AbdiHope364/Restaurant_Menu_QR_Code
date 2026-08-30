import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { ordersService, useSettings } from '@ethio-buna/shared';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  BellRing,
  Receipt,
  XCircle,
  ArrowRight,
  Filter,
  Search,
  Check,
  Trash2,
  CreditCard,
  Banknote,
  Utensils,
  Printer,
  X,
  Smartphone,
  Users,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrdersManagement() {
  const { theme, formatPrice, settings } = useSettings();
  const [orders, setOrders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'preparing' | 'ready' | 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // KOT Thermal Print Modal state
  const [selectedOrderForKOT, setSelectedOrderForKOT] = useState(null);
  const kotPrintRef = useRef(null);

  const fetchLiveOrders = async () => {
    const [ords, reqs] = await Promise.all([
      ordersService.getOrders(),
      ordersService.getServiceRequests(),
    ]);
    setOrders(ords);
    setServiceRequests(reqs);
  };

  useEffect(() => {
    fetchLiveOrders();

    const handleOrdersUpdate = (e) => {
      if (e.detail) setOrders(e.detail);
      if (soundEnabled) {
        toast('New order update received!', { icon: '🔔' });
      }
    };

    const handleServiceUpdate = (e) => {
      if (e.detail) setServiceRequests(e.detail);
      if (soundEnabled) {
        toast('New table service request!', { icon: '🛎️' });
      }
    };

    window.addEventListener('orders_updated', handleOrdersUpdate);
    window.addEventListener('service_requests_updated', handleServiceUpdate);

    const interval = setInterval(fetchLiveOrders, 8000);
    return () => {
      window.removeEventListener('orders_updated', handleOrdersUpdate);
      window.removeEventListener('service_requests_updated', handleServiceUpdate);
      clearInterval(interval);
    };
  }, [soundEnabled]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await ordersService.updateOrderStatus(orderId, newStatus);
      setOrders(updated);
      toast.success(`Order marked as ${newStatus.toUpperCase()}`);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleResolveService = async (reqId) => {
    try {
      const updated = await ordersService.resolveServiceRequest(reqId);
      setServiceRequests(updated);
      toast.success('Service request acknowledged & cleared');
    } catch (e) {
      toast.error('Failed to resolve request');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Delete this order record permanently?')) {
      const updated = await ordersService.deleteOrder(orderId);
      setOrders(updated);
      toast.success('Order deleted');
    }
  };

  const handlePrintKOT = () => {
    window.print();
  };

  // Filter logic
  const filteredOrders = orders.filter((ord) => {
    const matchesTab = activeTab === 'all' || ord.status === activeTab;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      ord.tableName?.toLowerCase().includes(term) ||
      ord.id?.toLowerCase().includes(term) ||
      ord.items?.some((i) => i.name.toLowerCase().includes(term));
    return matchesTab && matchesSearch;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  const STATUS_CONFIG = {
    pending: {
      label: 'New / Pending',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      next: 'preparing',
      nextLabel: 'Accept & Send to Kitchen',
      nextColor: 'bg-amber-600 hover:bg-amber-700',
    },
    preparing: {
      label: 'In Kitchen',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      next: 'ready',
      nextLabel: 'Mark as Ready to Serve',
      nextColor: 'bg-blue-600 hover:bg-blue-700',
    },
    ready: {
      label: 'Ready to Serve',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      next: 'completed',
      nextLabel: 'Mark Delivered & Paid',
      nextColor: 'bg-emerald-600 hover:bg-emerald-700',
    },
    completed: {
      label: 'Completed & Settled',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      next: null,
      nextLabel: null,
    },
    cancelled: {
      label: 'Cancelled / Voided',
      badge: 'bg-red-100 text-red-700 border-red-200',
      next: null,
      nextLabel: null,
    },
  };

  return (
    <AdminLayout title="Live Kitchen & Orders Display">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* KPI COUNTERS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{pendingCount}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
                Pending Orders
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <ChefHat size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{preparingCount}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
                In Kitchen
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <Utensils size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{readyCount}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
                Ready to Serve
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
              <BellRing size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">
                {serviceRequests.length}
              </p>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
                Service Calls
              </p>
            </div>
          </div>
        </div>

        {/* SERVICE REQUESTS BANNER (IF ACTIVE) */}
        {serviceRequests.length > 0 && (
          <div className="bg-gradient-to-r from-rose-500 to-red-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-rose-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <BellRing size={16} className="animate-bounce" /> Live Table Assistance Requests
              </h3>
              <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase">
                {serviceRequests.length} Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {serviceRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {req.type === 'call_waiter' ? (
                        <span className="text-xs font-black bg-white text-rose-600 px-2 py-0.5 rounded-lg">
                          🛎️ Waiter Call
                        </span>
                      ) : (
                        <span className="text-xs font-black bg-white text-green-700 px-2 py-0.5 rounded-lg">
                          💳 Bill Request
                        </span>
                      )}
                      <span className="font-black text-sm">{req.tableName}</span>
                    </div>
                    <p className="text-xs text-rose-100 mt-1 font-medium">{req.details}</p>
                  </div>

                  <button
                    onClick={() => handleResolveService(req.id)}
                    className="p-2 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-rose-50 transition shrink-0 flex items-center gap-1"
                  >
                    <Check size={14} /> Clear
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTROLS / FILTER BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: 'All Orders', count: orders.length },
              { id: 'pending', label: 'Pending', count: pendingCount },
              { id: 'preparing', label: 'In Kitchen', count: preparingCount },
              { id: 'ready', label: 'Ready', count: readyCount },
              { id: 'completed', label: 'Completed', count: orders.filter((o) => o.status === 'completed').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? `${theme.primary} text-white shadow-md ${theme.shadow}`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search table or dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        {/* ORDERS GRID */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <ChefHat size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-slate-800 font-black uppercase text-base">No Orders in this View</h3>
            <p className="text-slate-400 text-xs mt-1">
              New customer orders from table QR scans will automatically show up here in real time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-lg transition-all"
                >
                  {/* CARD HEADER */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base text-slate-900 uppercase tracking-tight">
                          {order.tableName || 'Table'}
                        </h4>
                        <span
                          className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${statusCfg.badge}`}
                        >
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">
                        #{order.id} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* KOT PRINT BUTTON */}
                      <button
                        onClick={() => setSelectedOrderForKOT(order)}
                        title="Print 80mm Kitchen Order Ticket"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        <Printer size={15} />
                      </button>

                      <div className="flex items-center gap-1 text-[10px] font-bold bg-slate-50 px-2.5 py-1.5 rounded-xl text-slate-700 uppercase">
                        {order.paymentMethod === 'telebirr' ? (
                          <span className="text-blue-600 font-black">Telebirr</span>
                        ) : order.paymentMethod === 'chapa' ? (
                          <span className="text-green-600 font-black">Chapa</span>
                        ) : order.paymentMethod === 'card' ? (
                          <span>Card</span>
                        ) : (
                          <span>Cash</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ITEMS LIST */}
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Ordered Items ({order.items?.length || 0})
                      </p>
                      {order.splitCount > 1 && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                          <Users size={11} /> {order.splitCount} Guest Split
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs font-bold p-2.5 rounded-xl bg-slate-50"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-800 flex items-center justify-center text-[10px] font-black shrink-0">
                              {item.quantity}x
                            </span>
                            <span className="text-slate-800 truncate">{item.name}</span>
                          </div>
                          <span className="text-slate-600 shrink-0">
                            {formatPrice(parseFloat(item.price) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-amber-900 text-xs italic">
                        <span className="font-bold not-italic">Guest Note:</span> "{order.notes}"
                      </div>
                    )}
                  </div>

                  {/* CARD FOOTER / ACTIONS */}
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-slate-500">Total Bill</span>
                        {order.tip > 0 && (
                          <span className="block text-[10px] text-emerald-600 font-bold">
                            Includes {formatPrice(order.tip)} staff tip
                          </span>
                        )}
                      </div>
                      <span className={`text-lg font-black ${theme.textPrimary}`}>
                        {formatPrice(order.total || order.subtotal)}
                      </span>
                    </div>

                    {/* ACTION PROGRESSION BUTTON */}
                    {statusCfg.next && (
                      <button
                        onClick={() => handleStatusChange(order.id, statusCfg.next)}
                        className={`w-full py-3.5 rounded-2xl ${statusCfg.nextColor} text-white font-black text-xs uppercase tracking-widest shadow-md transition flex items-center justify-center gap-2 active:scale-95`}
                      >
                        <span>{statusCfg.nextLabel}</span>
                        <ArrowRight size={14} />
                      </button>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-wider"
                        >
                          Cancel / Void
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-700 ml-auto uppercase tracking-wider flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Remove Record
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= KOT 80MM THERMAL RECEIPT MODAL ================= */}
        {selectedOrderForKOT && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] p-6 max-w-sm w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Printer size={18} className={theme.textPrimary} />
                  <h3 className="font-black text-sm text-slate-900 uppercase">
                    Kitchen Order Ticket (KOT)
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderForKOT(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              {/* THERMAL TICKET SIMULATION (80MM ESC/POS) */}
              <div
                ref={kotPrintRef}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200 font-mono text-xs text-slate-900 space-y-3 leading-relaxed shadow-inner"
              >
                <div className="text-center border-b border-dashed border-slate-300 pb-2">
                  <p className="font-black text-sm uppercase">{settings.restaurantName || 'ITETE BUNA'}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">*** KITCHEN COPY (KOT) ***</p>
                </div>

                <div className="flex justify-between text-[11px]">
                  <span>TABLE: <strong>{selectedOrderForKOT.tableName}</strong></span>
                  <span>#{selectedOrderForKOT.id?.slice(-4)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>TIME: {new Date(selectedOrderForKOT.createdAt).toLocaleTimeString()}</span>
                  <span>PAY: {selectedOrderForKOT.paymentMethod?.toUpperCase()}</span>
                </div>

                <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>QTY  ITEM</span>
                    <span>PRICE</span>
                  </div>
                  {selectedOrderForKOT.items?.map((it, i) => (
                    <div key={i} className="flex justify-between font-bold">
                      <span>{it.quantity}x {it.name}</span>
                      <span>{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                {selectedOrderForKOT.notes && (
                  <div className="bg-white p-2 rounded border border-slate-200 text-[10px]">
                    <strong>SPECIAL INSTRUCTIONS:</strong><br />
                    {selectedOrderForKOT.notes}
                  </div>
                )}

                <div className="text-right font-black text-sm border-t border-dashed border-slate-300 pt-2">
                  TOTAL: {formatPrice(selectedOrderForKOT.total || selectedOrderForKOT.subtotal)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrderForKOT(null)}
                  className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase"
                >
                  Close
                </button>
                <button
                  onClick={handlePrintKOT}
                  className={`py-3 rounded-xl ${theme.primary} text-white font-bold text-xs uppercase shadow-md flex items-center justify-center gap-1.5`}
                >
                  <Printer size={14} /> Print Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
