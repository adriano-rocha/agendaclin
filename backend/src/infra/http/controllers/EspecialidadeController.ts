import { Request, Response } from "express";
import { CadastrarEspecialidade } from "../../../application/use-cases/CadastrarEspecialidade";
import { PrismaEspecialidadeRepository } from "../../database/repositories/PrismaEspecialidadeRepository";

const especialidadeRepository = new PrismaEspecialidadeRepository();
const cadastrarEspecialidade = new CadastrarEspecialidade(especialidadeRepository);

export class EspecialidadeController {
  async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, duracaoPadrao } = req.body;
      const especialidade = await cadastrarEspecialidade.executar({ nome, duracaoPadrao });
      res.status(201).json(especialidade);
    } catch (erro: any) {
      res.status(400).json({ erro: erro.message });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    const especialidades = await especialidadeRepository.listarTodas();
    res.status(200).json(especialidades);
  }
}