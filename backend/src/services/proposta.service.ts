import { PropostaRepository } from '../repositories/proposta.repository';
import { ServicoRepository } from '../repositories/servico.repository';
import { AppError } from '../utils/AppError';
import { TipoProposta, StatusProposta } from '@prisma/client';
import { MSG009, MSG010 } from '../utils/constants';

const propostaRepo = new PropostaRepository();
const servicoRepo = new ServicoRepository();

export class PropostaService {
  async create(cliente_id: number, data: any) {
    const servico = await servicoRepo.findById(data.servico_id);
    if (!servico) throw new AppError('Serviço não encontrado', 404, 'NOT_FOUND');
    if (servico.status !== 'ATIVO') throw new AppError('Serviço não está ativo', 400, 'BAD_REQUEST');
    if (servico.trabalhador_id === cliente_id) throw new AppError('Você não pode solicitar seu próprio serviço', 400, 'BAD_REQUEST');

    if (data.tipo_proposta === TipoProposta.PERMUTA && !servico.aceita_permuta) {
      throw new AppError('Este serviço não aceita permuta', 400, 'BAD_REQUEST');
    }

    const novaProposta = await propostaRepo.create({
      servico_id: data.servico_id,
      cliente_id,
      trabalhador_id: servico.trabalhador_id,
      tipo_proposta: data.tipo_proposta,
      valor_oferecido: data.valor_oferecido,
      descricao_permuta: data.descricao_permuta,
      status: StatusProposta.PENDENTE
    });

    const msg = data.tipo_proposta === TipoProposta.PERMUTA ? MSG010 : MSG009;

    return { message: msg, proposta: novaProposta };
  }

  async getMyPropostas(usuario_id: number, tipo: 'CLIENTE' | 'TRABALHADOR') {
    let propostas = [];
    if (tipo === 'CLIENTE') {
      propostas = await propostaRepo.findByClienteId(usuario_id);
    } else {
      propostas = await propostaRepo.findByTrabalhadorId(usuario_id);
    }

    // Regra: Esconder telefone se a proposta não estiver aceita/andamento/concluida
    return propostas.map(p => {
      const isAprovada = ['ACEITA', 'EM_ANDAMENTO', 'CONCLUIDA'].includes(p.status);
      
      if (tipo === 'CLIENTE' && p.trabalhador && !isAprovada) {
        p.trabalhador.telefone = null;
      }
      if (tipo === 'TRABALHADOR' && p.cliente && !isAprovada) {
        p.cliente.telefone = null;
      }

      return p;
    });
  }

  async getById(id: number, usuario_id: number) {
    const p = await propostaRepo.findById(id);
    if (!p) throw new AppError('Proposta não encontrada', 404, 'NOT_FOUND');
    
    if (p.cliente_id !== usuario_id && p.trabalhador_id !== usuario_id) {
      throw new AppError('Acesso negado', 403, 'FORBIDDEN');
    }

    const isAprovada = ['ACEITA', 'EM_ANDAMENTO', 'CONCLUIDA'].includes(p.status);
    
    if (p.cliente_id === usuario_id && !isAprovada) {
      p.trabalhador.telefone = null;
      p.trabalhador.senha_hash = '';
    } else if (p.trabalhador_id === usuario_id && !isAprovada) {
      p.cliente.telefone = null;
      p.cliente.senha_hash = '';
    }

    return p;
  }

  // Máquina de Estados
  private transicaoValida(atual: StatusProposta, novo: StatusProposta): boolean {
    const transicoes = {
      [StatusProposta.PENDENTE]: [StatusProposta.ACEITA, StatusProposta.RECUSADA, StatusProposta.CANCELADA],
      [StatusProposta.ACEITA]: [StatusProposta.EM_ANDAMENTO, StatusProposta.CANCELADA],
      [StatusProposta.RECUSADA]: [],
      [StatusProposta.EM_ANDAMENTO]: [StatusProposta.CONCLUIDA, StatusProposta.CANCELADA],
      [StatusProposta.CONCLUIDA]: [],
      [StatusProposta.CANCELADA]: []
    };

    return transicoes[atual].includes(novo);
  }

  async updateStatus(id: number, usuario_id: number, tipo_usuario: 'CLIENTE' | 'TRABALHADOR', novoStatus: StatusProposta) {
    const p = await propostaRepo.findById(id);
    if (!p) throw new AppError('Proposta não encontrada', 404, 'NOT_FOUND');

    // Validação de ownership e regras de transição baseadas em quem solicita
    if (novoStatus === StatusProposta.ACEITA || novoStatus === StatusProposta.RECUSADA) {
      if (tipo_usuario !== 'TRABALHADOR' || p.trabalhador_id !== usuario_id) {
        throw new AppError('Apenas o trabalhador pode aceitar/recusar', 403, 'FORBIDDEN');
      }
    }

    if (novoStatus === StatusProposta.EM_ANDAMENTO || novoStatus === StatusProposta.CONCLUIDA) {
      if (tipo_usuario !== 'TRABALHADOR' || p.trabalhador_id !== usuario_id) {
        throw new AppError('Apenas o trabalhador pode iniciar/concluir', 403, 'FORBIDDEN');
      }
    }

    if (novoStatus === StatusProposta.CANCELADA) {
      if (p.cliente_id !== usuario_id && p.trabalhador_id !== usuario_id) {
        throw new AppError('Acesso negado', 403, 'FORBIDDEN');
      }
    }

    if (!this.transicaoValida(p.status, novoStatus)) {
      throw new AppError(`Transição inválida de ${p.status} para ${novoStatus}`, 400, 'BAD_REQUEST');
    }

    const updated = await propostaRepo.updateStatus(id, novoStatus);
    return updated;
  }
}
