import bcrypt from "bcrypt";
import { Usuario, Perfil } from "../../domain/entities/Usuario";
import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";

interface CadastrarUsuarioInput {
  nome: string;
  email: string;
  senha: string;
  perfil?: Perfil;
}

export class CadastrarUsuario {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async executar(input: CadastrarUsuarioInput): Promise<Usuario> {
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(input.email);

    if (usuarioExistente) {
      throw new Error("Já existe um usuário cadastrado com esse e-mail");
    }

    const senhaHash = await bcrypt.hash(input.senha, 10);

    const novoUsuario = new Usuario(
      null,
      input.nome,
      input.email,
      senhaHash,
      input.perfil ?? "PACIENTE"
    );

    return this.usuarioRepository.criar(novoUsuario);
  }
}