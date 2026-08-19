import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { authenticate } from '../middlewares/auth';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;
