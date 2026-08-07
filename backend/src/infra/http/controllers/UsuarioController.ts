import { Request, Response } from "express";
import { CadastrarUsuario } from "../../../application/use-cases/CadastrarUsuario";
import { PrismaUsuarioRepository } from "../../database/repositories/PrismaUsuarioRepository";

const usuarioRepository = new PrismaUsuarioRepository();
const cadastrarUsuario = new CadastrarUsuario(usuarioRepository);

export class UsuarioController {
  async cadastrar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, senha, perfil } = req.body;

      const usuario = await cadastrarUsuario.executar({ nome, email, senha, perfil });

      res.status(201).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      });
    } catch (erro: any) {
      res.status(400).json({ erro: erro.message });
    }
  }
}