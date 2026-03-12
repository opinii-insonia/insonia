import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

export const AdminSidebar = () => {
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const links = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/leads", icon: Users, label: "Leads (Pacientes)" },
    { to: "/admin/reports", icon: FileText, label: "Relatórios" },
    { to: "/admin/settings", icon: Settings, label: "Configurações" },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-400 tracking-tight">InsônIA Admin</h2>
        <p className="text-xs text-slate-500 mt-1 truncate">{user?.email}</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <link.icon size={18} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors font-medium text-sm"
        >
          <LogOut size={18} />
          <span>Sair do Painel</span>
        </button>
      </div>
    </div>
  );
};