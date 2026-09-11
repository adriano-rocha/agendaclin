import { Request, Response } from "express";
import Stripe from "stripe";
import { PrismaAgendamentoRepository } from "../../database/repositories/PrismaAgendamentoRepository";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const agendamentoRepository = new PrismaAgendamentoRepository();

export async function tratarWebhookStripeController(
  req: Request,
  res: Response,
) {
  const assinatura = req.headers["stripe-signature"] as string;

  let evento: Stripe.Event;

  try {
    evento = stripe.webhooks.constructEvent(
      req.body,
      assinatura,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (erro: any) {
    console.error("Assinatura do webhook inválida:", erro.message);
    return res.status(400).json({ erro: "Assinatura inválida." });
  }

  if (evento.type === "checkout.session.completed") {
    const sessao = evento.data.object as Stripe.Checkout.Session;
    const agendamentoId = Number(sessao.metadata?.agendamentoId);

    if (agendamentoId) {
      await agendamentoRepository.atualizarStatus(agendamentoId, "CONFIRMADO");
    }
  }

  return res.status(200).json({ recebido: true });
}
