import React from 'react';
import { useOverview } from '../../../hooks/useOverview';
import {
  Utensils,
  Tag,
  QrCode,
  Plus,
  AlertCircle,
  Zap,
  MessageSquare,
  ArrowRight,
  Loader2,
  Star,
  ChefHat,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useSettings } from '@ethio-buna/shared';

const AdminDashboard = () => {
  const { data, isLoading, error } = useOverview();
  const { theme, formatPrice } = useSettings();

  if (isLoading) {
    return (
      <AdminLayout title="Operational Overview">
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
          <Loader2 className={`animate-spin ${theme.textPrimary}`} size={40} />
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
            Syncing Live Data...
          </p>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      label: "Today's Scans",
      value: data?.todayScans || 0,
      icon: Zap,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Out of Stock',
      value: data?.outOfStock || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'Total Categories',
      value: data?.totalCategories || 0,
      icon: Tag,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Dishes',
      value: data?.totalItems || 0,
      icon: Utensils,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <AdminLayout title="Operational Overview">
      <div className="space-y-10 animate-in fade-in duration-700">
        {/* KPI SECTION */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className={`
                  ${stat.bg} ${stat.color} 
                  w-10 h-10 
                  rounded-2xl 
                  flex 
                  items-center 
                  justify-center 
                  mb-4
                `}
              >
                <stat.icon size={20} />
              </div>
              <p className="text-3xl font-black text-slate-800 leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* QUICK ACTIONS CARD */}
            <div className={`${theme.primary} rounded-[3rem] p-8 text-white shadow-xl ${theme.shadow} relative overflow-hidden`}>
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Zap size={20} /> Quick Management
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Link
                    to="/dashboard/orders"
                    className="bg-white/10 hover:bg-white/20 p-4 rounded-[1.5rem] transition-all group border border-white/10 flex flex-col justify-between"
                  >
                    <ChefHat className="mb-2 group-hover:scale-110 transition-transform" size={20} />
                    <p className="text-[10px] font-black uppercase tracking-wider text-white">
                      Live Orders
                    </p>
                  </Link>

                  <Link
                    to="/dashboard/menu"
                    className="bg-white/10 hover:bg-white/20 p-4 rounded-[1.5rem] transition-all group border border-white/10 flex flex-col justify-between"
                  >
                    <Plus className="mb-2 group-hover:rotate-90 transition-transform" size={20} />
                    <p className="text-[10px] font-black uppercase tracking-wider text-white">
                      New Dish
                    </p>
                  </Link>

                  <Link
                    to="/dashboard/qr"
                    className="bg-white/10 hover:bg-white/20 p-4 rounded-[1.5rem] transition-all group border border-white/10 flex flex-col justify-between"
                  >
                    <QrCode className="mb-2 group-hover:scale-110 transition-transform" size={20} />
                    <p className="text-[10px] font-black uppercase tracking-wider text-white">
                      Table QRs
                    </p>
                  </Link>

                  <Link
                    to="/dashboard/settings"
                    className="bg-white/10 hover:bg-white/20 p-4 rounded-[1.5rem] transition-all group border border-white/10 flex flex-col justify-between"
                  >
                    <SettingsIcon className="mb-2 group-hover:rotate-45 transition-transform" size={20} />
                    <p className="text-[10px] font-black uppercase tracking-wider text-white">
                      Branding
                    </p>
                  </Link>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 pointer-events-none" />
            </div>

            {/* REAL LATEST INVENTORY LIST */}
            <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-[0.3em]">
                  Recently Added
                </h3>
                <Link
                  to="/dashboard/menu"
                  className={`${theme.textPrimary} text-[10px] font-black flex items-center gap-1 uppercase tracking-widest hover:underline`}
                >
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              <div className="space-y-4">
                {data?.latestInventory?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-50/50 rounded-[1.8rem] hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.images?.[0]?.imageUrl.startsWith('http')
                            ? item.images[0].imageUrl
                            : `http://localhost:5000/${item.images?.[0]?.imageUrl}`
                        }
                        className="w-12 h-12 rounded-2xl object-cover bg-white"
                        alt={item.name}
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">
                          {item.category?.name || 'No Category'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`
                        text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter
                        ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                      `}
                    >
                      {item.isAvailable ? 'Active' : 'Out'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT RATINGS WIDGET */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest flex items-center gap-2">
                <MessageSquare size={18} className={theme.textPrimary} />
                Recent Feedback
              </h3>
              <Link
                to="/dashboard/ratings"
                className={`${theme.textPrimary} text-[10px] font-black uppercase hover:underline`}
              >
                View All
              </Link>
            </div>

            <div className="space-y-6">
              {data?.recentRatings?.length > 0 ? (
                data.recentRatings.map((rating) => (
                  <div
                    key={rating.id}
                    className="border-b border-slate-50 pb-6 last:border-0"
                  >
                    <div className="flex gap-1 text-yellow-400 mb-2">
                      {[...Array(rating.ratingValue || 5)].map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-relaxed italic">
                      "{rating.comment || 'Excellent service!'}"
                    </p>
                    <p className="text-[9px] text-slate-400 mt-2 font-black uppercase tracking-widest">
                      By {rating.customerName || 'Guest'} on {rating.menuItem?.name || 'Dish'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-300 py-10 font-bold text-xs uppercase italic">
                  No ratings today
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
