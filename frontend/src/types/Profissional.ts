import type { Especialidade } from "./Especialidade";

export interface Profissional {
  id: number;
  nome: string;
  especialidadeId: number;
  especialidade: Especialidade; // vem populado quando o back faz include/select
}