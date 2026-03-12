import { getAllResults, saveTestResult, getResultById, updateResult, addTimelineEvent, Lead, TimelineEvent } from './storage';
import { calculateOverallRisk } from '@/utils/calculateOverallRisk';

/**
 * ==========================================
 * CAMADA DE INTEGRAÇÃO COM BACKEND (API)
 * ==========================================
 * 
 * TODO: Quando o Supabase for configurado, importe o cliente aqui e
 * substitua o conteúdo interno das funções pelas chamadas reais.
 */

export const submitTestResult = async (data: any): Promise<{ success: boolean; message: string; data?: Lead }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const risk = calculateOverallRisk(data.epworth_classificacao, data.insomnia_classificacao);
        const newLead = saveTestResult({
          ...data,
          overall_risk: risk
        });
        resolve({ success: true, data: newLead, message: "Dados salvos com sucesso!" });
      } catch (error) {
        reject(new Error("Erro ao salvar os dados"));
      }
    }, 1200); // Simulando delay de rede
  });
};

export const fetchLeads = async (): Promise<Lead[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const leads = getAllResults().sort((a, b) => new Date(b.data_resposta).getTime() - new Date(a.data_resposta).getTime());
      resolve(leads);
    }, 800);
  });
};

export const fetchLeadById = async (id: string): Promise<Lead | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = getResultById(id);
      resolve(found);
    }, 500);
  });
};

export const updateLeadData = async (id: string, updates: Partial<Lead>): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        updateResult(id, updates);
        resolve();
      } catch (error) {
        reject(new Error("Erro ao atualizar o lead"));
      }
    }, 600);
  });
};

export const appendTimelineEvent = async (id: string, event: Omit<TimelineEvent, 'id' | 'date'>): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        addTimelineEvent(id, event);
        resolve();
      } catch (error) {
        reject(new Error("Erro ao adicionar evento na timeline"));
      }
    }, 400);
  });
};