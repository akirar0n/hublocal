import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { validate } from '../middlewares/validate';
import { updateProfileSchema } from '../schemas/usuario.schema';
import { authenticate } from '../middlewares/auth';

const router = Router();
const usuarioController = new UsuarioController();

router.use(authenticate);

router.put('/me', validate(updateProfileSchema), usuarioController.updateProfile);

export default router;
