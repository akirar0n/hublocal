import { Router } from 'express';
import authRoutes from './auth.routes';
import servicoRoutes from './servico.routes';
import propostaRoutes from './proposta.routes';
import avaliacaoRoutes from './avaliacao.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/servicos', servicoRoutes);
router.use('/propostas', propostaRoutes);
router.use('/avaliacoes', avaliacaoRoutes);

export default router;
