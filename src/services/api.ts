import { saveLead } from './storage';
import { calculateOverallRisk } from '@/utils/calculateOverallRisk';

export const submitTestResult = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const risk = calculateOverallRisk(data.epworth_classificacao, data.insomnia_classificacao);
      
      saveLead({
        ...data,
        overall_risk: risk
      });

      resolve({ success: true, message: "Dados salvos com sucesso!" });
    }, 1000);
  });
};