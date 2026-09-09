import { IAgendamentoRepository } from "../../domain/repositories/IAgendamentoRepository";

interface ListarHorariosOcupadosInput {
  profissionalId: number;
  data: string;
}

export class ListarHorariosOcupados {
  constructor(private agendamentoRepository: IAgendamentoRepository) {}

  async executar({
    profissionalId,
    data,
  }: ListarHorariosOcupadosInput): Promise<string[]> {
    const [ano, mes, dia] = data.split("-").map(Number);

    const inicioDoDia = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
    const fimDoDia = new Date(ano, mes - 1, dia, 23, 59, 59, 999);

    const { dados } = await this.agendamentoRepository.listar(
      { profissionalId, dataInicio: inicioDoDia, dataFim: fimDoDia },
      1,
      100,
    );

    return dados
      .filter((agendamento) => agendamento.status !== "CANCELADO")
      .map((agendamento) => {
        const hora = String(agendamento.dataHoraInicio.getHours()).padStart(
          2,
          "0",
        );
        const minuto = String(agendamento.dataHoraInicio.getMinutes()).padStart(
          2,
          "0",
        );
        return `${hora}:${minuto}`;
      });
  }
}
