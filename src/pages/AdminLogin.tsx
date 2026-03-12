import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '@/context/AdminContext';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdminContext();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Senha incorreta. (Dica: admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">Acesso Administrativo</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Digite a senha"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-medium p-3 rounded-lg hover:bg-blue-700 transition-colors">
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;