import { Especialidade } from "../entities/Especialidade";

export interface IEspecialidadeRepository {
  criar(especialidade: Especialidade): Promise<Especialidade>;
  listarTodas(): Promise<Especialidade[]>;
}