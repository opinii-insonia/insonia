import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLeads, Lead, updateLead, addTimelineEvent } from '@/services/storage';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  leads: Lead[];
  refreshLeads: () => void;
  changeLeadStatus: (id: string, status: Lead['status']) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const login = (password: string) => {
    if (password === 'admin123') { // Mock simples de senha
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      refreshLeads();
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const refreshLeads = () => {
    setLeads(getLeads().sort((a, b) => new Date(b.data_resposta).getTime() - new Date(a.data_resposta).getTime()));
  };

  const changeLeadStatus = (id: string, status: Lead['status']) => {
    // Atualiza o status e adiciona na timeline (histórico)
    updateLead(id, { status });
    addTimelineEvent(id, {
      type: 'status',
      description: `Status alterado para: ${status.replace('_', ' ').toUpperCase()}`
    });
    refreshLeads();
  };

  // Carrega os leads se estiver logado
  useEffect(() => {
    if (isAuthenticated) refreshLeads();
  }, [isAuthenticated]);

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, leads, refreshLeads, changeLeadStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminContext must be used within an AdminProvider");
  return context;
};