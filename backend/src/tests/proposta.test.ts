import { PropostaService } from '../services/proposta.service';
import { prisma } from '../repositories/prismaClient';

describe('PropostaService - Regras de Negócio e Permutas', () => {
  const propostaService = new PropostaService();

  it('deve bloquear permuta em serviço que não aceita permuta (RN003)', async () => {
    const mockData = {
      servico_id: 1,
      tipo_proposta: 'PERMUTA',
      descricao_permuta: 'Troco por pão'
    };
    const servico = await prisma.servico.findFirst({ where: { aceita_permuta: false } });
    
    if (servico) {
      mockData.servico_id = servico.id;
      await expect(
        propostaService.create(1, mockData) // 1 é um id de cliente dummy
      ).rejects.toThrow('Este serviço não aceita permuta');
    }
  });
});
