import { Lead } from '@/services/storage';

export const exportLeadsToCSV = (leads: Lead[]) => {
  if (!leads || leads.length === 0) return;

  // Define the headers
  const headers = [
    'ID', 
    'Data Avaliacao', 
    'Nome', 
    'Idade', 
    'Sexo', 
    'Cidade', 
    'Telefone', 
    'Email',
    'Epworth Score', 
    'Epworth Classificacao', 
    'Insonia Score', 
    'Insonia Classificacao',
    'Risco Geral', 
    'Status Atendimento', 
    'Prioridade'
  ];

  // Helper to safely format strings for CSV (handling commas, etc.)
  const escapeCSV = (value: string | number | undefined | null) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Build the CSV content
  const csvContent = [
    headers.join(','),
    ...leads.map(lead => [
      escapeCSV(lead.id),
      escapeCSV(new Date(lead.data_resposta).toLocaleDateString('pt-BR')),
      escapeCSV(lead.nome),
      escapeCSV(lead.idade),
      escapeCSV(lead.sexo),
      escapeCSV(lead.cidade),
      escapeCSV(lead.telefone),
      escapeCSV(lead.email),
      escapeCSV(lead.epworth_score),
      escapeCSV(lead.epworth_classificacao),
      escapeCSV(lead.insomnia_score),
      escapeCSV(lead.insomnia_classificacao),
      escapeCSV(lead.overall_risk),
      escapeCSV(lead.status),
      escapeCSV(lead.prioridade)
    ].join(','))
  ].join('\n');

  // Create a Blob and trigger download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for Excel UTF-8 BOM
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `leads_insonia_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};