import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '../types';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: { id: string; username: string; role: string }) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'dv_admin_auth_v1';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  }, [admin]);

  const login = (token: string, user: { id: string; username: string; role: string }) => {
    setAdmin({
      ...user,
      token
    });
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  const getAuthHeaders = (): Record<string, string> => {
    if (!admin?.token) return {};
    return {
      Authorization: `Bearer ${admin.token}`
    };
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        login,
        logout,
        getAuthHeaders
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
