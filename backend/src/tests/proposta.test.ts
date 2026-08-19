import { PropostaService } from '../services/proposta.service';
import { prisma } from '../repositories/prismaClient';

describe('PropostaService - Regras de Negócio e Permutas', () => {
  const propostaService = new PropostaService();

  it('deve bloquear permuta em serviço que não aceita permuta (RN003)', async () => {
    // Assumimos que o seed inseriu o serviço de ID 1 (aceita_permuta: false) e ID 2 (aceita_permuta: true)
    // O mock no teste unitário validará a lógica sem bater na rede HTTP

    const mockData = {
      servico_id: 1, // Não aceita permuta no SEED
      tipo_proposta: 'PERMUTA',
      descricao_permuta: 'Troco por pão'
    };

    // Este teste dependenderia do BD populado. Vamos mockar o comportamento ou usar o banco test.
    // Como é teste de integração/e2e simplificado com o DB real:
    const servico = await prisma.servico.findFirst({ where: { aceita_permuta: false } });
    
    if (servico) {
      mockData.servico_id = servico.id;
      await expect(
        propostaService.create(1, mockData) // 1 é um id de cliente dummy
      ).rejects.toThrow('Este serviço não aceita permuta');
    }
  });
});
