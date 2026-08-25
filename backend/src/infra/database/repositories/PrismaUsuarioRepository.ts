import { PrismaClient } from "@prisma/client";
import { Usuario, Perfil } from "../../../domain/entities/Usuario";
import { IUsuarioRepository } from "../../../domain/repositories/IUsuarioRepository";

const prisma = new PrismaClient();

export class PrismaUsuarioRepository implements IUsuarioRepository {
  async criar(usuario: Usuario): Promise<Usuario> {
    const usuarioCriado = await prisma.usuario.create({
      data: {
        nome: usuario.nome,
        email: usuario.email,
        senhaHash: usuario.senhaHash,
        perfil: usuario.perfil,
      },
    });

    return new Usuario(
      usuarioCriado.id,
      usuarioCriado.nome,
      usuarioCriado.email,
      usuarioCriado.senhaHash,
      usuarioCriado.perfil as Perfil
    );
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const usuarioEncontrado = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuarioEncontrado) return null;

    return new Usuario(
      usuarioEncontrado.id,
      usuarioEncontrado.nome,
      usuarioEncontrado.email,
      usuarioEncontrado.senhaHash,
      usuarioEncontrado.perfil as Perfil
    );
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    const usuarioEncontrado = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioEncontrado) return null;

    return new Usuario(
      usuarioEncontrado.id,
      usuarioEncontrado.nome,
      usuarioEncontrado.email,
      usuarioEncontrado.senhaHash,
      usuarioEncontrado.perfil as Perfil
    );
  }

  async atualizar(usuario: Usuario): Promise<void> {
    await prisma.usuario.update({
      where: { id: usuario.id! },
      data: {
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  }

  async atualizarSenha(id: number, senhaHash: string): Promise<void> {
    await prisma.usuario.update({
      where: { id },
      data: { senhaHash },
    });
  }
}