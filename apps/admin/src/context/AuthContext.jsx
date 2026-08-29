import React, { createContext, useState, useEffect } from 'react';
import { apiClient as api } from '@ethio-buna/shared';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

const DEFAULT_ADMIN = {
  id: 'usr-admin-1',
  fullName: 'Restaurant Manager',
  email: 'manager@restaurant.com',
  role: 'admin', // 'admin' | 'waiter' | 'manager'
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_user_session');
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
    } catch (e) {
      return DEFAULT_ADMIN;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (admin) {
        localStorage.setItem('admin_user_session', JSON.stringify(admin));
      } else {
        localStorage.removeItem('admin_user_session');
      }
    } catch (e) {}
  }, [admin]);

  const switchRole = (newRole) => {
    setAdmin((prev) => {
      const updated = {
        ...prev,
        role: newRole,
        fullName: newRole === 'waiter' ? 'Floor Waiter (Alex)' : 'Restaurant Manager',
        email: newRole === 'waiter' ? 'waiter@restaurant.com' : 'manager@restaurant.com',
      };
      toast.success(`Switched role to ${newRole.toUpperCase()}`, {
        icon: newRole === 'waiter' ? '🛎️' : '👑',
      });
      return updated;
    });
  };

  const loginAs = (role = 'admin') => {
    const userObj = {
      id: role === 'waiter' ? 'usr-waiter-1' : 'usr-admin-1',
      fullName: role === 'waiter' ? 'Floor Waiter (Alex)' : 'Restaurant Manager',
      email: role === 'waiter' ? 'waiter@restaurant.com' : 'manager@restaurant.com',
      role,
    };
    setAdmin(userObj);
    localStorage.setItem('token', 'mock-jwt-session-token-' + role);
    return userObj;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_user_session');
    setAdmin(DEFAULT_ADMIN);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        setAdmin,
        loading,
        switchRole,
        loginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
