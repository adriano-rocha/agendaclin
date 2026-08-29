// frontend/src/hooks/useMetricas.ts
import { useState, useEffect, useCallback } from 'react';
import { listarAgendamentos } from '../services/agendamentoService';
import type { Agendamento } from '../types/Agendamento';

interface Metricas {
  total: number;
  pendentes: number;
  confirmadosHoje: number;
}

interface ListasPorCategoria {
  total: Agendamento[];
  pendentes: Agendamento[];
  confirmadosHoje: Agendamento[];
}

function ehHoje(dataHoraInicio: string) {
  const data = new Date(dataHoraInicio);
  const hoje = new Date();
  return (
    data.getFullYear() === hoje.getFullYear() &&
    data.getMonth() === hoje.getMonth() &&
    data.getDate() === hoje.getDate()
  );
}

export function useMetricas() {
  const [metricas, setMetricas] = useState<Metricas>({
    total: 0,
    pendentes: 0,
    confirmadosHoje: 0,
  });
  const [listas, setListas] = useState<ListasPorCategoria>({
    total: [],
    pendentes: [],
    confirmadosHoje: [],
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const primeira = await listarAgendamentos({ page: 1 });
      let todos: Agendamento[] = [...primeira.dados];

      if (primeira.totalPaginas > 1) {
        const restantes = await Promise.all(
          Array.from({ length: primeira.totalPaginas - 1 }, (_, i) =>
            listarAgendamentos({ page: i + 2 })
          )
        );
        restantes.forEach((resultado) => {
          todos = todos.concat(resultado.dados);
        });
      }

      const pendentes = todos.filter((a) => a.status === 'PENDENTE');
      const confirmadosHoje = todos.filter(
        (a) => a.status === 'CONFIRMADO' && ehHoje(a.dataHoraInicio)
      );

      setMetricas({
        total: todos.length,
        pendentes: pendentes.length,
        confirmadosHoje: confirmadosHoje.length,
      });
      setListas({ total: todos, pendentes, confirmadosHoje });
    } catch {
      setErro('Não foi possível carregar as métricas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      buscar();
    });
  }, [buscar]);

  return { metricas, listas, carregando, erro };
}