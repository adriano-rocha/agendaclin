import { Profissional } from "../../domain/entities/Profissional";
import { IProfissionalRepository } from "../../domain/repositories/IProfissionalRepository";

interface CadastrarProfissionalInput {
  nome: string;
  especialidadeId: number;
}

export class CadastrarProfissional {
  constructor(private profissionalRepository: IProfissionalRepository) {}

  async executar(input: CadastrarProfissionalInput): Promise<Profissional> {
    const profissional = new Profissional(null, input.nome, input.especialidadeId);
    return this.profissionalRepository.criar(profissional);
  }
}