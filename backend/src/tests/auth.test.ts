import { AuthService } from '../services/auth.service';
import { prisma } from '../repositories/prismaClient';

describe('AuthService - Regras de Negócio', () => {
  const authService = new AuthService();

  beforeAll(async () => {
    // limpar para o teste
    await prisma.usuario.deleteMany({ where: { email: 'teste@jest.com' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve cadastrar um usuário válido (RN001 e RN002)', async () => {
    const data = {
      nome: 'Teste Jest',
      email: 'teste@jest.com',
      senha: 'password123',
      cpf: '99988877766',
      tipo: 'CLIENTE'
    };

    const res = await authService.register(data);
    expect(res.message).toBeDefined();
    expect(res.user).toHaveProperty('id');
    expect(res.user).not.toHaveProperty('senha_hash');
  });

  it('não deve permitir cadastro com e-mail duplicado', async () => {
    const data = {
      nome: 'Teste Clone',
      email: 'teste@jest.com',
      senha: 'password123',
      cpf: '11122233344',
      tipo: 'CLIENTE'
    };

    await expect(authService.register(data)).rejects.toThrow('O e-mail ou CPF informado já está em uso.');
  });

  it('deve gerar link e token de recuperação para e-mail cadastrado', async () => {
    const res = await authService.forgotPassword('teste@jest.com');
    expect(res.message).toBeDefined();
    expect(res.token).toBeDefined();
    expect(res.devResetUrl).toContain('/redefinir-senha?token=');
  });

  it('deve redefinir a senha com token válido e permitir novo login', async () => {
    const forgotRes = await authService.forgotPassword('teste@jest.com');
    const resetRes = await authService.resetPassword(forgotRes.token!, 'novasenha456');
    expect(resetRes.message).toBeDefined();

    // Login com a nova senha deve funcionar
    const loginRes = await authService.login('teste@jest.com', 'novasenha456');
    expect(loginRes.token).toBeDefined();

    // Token antigo não deve mais funcionar pois o hash mudou
    await expect(authService.resetPassword(forgotRes.token!, 'outrasenha789')).rejects.toThrow();
  });
});

