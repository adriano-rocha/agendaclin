export type Perfil = "PACIENTE" | "ADMIN";

export class Usuario {
  constructor(
    public readonly id: number | null,
    public nome: string,
    public email: string,
    public senhaHash: string,
    public perfil: Perfil = "PACIENTE"
  ) {}
}