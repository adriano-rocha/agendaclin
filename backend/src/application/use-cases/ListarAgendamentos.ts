import { IAgendamentoRepository, FiltrosAgendamento } from '../../domain/repositories/IAgendamentoRepository';
import { Agendamento } from '../../domain/entities/Agendamento';

interface ListarAgendamentosInput {
  filtros: FiltrosAgendamento;
  pagina?: number;
  limite?: number;
}

export class ListarAgendamentos {
  constructor(private agendamentoRepository: IAgendamentoRepository) {}

  async executar(input: ListarAgendamentosInput): Promise<{ dados: Agendamento[]; total: number; pagina: number; totalPaginas: number }> {
    const pagina = input.pagina ?? 1;
    const limite = input.limite ?? 10;

    const { dados, total } = await this.agendamentoRepository.listar(input.filtros, pagina, limite);

    return {
      dados,
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite),
    };
  }
}