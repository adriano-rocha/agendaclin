import { ConfirmarAgendamento } from '../ConfirmarAgendamento';
import { IAgendamentoRepository } from '../../../domain/repositories/IAgendamentoRepository';
import { Agendamento } from '../../../domain/entities/Agendamento';

describe('ConfirmarAgendamento', () => {
  function criarRepositorioMock(): jest.Mocked<IAgendamentoRepository> {
    return {
      criar: jest.fn(),
      buscarConflitosDoDia: jest.fn(),
      buscarPorId: jest.fn(),
      listar: jest.fn(),
      atualizarStatus: jest.fn(),
    };
  }

  it('deve confirmar um agendamento pendente', async () => {
    const repositorioMock = criarRepositorioMock();

    const agendamentoPendente = new Agendamento(
      1,
      1,
      1,
      new Date('2026-08-20T10:00:00'),
      new Date('2026-08-20T10:50:00'),
      'PENDENTE',
    );

    const agendamentoConfirmado = new Agendamento(
      1,
      1,
      1,
      new Date('2026-08-20T10:00:00'),
      new Date('2026-08-20T10:50:00'),
      'CONFIRMADO',
    );

    repositorioMock.buscarPorId.mockResolvedValue(agendamentoPendente);
    repositorioMock.atualizarStatus.mockResolvedValue(agendamentoConfirmado);

    const useCase = new ConfirmarAgendamento(repositorioMock);

    const resultado = await useCase.executar(1);

    expect(resultado.status).toBe('CONFIRMADO');
    expect(repositorioMock.atualizarStatus).toHaveBeenCalledWith(1, 'CONFIRMADO');
  });

  it('deve lançar erro quando o agendamento não existe', async () => {
    const repositorioMock = criarRepositorioMock();
    repositorioMock.buscarPorId.mockResolvedValue(null);

    const useCase = new ConfirmarAgendamento(repositorioMock);

    await expect(useCase.executar(999)).rejects.toThrow('Agendamento não encontrado');

    expect(repositorioMock.atualizarStatus).not.toHaveBeenCalled();
  });

  it('deve lançar erro ao tentar confirmar um agendamento que não está pendente', async () => {
    const repositorioMock = criarRepositorioMock();

    const agendamentoJaConfirmado = new Agendamento(
      1,
      1,
      1,
      new Date('2026-08-20T10:00:00'),
      new Date('2026-08-20T10:50:00'),
      'CONFIRMADO',
    );

    repositorioMock.buscarPorId.mockResolvedValue(agendamentoJaConfirmado);

    const useCase = new ConfirmarAgendamento(repositorioMock);

    await expect(useCase.executar(1)).rejects.toThrow(
      'Somente agendamentos pendentes podem ser confirmados',
    );

    expect(repositorioMock.atualizarStatus).not.toHaveBeenCalled();
  });
});