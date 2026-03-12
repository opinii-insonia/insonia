import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar';
import { Lead, fetchLeadById, updateLeadData, appendTimelineEvent } from '@/services/api';
import { riskRules } from '@/data/riskRules';
import { formatDate } from '@/utils/formatDate';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Activity, Clock, FileText, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminLeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [newObs, setNewObs] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadLeadData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const found = await fetchLeadById(id);
      if (found) {
        setLead(found);
      } else {
        toast.error("Paciente não encontrado.");
        navigate('/admin/leads');
      }
    } catch (error) {
      toast.error("Erro ao buscar detalhes do paciente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeadData();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center text-blue-600">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">Carregando ficha do paciente...</p>
        </div>
      </div>
    );
  }

  if (!lead) return null;

  const risk = riskRules[lead.overall_risk as keyof typeof riskRules] || riskRules.BAIXO;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Lead['status'];
    const toastId = toast.loading("Atualizando status...");
    setIsUpdating(true);
    
    try {
      await updateLeadData(lead.id, { status: newStatus });
      await appendTimelineEvent(lead.id, {
        type: 'status',
        description: `Status alterado para: ${newStatus.replace('_', ' ').toUpperCase()}`
      });
      await loadLeadData();
      toast.success("Status atualizado!", { id: toastId });
    } catch (error) {
      toast.error("Falha ao atualizar", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddObs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObs.trim()) return;
    
    const toastId = toast.loading("Adicionando observação...");
    setIsUpdating(true);

    try {
      await appendTimelineEvent(lead.id, {
        type: 'observacao',
        description: newObs
      });
      await updateLeadData(lead.id, { observacoes: newObs });
      setNewObs('');
      await loadLeadData();
      toast.success("Observação salva!", { id: toastId });
    } catch (error) {
      toast.error("Falha ao salvar observação", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center space-x-4 mb-8">
            <button 
              onClick={() => navigate('/admin/leads')}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Ficha do Paciente</h1>
              <p className="text-slate-500 text-sm">Visualizando detalhes do lead capturado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Esquerda: Dados e Resultados */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Card Pessoal */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{lead.nome}</h2>
                    <p className="text-slate-500 mt-1">{lead.idade} anos • {lead.sexo}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase ${risk.color}`}>
                      {risk.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-slate-50 rounded-xl">
                    <Phone className="text-blue-500 mr-3" size={20} />
                    <span className="text-slate-700 font-medium">{lead.telefone}</span>
                  </div>
                  <div className="flex items-center p-3 bg-slate-50 rounded-xl">
                    <Mail className="text-blue-500 mr-3" size={20} />
                    <span className="text-slate-700 font-medium truncate" title={lead.email}>{lead.email}</span>
                  </div>
                  <div className="flex items-center p-3 bg-slate-50 rounded-xl">
                    <MapPin className="text-blue-500 mr-3" size={20} />
                    <span className="text-slate-700 font-medium">{lead.cidade ? `${lead.cidade} - ${lead.estado}` : 'Não informada'}</span>
                  </div>
                  <div className="flex items-center p-3 bg-slate-50 rounded-xl">
                    <Calendar className="text-blue-500 mr-3" size={20} />
                    <span className="text-slate-700 font-medium text-sm">{formatDate(lead.data_resposta)}</span>
                  </div>
                </div>
              </div>

              {/* Card Resultados */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <Activity className="text-blue-500 mr-2" size={22} />
                  Resultados da Avaliação Clínica
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-[100px] -z-0"></div>
                    <div className="relative z-10">
                      <p className="text-sm text-slate-500 font-medium mb-1">Escala de Epworth</p>
                      <div className="flex items-end mb-2">
                        <span className="text-4xl font-bold text-slate-800">{lead.epworth_score}</span>
                        <span className="text-slate-400 mb-1 ml-1">/ 24</span>
                      </div>
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                        {lead.epworth_classificacao}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-[100px] -z-0"></div>
                    <div className="relative z-10">
                      <p className="text-sm text-slate-500 font-medium mb-1">Índice de Insônia</p>
                      <div className="flex items-end mb-2">
                        <span className="text-4xl font-bold text-slate-800">{lead.insomnia_score}</span>
                        <span className="text-slate-400 mb-1 ml-1">/ 28</span>
                      </div>
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                        {lead.insomnia_classificacao}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Coluna Direita: CRM & Timeline */}
            <div className="space-y-8">
              
              {/* Status Manager */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Gestão do Atendimento</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-600 mb-2">Status do Lead</label>
                  <select
                    value={lead.status}
                    onChange={handleStatusChange}
                    disabled={isUpdating}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 font-medium disabled:opacity-50"
                  >
                    <option value="novo">Novo</option>
                    <option value="contato_pendente">Contato Pendente</option>
                    <option value="em_atendimento">Em Atendimento</option>
                    <option value="retorno_agendado">Retorno Agendado</option>
                    <option value="convertido">Convertido (Cliente)</option>
                    <option value="encerrado">Encerrado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Prioridade</label>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium uppercase text-sm flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-2 ${lead.prioridade === 'alta' ? 'bg-red-500' : lead.prioridade === 'media' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    {lead.prioridade}
                  </div>
                </div>
              </div>

              {/* Timeline / Histórico */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-[500px] flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <Clock className="text-blue-500 mr-2" size={20} />
                  Histórico (Timeline)
                </h3>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-4">
                  {lead.timeline?.map((event) => (
                    <div key={event.id} className="relative pl-6 border-l-2 border-slate-100 pb-2">
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white ${
                        event.type === 'criacao' ? 'bg-emerald-500' :
                        event.type === 'status' ? 'bg-blue-500' :
                        'bg-amber-500'
                      }`}></div>
                      <p className="text-xs text-slate-400 font-medium mb-1">{formatDate(event.date)}</p>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl inline-block mt-1 border border-slate-100">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddObs} className="relative mt-auto border-t border-slate-100 pt-4">
                  <input 
                    type="text" 
                    value={newObs}
                    onChange={(e) => setNewObs(e.target.value)}
                    disabled={isUpdating}
                    placeholder="Adicionar observação..."
                    className="w-full p-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={isUpdating}
                    className="absolute right-3 top-7 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLeadDetails;