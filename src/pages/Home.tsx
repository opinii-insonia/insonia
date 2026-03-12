import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '@/context/TestContext';
import { Activity } from 'lucide-react';
import { citiesByState } from '@/data/cities';
import { BRAZIL_STATES } from '@/data/states';

const Home = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useTestContext();
  const [error, setError] = useState({ nome: '', loc: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { nome: '', loc: '' };

    if (!userInfo.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório para iniciar.';
      valid = false;
    }
    if (!userInfo.estado || !userInfo.cidade) {
      newErrors.loc = 'Selecione o Estado e a Cidade para continuar.';
      valid = false;
    }

    if (!valid) {
      setError(newErrors);
      return;
    }

    navigate('/epworth');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    if (e.target.name === 'nome') setError(prev => ({ ...prev, nome: '' }));
    if (e.target.name === 'cidade') setError(prev => ({ ...prev, loc: '' }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Ao trocar o estado, limpar a cidade e o erro de localização
    setUserInfo({ ...userInfo, estado: e.target.value, cidade: '' });
    setError(prev => ({ ...prev, loc: '' }));
  };

  const currentCities = citiesByState[userInfo.estado] || [];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Activity className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">InsônIA</h1>
          <p className="text-blue-100 text-sm">Descubra a qualidade do seu descanso em poucos minutos com nossa avaliação inteligente.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
            <input
              type="text"
              name="nome"
              value={userInfo.nome}
              onChange={handleChange}
              placeholder="Digite seu nome"
              className={`w-full p-3 rounded-xl border ${error.nome ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
            />
            {error.nome && <p className="text-red-500 text-xs mt-1">{error.nome}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Idade</label>
              <input
                type="number"
                name="idade"
                value={userInfo.idade}
                onChange={handleChange}
                placeholder="Ex: 30"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sexo</label>
              <select
                name="sexo"
                value={userInfo.sexo}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estado *</label>
              <select
                name="estado"
                value={userInfo.estado}
                onChange={handleStateChange}
                className={`w-full p-3 rounded-xl border ${error.loc ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white`}
              >
                <option value="">Selecione seu Estado</option>
                {BRAZIL_STATES.map((state) => (
                  <option key={state.uf} value={state.uf}>{state.name} ({state.uf})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cidade *</label>
              <select
                name="cidade"
                value={userInfo.cidade}
                onChange={handleChange}
                disabled={!userInfo.estado}
                className={`w-full p-3 rounded-xl border ${error.loc ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {!userInfo.estado ? 'Selecione o estado primeiro' : 'Selecione sua cidade'}
                </option>
                {currentCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            {error.loc && <p className="text-red-500 text-xs mt-1">{error.loc}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm mt-4"
          >
            Iniciar Avaliação
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;