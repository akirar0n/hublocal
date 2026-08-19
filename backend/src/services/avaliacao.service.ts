import { AvaliacaoRepository } from '../repositories/avaliacao.repository';
import { PropostaRepository } from '../repositories/proposta.repository';
import { AppError } from '../utils/AppError';
import { MSG012 } from '../utils/constants';

const avaliacaoRepo = new AvaliacaoRepository();
const propostaRepo = new PropostaRepository();

export class AvaliacaoService {
  async create(cliente_id: number, data: any) {
    const proposta = await propostaRepo.findById(data.proposta_id);
    
    if (!proposta) throw new AppError('Proposta não encontrada', 404, 'NOT_FOUND');
    if (proposta.cliente_id !== cliente_id) throw new AppError('Apenas o cliente pode avaliar a proposta', 403, 'FORBIDDEN');
    if (proposta.status !== 'CONCLUIDA') throw new AppError('Apenas propostas concluídas podem ser avaliadas', 400, 'BAD_REQUEST');

    const avaliacaoExistente = await avaliacaoRepo.findByPropostaId(proposta.id);
    if (avaliacaoExistente) throw new AppError('Proposta já avaliada', 409, 'CONFLICT');

    const novaAvaliacao = await avaliacaoRepo.create({
      proposta_id: proposta.id,
      cliente_id,
      trabalhador_id: proposta.trabalhador_id,
      estrelas: data.estrelas,
      comentario: data.comentario
    });

    return { message: MSG012, avaliacao: novaAvaliacao };
  }

  async getTrabalhadorReviews(trabalhador_id: number) {
    return avaliacaoRepo.findByTrabalhador(trabalhador_id);
  }

  async getTrabalhadorMedia(trabalhador_id: number) {
    return avaliacaoRepo.getMediaTrabalhador(trabalhador_id);
  }
}
