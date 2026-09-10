export class Especialidade {
  constructor(
    public readonly id: number | null,
    public nome: string,
    public duracaoPadrao: number,
    public preco: number = 0 
  ) {}
}