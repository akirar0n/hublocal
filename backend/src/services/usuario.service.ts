import { UsuarioRepository } from '../repositories/usuario.repository';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client';

const usuarioRepo = new UsuarioRepository();

export class UsuarioService {
  async updateProfile(userId: number, data: { nome?: string; email?: string; telefone?: string }) {
    const user = await usuarioRepo.findById(userId);
    if (!user) throw new AppError('Usuário não encontrado', 404, 'NOT_FOUND');

    if (data.email && data.email !== user.email) {
      const emailExists = await usuarioRepo.findByEmail(data.email);
      if (emailExists) throw new AppError('E-mail já está em uso', 400, 'BAD_REQUEST');
    }

    const updateData: Prisma.UsuarioUpdateInput = {};
    if (data.nome) updateData.nome = data.nome;
    if (data.email) updateData.email = data.email;
    if (data.telefone !== undefined) updateData.telefone = data.telefone;

    const updatedUser = await usuarioRepo.update(userId, updateData);
    
    const { senha_hash, cpf, ...safeUser } = updatedUser;
    
    return safeUser;
  }
}
