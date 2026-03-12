import { getLeads, saveLead, updateLead, addTimelineEvent, Lead, TimelineEvent } from './storage';
import { calculateOverallRisk } from '@/utils/calculateOverallRisk';

/**
 * ==========================================
 * CAMADA DE INTEGRAÇÃO COM BACKEND (API)
 * ==========================================
 * 
 * TODO: Quando o Supabase for configurado, importe o cliente aqui:
 * import { supabase } from '@/lib/supabase';
 * 
 * Substitua o conteúdo interno das funções pelas chamadas reais do Supabase.
 */

export const submitTestResult = async (data: any): Promise<{ success: boolean; message: string; data?: Lead }> => {
  // TODO [Supabase]: 
  // const { data: result, error } = await supabase.from('leads').insert([data]).select().single();
  // if (error) throw error;
  // return { success: true, data: result, message: "Salvo com sucesso!" };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const risk = calculateOverallRisk(data.epworth_classificacao, data.insomnia_classificacao);
        const newLead = saveLead({
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
  // TODO [Supabase]:
  // const { data, error } = await supabase.from('leads').select('*').order('data_resposta', { ascending: false });
  // if (error) throw error;
  // return data;

  return new Promise((resolve) => {
    setTimeout(() => {
      const leads = getLeads().sort((a, b) => new Date(b.data_resposta).getTime() - new Date(a.data_resposta).getTime());
      resolve(leads);
    }, 800);
  });
};

export const fetchLeadById = async (id: string): Promise<Lead | null> => {
  // TODO [Supabase]:
  // const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
  // if (error) throw error;
  // return data;

  return new Promise((resolve) => {
    setTimeout(() => {
      const leads = getLeads();
      const found = leads.find(l => l.id === id);
      resolve(found || null);
    }, 500);
  });
};

export const updateLeadData = async (id: string, updates: Partial<Lead>): Promise<void> => {
  // TODO [Supabase]:
  // const { error } = await supabase.from('leads').update(updates).eq('id', id);
  // if (error) throw error;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        updateLead(id, updates);
        resolve();
      } catch (error) {
        reject(new Error("Erro ao atualizar o lead"));
      }
    }, 600);
  });
};

export const appendTimelineEvent = async (id: string, event: Omit<TimelineEvent, 'id' | 'date'>): Promise<void> => {
  // TODO [Supabase]:
  // O ideal no banco é ter uma tabela separada `lead_timeline` e fazer um insert:
  // const { error } = await supabase.from('lead_timeline').insert([{ lead_id: id, ...event }]);
  // if (error) throw error;

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