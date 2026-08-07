import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";

interface AutenticarUsuarioInput {
  email: string;
  senha: string;
}

interface AutenticarUsuarioOutput {
  token: string;
  usuario: {
    id: number | null;
    nome: string;
    email: string;
    perfil: string;
  };
}

export class AutenticarUsuario {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async executar(input: AutenticarUsuarioInput): Promise<AutenticarUsuarioOutput> {
    const usuario = await this.usuarioRepository.buscarPorEmail(input.email);

    if (!usuario) {
      throw new Error("E-mail ou senha inválidos");
    }

    const senhaValida = await bcrypt.compare(input.senha, usuario.senhaHash);

    if (!senhaValida) {
      throw new Error("E-mail ou senha inválidos");
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    };
  }
}