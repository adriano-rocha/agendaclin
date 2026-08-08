import { PrismaClient } from '@prisma/client';
import { IAgendamentoRepository } from '../../../domain/repositories/IAgendamentoRepository';
import { Agendamento, StatusAgendamento } from '../../../domain/entities/Agendamento';

const prisma = new PrismaClient();

export class PrismaAgendamentoRepository implements IAgendamentoRepository {
  async criar(agendamento: Agendamento): Promise<Agendamento> {
    const criado = await prisma.agendamento.create({
      data: {
        usuarioId: agendamento.usuarioId,
        profissionalId: agendamento.profissionalId,
        dataHoraInicio: agendamento.dataHoraInicio,
        dataHoraFim: agendamento.dataHoraFim,
        status: agendamento.status,
      },
    });

    return new Agendamento(
      criado.id,
      criado.usuarioId,
      criado.profissionalId,
      criado.dataHoraInicio,
      criado.dataHoraFim,
      criado.status as StatusAgendamento,
    );
  }

  async buscarConflitosDoDia(
    usuarioId: number,
    profissionalId: number,
    inicioDoDia: Date,
    fimDoDia: Date,
  ): Promise<Agendamento[]> {
    const encontrados = await prisma.agendamento.findMany({
      where: {
        status: { not: 'CANCELADO' },
        dataHoraInicio: { gte: inicioDoDia, lte: fimDoDia },
        OR: [{ profissionalId }, { usuarioId }],
      },
    });

    return encontrados.map(
      (a) =>
        new Agendamento(
          a.id,
          a.usuarioId,
          a.profissionalId,
          a.dataHoraInicio,
          a.dataHoraFim,
          a.status as StatusAgendamento,
        ),
    );
  }
}