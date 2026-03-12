export const calculateOverallRisk = (epworthClass: string, insomniaClass: string) => {
  const epworthStr = epworthClass.toLowerCase();
  const insomniaStr = insomniaClass.toLowerCase();

  // Se qualquer um dos testes der "grave", o risco é alto
  if (epworthStr.includes('grave') || insomniaStr.includes('grave')) {
    return 'ALTO';
  }
  
  // Se qualquer um der "moderado", o risco é moderado
  if (epworthStr.includes('moderado') || insomniaStr.includes('moderada')) {
    return 'MODERADO';
  }

  // Caso contrário, ambos são leves/normais
  return 'BAIXO';
};