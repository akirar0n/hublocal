import { prisma } from './prismaClient';
import { Prisma, StatusServico } from '@prisma/client';

export class ServicoRepository {
  async create(data: Prisma.ServicoUncheckedCreateInput) {
    return prisma.servico.create({
      data
    });
  }

  async findById(id: number) {
    return prisma.servico.findUnique({
      where: { id },
      include: {
        trabalhador: {
          include: { localizacao: true }
        }
      }
    });
  }

  async update(id: number, data: Prisma.ServicoUpdateInput) {
    return prisma.servico.update({
      where: { id },
      data
    });
  }

  async findAllAtivos() {
    return prisma.servico.findMany({
      where: { status: StatusServico.ATIVO },
      include: {
        trabalhador: {
          include: { localizacao: true }
        }
      }
    });
  }

  async delete(id: number) {
    return prisma.servico.delete({
      where: { id }
    });
  }
}
