/**
 * Calcula a pontuação e classificação da Escala de Sonolência de Epworth
 * Pontuação máxima: 24
 */
export const calculateEpworth = (answers: number[]) => {
  const score = answers.reduce((acc, curr) => acc + curr, 0);
  
  let classification = "Normal";
  if (score >= 10 && score <= 12) classification = "Leve";
  else if (score >= 13 && score <= 15) classification = "Moderado";
  else if (score >= 16) classification = "Grave";

  return { score, classification };
};