export class Profissional {
  constructor(
    public readonly id: number | null,
    public nome: string,
    public especialidadeId: number,
    public especialidade?: { id: number; nome: string; duracaoPadrao: number }
  ) {}
}