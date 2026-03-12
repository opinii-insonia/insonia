import React, { useMemo } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar';
import { useAdminContext } from '@/context/AdminContext';
import { exportLeadsToCSV } from '@/utils/exportCSV';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Activity, PieChart as PieChartIcon, BarChart3, Users } from 'lucide-react';
import { GeographicOverview } from '@/components/GeographicOverview';

const AdminReports = () => {
  const { leads } = useAdminContext();

  const riskData = useMemo(() => {
    const counts = { BAIXO: 0, MODERADO: 0, ALTO: 0 };
    leads.forEach(l => {
      if (counts[l.overall_risk as keyof typeof counts] !== undefined) {
        counts[l.overall_risk as keyof typeof counts]++;
      }
    });
    return [
      { name: 'Baixo Risco', value: counts.BAIXO, color: '#10b981' },
      { name: 'Risco Moderado', value: counts.MODERADO, color: '#f59e0b' },
      { name: 'Alto Risco', value: counts.ALTO, color: '#f43f5e' }
    ].filter(item => item.value > 0);
  }, [leads]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      const statusLabel = l.status.replace(/_/g, ' ').toUpperCase();
      counts[statusLabel] = (counts[statusLabel] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([name, quantidade]) => ({ name, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade);
  }, [leads]);

  const totaisGerais = useMemo(() => {
    return {
      total: leads.length,
      altaGravidade: leads.filter(l => l.overall_risk === 'ALTO').length,
      novos: leads.filter(l => l.status === 'novo').length
    };
  }, [leads]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Relatórios e Análises</h1>
              <p className="text-slate-500 mt-1">Estatísticas visuais sobre o volume, gravidade e demografia dos pacientes.</p>
            </div>
            
            <button 
              onClick={() => exportLeadsToCSV(leads)}
              disabled={leads.length === 0}
              className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Download size={18} className="mr-2" />
              Baixar Relatório (CSV)
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm mt-4">
              <Activity size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-medium text-slate-700 mb-1">Ainda não há dados suficientes</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Os gráficos e mapas serão gerados automaticamente assim que os primeiros pacientes concluírem a avaliação.
              </p>
            </div>
          ) : (
            <>
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total de Pacientes</p>
                    <p className="text-2xl font-bold text-slate-800">{totaisGerais.total}</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mr-4">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Casos Graves (Alto Risco)</p>
                    <p className="text-2xl font-bold text-slate-800">{totaisGerais.altaGravidade}</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mr-4">
                    <div className="relative">
                      <Users size={24} />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Aguardando Contato (Novos)</p>
                    <p className="text-2xl font-bold text-slate-800">{totaisGerais.novos}</p>
                  </div>
                </div>
              </div>

              {/* Gráficos em Linha */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-blue-600">
                      <PieChartIcon size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Distribuição por Risco (Gravidade)</h2>
                  </div>
                  
                  <div className="h-[320px] w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 500 }}
                          itemStyle={{ color: '#1e293b' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex flex-wrap justify-center mt-2 gap-6">
                    {riskData.map(item => (
                      <div key={item.name} className="flex items-center text-sm font-medium">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="text-slate-700">{item.name} ({item.value})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center mr-3 text-indigo-600">
                      <BarChart3 size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Funil de Atendimento (Status do CRM)</h2>
                  </div>
                  
                  <div className="h-[320px] w-full flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={statusData} 
                        layout="vertical" 
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} 
                          width={130} 
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value) => [value, 'Pacientes']}
                        />
                        <Bar dataKey="quantidade" radius={[0, 6, 6, 0]} barSize={32}>
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#3b82f6" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Visão Geográfica (MAPA) */}
              <GeographicOverview leads={leads} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminReports;