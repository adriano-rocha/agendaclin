export type StatusAgendamento = 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';

export class Agendamento {
  constructor(
    public readonly id: number | null,
    public readonly usuarioId: number,
    public readonly profissionalId: number,
    public readonly dataHoraInicio: Date,
    public readonly dataHoraFim: Date,
    public readonly status: StatusAgendamento = 'PENDENTE',
  ) {}
}