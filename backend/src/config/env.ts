import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
