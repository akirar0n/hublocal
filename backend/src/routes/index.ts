import { Router } from 'express';
import authRoutes from './auth.routes';
import servicoRoutes from './servico.routes';
import propostaRoutes from './proposta.routes';
import avaliacaoRoutes from './avaliacao.routes';
import usuarioRoutes from './usuario.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/servicos', servicoRoutes);
router.use('/propostas', propostaRoutes);
router.use('/avaliacoes', avaliacaoRoutes);
router.use('/usuarios', usuarioRoutes);

export default router;
