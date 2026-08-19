import { Request, Response, NextFunction } from 'express';
import { ServicoService } from '../services/servico.service';
import { StatusServico } from '@prisma/client';

const servicoService = new ServicoService();

export class ServicoController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const trabalhadorId = req.user!.id;
      const result = await servicoService.create(trabalhadorId, req.body);
      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.servico
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const trabalhadorId = req.user!.id;
      const servico = await servicoService.update(id, trabalhadorId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Serviço atualizado com sucesso.',
        data: servico
      });
    } catch (error) {
      next(error);
    }
  }

  async changeStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const trabalhadorId = req.user!.id;
      const status = req.body.status as StatusServico;
      const servico = await servicoService.changeStatus(id, trabalhadorId, status);
      return res.status(200).json({
        success: true,
        message: 'Status do serviço atualizado com sucesso.',
        data: servico
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const trabalhadorId = req.user!.id;
      await servicoService.delete(id, trabalhadorId);
      return res.status(200).json({
        success: true,
        message: 'Serviço excluído com sucesso.'
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const servico = await servicoService.findById(id);
      return res.status(200).json({
        success: true,
        data: servico
      });
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const servicos = await servicoService.search(req.query);
      return res.status(200).json({
        success: true,
        data: servicos
      });
    } catch (error) {
      next(error);
    }
  }
}
