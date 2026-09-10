import { useState, useEffect } from "react";
import { listarAgendamentos } from "../services/agendamentoService";

export function useContagemPendentes() {
  const [contagem, setContagem] = useState(0);

  useEffect(() => {
    async function buscarContagem() {
      try {
        const resultado = await listarAgendamentos({ status: "PENDENTE", page: 1 });
        setContagem(resultado.total);
      } catch {
        setContagem(0);
      }
    }

    queueMicrotask(buscarContagem);
  }, []);

  return contagem;
}