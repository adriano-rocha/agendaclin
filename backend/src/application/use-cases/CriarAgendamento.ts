import { Agendamento } from '../../domain/entities/Agendamento';
import { IAgendamentoRepository } from '../../domain/repositories/IAgendamentoRepository';

const DURACAO_CONSULTA_MINUTOS = 50;

interface CriarAgendamentoInput {
  usuarioId: number;
  profissionalId: number;
  dataHoraInicio: Date;
}

export class CriarAgendamento {
  constructor(private agendamentoRepository: IAgendamentoRepository) {}

  async executar(input: CriarAgendamentoInput): Promise<Agendamento> {
    const { usuarioId, profissionalId, dataHoraInicio } = input;

    const dataHoraFim = new Date(
      dataHoraInicio.getTime() + DURACAO_CONSULTA_MINUTOS * 60 * 1000,
    );

    const inicioDoDia = new Date(dataHoraInicio);
    inicioDoDia.setHours(0, 0, 0, 0);

    const fimDoDia = new Date(dataHoraInicio);
    fimDoDia.setHours(23, 59, 59, 999);

    const candidatos = await this.agendamentoRepository.buscarConflitosDoDia(
      usuarioId,
      profissionalId,
      inicioDoDia,
      fimDoDia,
    );

    const temConflito = candidatos.some(
      (existente) =>
        dataHoraInicio < existente.dataHoraFim && dataHoraFim > existente.dataHoraInicio,
    );

    if (temConflito) {
      throw new Error('Conflito de horário: profissional ou paciente já possui agendamento nesse período.');
    }

    const novoAgendamento = new Agendamento(
      null,
      usuarioId,
      profissionalId,
      dataHoraInicio,
      dataHoraFim,
      'PENDENTE',
    );

    return this.agendamentoRepository.criar(novoAgendamento);
  }
}