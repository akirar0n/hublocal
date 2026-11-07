import test from 'node:test';
import assert from 'node:assert';
import { ServicoService } from '../services/servico.service';
import { prisma } from '../repositories/prismaClient';

test('ServicoService - Busca e Filtros', async (t) => {
  const servicoService = new ServicoService();

  t.after(async () => {
    await prisma.$disconnect();
  });

  await t.test('deve filtrar serviços por termo parcial no título', async () => {
    const resultados = await servicoService.search({ termo: 'chuveiro' });
    assert.ok(resultados.length > 0, 'Deveria retornar ao menos 1 serviço');
    assert.strictEqual(
      resultados.every((s: any) => 
        s.titulo.toLowerCase().includes('chuveiro') ||
        s.descricao.toLowerCase().includes('chuveiro') ||
        s.categoria.toLowerCase().includes('chuveiro')
      ),
      true,
      'Todos os resultados devem conter "chuveiro"'
    );
  });

  await t.test('deve filtrar serviços por termo parcial na categoria ou descrição', async () => {
    const resultados = await servicoService.search({ termo: 'eletric' });
    assert.ok(resultados.length > 0, 'Deveria retornar serviços para "eletric"');
    assert.strictEqual(
      resultados.every((s: any) => 
        s.categoria.toLowerCase().includes('eletric') ||
        s.titulo.toLowerCase().includes('eletric') ||
        s.descricao.toLowerCase().includes('eletric')
      ),
      true,
      'Todos os resultados devem bater com o termo'
    );
  });

  await t.test('deve filtrar serviços por categoria com correspondência parcial', async () => {
    const resultados = await servicoService.search({ categoria: 'eletric' });
    assert.ok(resultados.length > 0, 'Deveria encontrar categoria Eletricista com "eletric"');
  });

  await t.test('não deve descartar resultados por distância quando raio não for informado', async () => {
    // Coordenadas de Brasília (distante de São Paulo)
    const resultados = await servicoService.search({
      latitude: -15.7942,
      longitude: -47.8822
    });

    assert.ok(resultados.length > 0, 'Não deve retornar vazio se não houver raio definido');
    assert.ok(resultados[0].distanciaKm !== null, 'Distância deve ser calculada');
    assert.ok(resultados[0].distanciaKm > 100, 'Distância real deve ser superior a 100 km');
  });
});
