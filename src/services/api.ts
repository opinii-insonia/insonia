import { supabase } from '@/lib/supabase';
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

// Interface atualizada para refletir a flexibilidade da tabela test_results e o painel Admin
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
  respostas_epworth?: number[];
  respostas_insomnia?: number[];
  data_resposta: string;
  
  // Campos virtuais para o CRM não quebrar (já que não estamos focando nisso hoje)
  overall_risk?: string;
  status: LeadStatus;
  prioridade: LeadPriority;
  tags: string[];
  observacoes: string;
  timeline: TimelineEvent[];
  origem: string;
}

export const submitTestResult = async (data: any) => {
  try {
    // Montando o payload estrito conforme solicitado para a tabela test_results
    const testData = {
      nome: data.nome,
      idade: data.idade || null,
      sexo: data.sexo || null,
      estado: data.estado,
      cidade: data.cidade,
      telefone: data.telefone,
      email: data.email,
      epworth_score: data.epworth_score,
      epworth_classificacao: data.epworth_classificacao,
      insomnia_score: data.insomnia_score,
      insomnia_classificacao: data.insomnia_classificacao,
      respostas_epworth: data.respostas_epworth, // Arrays são salvos como JSONB nativamente pelo Supabase
      respostas_insomnia: data.respostas_insomnia,
      data_resposta: new Date().toISOString()
    };

    const { data: result, error } = await supabase
      .from('test_results')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.error("Erro ao salvar resultado na tabela test_results:", error);
      return { data: null, error };
    }

    return { data: result, error: null };
  } catch (err) {
    console.error("Erro inesperado no submitTestResult:", err);
    return { data: null, error: err };
  }
};

export const getTestResults = async () => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .order('data_resposta', { ascending: false });

    if (error) {
      console.error("Erro ao buscar registros da tabela test_results:", error);
      return { data: null, error };
    }
    
    // Mapeamento temporário para manter o Painel Admin funcionando sem quebrar
    // Injeta os dados de CRM (status, risco) virtualmente baseados nos scores
    const mappedData = data.map((item: any) => ({
      ...item,
      overall_risk: calculateOverallRisk(item.epworth_classificacao, item.insomnia_classificacao),
      status: 'novo',
      prioridade: 'media',
      timeline: [],
      tags: [],
      observacoes: ''
    }));

    return { data: mappedData as Lead[], error: null };
  } catch (err) {
    console.error("Erro inesperado no getTestResults:", err);
    return { data: null, error: err };
  }
};

// As funções abaixo foram mantidas para não quebrar as rotas do Admin
export const fetchLeadById = async (id: string): Promise<Lead | null> => {
  try {
    const { data: lead, error: leadError } = await supabase
      .from('test_results')
      .select('*')
      .eq('id', id)
      .single();

    if (leadError || !lead) return null;

    return {
      ...lead,
      overall_risk: calculateOverallRisk(lead.epworth_classificacao, lead.insomnia_classificacao),
      status: 'novo',
      prioridade: 'media',
      timeline: [],
      tags: [],
      observacoes: ''
    } as Lead;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateLeadData = async (id: string, updates: Partial<Lead>): Promise<void> => {
  console.log("updateLeadData bypass - CRM desativado temporariamente");
  // Bypass temporário pois não estamos usando CRM completo
};

export const appendTimelineEvent = async (id: string, event: Omit<TimelineEvent, 'id' | 'date' | 'lead_id'>): Promise<void> => {
  console.log("appendTimelineEvent bypass - CRM desativado temporariamente");
  // Bypass temporário pois não estamos usando CRM completo
};