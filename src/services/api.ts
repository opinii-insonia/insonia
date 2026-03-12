import { saveLead } from './storage';
import { calculateOverallRisk } from '@/utils/calculateOverallRisk';

export const submitTestResult = async (data: any) => {
  // Simula um delay de rede
  return new Promise((resolve) => {
    setTimeout(() => {
      const risk = calculateOverallRisk(data.epworth_score, data.insomnia_score);
      
      saveLead({
        ...data,
        data_resposta: new Date().toISOString(),
        overall_risk: risk
      });

      resolve({ success: true, message: "Dados salvos com sucesso!" });
    }, 1000);
  });
};