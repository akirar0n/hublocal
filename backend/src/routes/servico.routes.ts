import { Router } from 'express';
import { ServicoController } from '../controllers/servico.controller';
import { validate } from '../middlewares/validate';
import { createServicoSchema, updateServicoSchema, changeStatusServicoSchema } from '../schemas/servico.schema';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();
const servicoController = new ServicoController();

router.get('/', servicoController.search);
router.get('/:id', servicoController.getById);

router.use(authenticate);
router.use(requireRole('TRABALHADOR'));

router.post('/', validate(createServicoSchema), servicoController.create);
router.put('/:id', validate(updateServicoSchema), servicoController.update);
router.patch('/:id/status', validate(changeStatusServicoSchema), servicoController.changeStatus);
router.delete('/:id', servicoController.delete);

export default router;
