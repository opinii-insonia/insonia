import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '@/context/TestContext';
import { calculateEpworth } from '@/utils/calculateEpworth';
import { calculateInsomnia } from '@/utils/calculateInsomnia';
import { generatePDF } from '@/utils/generatePDF';
import { ResultCard } from '@/components/ResultCard';
import { Download, RefreshCcw, User } from 'lucide-react';

const ResultPage = () => {
  const navigate = useNavigate();
  const { userInfo, contactInfo, epworthAnswers, insomniaAnswers, resetTest } = useTestContext();

  useEffect(() => {
    // Redireciona se não tiver completado tudo
    if (!userInfo.nome || !contactInfo.email || epworthAnswers.includes(-1)) {
      navigate('/');
    }
  }, [userInfo, contactInfo, epworthAnswers, navigate]);

  const results = useMemo(() => {
    return {
      epworth: calculateEpworth(epworthAnswers),
      insomnia: calculateInsomnia(insomniaAnswers)
    };
  }, [epworthAnswers, insomniaAnswers]);

  const handleDownloadPDF = () => {
    const dataForPDF = {
      ...userInfo,
      ...contactInfo,
      epworth_score: results.epworth.score,
      epworth_classificacao: results.epworth.classification,
      insomnia_score: results.insomnia.score,
      insomnia_classificacao: results.insomnia.classification,
      data_resposta: new Date().toLocaleDateString('pt-BR')
    };
    generatePDF(dataForPDF);
  };

  const handleRestart = () => {
    resetTest();
    navigate('/');
  };

  if (!userInfo.nome) return null; // Evita flash antes do redirect

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Seu Relatório de Sono</h1>
          <p className="text-slate-500">Avaliação concluída com sucesso para <span className="font-semibold text-slate-700">{userInfo.nome}</span></p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ResultCard 
            type="epworth"
            title="Escala de Epworth" 
            score={results.epworth.score} 
            maxScore={24} 
            classification={results.epworth.classification} 
          />
          <ResultCard 
            type="insomnia"
            title="Índice de Insônia" 
            score={results.insomnia.score} 
            maxScore={28} 
            classification={results.insomnia.classification} 
          />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Cópia enviada para:</p>
              <p className="font-medium text-slate-800">{contactInfo.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleDownloadPDF}
            className="w-full md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Download size={18} className="mr-2" />
            Baixar PDF
          </button>
        </div>

        <div className="text-center">
          <button 
            onClick={handleRestart}
            className="inline-flex items-center text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            <RefreshCcw size={16} className="mr-2" />
            Fazer novo teste
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultPage;