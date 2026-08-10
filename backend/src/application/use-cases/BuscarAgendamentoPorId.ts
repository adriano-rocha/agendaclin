import { IAgendamentoRepository } from '../../domain/repositories/IAgendamentoRepository';
import { Agendamento } from '../../domain/entities/Agendamento';

export class BuscarAgendamentoPorId {
  constructor(private agendamentoRepository: IAgendamentoRepository) {}

  async executar(id: number): Promise<Agendamento> {
    const agendamento = await this.agendamentoRepository.buscarPorId(id);

    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }

    return agendamento;
  }
}