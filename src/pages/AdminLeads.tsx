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
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gestão de Pacientes</h1>
              <p className="text-slate-500 mt-1">Gerencie os leads gerados através da plataforma InsônIA.</p>
            </div>
            
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
              Total: <span className="text-blue-600 ml-1">{leads.length}</span>
            </div>
          </div>

          <LeadTable leads={leads} />
        </main>
      </div>
    </div>
  );
};

export default AdminLeads;