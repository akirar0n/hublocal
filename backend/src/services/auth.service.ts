import { UsuarioRepository } from '../repositories/usuario.repository';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Prisma } from '@prisma/client';
import { MSG001, MSG002, MSG004 } from '../utils/constants';

const usuarioRepo = new UsuarioRepository();

export class AuthService {
  async register(data: any) {
    // Verificar duplicatas
    const [existEmail, existCpf] = await Promise.all([
      usuarioRepo.findByEmail(data.email),
      usuarioRepo.findByCpf(data.cpf)
    ]);

    if (existEmail || existCpf) {
      throw new AppError(MSG002, 409, 'USER_EXISTS');
    }

    const senha_hash = await bcrypt.hash(data.senha, 10);

    const createData: Prisma.UsuarioCreateInput = {
      nome: data.nome,
      email: data.email,
      senha_hash,
      cpf: data.cpf,
      telefone: data.telefone,
      tipo: data.tipo,
      foto_url: data.foto_url
    };

    if (data.latitude && data.longitude) {
      createData.localizacao = {
        create: {
          latitude: data.latitude,
          longitude: data.longitude,
          endereco_texto: data.endereco_texto,
          cidade: data.cidade,
          bairro: data.bairro
        }
      };
    }

    const newUser = await usuarioRepo.create(createData);

    const { senha_hash: _, ...userWithoutPassword } = newUser;

    return {
      message: MSG004,
      user: userWithoutPassword
    };
  }

  async login(email: string, senha: string) {
    const user = await usuarioRepo.findByEmail(email);

    if (!user) {
      throw new AppError(MSG001, 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(senha, user.senha_hash);

    if (!isMatch) {
      throw new AppError(MSG001, 401, 'INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    const { senha_hash: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  }

  async getMe(id: number) {
    const user = await usuarioRepo.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404, 'NOT_FOUND');
    const { senha_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
