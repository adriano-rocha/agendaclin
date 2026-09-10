import { Especialidade } from "../../domain/entities/Especialidade";
import {
  IEspecialidadeRepository,
  DadosAtualizacaoEspecialidade,
} from "../../domain/repositories/IEspecialidadeRepository";

export class AtualizarEspecialidade {
  constructor(private especialidadeRepository: IEspecialidadeRepository) {}

  async executar(id: number, dados: DadosAtualizacaoEspecialidade): Promise<Especialidade> {
    return this.especialidadeRepository.atualizar(id, dados);
  }
}