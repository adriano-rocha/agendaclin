import { Especialidade } from "../entities/Especialidade";

export interface DadosAtualizacaoEspecialidade {
  nome?: string;
  duracaoPadrao?: number;
  preco?: number;
}

export interface IEspecialidadeRepository {
  criar(especialidade: Especialidade): Promise<Especialidade>;
  listarTodas(): Promise<Especialidade[]>;
  atualizar(id: number, dados: DadosAtualizacaoEspecialidade): Promise<Especialidade>;
  buscarPorId(id: number): Promise<Especialidade | null>;
}