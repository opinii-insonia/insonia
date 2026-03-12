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
  estado: string;
  cidade: string;
  telefone: string;
  email: string;
  epworth_score: number;
  epworth_classificacao: string;
  insomnia_score: number;
  insomnia_classificacao: string;
  overall_risk: string;
  data_resposta: string;
  
  // Custom CRM fields
  status: LeadStatus;
  prioridade: LeadPriority;
  tags: string[];
  observacoes: string;
  timeline: TimelineEvent[];
  origem: string;
}

const STORAGE_KEY = '@sleep_platform_results';

export const getAllResults = (): Lead[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getResultById = (id: string): Lead | null => {
  const results = getAllResults();
  return results.find(r => r.id === id) || null;
};

export const saveTestResult = (data: Partial<Lead>): Lead => {
  const results = getAllResults();
  
  let prioridade: LeadPriority = 'baixa';
  if (data.overall_risk === 'ALTO') prioridade = 'alta';
  else if (data.overall_risk === 'MODERADO') prioridade = 'media';

  const newResult: Lead = {
    id: crypto.randomUUID(),
    nome: data.nome || '',
    idade: data.idade || '',
    sexo: data.sexo || '',
    estado: data.estado || '',
    cidade: data.cidade || '',
    telefone: data.telefone || '',
    email: data.email || '',
    epworth_score: data.epworth_score || 0,
    epworth_classificacao: data.epworth_classificacao || '',
    insomnia_score: data.insomnia_score || 0,
    insomnia_classificacao: data.insomnia_classificacao || '',
    overall_risk: data.overall_risk || 'BAIXO',
    data_resposta: new Date().toISOString(),
    
    status: 'novo',
    prioridade,
    tags: [],
    observacoes: '',
    timeline: [{
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'criacao',
      description: 'Avaliação concluída pelo paciente.'
    }],
    origem: 'Plataforma Web'
  };
  
  results.push(newResult);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  return newResult;
};

export const updateResult = (id: string, payload: Partial<Lead>) => {
  const results = getAllResults();
  const index = results.findIndex(l => l.id === id);
  if (index !== -1) {
    results[index] = { ...results[index], ...payload };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }
};

export const addTimelineEvent = (id: string, event: Omit<TimelineEvent, 'id' | 'date'>) => {
  const results = getAllResults();
  const index = results.findIndex(l => l.id === id);
  if (index !== -1) {
    const newEvent: TimelineEvent = {
      ...event,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    results[index].timeline = [newEvent, ...(results[index].timeline || [])];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }
};