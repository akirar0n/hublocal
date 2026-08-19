import { Request, Response, NextFunction } from 'express';
import { AvaliacaoService } from '../services/avaliacao.service';

const avaliacaoService = new AvaliacaoService();

export class AvaliacaoController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const clienteId = req.user!.id;
      const result = await avaliacaoService.create(clienteId, req.body);
      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.avaliacao
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrabalhadorReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const avaliacoes = await avaliacaoService.getTrabalhadorReviews(id);
      return res.status(200).json({
        success: true,
        data: avaliacoes
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrabalhadorMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const media = await avaliacaoService.getTrabalhadorMedia(id);
      return res.status(200).json({
        success: true,
        data: media
      });
    } catch (error) {
      next(error);
    }
  }
}
