import { PrismaClient } from "@prisma/client";
import { Especialidade } from "../../../domain/entities/Especialidade";
import { IEspecialidadeRepository } from "../../../domain/repositories/IEspecialidadeRepository";

const prisma = new PrismaClient();

export class PrismaEspecialidadeRepository implements IEspecialidadeRepository {
  async criar(especialidade: Especialidade): Promise<Especialidade> {
    const criada = await prisma.especialidade.create({
      data: {
        nome: especialidade.nome,
        duracaoPadrao: especialidade.duracaoPadrao,
      },
    });

    return new Especialidade(criada.id, criada.nome, criada.duracaoPadrao);
  }

  async listarTodas(): Promise<Especialidade[]> {
    const especialidades = await prisma.especialidade.findMany();

    return especialidades.map(
      (e) => new Especialidade(e.id, e.nome, e.duracaoPadrao)
    );
  }
}