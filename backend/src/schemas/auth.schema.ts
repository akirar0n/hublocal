import { z } from 'zod';
import { TipoUsuario } from '@prisma/client';

export const registerSchema = z.object({
  body: z.object({
    nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    email: z.string().email('E-mail inválido.'),
    senha: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres.'),
    cpf: z.string().length(11, 'CPF deve ter 11 dígitos.'),
    telefone: z.string().optional(),
    tipo: z.nativeEnum(TipoUsuario, { required_error: 'Tipo de usuário inválido.' }),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    endereco_texto: z.string().optional(),
    cidade: z.string().optional(),
    bairro: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('E-mail inválido.'),
    senha: z.string().min(1, 'A senha é obrigatória.')
  })
});
