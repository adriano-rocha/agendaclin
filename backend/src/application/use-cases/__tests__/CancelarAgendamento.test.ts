import { CancelarAgendamento } from '../CancelarAgendamento';
import { IAgendamentoRepository } from '../../../domain/repositories/IAgendamentoRepository';
import { Agendamento } from '../../../domain/entities/Agendamento';

describe('CancelarAgendamento', () => {
  function criarRepositorioMock(): jest.Mocked<IAgendamentoRepository> {
    return {
      criar: jest.fn(),
      buscarConflitosDoDia: jest.fn(),
      buscarPorId: jest.fn(),
      listar: jest.fn(),
      atualizarStatus: jest.fn(),
    };
  }

  function criarDataFutura(horasNoFuturo: number): Date {
    return new Date(Date.now() + horasNoFuturo * 60 * 60 * 1000);
  }

  it('deve cancelar quando há mais de 2h de antecedência', async () => {
    const repositorioMock = criarRepositorioMock();

    const agendamento = new Agendamento(
      1, 1, 1,
      criarDataFutura(10),
      criarDataFutura(10.83),
      'PENDENTE',
    );

    repositorioMock.buscarPorId.mockResolvedValue(agendamento);
    repositorioMock.atualizarStatus.mockResolvedValue({ ...agendamento, status: 'CANCELADO' });

    const useCase = new CancelarAgendamento(repositorioMock);
    const resultado = await useCase.executar(1);

    expect(resultado.status).toBe('CANCELADO');
    expect(repositorioMock.atualizarStatus).toHaveBeenCalledWith(1, 'CANCELADO');
  });

  it('deve lançar erro quando faltam menos de 2h para a consulta', async () => {
    const repositorioMock = criarRepositorioMock();

    const agendamento = new Agendamento(
      1, 1, 1,
      criarDataFutura(1),
      criarDataFutura(1.83),
      'PENDENTE',
    );

    repositorioMock.buscarPorId.mockResolvedValue(agendamento);

    const useCase = new CancelarAgendamento(repositorioMock);

    await expect(useCase.executar(1)).rejects.toThrow('antecedência');
  });

  it('deve lançar erro quando o agendamento não existe', async () => {
    const repositorioMock = criarRepositorioMock();
    repositorioMock.buscarPorId.mockResolvedValue(null);

    const useCase = new CancelarAgendamento(repositorioMock);

    await expect(useCase.executar(999)).rejects.toThrow('não encontrado');
  });

  it('deve lançar erro quando o agendamento já está cancelado', async () => {
    const repositorioMock = criarRepositorioMock();

    const agendamento = new Agendamento(
      1, 1, 1,
      criarDataFutura(10),
      criarDataFutura(10.83),
      'CANCELADO',
    );

    repositorioMock.buscarPorId.mockResolvedValue(agendamento);

    const useCase = new CancelarAgendamento(repositorioMock);

    await expect(useCase.executar(1)).rejects.toThrow('já está cancelado');
  });
});