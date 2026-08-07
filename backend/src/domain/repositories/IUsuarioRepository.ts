import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository {
  criar(usuario: Usuario): Promise<Usuario>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
}