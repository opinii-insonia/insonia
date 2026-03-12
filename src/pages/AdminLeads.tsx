import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar';
import { LeadTable } from '@/components/LeadTable';
import { useAdminContext } from '@/context/AdminContext';

const AdminLeads = () => {
  const { leads } = useAdminContext();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gestão de Pacientes (CRM)</h1>
              <p className="text-slate-500 mt-1">Busque, filtre e gerencie os leads gerados através da plataforma InsônIA.</p>
            </div>
            
            <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 shadow-sm flex items-center">
              Total na Base: <span className="text-blue-600 ml-2 text-lg">{leads.length}</span>
            </div>
          </div>

          <LeadTable leads={leads} showFilters={true} />
        </main>
      </div>
    </div>
  );
};

export default AdminLeads;