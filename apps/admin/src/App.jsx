import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SettingsProvider, useSettings } from '@ethio-buna/shared';

// Providers
import { AuthProvider, AuthContext } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VerifyEmail from './pages/Auth/VerifyEmail';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import OrdersManagement from './pages/admin/OrdersManagement';
import MenuManagement from './pages/admin/MenuManagement';
import Categories from './pages/admin/Categories';
import QRManagement from './pages/admin/QRManagement';
import Analytics from './pages/admin/Analytics';
import Ratings from './pages/admin/Ratings';
import Settings from './pages/admin/Settings';

/**
 * ProtectedRoute Component
 * Prevents unauthorized access to management pages.
 */
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useContext(AuthContext);
  const { theme } = useSettings();

  if (loading) {
    return (
      <div className={`h-screen flex items-center justify-center font-black ${theme.textPrimary} animate-pulse text-lg tracking-widest uppercase`}>
        Loading System...
      </div>
    );
  }

  return admin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <MenuProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'font-bold text-xs shadow-xl rounded-2xl border border-slate-100',
              }}
            />

            <Routes>
              {/* PUBLIC AUTH ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* PROTECTED DASHBOARD ROUTES */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/orders"
                element={
                  <ProtectedRoute>
                    <OrdersManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/menu"
                element={
                  <ProtectedRoute>
                    <MenuManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/qr"
                element={
                  <ProtectedRoute>
                    <QRManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/ratings"
                element={
                  <ProtectedRoute>
                    <Ratings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* DEFAULT REDIRECT */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Router>
        </MenuProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
