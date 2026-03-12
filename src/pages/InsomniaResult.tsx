import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '@/context/TestContext';
import { calculateInsomnia } from '@/utils/calculateInsomnia';
import { ResultCard } from '@/components/ResultCard';
import { ArrowRight } from 'lucide-react';

const InsomniaResult = () => {
  const navigate = useNavigate();
  const { insomniaAnswers, userInfo } = useTestContext();

  useEffect(() => {
    if (!userInfo.nome || insomniaAnswers.includes(-1)) {
      navigate('/');
    }
  }, [userInfo, insomniaAnswers, navigate]);

  if (insomniaAnswers.includes(-1)) return null;

  const result = calculateInsomnia(insomniaAnswers);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Resultado da Parte 2</h2>
        <p className="text-slate-500 text-sm mb-6">Sua avaliação de qualidade do sono</p>

        <ResultCard 
          type="insomnia"
          title="Índice de Insônia" 
          score={result.score} 
          maxScore={28} 
          classification={result.classification} 
        />
        
        <p className="text-slate-600 mt-6 mb-8 text-sm leading-relaxed bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <strong>Você concluiu a avaliação!</strong> Agora vamos processar os dados e cruzar essas informações para gerar o seu relatório completo e recomendações personalizadas.
        </p>
        
        <button
          onClick={() => navigate('/lead-capture')}
          className="w-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-medium transition-all shadow-md"
        >
          Gerar Relatório Final
          <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default InsomniaResult;