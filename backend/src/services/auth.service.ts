import { UsuarioRepository } from '../repositories/usuario.repository';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Prisma } from '@prisma/client';
import { MSG001, MSG002, MSG004, MSG013, MSG014, MSG015 } from '../utils/constants';

const usuarioRepo = new UsuarioRepository();

export class AuthService {
  async register(data: any) {
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
      { expiresIn: env.JWT_EXPIRES_IN } as any
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

  async forgotPassword(email: string) {
    const user = await usuarioRepo.findByEmail(email);

    if (!user) {
      return {
        message: MSG013
      };
    }

    const resetSecret = `${env.JWT_SECRET}-${user.senha_hash}`;
    const token = jwt.sign(
      { id: user.id, email: user.email, type: 'password_reset' },
      resetSecret,
      { expiresIn: '1h' } as any
    );

    const resetUrl = `${env.FRONTEND_URL}/redefinir-senha?token=${token}`;

    console.log('\n======================================================');
    console.log(`[RECUPERAÇÃO DE SENHA] Solicitação para: ${user.email}`);
    console.log(`[RECUPERAÇÃO DE SENHA] Link: ${resetUrl}`);
    console.log('======================================================\n');

    return {
      message: MSG013,
      devResetUrl: resetUrl,
      token
    };
  }

  async resetPassword(token: string, novaSenha: string) {
    let decoded: any;
    try {
      decoded = jwt.decode(token);
    } catch {
      throw new AppError(MSG015, 400, 'INVALID_TOKEN');
    }

    if (!decoded || !decoded.id || decoded.type !== 'password_reset') {
      throw new AppError(MSG015, 400, 'INVALID_TOKEN');
    }

    const user = await usuarioRepo.findById(decoded.id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404, 'NOT_FOUND');
    }

    const resetSecret = `${env.JWT_SECRET}-${user.senha_hash}`;
    try {
      jwt.verify(token, resetSecret);
    } catch {
      throw new AppError(MSG015, 400, 'EXPIRED_OR_INVALID_TOKEN');
    }

    const senha_hash = await bcrypt.hash(novaSenha, 10);
    await usuarioRepo.update(user.id, { senha_hash });

    return {
      message: MSG014
    };
  }
}

