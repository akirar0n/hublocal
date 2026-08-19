import { z } from 'zod';

export const createAvaliacaoSchema = z.object({
  body: z.object({
    proposta_id: z.number().positive('Proposta ID inválido.'),
    estrelas: z.number().min(1).max(5, 'Estrelas devem estar entre 1 e 5.'),
    comentario: z.string().optional()
  })
});
