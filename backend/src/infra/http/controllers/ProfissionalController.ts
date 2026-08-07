import { Request, Response } from "express";
import { CadastrarProfissional } from "../../../application/use-cases/CadastrarProfissional";
import { PrismaProfissionalRepository } from "../../database/repositories/PrismaProfissionalRepository";

const profissionalRepository = new PrismaProfissionalRepository();
const cadastrarProfissional = new CadastrarProfissional(profissionalRepository);

export class ProfissionalController {
  async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, especialidadeId } = req.body;
      const profissional = await cadastrarProfissional.executar({ nome, especialidadeId });
      res.status(201).json(profissional);
    } catch (erro: any) {
      res.status(400).json({ erro: erro.message });
    }
  }

  async listar(req: Request, res: Response): Promise<void> {
    const profissionais = await profissionalRepository.listarTodos();
    res.status(200).json(profissionais);
  }
}