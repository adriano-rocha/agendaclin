import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";

export class AtualizarPerfil {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async executar(id: number, nome?: string, email?: string) {
    const usuario = await this.usuarioRepository.buscarPorId(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    if (email && email !== usuario.email) {
      const emailEmUso = await this.usuarioRepository.buscarPorEmail(email);

      if (emailEmUso) {
        throw new Error("Este e-mail já está em uso por outro usuário");
      }

      usuario.email = email;
    }

    if (nome) {
      usuario.nome = nome;
    }

    await this.usuarioRepository.atualizar(usuario);

    return usuario;
  }
}