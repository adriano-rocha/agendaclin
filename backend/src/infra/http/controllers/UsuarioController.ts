import { Request, Response } from "express";
import { CadastrarUsuario } from "../../../application/use-cases/CadastrarUsuario";
import { AtualizarPerfil } from "../../../application/use-cases/AtualizarPerfil";
import { AlterarSenha } from "../../../application/use-cases/AlterarSenha";
import { PrismaUsuarioRepository } from "../../database/repositories/PrismaUsuarioRepository";

const usuarioRepository = new PrismaUsuarioRepository();
const cadastrarUsuario = new CadastrarUsuario(usuarioRepository);
const atualizarPerfil = new AtualizarPerfil(usuarioRepository);
const alterarSenha = new AlterarSenha(usuarioRepository);

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

  async atualizarPerfil(req: Request, res: Response): Promise<void> {
    try {
      const id = req.usuario!.id;
      const { nome, email } = req.body;

      const usuario = await atualizarPerfil.executar(id, nome, email);

      res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      });
    } catch (erro: any) {
      res.status(400).json({ erro: erro.message });
    }
  }

  async alterarSenha(req: Request, res: Response): Promise<void> {
    try {
      const id = req.usuario!.id;
      const { senhaAtual, novaSenha } = req.body;

      await alterarSenha.executar(id, senhaAtual, novaSenha);

      res.status(200).json({ mensagem: "Senha alterada com sucesso" });
    } catch (erro: any) {
      res.status(400).json({ erro: erro.message });
    }
  }
}