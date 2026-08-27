import request from 'supertest';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { app } from '../../app';

const prisma = new PrismaClient();

describe('Agendamento - testes de integração (regras de autorização)', () => {
  let tokenPacienteA: string;
  let usuarioAId: number;
  let usuarioBId: number;
  let profissionalId: number;

  beforeAll(async () => {
    const especialidade = await prisma.especialidade.create({
      data: { nome: 'Especialidade Teste', duracaoPadrao: 60 },
    });

    const profissional = await prisma.profissional.create({
      data: { nome: 'Profissional Teste', especialidadeId: especialidade.id },
    });
    profissionalId = profissional.id;

    const senhaHash = await bcrypt.hash('senha123', 10);

    const usuarioA = await prisma.usuario.create({
      data: { nome: 'Paciente A', email: 'paciente.a@teste.com', senhaHash },
    });
    usuarioAId = usuarioA.id;

    const usuarioB = await prisma.usuario.create({
      data: { nome: 'Paciente B', email: 'paciente.b@teste.com', senhaHash },
    });
    usuarioBId = usuarioB.id;

    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'paciente.a@teste.com', senha: 'senha123' });

    tokenPacienteA = loginResponse.body.token;
  });

  afterAll(async () => {
    await prisma.agendamento.deleteMany({
      where: { usuarioId: { in: [usuarioAId, usuarioBId] } },
    });
    await prisma.usuario.deleteMany({
      where: { id: { in: [usuarioAId, usuarioBId] } },
    });
    await prisma.profissional.deleteMany({ where: { id: profissionalId } });
    await prisma.especialidade.deleteMany({ where: { nome: 'Especialidade Teste' } });
    await prisma.$disconnect();
  });

  it('deve criar o agendamento usando o usuarioId do token, ignorando um usuarioId diferente enviado no body', async () => {
    const resposta = await request(app)
      .post('/agendamentos')
      .set('Authorization', `Bearer ${tokenPacienteA}`)
      .send({
        usuarioId: usuarioBId,
        profissionalId,
        dataHoraInicio: '2026-09-10T10:00:00.000Z',
        dataHoraFim: '2026-09-10T11:00:00.000Z',
      });

    expect(resposta.status).toBe(201);
    expect(resposta.body.usuarioId).toBe(usuarioAId);
  });

  it('deve listar apenas os agendamentos do usuário logado, mesmo existindo agendamentos de outro usuário', async () => {
    await prisma.agendamento.create({
      data: {
        usuarioId: usuarioBId,
        profissionalId,
        dataHoraInicio: new Date('2026-09-11T14:00:00.000Z'),
        dataHoraFim: new Date('2026-09-11T15:00:00.000Z'),
      },
    });

    const resposta = await request(app)
      .get('/agendamentos')
      .set('Authorization', `Bearer ${tokenPacienteA}`);

    expect(resposta.status).toBe(200);
    const idsRetornados = resposta.body.dados.map((a: any) => a.usuarioId);
    expect(idsRetornados.every((id: number) => id === usuarioAId)).toBe(true);
  });

  it('deve retornar 409 ao tentar criar um agendamento em conflito de horário com o mesmo profissional', async () => {
    const dataHoraInicio = '2026-09-15T09:00:00.000Z';

    const primeiraResposta = await request(app)
      .post('/agendamentos')
      .set('Authorization', `Bearer ${tokenPacienteA}`)
      .send({ profissionalId, dataHoraInicio });

    expect(primeiraResposta.status).toBe(201);

    const segundaResposta = await request(app)
      .post('/agendamentos')
      .set('Authorization', `Bearer ${tokenPacienteA}`)
      .send({ profissionalId, dataHoraInicio });

    expect(segundaResposta.status).toBe(409);
    expect(segundaResposta.body.erro).toContain('Conflito de horário');
  });
});