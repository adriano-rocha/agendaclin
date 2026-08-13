import { useState, useEffect, useCallback } from 'react';
import {
  listarAgendamentos,
  criarAgendamento,
  cancelarAgendamento,
  confirmarAgendamento,
} from '../services/agendamentoService';
import type { Agendamento, CriarAgendamentoPayload } from '../types/Agendamento';

export function useAgendamentos(paginaInicial = 1, statusFiltro?: string) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [pagina, setPagina] = useState(paginaInicial);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await listarAgendamentos({ page: pagina, status: statusFiltro });
      setAgendamentos(resultado.dados);
      setTotalPaginas(resultado.totalPaginas);
    } catch {
      setErro('Não foi possível carregar os agendamentos.');
    } finally {
      setCarregando(false);
    }
  }, [pagina, statusFiltro]);

 useEffect(() => {
  queueMicrotask(() => {
    buscar();
  });
}, [buscar]);

  async function criar(payload: CriarAgendamentoPayload) {
    await criarAgendamento(payload);
    await buscar(); // recarrega a lista após criar
  }

  async function cancelar(id: number) {
    await cancelarAgendamento(id);
    await buscar();
  }

  async function confirmar(id: number) {
    await confirmarAgendamento(id);
    await buscar();
  }

  return {
    agendamentos,
    pagina,
    setPagina,
    totalPaginas,
    carregando,
    erro,
    criar,
    cancelar,
    confirmar,
  };
}