import { Agendamento } from '../entities/Agendamento';

export interface FiltrosAgendamento {
  usuarioId?: number;
  profissionalId?: number;
  status?: string;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface IAgendamentoRepository {
  criar(agendamento: Agendamento): Promise<Agendamento>;
  buscarConflitosDoDia(
    usuarioId: number,
    profissionalId: number,
    inicioDoDia: Date,
    fimDoDia: Date,
  ): Promise<Agendamento[]>;
  buscarPorId(id: number): Promise<Agendamento | null>;
  listar(
    filtros: FiltrosAgendamento,
    pagina: number,
    limite: number,
  ): Promise<{ dados: Agendamento[]; total: number }>;
  atualizarStatus(id: number, status: string): Promise<Agendamento>;
}