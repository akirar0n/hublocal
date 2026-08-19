import { ServicoRepository } from '../repositories/servico.repository';
import { AppError } from '../utils/AppError';
import { StatusServico, Prisma } from '@prisma/client';
import { MSG008 } from '../utils/constants';
import { calcularDistanciaHaversine } from '../utils/haversine';
import { UsuarioRepository } from '../repositories/usuario.repository';

const servicoRepo = new ServicoRepository();
const usuarioRepo = new UsuarioRepository();

export class ServicoService {
  async create(trabalhador_id: number, data: any) {
    const servicoData: Prisma.ServicoUncheckedCreateInput = {
      trabalhador_id,
      titulo: data.titulo,
      descricao: data.descricao,
      categoria: data.categoria,
      orcamento_base: data.orcamento_base,
      aceita_permuta: data.aceita_permuta ?? false,
      status: StatusServico.ATIVO
    };

    const newServico = await servicoRepo.create(servicoData);

    return {
      message: MSG008,
      servico: newServico
    };
  }

  async update(id: number, trabalhador_id: number, data: any) {
    const servico = await servicoRepo.findById(id);
    if (!servico) throw new AppError('Serviço não encontrado', 404, 'NOT_FOUND');
    if (servico.trabalhador_id !== trabalhador_id) throw new AppError('Acesso negado', 403, 'FORBIDDEN');

    const updated = await servicoRepo.update(id, data);
    return updated;
  }

  async changeStatus(id: number, trabalhador_id: number, status: StatusServico) {
    const servico = await servicoRepo.findById(id);
    if (!servico) throw new AppError('Serviço não encontrado', 404, 'NOT_FOUND');
    if (servico.trabalhador_id !== trabalhador_id) throw new AppError('Acesso negado', 403, 'FORBIDDEN');

    const updated = await servicoRepo.update(id, { status });
    return updated;
  }

  async delete(id: number, trabalhador_id: number) {
    const servico = await servicoRepo.findById(id);
    if (!servico) throw new AppError('Serviço não encontrado', 404, 'NOT_FOUND');
    if (servico.trabalhador_id !== trabalhador_id) throw new AppError('Acesso negado', 403, 'FORBIDDEN');

    await servicoRepo.delete(id);
    return true;
  }

  async findById(id: number) {
    const servico = await servicoRepo.findById(id);
    if (!servico) throw new AppError('Serviço não encontrado', 404, 'NOT_FOUND');
    
    // Ocultar dados sensíveis
    const { senha_hash, cpf, ...trabalhadorSafe } = servico.trabalhador;
    
    // Ocultar telefone/whatsapp no serviço puro (só libera na proposta)
    trabalhadorSafe.telefone = null;
    
    return { ...servico, trabalhador: trabalhadorSafe };
  }

  async search(query: any) {
    let servicos = await servicoRepo.findAllAtivos();

    // Filtro por Categoria
    if (query.categoria) {
      servicos = servicos.filter(s => s.categoria.toLowerCase() === String(query.categoria).toLowerCase());
    }

    // Filtro de Preço
    if (query.precoMin) {
      servicos = servicos.filter(s => Number(s.orcamento_base) >= Number(query.precoMin));
    }
    if (query.precoMax) {
      servicos = servicos.filter(s => Number(s.orcamento_base) <= Number(query.precoMax));
    }

    let resultados = servicos.map(s => {
      const { senha_hash, cpf, telefone, ...trabSafe } = s.trabalhador;
      let distanciaKm = null;

      // Calcular distância se o cliente enviou latitude/longitude
      if (query.latitude && query.longitude && trabSafe.localizacao) {
        distanciaKm = calcularDistanciaHaversine(
          Number(query.latitude),
          Number(query.longitude),
          trabSafe.localizacao.latitude,
          trabSafe.localizacao.longitude
        );
      }

      return {
        id: s.id,
        titulo: s.titulo,
        categoria: s.categoria,
        descricao: s.descricao,
        orcamentoBase: s.orcamento_base,
        aceita_permuta: s.aceita_permuta,
        trabalhador: trabSafe,
        distanciaKm
      };
    });

    // Filtro por Raio
    if (query.raio && query.latitude && query.longitude) {
      const raio = Number(query.raio);
      resultados = resultados.filter(s => s.distanciaKm !== null && s.distanciaKm <= raio);
    }

    // Ordenar pela menor distância
    resultados.sort((a, b) => {
      if (a.distanciaKm === null) return 1;
      if (b.distanciaKm === null) return -1;
      return a.distanciaKm - b.distanciaKm;
    });

    return resultados;
  }
}
