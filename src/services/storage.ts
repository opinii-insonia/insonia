export interface Lead {
  id: string;
  nome: string;
  idade: string;
  sexo: string;
  cidade: string;
  telefone: string;
  email: string;
  epworth_score: number;
  epworth_classificacao: string;
  insomnia_score: number;
  insomnia_classificacao: string;
  overall_risk: string;
  data_resposta: string;
  status: 'NOVO' | 'EM_CONTATO' | 'AGENDADO' | 'CONCLUIDO';
}

const STORAGE_KEY = '@sleep_leads';

export const getLeads = (): Lead[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLead = (leadData: Omit<Lead, 'id' | 'status'>) => {
  const leads = getLeads();
  const newLead: Lead = {
    ...leadData,
    id: crypto.randomUUID(),
    status: 'NOVO'
  };
  leads.push(newLead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  return newLead;
};

export const updateLeadStatus = (id: string, status: Lead['status']) => {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index !== -1) {
    leads[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }
};