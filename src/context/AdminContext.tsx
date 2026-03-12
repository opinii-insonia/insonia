import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead } from '@/services/storage';
import { fetchLeads, updateLeadData, appendTimelineEvent } from '@/services/api';
import { toast } from 'sonner';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  leads: Lead[];
  isLoading: boolean;
  refreshLeads: () => Promise<void>;
  changeLeadStatus: (id: string, status: Lead['status']) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const login = (password: string) => {
    if (password === 'admin123') {
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
    setLeads([]);
  };

  const refreshLeads = async () => {
    try {
      setIsLoading(true);
      const data = await fetchLeads();
      setLeads(data);
    } catch (error) {
      toast.error("Erro ao carregar os leads.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLeadStatus = async (id: string, status: Lead['status']) => {
    const toastId = toast.loading("Atualizando status...");
    try {
      // 1. Atualiza no banco (simulado)
      await updateLeadData(id, { status });
      await appendTimelineEvent(id, {
        type: 'status',
        description: `Status alterado para: ${status.replace('_', ' ').toUpperCase()}`
      });
      
      // 2. Recarrega os dados
      await refreshLeads();
      toast.success("Status atualizado com sucesso!", { id: toastId });
    } catch (error) {
      toast.error("Erro ao atualizar status", { id: toastId });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshLeads();
    }
  }, [isAuthenticated]);

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, leads, isLoading, refreshLeads, changeLeadStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminContext must be used within an AdminProvider");
  return context;
};