import { CriarAgendamento } from '../CriarAgendamento';
import { IAgendamentoRepository } from '../../../domain/repositories/IAgendamentoRepository';
import { Agendamento } from '../../../domain/entities/Agendamento';

describe('CriarAgendamento', () => {
  function criarRepositorioMock(): jest.Mocked<IAgendamentoRepository> {
    return {
      criar: jest.fn(),
      buscarConflitosDoDia: jest.fn(),
      buscarPorId: jest.fn(),
      listar: jest.fn(),
      atualizarStatus: jest.fn(),
    };
  }

  it('deve criar um agendamento quando não há conflito de horário', async () => {
    const repositorioMock = criarRepositorioMock();
    repositorioMock.buscarConflitosDoDia.mockResolvedValue([]);
    repositorioMock.criar.mockImplementation(async (agendamento) => agendamento as Agendamento);

    const useCase = new CriarAgendamento(repositorioMock);

    const resultado = await useCase.executar({
      usuarioId: 1,
      profissionalId: 1,
      dataHoraInicio: new Date('2026-08-20T10:00:00'),
    });

    expect(resultado.status).toBe('PENDENTE');
    expect(repositorioMock.criar).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro quando já existe agendamento conflitante', async () => {
    const repositorioMock = criarRepositorioMock();

    const agendamentoExistente = new Agendamento(
      1,
      1,
      1,
      new Date('2026-08-20T10:00:00'),
      new Date('2026-08-20T10:50:00'),
      'PENDENTE',
    );

    repositorioMock.buscarConflitosDoDia.mockResolvedValue([agendamentoExistente]);

    const useCase = new CriarAgendamento(repositorioMock);

    await expect(
      useCase.executar({
        usuarioId: 1,
        profissionalId: 1,
        dataHoraInicio: new Date('2026-08-20T10:20:00'),
      }),
    ).rejects.toThrow('Conflito de horário');
  });
});