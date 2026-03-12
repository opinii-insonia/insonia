import React from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar';
import { LeadTable } from '@/components/LeadTable';
import { useAdminContext } from '@/context/AdminContext';
import { Users, AlertTriangle, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const { leads } = useAdminContext();

  const highRiskLeads = leads.filter(l => l.overall_risk === 'ALTO').length;
  const newLeads = leads.filter(l => l.status === 'novo').length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Visão Geral</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center transition-all hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mr-5">
                <Users size={28} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total de Avaliações</p>
                <p className="text-3xl font-bold text-slate-800">{leads.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center transition-all hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mr-5">
                <AlertTriangle size={28} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Alto Risco</p>
                <p className="text-3xl font-bold text-slate-800">{highRiskLeads}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center transition-all hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mr-5">
                <div className="relative">
                  <Users size={28} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Novos Leads</p>
                <p className="text-3xl font-bold text-slate-800">{newLeads}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Últimas Avaliações</h2>
              <Link 
                to="/admin/leads" 
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm transition-colors"
              >
                Ver todos
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <LeadTable leads={leads} limit={5} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;