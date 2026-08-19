import { z } from 'zod';
import { StatusServico } from '@prisma/client';

export const createServicoSchema = z.object({
  body: z.object({
    titulo: z.string().min(3, 'O título é obrigatório.'),
    descricao: z.string().min(5, 'A descrição é obrigatória.'),
    categoria: z.string().min(2, 'A categoria é obrigatória.'),
    orcamento_base: z.number().positive('O orçamento base deve ser maior que zero.'),
    aceita_permuta: z.boolean().optional()
  })
});

export const updateServicoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID inválido')
  }),
  body: z.object({
    titulo: z.string().optional(),
    descricao: z.string().optional(),
    categoria: z.string().optional(),
    orcamento_base: z.number().positive().optional(),
    aceita_permuta: z.boolean().optional()
  })
});

export const changeStatusServicoSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID inválido')
  }),
  body: z.object({
    status: z.nativeEnum(StatusServico, { required_error: 'Status inválido.' })
  })
});
