import { Request, Response } from "express";
import { CadastrarEspecialidade } from "../../../application/use-cases/CadastrarEspecialidade";
import { AtualizarEspecialidade } from "../../../application/use-cases/AtualizarEspecialidade";
import { PrismaEspecialidadeRepository } from "../../database/repositories/PrismaEspecialidadeRepository";

const especialidadeRepository = new PrismaEspecialidadeRepository();
const cadastrarEspecialidade = new CadastrarEspecialidade(especialidadeRepository);
const atualizarEspecialidade = new AtualizarEspecialidade(especialidadeRepository);

export class EspecialidadeController {
  async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, duracaoPadrao, preco } = req.body;
      const especialidade = await cadastrarEspecialidade.executar({ nome, duracaoPadrao, preco });
      res.status(201).json(especialidade);
    } catch (erro: any) {
      res.status(400).json({ erro: erro.message });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    const especialidades = await especialidadeRepository.listarTodas();
    res.status(200).json(especialidades);
  }

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, duracaoPadrao, preco } = req.body;
      const especialidade = await atualizarEspecialidade.executar(Number(id), {
        nome,
        duracaoPadrao,
        preco,
      });
      res.status(200).json(especialidade);
    } catch (erro: any) {
      res.status(400).json({ erro: erro.message });
    }
  }
}