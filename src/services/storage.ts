export type LeadStatus = 'novo' | 'contato_pendente' | 'em_atendimento' | 'retorno_agendado' | 'convertido' | 'encerrado';
export type LeadPriority = 'baixa' | 'media' | 'alta';

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'criacao' | 'status' | 'observacao' | 'contato' | 'sistema';
  description: string;
}

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
  respostas_epworth: number[];
  respostas_insomnia: number[];
  status: LeadStatus;
  prioridade: LeadPriority;
  tags: string[];
  observacoes: string;
  timeline: TimelineEvent[];
  data_resposta: string;
  ultimo_contato?: string;
  proximo_followup?: string;
  origem: string;
}

const STORAGE_KEY = '@sleep_leads_v2';

export const getLeads = (): Lead[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLead = (leadData: Partial<Lead>) => {
  const leads = getLeads();
  
  // Define prioridade baseada no risco
  let prioridade: LeadPriority = 'baixa';
  if (leadData.overall_risk === 'ALTO') prioridade = 'alta';
  else if (leadData.overall_risk === 'MODERADO') prioridade = 'media';

  const newLead: Lead = {
    id: crypto.randomUUID(),
    nome: leadData.nome || '',
    idade: leadData.idade || '',
    sexo: leadData.sexo || '',
    cidade: leadData.cidade || '',
    telefone: leadData.telefone || '',
    email: leadData.email || '',
    epworth_score: leadData.epworth_score || 0,
    epworth_classificacao: leadData.epworth_classificacao || '',
    insomnia_score: leadData.insomnia_score || 0,
    insomnia_classificacao: leadData.insomnia_classificacao || '',
    overall_risk: leadData.overall_risk || 'BAIXO',
    respostas_epworth: leadData.respostas_epworth || [],
    respostas_insomnia: leadData.respostas_insomnia || [],
    status: 'novo',
    prioridade,
    tags: [],
    observacoes: '',
    timeline: [{
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'criacao',
      description: 'Avaliação concluída pelo paciente na plataforma pública.'
    }],
    data_resposta: new Date().toISOString(),
    origem: 'Plataforma Web'
  };
  
  leads.push(newLead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  return newLead;
};

export const updateLead = (id: string, updates: Partial<Lead>) => {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index !== -1) {
    leads[index] = { ...leads[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }
};

export const addTimelineEvent = (id: string, event: Omit<TimelineEvent, 'id' | 'date'>) => {
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);
  if (index !== -1) {
    const newEvent: TimelineEvent = {
      ...event,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    leads[index].timeline = [newEvent, ...(leads[index].timeline || [])];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }
};