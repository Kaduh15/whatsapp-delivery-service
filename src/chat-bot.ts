export class ChatBotHandler {
  handleMessage(_userId: string, _message: string): string {
    return 'Hello there!' // Exemplo: retorna uma mensagem fixa
  }

  isValidTrackingCode(_code: string): boolean {
    // Função para validar código de rastreamento
    return true // Supondo que todos os códigos são válidos para o exemplo
  }

  getDeliveryStatus(_trackingCode: string): string {
    // Função para obter o status da entrega com base no código de rastreamento
    return 'chega hoje' // Exemplo: retorna um status fixo
  }

  saveToDatabase(_userId: string, _trackingCode: string): void {
    // Função para salvar o código de rastreamento no banco de dados
  }
}
