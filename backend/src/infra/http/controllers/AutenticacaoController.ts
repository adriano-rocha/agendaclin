import { Request, Response } from "express";
import { AutenticarUsuario } from "../../../application/use-cases/AutenticarUsuario";
import { PrismaUsuarioRepository } from "../../database/repositories/PrismaUsuarioRepository";

const usuarioRepository = new PrismaUsuarioRepository();
const autenticarUsuario = new AutenticarUsuario(usuarioRepository);

export class AutenticacaoController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body;

      const resultado = await autenticarUsuario.executar({ email, senha });

      res.status(200).json(resultado);
    } catch (erro: any) {
      res.status(401).json({ erro: erro.message });
    }
  }
}