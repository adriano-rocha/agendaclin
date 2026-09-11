import { Request, Response } from "express";
import { CriarAgendamento } from "../../../application/use-cases/CriarAgendamento";
import { ListarAgendamentos } from "../../../application/use-cases/ListarAgendamentos";
import { BuscarAgendamentoPorId } from "../../../application/use-cases/BuscarAgendamentoPorId";
import { CancelarAgendamento } from "../../../application/use-cases/CancelarAgendamento";
import { ConfirmarAgendamento } from "../../../application/use-cases/ConfirmarAgendamento";
import { PrismaAgendamentoRepository } from "../../database/repositories/PrismaAgendamentoRepository";
import { ListarHorariosOcupados } from "../../../application/use-cases/ListarHorariosOcupados";
import { PrismaProfissionalRepository } from "../../database/repositories/PrismaProfissionalRepository";
import { PrismaEspecialidadeRepository } from "../../database/repositories/PrismaEspecialidadeRepository";
import { CriarSessaoCheckout } from "../../../application/use-cases/CriarSessaoCheckout";

const profissionalRepository = new PrismaProfissionalRepository();
const especialidadeRepository = new PrismaEspecialidadeRepository();
const criarSessaoCheckout = new CriarSessaoCheckout();

const agendamentoRepository = new PrismaAgendamentoRepository();

export async function criarAgendamentoController(req: Request, res: Response) {
  try {
    const usuarioLogado = req.usuario;

    if (!usuarioLogado) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const { profissionalId, dataHoraInicio } = req.body;

    if (!profissionalId || !dataHoraInicio) {
      return res.status(400).json({
        erro: "profissionalId e dataHoraInicio são obrigatórios.",
      });
    }

    const criarAgendamento = new CriarAgendamento(agendamentoRepository);

    const novoAgendamento = await criarAgendamento.executar({
      usuarioId: usuarioLogado.id,
      profissionalId: Number(profissionalId),
      dataHoraInicio: new Date(dataHoraInicio),
    });

    // 🔑 Profissional → Especialidade → preço, usando os repositórios
    // já testados (com a conversão Number(preco) garantida).
    const profissional = await profissionalRepository.buscarPorId(novoAgendamento.profissionalId);
    const especialidade = profissional
      ? await especialidadeRepository.buscarPorId(profissional.especialidadeId)
      : null;

    if (!especialidade) {
      // Agendamento já foi criado — não desfazemos por segurança, só avisamos.
      return res.status(201).json({
        ...novoAgendamento,
        erroPagamento: "Especialidade não encontrada para gerar cobrança.",
      });
    }

    const sessao = await criarSessaoCheckout.executar({
      agendamentoId: novoAgendamento.id!,
      nomeEspecialidade: especialidade.nome,
      preco: especialidade.preco,
    });

    return res.status(201).json({
      agendamento: novoAgendamento,
      urlPagamento: sessao.url,
    });
  } catch (erro) {
    if (erro instanceof Error && erro.message.includes("Conflito de horário")) {
      return res.status(409).json({ erro: erro.message });
    }
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao criar agendamento." });
  }
}

export async function listarAgendamentosController(
  req: Request,
  res: Response,
) {
  try {
    const { profissionalId, status, dataInicio, dataFim, page, limit } =
      req.query;
    const usuarioLogado = req.usuario;

    if (!usuarioLogado) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const filtros: any = {};

    if (profissionalId) filtros.profissionalId = Number(profissionalId);
    if (status) filtros.status = String(status);
    if (dataInicio) filtros.dataInicio = new Date(String(dataInicio));
    if (dataFim) filtros.dataFim = new Date(String(dataFim));

    // Regra de permissão: não-admin só vê os próprios agendamentos
    if (usuarioLogado.perfil !== "ADMIN") {
      filtros.usuarioId = usuarioLogado.id;
    }

    const listarAgendamentos = new ListarAgendamentos(agendamentoRepository);

    const resultado = await listarAgendamentos.executar({
      filtros,
      pagina: page ? Number(page) : 1,
      limite: limit ? Number(limit) : 10,
    });

    return res.status(200).json(resultado);
  } catch (erro) {
    console.error(erro);
    return res
      .status(500)
      .json({ erro: "Erro interno ao listar agendamentos." });
  }
}

export async function buscarAgendamentoPorIdController(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.params;
    const usuarioLogado = req.usuario;

    const buscarAgendamentoPorId = new BuscarAgendamentoPorId(
      agendamentoRepository,
    );
    const agendamento = await buscarAgendamentoPorId.executar(Number(id));

    // Regra de permissão: não-admin só pode ver o próprio agendamento
    if (!usuarioLogado) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    if (
      usuarioLogado.perfil !== "ADMIN" &&
      agendamento.usuarioId !== usuarioLogado.id
    ) {
      return res
        .status(403)
        .json({ erro: "Acesso negado a este agendamento." });
    }

    return res.status(200).json(agendamento);
  } catch (erro) {
    if (erro instanceof Error && erro.message.includes("não encontrado")) {
      return res.status(404).json({ erro: erro.message });
    }
    console.error(erro);
    return res
      .status(500)
      .json({ erro: "Erro interno ao buscar agendamento." });
  }
}
export async function listarHorariosOcupadosController(
  req: Request,
  res: Response,
) {
  try {
    const { profissionalId, data } = req.query;

    if (!profissionalId || !data) {
      return res
        .status(400)
        .json({ erro: "profissionalId e data são obrigatórios." });
    }

    const listarHorariosOcupados = new ListarHorariosOcupados(
      agendamentoRepository,
    );

    const horariosOcupados = await listarHorariosOcupados.executar({
      profissionalId: Number(profissionalId),
      data: String(data),
    });
    return res.status(200).json({ horariosOcupados });
  } catch (erro) {
    console.error(erro);
    return res
      .status(500)
      .json({ erro: "Erro interno ao buscar horários ocupados." });
  }
}

export async function cancelarAgendamentoController(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.params;
    const usuarioLogado = req.usuario;

    const buscarAgendamentoPorId = new BuscarAgendamentoPorId(
      agendamentoRepository,
    );
    const agendamentoExistente = await buscarAgendamentoPorId.executar(
      Number(id),
    );

    // Regra de permissão: não-admin só pode cancelar o próprio agendamento
    if (!usuarioLogado) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    if (
      usuarioLogado.perfil !== "ADMIN" &&
      agendamentoExistente.usuarioId !== usuarioLogado.id
    ) {
      return res
        .status(403)
        .json({ erro: "Acesso negado a este agendamento." });
    }
    const cancelarAgendamento = new CancelarAgendamento(agendamentoRepository);
    const agendamentoCancelado = await cancelarAgendamento.executar(Number(id));

    return res.status(200).json(agendamentoCancelado);
  } catch (erro) {
    if (erro instanceof Error && erro.message.includes("não encontrado")) {
      return res.status(404).json({ erro: erro.message });
    }
    if (
      erro instanceof Error &&
      (erro.message.includes("antecedência") ||
        erro.message.includes("já está cancelado"))
    ) {
      return res.status(400).json({ erro: erro.message });
    }
    console.error(erro);
    return res
      .status(500)
      .json({ erro: "Erro interno ao cancelar agendamento." });
  }
}

export async function confirmarAgendamentoController(
  req: Request,
  res: Response,
) {
  try {
    const { id } = req.params;

    const confirmarAgendamento = new ConfirmarAgendamento(
      agendamentoRepository,
    );
    const agendamentoConfirmado = await confirmarAgendamento.executar(
      Number(id),
    );

    return res.status(200).json(agendamentoConfirmado);
  } catch (erro) {
    if (erro instanceof Error && erro.message.includes("não encontrado")) {
      return res.status(404).json({ erro: erro.message });
    }
    if (erro instanceof Error && erro.message.includes("pendentes")) {
      return res.status(400).json({ erro: erro.message });
    }
    console.error(erro);
    return res
      .status(500)
      .json({ erro: "Erro interno ao confirmar agendamento." });
  }
}
