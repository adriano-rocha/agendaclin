import bcrypt from "bcrypt";
import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";

export class AlterarSenha {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async executar(id: number, senhaAtual: string, novaSenha: string) {
    const usuario = await this.usuarioRepository.buscarPorId(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    const senhaConfere = await bcrypt.compare(senhaAtual, usuario.senhaHash);

    if (!senhaConfere) {
      throw new Error("Senha atual incorreta");
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await this.usuarioRepository.atualizarSenha(id, novaSenhaHash);
  }
}