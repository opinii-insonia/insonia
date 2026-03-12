import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead } from '@/services/storage';
import { useAdminContext } from '@/context/AdminContext';
import { riskRules } from '@/data/riskRules';
import { formatDate } from '@/utils/formatDate';
import { generatePDF } from '@/utils/generatePDF';
import { Phone, Mail, Calendar, Activity, Eye, FileText, Search, Filter } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  limit?: number;
  showFilters?: boolean;
}

const statusConfig = {
  NOVO: { label: 'Novo', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  EM_CONTATO: { label: 'Em Contato', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  AGENDADO: { label: 'Agendado', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  CONCLUIDO: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
};

export const LeadTable: React.FC<LeadTableProps> = ({ leads, limit, showFilters = false }) => {
  const { changeLeadStatus } = useAdminContext();
  const navigate = useNavigate();

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  // Lógica de filtragem (ignorada se limit for passado, para o dashboard)
  let filteredLeads = leads;
  
  if (showFilters) {
    filteredLeads = leads.filter(lead => {
      const matchSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.telefone.includes(searchTerm) ||
                          (lead.cidade && lead.cidade.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchRisk = riskFilter === 'all' || lead.overall_risk === riskFilter;

      return matchSearch && matchStatus && matchRisk;
    });
  }

  const displayLeads = limit ? filteredLeads.slice(0, limit) : filteredLeads;

  const handleDownloadPDF = (lead: Lead) => {
    generatePDF({
      ...lead,
      data_resposta: lead.data_resposta
    });
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
        <Activity size={40} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-700">Nenhum paciente encontrado</h3>
        <p className="text-slate-500 mt-1">Os pacientes que concluírem a avaliação aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Barra de Filtros (Apenas exibe se showFilters for true) */}
      {showFilters && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, email, telefone ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Filter size={16} className="text-slate-400" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-600 font-medium cursor-pointer"
              >
                <option value="all">Todos os Status</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Activity size={16} className="text-slate-400" />
              <select 
                value={riskFilter} 
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-600 font-medium cursor-pointer"
              >
                <option value="all">Todos os Riscos</option>
                <option value="BAIXO">Baixo Risco</option>
                <option value="MODERADO">Risco Moderado</option>
                <option value="ALTO">Alto Risco</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Leads */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">Paciente</th>
                <th className="px-6 py-4 font-medium">Contato</th>
                <th className="px-6 py-4 font-medium">Risco</th>
                <th className="px-6 py-4 font-medium">Data da Avaliação</th>
                <th className="px-6 py-4 font-medium">Status do Atendimento</th>
                <th className="px-6 py-4 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Nenhum paciente atende aos filtros atuais.
                  </td>
                </tr>
              )}
              {displayLeads.map((lead) => {
                const risk = riskRules[lead.overall_risk as keyof typeof riskRules] || riskRules.BAIXO;
                
                return (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{lead.nome}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {lead.idade} anos • {lead.sexo} {lead.cidade ? `• ${lead.cidade}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-slate-600">
                          <Phone size={14} className="mr-2 text-slate-400 shrink-0" />
                          {lead.telefone}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Mail size={14} className="mr-2 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px] block" title={lead.email}>{lead.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${risk.color}`}>
                        {risk.label}
                      </span>
                      <div className="text-xs text-slate-500 mt-2 flex flex-col gap-0.5 font-medium">
                        <span>Epworth: {lead.epworth_score}</span>
                        <span>Insônia: {lead.insomnia_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600 font-medium">
                        <Calendar size={14} className="mr-2 text-slate-400" />
                        {formatDate(lead.data_resposta)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => changeLeadStatus(lead.id, e.target.value as Lead['status'])}
                        className={`text-sm border rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer appearance-none pr-8 bg-no-repeat font-medium ${statusConfig[lead.status]?.color || statusConfig['NOVO'].color}`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundSize: '1em 1em',
                        }}
                      >
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <option key={key} value={key} className="bg-white text-slate-800">
                            {config.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => navigate(`/admin/leads/${lead.id}`)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors tooltip-trigger"
                          title="Ver Ficha Completa"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDownloadPDF(lead)}
                          className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors tooltip-trigger"
                          title="Baixar PDF"
                        >
                          <FileText size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};