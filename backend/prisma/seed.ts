import { PrismaClient, TipoUsuario, StatusServico, TipoProposta, StatusProposta } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o Seed do Banco de Dados...');

  const senha_hash = await bcrypt.hash('senha123', 10);

  // 1. Criar Clientes (2 clientes)
  const cliente1 = await prisma.usuario.upsert({
    where: { email: 'cliente1@teste.com' },
    update: {},
    create: {
      nome: 'Carlos Silva',
      email: 'cliente1@teste.com',
      senha_hash,
      cpf: '11111111111',
      telefone: '11999999991',
      tipo: TipoUsuario.CLIENTE,
      foto_url: 'https://i.pravatar.cc/150?u=carlos',
      localizacao: {
        create: {
          latitude: -23.5505,
          longitude: -46.6333,
          endereco_texto: 'Centro, São Paulo, SP',
          cidade: 'São Paulo',
          bairro: 'Centro'
        }
      }
    }
  });

  const cliente2 = await prisma.usuario.upsert({
    where: { email: 'cliente2@teste.com' },
    update: {},
    create: {
      nome: 'Ana Oliveira',
      email: 'cliente2@teste.com',
      senha_hash,
      cpf: '22222222222',
      telefone: '11999999992',
      tipo: TipoUsuario.CLIENTE,
      foto_url: 'https://i.pravatar.cc/150?u=ana',
      localizacao: {
        create: {
          latitude: -23.5615,
          longitude: -46.6560,
          endereco_texto: 'Avenida Paulista, São Paulo, SP',
          cidade: 'São Paulo',
          bairro: 'Bela Vista'
        }
      }
    }
  });

  // 2. Criar Trabalhadores (5 trabalhadores)
  const trab1 = await prisma.usuario.upsert({
    where: { email: 'trab1@teste.com' },
    update: {},
    create: {
      nome: 'João Eletricista',
      email: 'trab1@teste.com',
      senha_hash,
      cpf: '33333333333',
      telefone: '11999999993',
      tipo: TipoUsuario.TRABALHADOR,
      foto_url: 'https://i.pravatar.cc/150?u=joao',
      localizacao: {
        create: {
          latitude: -23.5501,
          longitude: -46.6339,
          cidade: 'São Paulo',
          bairro: 'Liberdade'
        }
      }
    }
  });

  const trab2 = await prisma.usuario.upsert({
    where: { email: 'trab2@teste.com' },
    update: {},
    create: {
      nome: 'Maria Encanadora',
      email: 'trab2@teste.com',
      senha_hash,
      cpf: '44444444444',
      telefone: '11999999994',
      tipo: TipoUsuario.TRABALHADOR,
      foto_url: 'https://i.pravatar.cc/150?u=maria',
      localizacao: {
        create: {
          latitude: -23.5521,
          longitude: -46.6349,
          cidade: 'São Paulo',
          bairro: 'Sé'
        }
      }
    }
  });

  const trab3 = await prisma.usuario.upsert({
    where: { email: 'trab3@teste.com' },
    update: {},
    create: {
      nome: 'Pedro Pedreiro',
      email: 'trab3@teste.com',
      senha_hash,
      cpf: '55555555555',
      telefone: '11999999995',
      tipo: TipoUsuario.TRABALHADOR,
      foto_url: 'https://i.pravatar.cc/150?u=pedro',
      localizacao: {
        create: {
          latitude: -23.5600,
          longitude: -46.6500,
          cidade: 'São Paulo',
          bairro: 'Consolação'
        }
      }
    }
  });

  const trab4 = await prisma.usuario.upsert({
    where: { email: 'trab4@teste.com' },
    update: {},
    create: {
      nome: 'Lucas Pintor',
      email: 'trab4@teste.com',
      senha_hash,
      cpf: '66666666666',
      telefone: '11999999996',
      tipo: TipoUsuario.TRABALHADOR,
      foto_url: 'https://i.pravatar.cc/150?u=lucas',
      localizacao: {
        create: {
          latitude: -23.5400,
          longitude: -46.6400,
          cidade: 'São Paulo',
          bairro: 'República'
        }
      }
    }
  });

  const trab5 = await prisma.usuario.upsert({
    where: { email: 'trab5@teste.com' },
    update: {},
    create: {
      nome: 'Fernanda Diarista',
      email: 'trab5@teste.com',
      senha_hash,
      cpf: '77777777777',
      telefone: '11999999997',
      tipo: TipoUsuario.TRABALHADOR,
      foto_url: 'https://i.pravatar.cc/150?u=fernanda',
      localizacao: {
        create: {
          latitude: -23.5300,
          longitude: -46.6300,
          cidade: 'São Paulo',
          bairro: 'Luz'
        }
      }
    }
  });

  // 3. Criar Serviços (8 serviços)
  await prisma.servico.deleteMany(); // Limpar serviços para re-seed limpo

  const servicos = await prisma.servico.createMany({
    data: [
      {
        trabalhador_id: trab1.id,
        titulo: 'Instalação de Chuveiro',
        descricao: 'Instalo seu chuveiro elétrico com segurança.',
        categoria: 'Eletricista',
        orcamento_base: 80.00,
        aceita_permuta: false,
        status: StatusServico.ATIVO
      },
      {
        trabalhador_id: trab1.id,
        titulo: 'Troca de Fiação',
        descricao: 'Revisão e troca completa da fiação da casa.',
        categoria: 'Eletricista',
        orcamento_base: 500.00,
        aceita_permuta: true,
        status: StatusServico.ATIVO
      },
      {
        trabalhador_id: trab2.id,
        titulo: 'Conserto de Vazamentos',
        descricao: 'Arrumo vazamentos em pias e canos.',
        categoria: 'Encanador',
        orcamento_base: 120.00,
        aceita_permuta: false,
        status: StatusServico.ATIVO
      },
      {
        trabalhador_id: trab2.id,
        titulo: 'Instalação de Vaso Sanitário',
        descricao: 'Instalação completa e vedação.',
        categoria: 'Encanador',
        orcamento_base: 150.00,
        aceita_permuta: true,
        status: StatusServico.ATIVO
      },
      {
        trabalhador_id: trab3.id,
        titulo: 'Reboco de Parede',
        descricao: 'Serviço de reboco e alvenaria.',
        categoria: 'Pedreiro',
        orcamento_base: 300.00,
        aceita_permuta: true,
        status: StatusServico.ATIVO
      },
      {
        trabalhador_id: trab4.id,
        titulo: 'Pintura Interna',
        descricao: 'Pintura de salas e quartos, material por conta do cliente.',
        categoria: 'Pintor',
        orcamento_base: 400.00,
        aceita_permuta: false,
        status: StatusServico.ATIVO
      },
      {
        trabalhador_id: trab5.id,
        titulo: 'Faxina Completa',
        descricao: 'Limpeza pesada em toda a casa.',
        categoria: 'Diarista',
        orcamento_base: 180.00,
        aceita_permuta: true,
        status: StatusServico.ATIVO
      },
      {
        trabalhador_id: trab5.id,
        titulo: 'Passar Roupa',
        descricao: 'Diária de passar roupas variadas.',
        categoria: 'Diarista',
        orcamento_base: 100.00,
        aceita_permuta: false,
        status: StatusServico.ATIVO
      }
    ]
  });

  const todosServicos = await prisma.servico.findMany();

  // 4. Criar Propostas
  await prisma.proposta.deleteMany();

  // Proposta 1: Pendente
  await prisma.proposta.create({
    data: {
      servico_id: todosServicos[0].id,
      cliente_id: cliente1.id,
      trabalhador_id: todosServicos[0].trabalhador_id,
      tipo_proposta: TipoProposta.PADRAO,
      valor_oferecido: 80.00,
      status: StatusProposta.PENDENTE
    }
  });

  // Proposta 2: Aceita
  await prisma.proposta.create({
    data: {
      servico_id: todosServicos[2].id,
      cliente_id: cliente2.id,
      trabalhador_id: todosServicos[2].trabalhador_id,
      tipo_proposta: TipoProposta.PADRAO,
      valor_oferecido: 120.00,
      status: StatusProposta.ACEITA
    }
  });

  // Proposta 3: Recusada (Permuta em servico que aceita permuta mas o trab recusou)
  await prisma.proposta.create({
    data: {
      servico_id: todosServicos[6].id,
      cliente_id: cliente1.id,
      trabalhador_id: todosServicos[6].trabalhador_id,
      tipo_proposta: TipoProposta.PERMUTA,
      descricao_permuta: 'Troco por manutenção no seu computador.',
      status: StatusProposta.RECUSADA
    }
  });

  // Proposta 4: Em Andamento
  await prisma.proposta.create({
    data: {
      servico_id: todosServicos[4].id,
      cliente_id: cliente2.id,
      trabalhador_id: todosServicos[4].trabalhador_id,
      tipo_proposta: TipoProposta.PADRAO,
      valor_oferecido: 300.00,
      status: StatusProposta.EM_ANDAMENTO
    }
  });

  // Proposta 5: Concluída com Avaliação
  const propConcluida = await prisma.proposta.create({
    data: {
      servico_id: todosServicos[1].id,
      cliente_id: cliente1.id,
      trabalhador_id: todosServicos[1].trabalhador_id,
      tipo_proposta: TipoProposta.PADRAO,
      valor_oferecido: 500.00,
      status: StatusProposta.CONCLUIDA
    }
  });

  await prisma.avaliacao.deleteMany();
  await prisma.avaliacao.create({
    data: {
      proposta_id: propConcluida.id,
      cliente_id: cliente1.id,
      trabalhador_id: propConcluida.trabalhador_id,
      estrelas: 5,
      comentario: 'Excelente profissional, resolveu tudo rápido.'
    }
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
