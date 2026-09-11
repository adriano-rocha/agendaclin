import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CriarSessaoCheckoutInput {
  agendamentoId: number;
  nomeEspecialidade: string;
  preco: number; // em reais (ex: 150.00)
}

export class CriarSessaoCheckout {
  async executar(input: CriarSessaoCheckoutInput): Promise<{ url: string }> {
    const sessao = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: `Consulta — ${input.nomeEspecialidade}` },
            unit_amount: Math.round(input.preco * 100), // 🔑 Stripe trabalha em centavos
          },
          quantity: 1,
        },
      ],
      // 🔑 metadata viaja junto com a sessão e volta pro webhook depois —
      // é assim que o webhook sabe QUAL agendamento confirmar.
      metadata: {
        agendamentoId: String(input.agendamentoId),
      },
      success_url: `${process.env.FRONTEND_URL}/agendamentos?pagamento=sucesso`,
      cancel_url: `${process.env.FRONTEND_URL}/agendamentos/novo?pagamento=cancelado`,
    });

    return { url: sessao.url! };
  }
}