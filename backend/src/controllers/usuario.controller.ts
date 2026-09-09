import { Request, Response, NextFunction } from 'express';
import { UsuarioService } from '../services/usuario.service';

const usuarioService = new UsuarioService();

export class UsuarioController {
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = req.body;
      const updatedUser = await usuarioService.updateProfile(userId, data);
      
      return res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }
}
