import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.user
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;
      const result = await authService.login(email, senha);
      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso.',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await authService.getMe(userId);
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}
