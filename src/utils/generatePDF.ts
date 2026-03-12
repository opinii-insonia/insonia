import jsPDF from "jspdf";
import { getRecommendations } from "@/data/recommendations";

export const generatePDF = (data: any) => {
  const doc = new jsPDF();
  const marginX = 20;
  let cursorY = 20;

  // Header
  doc.setFillColor(30, 58, 138); // Azul escuro
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("InsônIA", marginX, 23);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Relatório de Avaliação do Sono", 210 - marginX, 23, { align: "right" });

  cursorY = 50;
  
  // Informações Pessoais
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Dados do Paciente", marginX, cursorY);
  
  cursorY += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  
  const dateObj = new Date(data.data_resposta);
  const formattedDate = dateObj.toLocaleDateString('pt-BR') + ' às ' + dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  doc.text(`ID do Relatório: #${crypto.randomUUID().split('-')[0].toUpperCase()}`, marginX, cursorY);
  cursorY += 7;
  doc.text(`Data da Avaliação: ${formattedDate}`, marginX, cursorY);
  cursorY += 7;
  doc.text(`Nome: ${data.nome}`, marginX, cursorY);
  cursorY += 7;
  doc.text(`Idade: ${data.idade || 'N/A'} anos | Sexo: ${data.sexo || 'N/A'}`, marginX, cursorY);
  cursorY += 7;
  doc.text(`Contato: ${data.telefone} | ${data.email}`, marginX, cursorY);
  
  cursorY += 15;
  doc.setDrawColor(220, 220, 220);
  doc.line(marginX, cursorY, 210 - marginX, cursorY);
  cursorY += 10;
  
  // Resultados
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Resultados Clínicos", marginX, cursorY);
  cursorY += 10;

  // Box Epworth
  doc.setFillColor(245, 247, 255);
  doc.rect(marginX, cursorY, 80, 25, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 138);
  doc.text("Escala de Epworth", marginX + 5, cursorY + 8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(`Score: ${data.epworth_score} / 24`, marginX + 5, cursorY + 15);
  doc.setFont("helvetica", "bold");
  doc.text(data.epworth_classificacao.toUpperCase(), marginX + 5, cursorY + 22);

  // Box Insônia
  doc.setFillColor(245, 247, 255);
  doc.rect(marginX + 90, cursorY, 80, 25, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 58, 138);
  doc.text("Índice de Insônia", marginX + 95, cursorY + 8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(`Score: ${data.insomnia_score} / 28`, marginX + 95, cursorY + 15);
  doc.setFont("helvetica", "bold");
  doc.text(data.insomnia_classificacao.toUpperCase(), marginX + 95, cursorY + 22);

  cursorY += 35;

  // Nível de Atenção Geral
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Nível de Atenção Geral: ${data.overall_risk}`, marginX, cursorY);
  
  cursorY += 10;
  
  // Recomendações
  doc.setFontSize(14);
  doc.text("Recomendações Iniciais", marginX, cursorY);
  cursorY += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  
  const recs = getRecommendations(data.overall_risk);
  recs.forEach(rec => {
    doc.text(`• ${rec}`, marginX + 2, cursorY);
    cursorY += 7;
  });

  cursorY += 20;

  // Disclaimer
  doc.setFillColor(254, 242, 242); // Fundo avermelhado bem claro
  doc.rect(marginX, cursorY, 170, 25, 'F');
  doc.setTextColor(185, 28, 28); // Vermelho escuro
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("ATENÇÃO: Este relatório não substitui uma avaliação ou diagnóstico médico.", marginX + 5, cursorY + 8);
  doc.setFont("helvetica", "normal");
  doc.text("Os resultados apresentados são baseados em questionários de triagem auto-aplicáveis.", marginX + 5, cursorY + 14);
  doc.text("Procure sempre um profissional de saúde especializado para diagnóstico e tratamento.", marginX + 5, cursorY + 20);

  doc.save(`Relatorio_InsonIA_${data.nome.replace(/\s+/g, '_')}.pdf`);
};