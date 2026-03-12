import React, { useMemo } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar';
import { useAdminContext } from '@/context/AdminContext';
import { exportLeadsToCSV } from '@/utils/exportCSV';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Activity, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

const AdminReports = () => {
  const { leads } = useAdminContext();

  // Mapeia e consolida os dados de Risco Geral para o gráfico de pizza
  const riskData = useMemo(() => {
    const counts = { BAIXO: 0, MODERADO: 0, ALTO: 0 };
    leads.forEach(l => {
      if (counts[l.overall_risk as keyof typeof counts] !== undefined) {
        counts[l.overall_risk as keyof typeof counts]++;
      }
    });
    return [
      { name: 'Baixo Risco', value: counts.BAIXO, color: '#10b981' }, // emerald-500
      { name: 'Risco Moderado', value: counts.MODERADO, color: '#f59e0b' }, // amber-500
      { name: 'Alto Risco', value: counts.ALTO, color: '#f43f5e' } // rose-500
    ].filter(item => item.value > 0);
  }, [leads]);

  // Mapeia e consolida os dados do Funil (Status) para o gráfico de barras
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => {
      // Clean string para label
      const statusLabel = l.status.replace(/_/g, ' ').toUpperCase();
      counts[statusLabel] = (counts[statusLabel] || 0) + 1;
    });
    
    // Converte e ordena para o gráfico (maior pro menor, simulando funil)
    return Object.entries(counts)
      .map(([name, quantidade]) => ({ name, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade);
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
              <p className="text-slate-500 mt-1">Estatísticas visuais sobre o volume e a gravidade dos pacientes capturados.</p>
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
                Os gráficos serão gerados automaticamente assim que os primeiros pacientes concluírem a avaliação na plataforma.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Gráfico 1: Risco */}
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

              {/* Gráfico 2: Status CRM */}
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
                          <Cell key={`cell-${index}`} fill="#3b82f6" /> // blue-500
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminReports;