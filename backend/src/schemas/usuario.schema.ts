import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
    email: z.string().email('E-mail inválido').optional(),
    telefone: z.string().min(10, 'Telefone inválido').optional()
  })
});
