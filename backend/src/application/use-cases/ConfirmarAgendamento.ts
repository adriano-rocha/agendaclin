import { IAgendamentoRepository } from '../../domain/repositories/IAgendamentoRepository';
import { Agendamento } from '../../domain/entities/Agendamento';

export class ConfirmarAgendamento {
  constructor(private agendamentoRepository: IAgendamentoRepository) {}

  async executar(id: number): Promise<Agendamento> {
    const agendamento = await this.agendamentoRepository.buscarPorId(id);

    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }

    if (agendamento.status !== 'PENDENTE') {
      throw new Error('Somente agendamentos pendentes podem ser confirmados');
    }

    return this.agendamentoRepository.atualizarStatus(id, 'CONFIRMADO');
  }
}