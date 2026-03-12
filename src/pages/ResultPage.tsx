import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '@/context/TestContext';
import { calculateEpworth } from '@/utils/calculateEpworth';
import { calculateInsomnia } from '@/utils/calculateInsomnia';
import { calculateOverallRisk } from '@/utils/calculateOverallRisk';
import { getRecommendations } from '@/data/recommendations';
import { riskRules } from '@/data/riskRules';
import { generatePDF } from '@/utils/generatePDF';
import { ResultCard } from '@/components/ResultCard';
import { Download, RefreshCcw, User, AlertTriangle, FileText, CalendarDays } from 'lucide-react';

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
    const epworth = calculateEpworth(epworthAnswers);
    const insomnia = calculateInsomnia(insomniaAnswers);
    const overallRisk = calculateOverallRisk(epworth.classification, insomnia.classification);
    const riskConfig = riskRules[overallRisk as keyof typeof riskRules];
    
    return { epworth, insomnia, overallRisk, riskConfig };
  }, [epworthAnswers, insomniaAnswers]);

  const handleDownloadPDF = () => {
    const dataForPDF = {
      ...userInfo,
      ...contactInfo,
      epworth_score: results.epworth.score,
      epworth_classificacao: results.epworth.classification,
      insomnia_score: results.insomnia.score,
      insomnia_classificacao: results.insomnia.classification,
      overall_risk: results.overallRisk,
      data_resposta: new Date().toLocaleDateString('pt-BR')
    };
    generatePDF(dataForPDF);
  };

  const handleRestart = () => {
    resetTest();
    navigate('/');
  };

  if (!userInfo.nome) return null; // Evita flash antes do redirect

  const reportId = crypto.randomUUID().split('-')[0].toUpperCase();
  const today = new Date().toLocaleDateString('pt-BR');
  const recommendations = getRecommendations(results.overallRisk);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header do Relatório */}
        <div className="bg-white rounded-3xl p-8 mb-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Relatório InsônIA</h1>
            <p className="text-slate-500">Avaliação concluída para <span className="font-semibold text-slate-700">{userInfo.nome}</span></p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end text-sm text-slate-500 space-y-1">
            <span className="flex items-center"><FileText size={14} className="mr-2" /> ID: #{reportId}</span>
            <span className="flex items-center"><CalendarDays size={14} className="mr-2" /> Data: {today}</span>
          </div>
        </div>

        {/* Nível de Atenção Geral */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 text-center">
          <h2 className="text-lg font-medium text-slate-500 mb-4 uppercase tracking-wider">Nível de Atenção Geral</h2>
          <div className={`inline-flex items-center justify-center px-6 py-3 rounded-full text-2xl font-bold shadow-sm ${results.riskConfig.color}`}>
            {results.riskConfig.label}
          </div>
          <p className="text-slate-600 mt-6 max-w-2xl mx-auto leading-relaxed">
            {results.overallRisk === 'BAIXO' 
              ? 'Seus resultados indicam que você possui um padrão de sono saudável. Continue mantendo bons hábitos!'
              : results.overallRisk === 'MODERADO'
              ? 'Identificamos alguns sinais de alerta no seu padrão de sono. Recomenda-se atenção aos seus hábitos noturnos e monitoramento.'
              : 'Seus resultados sugerem um prejuízo significativo na qualidade do seu sono e possível impacto na sua rotina diurna. Recomendamos buscar orientação especializada.'}
          </p>
        </div>

        {/* Scores Individuais */}
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

        {/* Recomendações e Higiene do Sono */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Recomendações Iniciais</h3>
          <ul className="space-y-4">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 mr-4 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-slate-700 leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer / Aviso Médico */}
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl mb-8 flex items-start">
          <AlertTriangle className="text-rose-500 shrink-0 mr-4 mt-1" size={24} />
          <div>
            <h4 className="text-rose-800 font-bold mb-1">Atenção: Este relatório não é um diagnóstico</h4>
            <p className="text-rose-700 text-sm leading-relaxed">
              Os resultados apresentados baseiam-se em questionários de triagem padronizados e servem apenas como um alerta e auxílio educacional. Eles não substituem, de forma alguma, a avaliação clínica, o diagnóstico ou o tratamento por um profissional de saúde qualificado (médico especialista em medicina do sono).
            </p>
          </div>
        </div>

        {/* Download & Cópia */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mr-4">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Cópia do relatório enviada para:</p>
              <p className="font-medium text-slate-800">{contactInfo.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleDownloadPDF}
            className="w-full md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Download size={20} className="mr-3" />
            Baixar PDF Completo
          </button>
        </div>

        {/* Botão Reiniciar */}
        <div className="text-center">
          <button 
            onClick={handleRestart}
            className="inline-flex items-center text-slate-500 hover:text-slate-800 font-medium transition-colors px-6 py-2 rounded-full hover:bg-slate-200"
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