// backend/src/infra/database/repositories/PrismaAgendamentoRepository.ts

import { PrismaClient } from '@prisma/client';
import { IAgendamentoRepository, FiltrosAgendamento } from '../../../domain/repositories/IAgendamentoRepository';
import { Agendamento, StatusAgendamento } from '../../../domain/entities/Agendamento';

const prisma = new PrismaClient();

function paraEntidade(a: any): Agendamento {
  return new Agendamento(
    a.id,
    a.usuarioId,
    a.profissionalId,
    a.dataHoraInicio,
    a.dataHoraFim,
    a.status as StatusAgendamento,
  );
}

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
    return paraEntidade(criado);
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
    return encontrados.map(paraEntidade);
  }

  async buscarPorId(id: number): Promise<Agendamento | null> {
    const encontrado = await prisma.agendamento.findUnique({ where: { id } });
    return encontrado ? paraEntidade(encontrado) : null;
  }

  async listar(
    filtros: FiltrosAgendamento,
    pagina: number,
    limite: number,
  ): Promise<{ dados: Agendamento[]; total: number }> {
    const where: any = {};

    if (filtros.usuarioId) where.usuarioId = filtros.usuarioId;
    if (filtros.profissionalId) where.profissionalId = filtros.profissionalId;
    if (filtros.status) where.status = filtros.status;
    if (filtros.dataInicio || filtros.dataFim) {
      where.dataHoraInicio = {};
      if (filtros.dataInicio) where.dataHoraInicio.gte = filtros.dataInicio;
      if (filtros.dataFim) where.dataHoraInicio.lte = filtros.dataFim;
    }

    const [dados, total] = await Promise.all([
      prisma.agendamento.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { dataHoraInicio: 'asc' },
      }),
      prisma.agendamento.count({ where }),
    ]);

    return { dados: dados.map(paraEntidade), total };
  }

  async atualizarStatus(id: number, status: string): Promise<Agendamento> {
    const atualizado = await prisma.agendamento.update({
      where: { id },
      data: { status: status as StatusAgendamento },
    });
    return paraEntidade(atualizado);
  }
}