export const calculateOverallRisk = (epworthScore: number, insomniaScore: number) => {
  if (epworthScore >= 16 || insomniaScore >= 22) return 'ALTO';
  if (epworthScore >= 10 || insomniaScore >= 15) return 'MODERADO';
  return 'BAIXO';
};