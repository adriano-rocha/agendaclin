import { Router } from 'express';
import { criarAgendamentoController } from '../controllers/AgendamentoController';
import { autenticar } from '../middlewares/autenticar';

const router = Router();

router.post('/agendamentos', autenticar, criarAgendamentoController);

export const agendamentoRoutes = router;