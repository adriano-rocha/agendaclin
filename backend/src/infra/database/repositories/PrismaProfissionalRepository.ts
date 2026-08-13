import { PrismaClient } from "@prisma/client";
import { Profissional } from "../../../domain/entities/Profissional";
import { IProfissionalRepository } from "../../../domain/repositories/IProfissionalRepository";

const prisma = new PrismaClient();

export class PrismaProfissionalRepository implements IProfissionalRepository {
  async criar(profissional: Profissional): Promise<Profissional> {
    const criado = await prisma.profissional.create({
      data: {
        nome: profissional.nome,
        especialidadeId: profissional.especialidadeId,
      },
    });

    return new Profissional(criado.id, criado.nome, criado.especialidadeId);
  }

  async listarTodos(): Promise<Profissional[]> {
    const profissionais = await prisma.profissional.findMany({
      include: { especialidade: true },
    });

    return profissionais.map(
    (p) => new Profissional(p.id, p.nome, p.especialidadeId, p.especialidade)
  );
}
}