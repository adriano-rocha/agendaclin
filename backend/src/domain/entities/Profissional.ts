export class Profissional {
  constructor(
    public readonly id: number | null,
    public nome: string,
    public especialidadeId: number
  ) {}
}