import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '@/context/TestContext';
import { QuestionCard } from '@/components/QuestionCard';
import { ProgressBar } from '@/components/ProgressBar';

const questions = [
  "Dificuldade para pegar no sono (adormecer)",
  "Dificuldade para manter o sono (acordar no meio da noite)",
  "Problema de acordar muito cedo",
  "Qual o seu grau de satisfação/insatisfação com seu padrão atual de sono?",
  "Até que ponto você considera que seus problemas de sono interferem em suas funções diárias?",
  "Até que ponto outras pessoas percebem que o seu problema de sono interfere na sua qualidade de vida?",
  "Qual o seu grau de preocupação ou sofrimento em relação ao seu problema de sono?"
];

// As primeiras 3 perguntas têm essas opções (0-4 severidade)
const severityOptions = [
  { value: 0, label: "0 = Nenhuma" },
  { value: 1, label: "1 = Leve" },
  { value: 2, label: "2 = Moderada" },
  { value: 3, label: "3 = Grave" },
  { value: 4, label: "4 = Muito grave" },
];

// Pergunta 4 (Satisfação)
const satisfactionOptions = [
  { value: 0, label: "0 = Muito satisfeito" },
  { value: 1, label: "1 = Satisfeito" },
  { value: 2, label: "2 = Neutro" },
  { value: 3, label: "3 = Insatisfeito" },
  { value: 4, label: "4 = Muito insatisfeito" },
];

// Perguntas 5 e 6 (Interferência/Percepção)
const interferenceOptions = [
  { value: 0, label: "0 = Não interfere" },
  { value: 1, label: "1 = Interfere um pouco" },
  { value: 2, label: "2 = Interfere moderadamente" },
  { value: 3, label: "3 = Interfere muito" },
  { value: 4, label: "4 = Interfere muitíssimo" },
];

// Pergunta 7 (Preocupação)
const worryOptions = [
  { value: 0, label: "0 = Nenhuma" },
  { value: 1, label: "1 = Um pouco" },
  { value: 2, label: "2 = Moderada" },
  { value: 3, label: "3 = Muita" },
  { value: 4, label: "4 = Muitíssima" },
];

const InsomniaTest = () => {
  const navigate = useNavigate();
  const { insomniaAnswers, setInsomniaAnswers, userInfo } = useTestContext();
  const [localAnswers, setLocalAnswers] = useState<number[]>(insomniaAnswers);

  useEffect(() => {
    if (!userInfo.nome) navigate('/');
  }, [userInfo, navigate]);

  const handleAnswer = (index: number, value: number) => {
    const newAnswers = [...localAnswers];
    newAnswers[index] = value;
    setLocalAnswers(newAnswers);
  };

  const handleNext = () => {
    setInsomniaAnswers(localAnswers);
    navigate('/insomnia-result');
  };

  const answeredCount = localAnswers.filter(a => a !== -1).length;
  const isComplete = answeredCount === questions.length;

  const getOptionsForIndex = (index: number) => {
    if (index <= 2) return severityOptions;
    if (index === 3) return satisfactionOptions;
    if (index === 6) return worryOptions;
    return interferenceOptions;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Parte 2: Qualidade do Sono</h1>
          <p className="text-slate-500 mt-1">
            Avalie a gravidade dos seus problemas de sono nas últimas duas semanas.
          </p>
        </div>

        <ProgressBar 
          currentStep={answeredCount} 
          totalSteps={questions.length} 
          label={`Respondidas: ${answeredCount} de ${questions.length}`} 
        />

        <div className="space-y-6 mb-8">
          {questions.map((q, index) => (
            <QuestionCard
              key={index}
              index={index}
              question={q}
              options={getOptionsForIndex(index)}
              selectedValue={localAnswers[index]}
              onChange={(val) => handleAnswer(index, val)}
            />
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/epworth-result')}
            className="w-1/3 py-4 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={handleNext}
            disabled={!isComplete}
            className={`w-2/3 py-4 rounded-xl font-medium text-lg transition-all ${
              isComplete 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Ver Resultado Parcial
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsomniaTest;