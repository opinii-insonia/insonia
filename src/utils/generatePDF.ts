import jsPDF from "jspdf";

export const generatePDF = (data: any) => {
  const doc = new jsPDF();
  const marginX = 20;
  let cursorY = 20;

  // Estilo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(30, 58, 138); // Azul escuro
  doc.text("Relatório de Qualidade do Sono", marginX, cursorY);
  
  cursorY += 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  
  // Informações Pessoais
  doc.text(`Data da Avaliação: ${data.data_resposta}`, marginX, cursorY);
  cursorY += 10;
  doc.text(`Nome: ${data.nome}`, marginX, cursorY);
  cursorY += 10;
  doc.text(`Idade: ${data.idade} | Sexo: ${data.sexo}`, marginX, cursorY);
  cursorY += 10;
  doc.text(`Cidade: ${data.cidade}`, marginX, cursorY);
  
  cursorY += 20;
  
  // Resultado Epworth
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text("Escala de Sonolência de Epworth", marginX, cursorY);
  cursorY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Pontuação: ${data.epworth_score} / 24`, marginX, cursorY);
  cursorY += 10;
  doc.text(`Classificação: ${data.epworth_classificacao}`, marginX, cursorY);

  cursorY += 20;

  // Resultado Insônia
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text("Índice de Gravidade de Insônia", marginX, cursorY);
  cursorY += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Pontuação: ${data.insomnia_score} / 28`, marginX, cursorY);
  cursorY += 10;
  doc.text(`Classificação: ${data.insomnia_classificacao}`, marginX, cursorY);

  cursorY += 30;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Este é um relatório gerado automaticamente e não substitui avaliação médica.", marginX, cursorY);

  doc.save(`Resultado_Sono_${data.nome.replace(/\s+/g, '_')}.pdf`);
};