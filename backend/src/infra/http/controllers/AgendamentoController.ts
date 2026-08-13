import { Request, Response } from "express";
import { CriarAgendamento } from "../../../application/use-cases/CriarAgendamento";
import { ListarAgendamentos } from "../../../application/use-cases/ListarAgendamentos";
import { BuscarAgendamentoPorId } from "../../../application/use-cases/BuscarAgendamentoPorId";
import { CancelarAgendamento } from "../../../application/use-cases/CancelarAgendamento";
import { ConfirmarAgendamento } from "../../../application/use-cases/ConfirmarAgendamento";
import { PrismaAgendamentoRepository } from "../../database/repositories/PrismaAgendamentoRepository";

const agendamentoRepository = new PrismaAgendamentoRepository();

export async function criarAgendamentoController(req: Request, res: Response) {
  try {
    const { usuarioId, profissionalId, dataHoraInicio } = req.body;

    if (!usuarioId || !profissionalId || !dataHoraInicio) {
      return res
        .status(400)
        .json({
          erro: "usuarioId, profissionalId e dataHoraInicio são obrigatórios.",
        });
    }

    const criarAgendamento = new CriarAgendamento(agendamentoRepository);

    const novoAgendamento = await criarAgendamento.executar({
      usuarioId: Number(usuarioId),
      profissionalId: Number(profissionalId),
      dataHoraInicio: new Date(dataHoraInicio),
    });

    return res.status(201).json(novoAgendamento);
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

    const filtros: any = {};

    if (!usuarioLogado) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    if (profissionalId) filtros.profissionalId = Number(profissionalId);
    if (status) filtros.status = String(status);
    if (dataInicio) filtros.dataInicio = new Date(String(dataInicio));
    if (dataFim) filtros.dataFim = new Date(String(dataFim));

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
