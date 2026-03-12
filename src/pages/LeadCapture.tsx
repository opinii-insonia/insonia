import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '@/context/TestContext';
import { calculateEpworth } from '@/utils/calculateEpworth';
import { calculateInsomnia } from '@/utils/calculateInsomnia';
import { submitTestResult } from '@/services/api';
import { Lock, FileText, CheckCircle2 } from 'lucide-react';
import { showLoading, dismissToast, showSuccess, showError } from '@/utils/toast';

const LeadCapture = () => {
  const navigate = useNavigate();
  const { userInfo, contactInfo, setContactInfo, epworthAnswers, insomniaAnswers } = useTestContext();
  const [errors, setErrors] = useState({ whatsapp: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userInfo.nome || epworthAnswers.includes(-1) || insomniaAnswers.includes(-1)) {
      navigate('/');
    }
  }, [userInfo, epworthAnswers, insomniaAnswers, navigate]);

  const validate = () => {
    let valid = true;
    const newErrors = { whatsapp: '', email: '' };

    if (!contactInfo.telefone.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
      valid = false;
    } else if (contactInfo.telefone.length < 10) {
      newErrors.whatsapp = 'Digite um número válido';
      valid = false;
    }

    if (!contactInfo.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
      newErrors.email = 'E-mail inválido';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const toastId = showLoading("Gerando seu relatório...");

    try {
      const epworthResult = calculateEpworth(epworthAnswers);
      const insomniaResult = calculateInsomnia(insomniaAnswers);

      const finalPayload = {
        ...userInfo,
        ...contactInfo,
        epworth_score: epworthResult.score,
        epworth_classificacao: epworthResult.classification,
        insomnia_score: insomniaResult.score,
        insomnia_classificacao: insomniaResult.classification,
        respostas_epworth: epworthAnswers,
        respostas_insomnia: insomniaAnswers,
      };

      const { error } = await submitTestResult(finalPayload);
      
      if (error) {
        throw new Error("Erro ao salvar os dados no banco");
      }
      
      dismissToast(toastId);
      showSuccess("Tudo pronto! Redirecionando...");
      
      setTimeout(() => navigate('/resultado'), 1000);
      
    } catch (error) {
      dismissToast(toastId);
      showError("Erro ao processar dados. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        <div className="bg-slate-900 p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 mb-4 shadow-lg shadow-emerald-500/30">
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Avaliação Concluída!</h1>
          <p className="text-slate-300 text-sm">
            Seu relatório personalizado já foi gerado e está pronto.
          </p>
        </div>
        
        <div className="p-8">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start mb-6 border border-blue-100">
            <Lock className="shrink-0 mr-3 mt-0.5 text-blue-600" size={18} />
            <p className="text-sm leading-relaxed">
              Para acessar seus resultados e liberar o download do PDF, por favor informe seus dados de contato para enviarmos uma cópia.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp *</label>
              <input
                type="tel"
                name="telefone"
                value={contactInfo.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className={`w-full p-3.5 rounded-xl border ${errors.whatsapp ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
              />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
              <input
                type="email"
                name="email"
                value={contactInfo.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className={`w-full p-3.5 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-all shadow-md flex items-center justify-center mt-2 disabled:opacity-70"
            >
              <FileText size={18} className="mr-2" />
              {isSubmitting ? 'Processando...' : 'Liberar Meu Resultado'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              Seus dados estão seguros. Não enviamos spam.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadCapture;