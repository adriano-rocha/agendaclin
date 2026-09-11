import { Profissional } from "../entities/Profissional";

export interface IProfissionalRepository {
  criar(profissional: Profissional): Promise<Profissional>;
  listarTodos(): Promise<Profissional[]>;
  buscarPorId(id: number): Promise<Profissional | null>;
}