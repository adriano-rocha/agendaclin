import { PrismaClient } from "@prisma/client";
import { Especialidade } from "../../../domain/entities/Especialidade";
import {
  IEspecialidadeRepository,
  DadosAtualizacaoEspecialidade,
} from "../../../domain/repositories/IEspecialidadeRepository";

const prisma = new PrismaClient();

export class PrismaEspecialidadeRepository implements IEspecialidadeRepository {
  async criar(especialidade: Especialidade): Promise<Especialidade> {
    const criada = await prisma.especialidade.create({
      data: {
        nome: especialidade.nome,
        duracaoPadrao: especialidade.duracaoPadrao,
        preco: especialidade.preco,
      },
    });

    return new Especialidade(criada.id, criada.nome, criada.duracaoPadrao, Number(criada.preco));
  }

  async listarTodas(): Promise<Especialidade[]> {
    const especialidades = await prisma.especialidade.findMany();

    return especialidades.map(
      (e) => new Especialidade(e.id, e.nome, e.duracaoPadrao, Number(e.preco)),
    );
  }

  async atualizar(id: number, dados: DadosAtualizacaoEspecialidade): Promise<Especialidade> {
    const atualizada = await prisma.especialidade.update({
      where: { id },
      data: dados,
    });

    return new Especialidade(
      atualizada.id,
      atualizada.nome,
      atualizada.duracaoPadrao,
      Number(atualizada.preco),
    );
  }
}