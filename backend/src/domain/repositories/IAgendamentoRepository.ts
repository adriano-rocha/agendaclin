import { Agendamento } from '../entities/Agendamento';

export interface IAgendamentoRepository {
  criar(agendamento: Agendamento): Promise<Agendamento>;
  buscarConflitosDoDia(
    usuarioId: number,
    profissionalId: number,
    inicioDoDia: Date,
    fimDoDia: Date,
  ): Promise<Agendamento[]>;
}