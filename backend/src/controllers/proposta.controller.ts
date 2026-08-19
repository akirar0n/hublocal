import { Request, Response, NextFunction } from 'express';
import { PropostaService } from '../services/proposta.service';
import { StatusProposta } from '@prisma/client';

const propostaService = new PropostaService();

export class PropostaController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const clienteId = req.user!.id;
      const result = await propostaService.create(clienteId, req.body);
      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.proposta
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyPropostas(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.user!.id;
      const tipo = req.user!.tipo;
      const propostas = await propostaService.getMyPropostas(usuarioId, tipo);
      return res.status(200).json({
        success: true,
        data: propostas
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const usuarioId = req.user!.id;
      const proposta = await propostaService.getById(id, usuarioId);
      return res.status(200).json({
        success: true,
        data: proposta
      });
    } catch (error) {
      next(error);
    }
  }

  async aceitar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const usuarioId = req.user!.id;
      const updated = await propostaService.updateStatus(id, usuarioId, req.user!.tipo, StatusProposta.ACEITA);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async recusar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const usuarioId = req.user!.id;
      const updated = await propostaService.updateStatus(id, usuarioId, req.user!.tipo, StatusProposta.RECUSADA);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async iniciar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const usuarioId = req.user!.id;
      const updated = await propostaService.updateStatus(id, usuarioId, req.user!.tipo, StatusProposta.EM_ANDAMENTO);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async concluir(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const usuarioId = req.user!.id;
      const updated = await propostaService.updateStatus(id, usuarioId, req.user!.tipo, StatusProposta.CONCLUIDA);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async cancelar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const usuarioId = req.user!.id;
      const updated = await propostaService.updateStatus(id, usuarioId, req.user!.tipo, StatusProposta.CANCELADA);
      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}
