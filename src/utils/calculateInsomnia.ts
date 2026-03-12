/**
 * Calcula a pontuação e classificação do Índice de Gravidade de Insônia
 * Pontuação máxima: 28
 */
export const calculateInsomnia = (answers: number[]) => {
  const score = answers.reduce((acc, curr) => acc + curr, 0);
  
  let classification = "Ausência de insônia";
  if (score >= 8 && score <= 14) classification = "Leve";
  else if (score >= 15 && score <= 21) classification = "Moderada";
  else if (score >= 22) classification = "Grave";

  return { score, classification };
};