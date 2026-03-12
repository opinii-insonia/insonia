import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar';
import { useAdminContext } from '@/context/AdminContext';
import { formatDate } from '@/utils/formatDate';
import { Users, Phone, Mail, Activity, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { leads, isLoading } = useAdminContext();

  // Cálculos para os cards do topo
  const totalAvaliacoes = leads.length;
  const comTelefone = leads.filter(l => l.telefone && l.telefone.trim() !== '').length;
  const comEmail = leads.filter(l => l.email && l.email.trim() !== '').length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Resultados Capturados</h1>
          
          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center transition-all hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mr-5 shrink-0">
                <Users size={28} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total de Avaliações</p>
                <p className="text-3xl font-bold text-slate-800">{isLoading ? '-' : totalAvaliacoes}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center transition-all hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mr-5 shrink-0">
                <Phone size={28} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Leads com Telefone</p>
                <p className="text-3xl font-bold text-slate-800">{isLoading ? '-' : comTelefone}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center transition-all hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mr-5 shrink-0">
                <Mail size={28} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Leads com E-mail</p>
                <p className="text-3xl font-bold text-slate-800">{isLoading ? '-' : comEmail}</p>
              </div>
            </div>
          </div>

          {/* Área da Tabela */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Últimos Registros (Supabase)</h2>
              <p className="text-sm text-slate-500 mt-1">Lista de todos os pacientes que finalizaram o teste, do mais recente ao mais antigo.</p>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
                  <p className="font-medium text-slate-600">Buscando resultados...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-20">
                  <Activity size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="text-lg font-medium text-slate-700">Nenhuma avaliação encontrada</h3>
                  <p className="text-slate-500 mt-1">Os resultados aparecerão aqui assim que o primeiro usuário finalizar o fluxo.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                      <th className="px-6 py-4 font-semibold whitespace-nowrap">Data da Avaliação</th>
                      <th className="px-6 py-4 font-semibold">Nome</th>
                      <th className="px-6 py-4 font-semibold">Idade / Sexo</th>
                      <th className="px-6 py-4 font-semibold">Localização</th>
                      <th className="px-6 py-4 font-semibold">Contato</th>
                      <th className="px-6 py-4 font-semibold text-center">Score Epworth</th>
                      <th className="px-6 py-4 font-semibold text-center">Score Insônia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                          {formatDate(lead.data_resposta)}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {lead.nome}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                          {lead.idade || '-'} anos <br />
                          <span className="text-xs text-slate-400">{lead.sexo || 'Não informado'}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {lead.cidade ? `${lead.cidade} - ${lead.estado}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div>{lead.telefone}</div>
                          <div className="text-xs text-slate-400">{lead.email}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                            {lead.epworth_score} pts
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                            {lead.insomnia_score} pts
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;