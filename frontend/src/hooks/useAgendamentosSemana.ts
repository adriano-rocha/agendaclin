import { useState, useEffect, useCallback } from 'react';
import { listarAgendamentos } from '../services/agendamentoService';
import type { Agendamento } from '../types/Agendamento';

function formatarDataISO(data: Date): string {
  return data.toISOString().slice(0, 10);
}

export function useAgendamentosSemana(
  inicio: Date,
  fim: Date,
  statusFiltro?: string,
  habilitado = true
) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const dataInicio = formatarDataISO(inicio);
  const dataFim = formatarDataISO(fim);

  const buscar = useCallback(async () => {
    if (!habilitado) return;

    setCarregando(true);
    setErro(null);
    try {
      const primeira = await listarAgendamentos({
        page: 1,
        status: statusFiltro,
        dataInicio,
        dataFim,
      });
      let todos: Agendamento[] = [...primeira.dados];

      if (primeira.totalPaginas > 1) {
        const restantes = await Promise.all(
          Array.from({ length: primeira.totalPaginas - 1 }, (_, i) =>
            listarAgendamentos({
              page: i + 2,
              status: statusFiltro,
              dataInicio,
              dataFim,
            })
          )
        );
        restantes.forEach((resultado) => {
          todos = todos.concat(resultado.dados);
        });
      }

      setAgendamentos(todos);
    } catch {
      setErro('Não foi possível carregar os agendamentos da semana.');
    } finally {
      setCarregando(false);
    }
  }, [dataInicio, dataFim, statusFiltro, habilitado]);

  useEffect(() => {
    queueMicrotask(() => {
      buscar();
    });
  }, [buscar]);

  return { agendamentos, carregando, erro };
}