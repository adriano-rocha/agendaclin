// backend/src/infra/http/routes/agendamento.routes.ts

import { Router } from 'express';
import {
  criarAgendamentoController,
  listarAgendamentosController,
  buscarAgendamentoPorIdController,
  cancelarAgendamentoController,
  confirmarAgendamentoController,
} from '../controllers/AgendamentoController';
import { autenticar } from '../middlewares/autenticar';
import { somenteAdmin } from '../middlewares/somenteAdmin';

const router = Router();

router.post('/agendamentos', autenticar, criarAgendamentoController);
router.get('/agendamentos', autenticar, listarAgendamentosController);
router.get('/agendamentos/:id', autenticar, buscarAgendamentoPorIdController);
router.patch('/agendamentos/:id/cancelar', autenticar, cancelarAgendamentoController);
router.patch('/agendamentos/:id/confirmar', autenticar, somenteAdmin, confirmarAgendamentoController);

export const agendamentoRoutes = router;