import api from "./api";
import type { Usuario } from "../context/AuthContext";

interface AtualizarPerfilDTO {
  nome: string;
  email: string;
}

interface AlterarSenhaDTO {
  senhaAtual: string;
  novaSenha: string;
}

export async function atualizarPerfil(dados: AtualizarPerfilDTO): Promise<Usuario> {
  const response = await api.patch<Usuario>("/usuarios/me", dados);
  return response.data;
}

export async function alterarSenha(dados: AlterarSenhaDTO): Promise<void> {
  await api.patch("/usuarios/me/senha", dados);
}