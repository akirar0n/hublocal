import { Router } from 'express';
import { AvaliacaoController } from '../controllers/avaliacao.controller';
import { validate } from '../middlewares/validate';
import { createAvaliacaoSchema } from '../schemas/avaliacao.schema';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();
const avaliacaoController = new AvaliacaoController();

router.get('/trabalhador/:id', avaliacaoController.getTrabalhadorReviews);
router.get('/trabalhador/:id/media', avaliacaoController.getTrabalhadorMedia);

router.post('/', authenticate, requireRole('CLIENTE'), validate(createAvaliacaoSchema), avaliacaoController.create);

export default router;
