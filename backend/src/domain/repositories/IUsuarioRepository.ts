import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository {
  criar(usuario: Usuario): Promise<Usuario>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorId(id: number): Promise<Usuario | null>;
  atualizar(usuario: Usuario): Promise<void>;
  atualizarSenha(id: number, senhaHash: string): Promise<void>;
}