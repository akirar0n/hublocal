import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { TipoUsuario } from '@prisma/client';

interface TokenPayload {
  id: number;
  tipo: TipoUsuario;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Token não fornecido', 401, 'UNAUTHORIZED'));
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.user = {
      id: decoded.id,
      tipo: decoded.tipo
    };
    return next();
  } catch (err) {
    return next(new AppError('Token inválido', 401, 'UNAUTHORIZED'));
  }
};

export const requireRole = (role: TipoUsuario) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Usuário não autenticado', 401, 'UNAUTHORIZED'));
    }

    if (req.user.tipo !== role) {
      return next(new AppError('Acesso negado', 403, 'FORBIDDEN'));
    }

    return next();
  };
};
