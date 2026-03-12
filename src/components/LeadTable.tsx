import React from 'react';
import { Lead } from '@/services/storage';
import { useAdminContext } from '@/context/AdminContext';
import { riskRules } from '@/data/riskRules';
import { formatDate } from '@/utils/formatDate';
import { Phone, Mail, Calendar, Activity } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  limit?: number;
}

const statusConfig = {
  NOVO: { label: 'Novo', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  EM_CONTATO: { label: 'Em Contato', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  AGENDADO: { label: 'Agendado', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  CONCLUIDO: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
};

export const LeadTable: React.FC<LeadTableProps> = ({ leads, limit }) => {
  const { changeLeadStatus } = useAdminContext();
  
  const displayLeads = limit ? leads.slice(0, limit) : leads;

  if (displayLeads.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
        <Activity size={40} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-700">Nenhum paciente encontrado</h3>
        <p className="text-slate-500 mt-1">Os pacientes que concluírem a avaliação aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-sm">
              <th className="px-6 py-4 font-medium">Paciente</th>
              <th className="px-6 py-4 font-medium">Contato</th>
              <th className="px-6 py-4 font-medium">Risco</th>
              <th className="px-6 py-4 font-medium">Data da Avaliação</th>
              <th className="px-6 py-4 font-medium">Status do Atendimento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayLeads.map((lead) => {
              const risk = riskRules[lead.overall_risk as keyof typeof riskRules] || riskRules.BAIXO;
              
              return (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{lead.nome}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {lead.idade} anos • {lead.sexo} • {lead.cidade}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <Phone size={14} className="mr-2 text-slate-400" />
                        {lead.telefone}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Mail size={14} className="mr-2 text-slate-400" />
                        {lead.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${risk.color}`}>
                      {risk.label}
                    </span>
                    <div className="text-xs text-slate-500 mt-1.5 flex flex-col gap-0.5">
                      <span>Epworth: {lead.epworth_score}</span>
                      <span>Insônia: {lead.insomnia_score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar size={14} className="mr-2 text-slate-400" />
                      {formatDate(lead.data_resposta)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={lead.status}
                      onChange={(e) => changeLeadStatus(lead.id, e.target.value as Lead['status'])}
                      className={`text-sm border rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer appearance-none pr-8 bg-no-repeat ${statusConfig[lead.status].color}`}
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};