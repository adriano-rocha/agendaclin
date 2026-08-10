import { IAgendamentoRepository } from '../../domain/repositories/IAgendamentoRepository';
import { Agendamento } from '../../domain/entities/Agendamento';

const ANTECEDENCIA_MINIMA_HORAS = 2;

export class CancelarAgendamento {
  constructor(private agendamentoRepository: IAgendamentoRepository) {}

  async executar(id: number): Promise<Agendamento> {
    const agendamento = await this.agendamentoRepository.buscarPorId(id);

    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }

    if (agendamento.status === 'CANCELADO') {
      throw new Error('Agendamento já está cancelado');
    }

    const agora = new Date();
    const horasAteConsulta = (agendamento.dataHoraInicio.getTime() - agora.getTime()) / (1000 * 60 * 60);

    if (horasAteConsulta < ANTECEDENCIA_MINIMA_HORAS) {
      throw new Error(`Cancelamento só é permitido com no mínimo ${ANTECEDENCIA_MINIMA_HORAS}h de antecedência`);
    }

    return this.agendamentoRepository.atualizarStatus(id, 'CANCELADO');
  }
}