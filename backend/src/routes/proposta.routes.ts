import { Router } from 'express';
import { PropostaController } from '../controllers/proposta.controller';
import { validate } from '../middlewares/validate';
import { createPropostaSchema, propostaIdSchema } from '../schemas/proposta.schema';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();
const propostaController = new PropostaController();

router.use(authenticate);

router.get('/', propostaController.getMyPropostas);
router.get('/:id', validate(propostaIdSchema), propostaController.getById);
router.patch('/:id/cancelar', validate(propostaIdSchema), propostaController.cancelar);

router.post('/', requireRole('CLIENTE'), validate(createPropostaSchema), propostaController.create);

router.patch('/:id/aceitar', requireRole('TRABALHADOR'), validate(propostaIdSchema), propostaController.aceitar);
router.patch('/:id/recusar', requireRole('TRABALHADOR'), validate(propostaIdSchema), propostaController.recusar);
router.patch('/:id/iniciar', requireRole('TRABALHADOR'), validate(propostaIdSchema), propostaController.iniciar);
router.patch('/:id/concluir', requireRole('TRABALHADOR'), validate(propostaIdSchema), propostaController.concluir);

export default router;
