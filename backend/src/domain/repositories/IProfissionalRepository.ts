import { Profissional } from "../entities/Profissional";

export interface IProfissionalRepository {
  criar(profissional: Profissional): Promise<Profissional>;
  listarTodos(): Promise<Profissional[]>;
}