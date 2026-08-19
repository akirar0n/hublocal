import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: err.errors[0].message, // retorna a primeira mensagem de validação
      code: 'VALIDATION_ERROR'
    });
  }

  console.error('Unhandled Error:', err);

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor.',
    code: 'INTERNAL_SERVER_ERROR'
  });
}
