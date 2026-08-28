import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AutenticarUsuario } from '../AutenticarUsuario';
import { IUsuarioRepository } from '../../../domain/repositories/IUsuarioRepository';
import { Usuario } from '../../../domain/entities/Usuario';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AutenticarUsuario', () => {
  function criarRepositorioMock(): jest.Mocked<IUsuarioRepository> {
    return {
      criar: jest.fn(),
      buscarPorEmail: jest.fn(),
      buscarPorId: jest.fn(),
      atualizar: jest.fn(),
      atualizarSenha: jest.fn(),
    };
  }

  const usuarioMock = {
    id: 1,
    nome: 'Adriano',
    email: 'adriano@teste.com',
    senhaHash: 'hash-fake',
    perfil: 'PACIENTE',
  } as Usuario;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve autenticar com sucesso e retornar token + dados do usuário', async () => {
    const repositorioMock = criarRepositorioMock();
    repositorioMock.buscarPorEmail.mockResolvedValue(usuarioMock);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('token-fake');

    const useCase = new AutenticarUsuario(repositorioMock);

    const resultado = await useCase.executar({
      email: 'adriano@teste.com',
      senha: 'senha123',
    });

    expect(resultado.token).toBe('token-fake');
    expect(resultado.usuario).toEqual({
      id: 1,
      nome: 'Adriano',
      email: 'adriano@teste.com',
      perfil: 'PACIENTE',
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('senha123', 'hash-fake');
    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro quando o e-mail não é encontrado', async () => {
    const repositorioMock = criarRepositorioMock();
    repositorioMock.buscarPorEmail.mockResolvedValue(null);

    const useCase = new AutenticarUsuario(repositorioMock);

    await expect(
      useCase.executar({ email: 'naoexiste@teste.com', senha: 'qualquer' }),
    ).rejects.toThrow('E-mail ou senha inválidos');

    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a senha está incorreta', async () => {
    const repositorioMock = criarRepositorioMock();
    repositorioMock.buscarPorEmail.mockResolvedValue(usuarioMock);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const useCase = new AutenticarUsuario(repositorioMock);

    await expect(
      useCase.executar({ email: 'adriano@teste.com', senha: 'senhaerrada' }),
    ).rejects.toThrow('E-mail ou senha inválidos');

    expect(jwt.sign).not.toHaveBeenCalled();
  });
});