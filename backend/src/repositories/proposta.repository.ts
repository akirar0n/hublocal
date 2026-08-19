import { prisma } from './prismaClient';
import { Prisma, StatusProposta } from '@prisma/client';

export class PropostaRepository {
  async create(data: Prisma.PropostaUncheckedCreateInput) {
    return prisma.proposta.create({
      data,
      include: {
        servico: true,
        cliente: true,
        trabalhador: true
      }
    });
  }

  async findById(id: number) {
    return prisma.proposta.findUnique({
      where: { id },
      include: {
        servico: true,
        cliente: true,
        trabalhador: true
      }
    });
  }

  async findByClienteId(cliente_id: number) {
    return prisma.proposta.findMany({
      where: { cliente_id },
      include: {
        servico: true,
        trabalhador: {
          select: { id: true, nome: true, foto_url: true, telefone: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findByTrabalhadorId(trabalhador_id: number) {
    return prisma.proposta.findMany({
      where: { trabalhador_id },
      include: {
        servico: true,
        cliente: {
          select: { id: true, nome: true, foto_url: true, telefone: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async updateStatus(id: number, status: StatusProposta) {
    return prisma.proposta.update({
      where: { id },
      data: { status },
      include: {
        servico: true,
        cliente: true,
        trabalhador: true
      }
    });
  }
}
