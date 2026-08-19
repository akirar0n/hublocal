import { z } from 'zod';
import { TipoProposta } from '@prisma/client';

export const createPropostaSchema = z.object({
  body: z.object({
    servico_id: z.number().positive('Serviço ID inválido.'),
    tipo_proposta: z.nativeEnum(TipoProposta, { required_error: 'Tipo de proposta inválido.' }),
    valor_oferecido: z.number().positive().optional(),
    descricao_permuta: z.string().optional()
  }).refine((data) => {
    if (data.tipo_proposta === TipoProposta.PERMUTA && !data.descricao_permuta) {
      return false;
    }
    if (data.tipo_proposta === TipoProposta.PADRAO && data.valor_oferecido === undefined) {
      return false;
    }
    return true;
  }, {
    message: 'Dados incompletos para o tipo de proposta.'
  })
});

export const propostaIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID inválido')
  })
});
