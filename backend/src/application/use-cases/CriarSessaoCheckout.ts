import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CriarSessaoCheckoutInput {
  agendamentoId: number;
  nomeEspecialidade: string;
  preco: number; 
}

export class CriarSessaoCheckout {
  async executar(input: CriarSessaoCheckoutInput): Promise<{ url: string }> {
    const precoNumerico = Number(input.preco);
  
    if (!precoNumerico || precoNumerico <= 0) {
      throw new Error(
        `Não é possível gerar cobrança: especialidade "${input.nomeEspecialidade}" está sem preço configurado (preco=${input.preco}).`
      );
    }

    const sessao = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: { name: `Consulta — ${input.nomeEspecialidade}` },
            unit_amount: Math.round(precoNumerico * 100), // 🔑 Stripe trabalha em centavos
          },
          quantity: 1,
        },
      ],
     
      metadata: {
        agendamentoId: String(input.agendamentoId),
      },
      success_url: `${process.env.FRONTEND_URL}/agendamentos?pagamento=sucesso`,
      cancel_url: `${process.env.FRONTEND_URL}/agendamentos/novo?pagamento=cancelado`,
    });

    return { url: sessao.url! };
  }
}