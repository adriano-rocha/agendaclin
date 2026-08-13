import api from './api';
import type { Profissional } from '../types/Profissional';
import type { Especialidade } from '../types/Especialidade';

export async function listarProfissionais(): Promise<Profissional[]> {
  const response = await api.get('/profissionais');
  return response.data;
}

export async function listarEspecialidades(): Promise<Especialidade[]> {
  const response = await api.get('/especialidades');
  return response.data;
}