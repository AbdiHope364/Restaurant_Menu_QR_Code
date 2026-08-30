import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

const AdminLayout = ({ children, title }) => {
  const { admin, logout, switchRole } = useContext(AuthContext);
  const { settings, theme } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

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
      name: isWaiter ? 'Stock Toggle' : 'Menu Management',
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

  const handleLogout = () => {
    setIsMobileOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex">
      {/* ================= MOBILE BACKDROP OVERLAY ================= */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[99] lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* ================= MOBILE DRAWER SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-900 text-white z-[100] flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.restaurantName}
                  className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                />
              ) : (
                <div className={`w-10 h-10 ${theme.primary} rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0`}>
                  {settings.shortCode || 'IB'}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-sm font-black text-white uppercase truncate">
                  {settings.restaurantName || 'ITETE BUNA'}
                </h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {isWaiter ? 'Staff Terminal' : 'Manager Portal'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0"
              aria-label="Close Sidebar"
            >
              <X size={22} />
            </button>
          </div>

          {/* Role Pill */}
          <div className="p-4 border-b border-white/5 bg-white/5">
            <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <Shield size={14} className={isWaiter ? 'text-blue-400' : theme.textPrimary} />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  {admin?.role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => switchRole(isWaiter ? 'admin' : 'waiter')}
                className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                Switch
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
            {visibleNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.exact}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition font-bold text-xs uppercase tracking-wider ${
                    isActive
                      ? `${theme.primary} text-white shadow-lg ${theme.shadow}`
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-black text-xs uppercase tracking-wider transition"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= DESKTOP FIXED SIDEBAR ================= */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 bg-slate-900 text-white flex-col justify-between z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64 xl:w-72'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="h-20 flex items-center justify-between px-5 xl:px-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.restaurantName}
                  className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                />
              ) : (
                <div className={`w-10 h-10 ${theme.primary} rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0`}>
                  {settings.shortCode || 'IB'}
                </div>
              )}

              {!isCollapsed && (
                <div className="min-w-0 animate-in fade-in duration-200">
                  <h1 className="text-sm font-black uppercase tracking-tight text-white truncate">
                    {settings.restaurantName || 'ITETE BUNA'}
                  </h1>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                    {isWaiter ? 'Staff Terminal' : 'Manager Portal'}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          {/* Role Selector */}
          {!isCollapsed ? (
            <div className="p-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center justify-between bg-slate-800/80 p-2.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <Shield size={14} className={isWaiter ? 'text-blue-400' : theme.textPrimary} />
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-200">
                    {admin?.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => switchRole(isWaiter ? 'admin' : 'waiter')}
                  className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  Switch
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 text-center border-b border-white/5">
              <button
                type="button"
                onClick={() => switchRole(isWaiter ? 'admin' : 'waiter')}
                title={`Current: ${admin?.role}. Click to toggle.`}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 mx-auto transition"
              >
                <Shield size={16} className={isWaiter ? 'text-blue-400' : theme.textPrimary} />
              </button>
            </div>
          )}

          {/* Nav Links */}
          <nav className="p-3 xl:p-4 space-y-1.5 overflow-y-auto flex-1">
            {visibleNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.exact}
                title={isCollapsed ? link.name : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl transition font-bold text-xs uppercase tracking-wider ${
                    isCollapsed ? 'justify-center p-3.5' : 'px-4 py-3.5'
                  } ${
                    isActive
                      ? `${theme.primary} text-white shadow-lg ${theme.shadow}`
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <link.icon size={18} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{link.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className={`w-full flex items-center rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-black text-xs uppercase tracking-wider transition ${
              isCollapsed ? 'justify-center p-3' : 'justify-center gap-2 p-3.5'
            }`}
          >
            <LogOut size={16} className="shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN WRAPPER ================= */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64 xl:pl-72'
        }`}
      >
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
          {/* Left Area: Hamburger & Title */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 shadow-sm"
              aria-label="Open Sidebar Menu"
            >
              <Menu size={22} />
            </button>

            <h2 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-tight text-slate-900 truncate">
              {title}
            </h2>
          </div>

          {/* Right Area: Role Toggle & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role Switcher Pill */}
            <button
              type="button"
              onClick={() => switchRole(isWaiter ? 'admin' : 'waiter')}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border transition shadow-sm ${
                isWaiter
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : `${theme.bgLight} ${theme.textPrimary} ${theme.borderLight} hover:opacity-90`
              }`}
            >
              <UserCheck size={14} />
              <span>Role: {admin?.role}</span>
              <span className="text-[9px] text-slate-400 font-bold ml-1">(Toggle)</span>
            </button>

            {/* User Profile */}
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
                `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.fullName || 'Staff')}&background=${isWaiter ? '0284c7' : theme.accentHex.replace('#', '')}&color=fff`
              }
              alt="Profile"
              className="w-10 h-10 rounded-2xl border-2 border-white shadow-md object-cover"
            />
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
