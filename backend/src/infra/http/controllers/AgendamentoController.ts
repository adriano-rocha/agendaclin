import { Request, Response } from 'express';
import { CriarAgendamento } from '../../../application/use-cases/CriarAgendamento';
import { PrismaAgendamentoRepository } from '../../database/repositories/PrismaAgendamentoRepository';

export async function criarAgendamentoController(req: Request, res: Response) {
  try {
    const { usuarioId, profissionalId, dataHoraInicio } = req.body;

    if (!usuarioId || !profissionalId || !dataHoraInicio) {
      return res.status(400).json({ erro: 'usuarioId, profissionalId e dataHoraInicio são obrigatórios.' });
    }

    const agendamentoRepository = new PrismaAgendamentoRepository();
    const criarAgendamento = new CriarAgendamento(agendamentoRepository);

    const novoAgendamento = await criarAgendamento.executar({
      usuarioId: Number(usuarioId),
      profissionalId: Number(profissionalId),
      dataHoraInicio: new Date(dataHoraInicio),
    });

    return res.status(201).json(novoAgendamento);
  } catch (erro) {
    if (erro instanceof Error && erro.message.includes('Conflito de horário')) {
      return res.status(409).json({ erro: erro.message });
    }

    console.error(erro);
    return res.status(500).json({ erro: 'Erro interno ao criar agendamento.' });
  }
}