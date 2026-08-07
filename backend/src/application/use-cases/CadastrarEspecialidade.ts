import { Especialidade } from "../../domain/entities/Especialidade";
import { IEspecialidadeRepository } from "../../domain/repositories/IEspecialidadeRepository";

interface CadastrarEspecialidadeInput {
  nome: string;
  duracaoPadrao: number;
}

export class CadastrarEspecialidade {
  constructor(private especialidadeRepository: IEspecialidadeRepository) {}

  async executar(input: CadastrarEspecialidadeInput): Promise<Especialidade> {
    const especialidade = new Especialidade(null, input.nome, input.duracaoPadrao);
    return this.especialidadeRepository.criar(especialidade);
  }
}