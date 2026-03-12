import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '@/context/TestContext';
import { calculateEpworth } from '@/utils/calculateEpworth';
import { ResultCard } from '@/components/ResultCard';
import { ArrowRight } from 'lucide-react';

const EpworthResult = () => {
  const navigate = useNavigate();
  const { epworthAnswers, userInfo } = useTestContext();

  useEffect(() => {
    if (!userInfo.nome || epworthAnswers.includes(-1)) {
      navigate('/');
    }
  }, [userInfo, epworthAnswers, navigate]);

  if (epworthAnswers.includes(-1)) return null;

  const result = calculateEpworth(epworthAnswers);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Resultado da Parte 1</h2>
        <p className="text-slate-500 text-sm mb-6">Sua avaliação de sonolência diurna</p>
        
        <ResultCard 
          type="epworth"
          title="Escala de Epworth" 
          score={result.score} 
          maxScore={24} 
          classification={result.classification} 
        />
        
        <p className="text-slate-600 mt-6 mb-8 text-sm leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-100">
          Esta é apenas a primeira parte da avaliação. Para um diagnóstico mais preciso do seu padrão de sono, precisamos analisar a qualidade do seu sono noturno.
        </p>
        
        <button
          onClick={() => navigate('/insomnia')}
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium transition-all shadow-md"
        >
          Continuar para Parte 2
          <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default EpworthResult;