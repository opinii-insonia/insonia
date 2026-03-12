import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface AdminUser {
  email: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  getCurrentUser: () => AdminUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, pass: string) => {
    // Validação estrita para o e-mail e senha solicitados
    if (email === 'admin@insonia.com' && pass === 'Insonia2026') {
      const adminUser = { email, role: 'admin' };
      setUser(adminUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const getCurrentUser = () => user;

  return (
    <AuthContext.Provider value={{ user, login, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};