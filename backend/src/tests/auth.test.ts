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
});
