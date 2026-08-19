import { prisma } from './prismaClient';
import { Prisma } from '@prisma/client';

export class UsuarioRepository {
  async findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
      include: { localizacao: true }
    });
  }

  async findByCpf(cpf: string) {
    return prisma.usuario.findUnique({
      where: { cpf }
    });
  }

  async findById(id: number) {
    return prisma.usuario.findUnique({
      where: { id },
      include: { localizacao: true }
    });
  }

  async create(data: Prisma.UsuarioCreateInput) {
    return prisma.usuario.create({
      data,
      include: { localizacao: true }
    });
  }

  async update(id: number, data: Prisma.UsuarioUpdateInput) {
    return prisma.usuario.update({
      where: { id },
      data,
      include: { localizacao: true }
    });
  }
}
