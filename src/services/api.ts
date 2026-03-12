/**
 * Simula o envio de dados para uma API REST ou Supabase.
 * Prepara o objeto completo para inserção no banco de dados.
 */
export const submitTestResult = async (data: any) => {
  console.log("=== ENVIANDO DADOS PARA O SERVIDOR ===");
  console.log("Payload estruturado para banco de dados:");
  console.log(JSON.stringify(data, null, 2));
  
  // Simula um delay de rede
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Dados salvos com sucesso!" });
    }, 1000);
  });
};