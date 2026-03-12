import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar';
import { useAdminContext } from '@/context/AdminContext';
import { Users, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const { isAuthenticated, leads } = useAdminContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const highRiskLeads = leads.filter(l => l.overall_risk === 'ALTO').length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Visão Geral</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* DashboardCards (simplificados por enquanto) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total de Avaliações</p>
                <p className="text-2xl font-bold text-slate-800">{leads.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mr-4">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pacientes de Alto Risco</p>
                <p className="text-2xl font-bold text-slate-800">{highRiskLeads}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Últimas Avaliações</h2>
            <p className="text-slate-500 text-sm">Os componentes detalhados da tabela serão construídos nos próximos passos.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;