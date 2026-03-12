export const getRecommendations = (riskLevel: string) => {
  switch (riskLevel) {
    case 'ALTO':
      return [
        "Recomendamos agendar uma consulta com um especialista em sono.",
        "Considere a realização de uma polissonografia.",
        "Evite conduzir veículos se estiver com muito sono."
      ];
    case 'MODERADO':
      return [
        "Melhore a higiene do sono (horários regulares, ambiente escuro).",
        "Reduza a ingestão de cafeína após as 14h.",
        "Monitore seus sintomas nas próximas semanas."
      ];
    default:
      return [
        "Mantenha seus bons hábitos de sono.",
        "Pratique exercícios físicos regularmente.",
        "Evite telas 1 hora antes de dormir."
      ];
  }
};