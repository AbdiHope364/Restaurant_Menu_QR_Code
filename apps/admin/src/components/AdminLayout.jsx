import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSettings } from '@ethio-buna/shared';
import {
  LayoutDashboard,
  ChefHat,
  Utensils,
  Tag,
  QrCode,
  BarChart3,
  LogOut,
  Menu,
  X,
  Star,
  Settings as SettingsIcon,
  UserCheck,
  Shield,
} from 'lucide-react';

const AdminLayout = ({ children, title }) => {
  const { admin, logout, switchRole } = useContext(AuthContext);
  const { settings, theme } = useSettings();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const isWaiter = admin?.role === 'waiter';

  // Role-filtered navigation links
  const allNavLinks = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Live Orders',
      path: '/dashboard/orders',
      icon: ChefHat,
      roles: ['admin', 'manager', 'waiter'],
    },
    {
      name: isWaiter ? 'Menu Stock Toggle' : 'Menu Management',
      path: '/dashboard/menu',
      icon: Utensils,
      roles: ['admin', 'manager', 'waiter'],
    },
    {
      name: 'Categories',
      path: '/dashboard/categories',
      icon: Tag,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Table QRs & Tents',
      path: '/dashboard/qr',
      icon: QrCode,
      roles: ['admin', 'manager', 'waiter'],
    },
    {
      name: 'Analytics',
      path: '/dashboard/analytics',
      icon: BarChart3,
      roles: ['admin', 'manager'],
    },
    {
      name: 'Reviews',
      path: '/dashboard/ratings',
      icon: Star,
      roles: ['admin', 'manager', 'waiter'],
    },
    {
      name: 'Branding & Setup',
      path: '/dashboard/settings',
      icon: SettingsIcon,
      roles: ['admin', 'manager'],
    },
  ];

  const visibleNavLinks = allNavLinks.filter((link) =>
    link.roles.includes(admin?.role || 'admin'),
  );

  const LinkItem = ({ link, mobile = false }) => (
    <NavLink
      to={link.path}
      end={link.exact}
      onClick={() => mobile && setIsOpen(false)}
      className={({ isActive }) =>
        `
          flex items-center gap-3 rounded-xl transition-all duration-200
          ${mobile ? 'px-4 py-3 text-sm' : 'px-3 py-3 text-[11px]'}
          ${
            isActive
              ? `${theme.primary} text-white shadow-lg ${theme.shadow}`
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }
        `
      }
    >
      <link.icon size={mobile ? 22 : 18} />
      <span
        className={`font-bold uppercase tracking-widest ${
          mobile ? 'text-xs sm:text-sm' : 'text-[11px]'
        }`}
      >
        {link.name}
      </span>
    </NavLink>
  );

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#fcfcfd]">
      {/* ================= MOBILE SIDEBAR ================= */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <aside
          className={`absolute left-0 top-0 w-[85vw] max-w-sm bg-slate-900 shadow-2xl h-[100dvh] flex flex-col transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Logo */}
          <div className="h-[68px] flex items-center justify-between px-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.restaurantName}
                  className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                />
              ) : (
                <div
                  className={`w-9 h-9 ${theme.primary} rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0`}
                >
                  {settings.shortCode || 'IB'}
                </div>
              )}
              <h1 className="text-base font-black text-white uppercase truncate">
                {settings.restaurantName || 'ITETE BUNA'}
              </h1>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-white/60 hover:bg-white/10 shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Role Indicator in Mobile */}
          <div className="px-5 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Role</span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isWaiter ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'}`}>
              {admin?.role}
            </span>
          </div>

          {/* SCROLL AREA */}
          <nav className="overflow-y-auto px-4 py-4 space-y-1.5 flex-1">
            {visibleNavLinks.map((link) => (
              <LinkItem key={link.path} link={link} mobile />
            ))}
          </nav>

          {/* FOOTER */}
          <div className="border-t border-white/10 p-4 flex-shrink-0 bg-slate-900">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 p-4 transition font-bold uppercase tracking-widest text-xs"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex fixed inset-y-0 w-64 xl:w-72 bg-slate-900 text-white flex-col z-50">
        <div className="p-6 xl:p-8 border-b border-white/10 flex items-center gap-3">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.restaurantName}
              className="w-11 h-11 rounded-2xl object-cover border border-white/10 shadow-md shrink-0"
            />
          ) : (
            <div
              className={`w-10 h-10 ${theme.primary} rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg ${theme.shadow}`}
            >
              {settings.shortCode || 'IB'}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-black uppercase tracking-tight text-white truncate">
              {settings.restaurantName || 'ITETE BUNA'}
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
              {isWaiter ? 'Staff / Waiter Terminal' : 'Manager Portal'}
            </p>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="px-5 py-3 mx-4 mt-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={14} className={isWaiter ? 'text-blue-400' : theme.textPrimary} />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
              {admin?.role}
            </span>
          </div>

          <button
            onClick={() => switchRole(isWaiter ? 'admin' : 'waiter')}
            title="Toggle between Admin and Waiter role views"
            className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            Switch to {isWaiter ? 'Admin' : 'Waiter'}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {visibleNavLinks.map((link) => (
            <LinkItem key={link.path} link={link} />
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-400 p-4 transition"
          >
            <LogOut size={18} />
            <span className="text-xs font-black uppercase tracking-widest">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 w-full lg:ml-64 xl:ml-72 flex flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition shrink-0"
            >
              <Menu size={20} />
            </button>

            <h2 className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-tight text-slate-800 truncate">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Top Bar Quick Role Switcher */}
            <button
              onClick={() => switchRole(isWaiter ? 'admin' : 'waiter')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase transition ${
                isWaiter
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  : `${theme.bgLight} ${theme.textPrimary} border ${theme.borderLight} hover:opacity-80`
              }`}
            >
              <UserCheck size={14} />
              <span>Role: {admin?.role}</span>
              <span className="text-[9px] text-slate-400 ml-1">(Click to toggle)</span>
            </button>

            <div className="hidden md:block text-right">
              <p className="text-xs font-black text-slate-900 leading-none">
                {admin?.fullName || 'User'}
              </p>
              <p className={`mt-1 text-[10px] uppercase tracking-widest font-black ${isWaiter ? 'text-blue-600' : theme.textPrimary}`}>
                {admin?.role}
              </p>
            </div>

            <img
              src={
                admin?.profileImage ||
                `https://ui-avatars.com/api/?name=${admin?.fullName || 'Staff'}&background=${isWaiter ? '0284c7' : theme.accentHex.replace('#', '')}&color=fff`
              }
              alt="Profile"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border-2 border-white shadow object-cover"
            />
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
