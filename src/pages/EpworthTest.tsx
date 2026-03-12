import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '@/context/TestContext';
import { QuestionCard } from '@/components/QuestionCard';
import { ProgressBar } from '@/components/ProgressBar';

const questions = [
  "Sentado e lendo",
  "Assistindo TV",
  "Sentado, inativo, em um local público (ex: teatro, reunião)",
  "Como passageiro de carro por uma hora sem parar",
  "Deitado para descansar à tarde, quando as circunstâncias permitem",
  "Sentado e conversando com alguém",
  "Sentado quietamente após o almoço sem álcool",
  "Em um carro, parado no trânsito por alguns minutos"
];

const options = [
  { value: 0, label: "0 = Nunca cochilaria" },
  { value: 1, label: "1 = Pequena chance" },
  { value: 2, label: "2 = Chance moderada" },
  { value: 3, label: "3 = Grande chance" },
];

const EpworthTest = () => {
  const navigate = useNavigate();
  const { epworthAnswers, setEpworthAnswers, userInfo } = useTestContext();
  const [localAnswers, setLocalAnswers] = useState<number[]>(epworthAnswers);

  // Redireciona se pular a home
  useEffect(() => {
    if (!userInfo.nome) navigate('/');
  }, [userInfo, navigate]);

  const handleAnswer = (index: number, value: number) => {
    const newAnswers = [...localAnswers];
    newAnswers[index] = value;
    setLocalAnswers(newAnswers);
  };

  const handleNext = () => {
    setEpworthAnswers(localAnswers);
    navigate('/epworth-result');
  };

  const answeredCount = localAnswers.filter(a => a !== -1).length;
  const isComplete = answeredCount === questions.length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Parte 1: Sonolência Diurna</h1>
          <p className="text-slate-500 mt-1">
            Qual a chance de você cochilar ou adormecer nas seguintes situações?
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
              options={options}
              selectedValue={localAnswers[index]}
              onChange={(val) => handleAnswer(index, val)}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!isComplete}
          className={`w-full py-4 rounded-xl font-medium text-lg transition-all ${
            isComplete 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Ver Resultado Parcial
        </button>
      </div>
    </div>
  );
};

export default EpworthTest;