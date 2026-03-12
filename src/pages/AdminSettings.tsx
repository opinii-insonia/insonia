import React from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminTopbar } from '@/components/AdminTopbar';

const AdminSettings = () => (
  <div className="flex min-h-screen bg-slate-50">
    <AdminSidebar />
    <div className="flex-1 flex flex-col">
      <AdminTopbar />
      <main className="p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Configurações</h1>
        <p>Ajustes do sistema virão aqui.</p>
      </main>
    </div>
  </div>
);

export default AdminSettings;