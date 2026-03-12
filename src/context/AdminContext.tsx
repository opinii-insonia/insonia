import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead } from '@/services/storage';
import { fetchLeads, updateLeadData, appendTimelineEvent } from '@/services/api';
import { toast } from 'sonner';
import { useAuthContext } from './AuthContext';

interface AdminContextType {
  leads: Lead[];
  isLoading: boolean;
  refreshLeads: () => Promise<void>;
  changeLeadStatus: (id: string, status: Lead['status']) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

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
      await updateLeadData(id, { status });
      await appendTimelineEvent(id, {
        type: 'status',
        description: `Status alterado para: ${status.replace('_', ' ').toUpperCase()}`
      });
      await refreshLeads();
      toast.success("Status atualizado com sucesso!", { id: toastId });
    } catch (error) {
      toast.error("Erro ao atualizar status", { id: toastId });
    }
  };

  // Carrega os leads automaticamente sempre que um administrador estiver logado
  useEffect(() => {
    if (user?.role === 'admin') {
      refreshLeads();
    } else {
      setLeads([]);
    }
  }, [user]);

  return (
    <AdminContext.Provider value={{ leads, isLoading, refreshLeads, changeLeadStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminContext must be used within an AdminProvider");
  return context;
};