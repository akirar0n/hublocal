import { prisma } from './prismaClient';
import { Prisma } from '@prisma/client';

export class AvaliacaoRepository {
  async create(data: Prisma.AvaliacaoUncheckedCreateInput) {
    return prisma.avaliacao.create({
      data
    });
  }

  async findByPropostaId(proposta_id: number) {
    return prisma.avaliacao.findUnique({
      where: { proposta_id }
    });
  }

  async getMediaTrabalhador(trabalhador_id: number) {
    const agg = await prisma.avaliacao.aggregate({
      where: { trabalhador_id },
      _avg: { estrelas: true },
      _count: { estrelas: true }
    });
    
    return {
      media: agg._avg.estrelas || 0,
      total: agg._count.estrelas || 0
    };
  }

  async findByTrabalhador(trabalhador_id: number) {
    return prisma.avaliacao.findMany({
      where: { trabalhador_id },
      include: {
        cliente: { select: { id: true, nome: true, foto_url: true } }
      },
      orderBy: { data_avaliacao: 'desc' }
    });
  }
}
