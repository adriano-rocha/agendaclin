// frontend/src/types/Agendamento.ts

export type StatusAgendamento =
  | "PENDENTE"
  | "CONFIRMADO"
  | "CANCELADO"
  | "CONCLUIDO";

export interface Agendamento {
  id: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: StatusAgendamento;
  criadoEm: string;
  usuarioId: number;
  profissionalId: number;
}

export interface CriarAgendamentoPayload {
  usuarioId: number;
  profissionalId: number;
  dataHoraInicio: string;
}