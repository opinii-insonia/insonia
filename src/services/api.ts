import { supabase } from '@/integrations/supabase/client';
import { calculateOverallRisk } from '@/utils/calculateOverallRisk';

export type LeadStatus = 'novo' | 'contato_pendente' | 'em_atendimento' | 'retorno_agendado' | 'convertido' | 'encerrado';
export type LeadPriority = 'baixa' | 'media' | 'alta';

export interface TimelineEvent {
  id: string;
  lead_id?: string;
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
  status: LeadStatus;
  prioridade: LeadPriority;
  tags: string[];
  observacoes: string;
  timeline: TimelineEvent[];
  origem: string;
}

export const submitTestResult = async (data: any): Promise<{ success: boolean; message: string; data?: Lead }> => {
  const risk = calculateOverallRisk(data.epworth_classificacao, data.insomnia_classificacao);
  
  let prioridade: LeadPriority = 'baixa';
  if (risk === 'ALTO') prioridade = 'alta';
  else if (risk === 'MODERADO') prioridade = 'media';

  const leadData = {
    nome: data.nome,
    idade: data.idade,
    sexo: data.sexo,
    estado: data.estado,
    cidade: data.cidade,
    telefone: data.telefone,
    email: data.email,
    epworth_score: data.epworth_score,
    epworth_classificacao: data.epworth_classificacao,
    insomnia_score: data.insomnia_score,
    insomnia_classificacao: data.insomnia_classificacao,
    overall_risk: risk,
    data_resposta: new Date().toISOString(),
    status: 'novo',
    prioridade,
    origem: 'Plataforma Web',
    observacoes: ''
  };

  const { data: result, error } = await supabase.from('leads').insert([leadData]).select().single();
  
  if (error) {
    console.error("Erro ao salvar lead:", error);
    throw new Error("Erro ao salvar os dados");
  }

  // Cria o evento inicial na linha do tempo
  await supabase.from('lead_timeline').insert([{
    lead_id: result.id,
    type: 'criacao',
    description: 'Avaliação concluída pelo paciente.',
    date: new Date().toISOString()
  }]);

  return { success: true, data: result as Lead, message: "Dados salvos com sucesso!" };
};

export const fetchLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('data_resposta', { ascending: false });

  if (error) {
    console.error("Erro ao buscar leads:", error);
    throw error;
  }
  return data as Lead[] || [];
};

export const fetchLeadById = async (id: string): Promise<Lead | null> => {
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (leadError || !lead) return null;

  const { data: timeline, error: timelineError } = await supabase
    .from('lead_timeline')
    .select('*')
    .eq('lead_id', id)
    .order('date', { ascending: false });

  return {
    ...lead,
    timeline: timeline || []
  } as Lead;
};

export const updateLeadData = async (id: string, updates: Partial<Lead>): Promise<void> => {
  const { error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error("Erro ao atualizar lead:", error);
    throw error;
  }
};

export const appendTimelineEvent = async (id: string, event: Omit<TimelineEvent, 'id' | 'date' | 'lead_id'>): Promise<void> => {
  const { error } = await supabase
    .from('lead_timeline')
    .insert([{
      lead_id: id,
      ...event,
      date: new Date().toISOString()
    }]);

  if (error) {
    console.error("Erro ao adicionar evento na timeline:", error);
    throw error;
  }
};