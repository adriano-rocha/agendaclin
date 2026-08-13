import api from './api';
import type { Agendamento, CriarAgendamentoPayload } from '../types/Agendamento';

interface ListarAgendamentosParams {
  page?: number;
  status?: string;
  profissionalId?: number;
  dataInicio?: string;
  dataFim?: string;
}

interface ListarAgendamentosResponse {
  dados: Agendamento[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export async function listarAgendamentos(
  params?: ListarAgendamentosParams
): Promise<ListarAgendamentosResponse> {
  const response = await api.get('/agendamentos', { params });
  return response.data;
}

export async function criarAgendamento(
  payload: CriarAgendamentoPayload
): Promise<Agendamento> {
  const response = await api.post('/agendamentos', payload);
  return response.data;
}

export async function cancelarAgendamento(id: number): Promise<Agendamento> {
  const response = await api.patch(`/agendamentos/${id}/cancelar`);
  return response.data;
}

export async function confirmarAgendamento(id: number): Promise<Agendamento> {
  const response = await api.patch(`/agendamentos/${id}/confirmar`);
  return response.data;
}