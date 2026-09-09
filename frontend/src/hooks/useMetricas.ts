import { useState, useEffect, useCallback } from 'react';
import { listarAgendamentos } from '../services/agendamentoService';
import type { Agendamento } from '../types/Agendamento';

interface Metricas {
  total: number;
  pendentes: number;
  confirmadosHoje: number;
  faltaram: number;
  pendentesAtivos: number; 
}

interface ListasPorCategoria {
  total: Agendamento[];
  pendentes: Agendamento[];
  confirmadosHoje: Agendamento[];
  faltaram: Agendamento[];
}

interface Tendencias {
  total: number[];
  pendentes: number[];
  confirmadosHoje: number[];
  faltaram: number[];
}

const DIAS_TENDENCIA = 7;

function ehHoje(dataHoraInicio: string) {
  const data = new Date(dataHoraInicio);
  const hoje = new Date();
  return (
    data.getFullYear() === hoje.getFullYear() &&
    data.getMonth() === hoje.getMonth() &&
    data.getDate() === hoje.getDate()
  );
}

// TODO: quando existir status FALTOU no back-end, trocar essa derivação por filtro direto de status
function jaPassou(dataHoraInicio: string) {
  return new Date(dataHoraInicio).getTime() < Date.now();
}

// Agrupa uma lista pela data de CRIAÇÃO (criadoEm), contando quantos itens
// foram criados em cada um dos últimos `dias` dias (índice 0 = mais antigo, último = hoje).
function agruparPorDiaCriacao(lista: Agendamento[], dias: number): number[] {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const baldes = Array(dias).fill(0);

  lista.forEach((a) => {
    const criado = new Date(a.criadoEm);
    criado.setHours(0, 0, 0, 0);
    const diffDias = Math.round((hoje.getTime() - criado.getTime()) / 86400000);
    const indice = dias - 1 - diffDias;
    if (indice >= 0 && indice < dias) {
      baldes[indice] += 1;
    }
  });

  return baldes;
}

export function useMetricas() {
  const [metricas, setMetricas] = useState<Metricas>({
    total: 0,
    pendentes: 0,
    confirmadosHoje: 0,
    faltaram: 0,
    pendentesAtivos: 0,
  });
  const [listas, setListas] = useState<ListasPorCategoria>({
    total: [],
    pendentes: [],
    confirmadosHoje: [],
    faltaram: [],
  });
  const [tendencias, setTendencias] = useState<Tendencias>({
    total: [],
    pendentes: [],
    confirmadosHoje: [],
    faltaram: [],
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
      const confirmadosTodos = todos.filter((a) => a.status === 'CONFIRMADO');
      const faltaram = todos.filter(
        (a) =>
          (a.status === 'PENDENTE' || a.status === 'CONFIRMADO') &&
          jaPassou(a.dataHoraInicio)
      );

      // Pendentes que ainda não passaram — mutuamente exclusivo com "faltaram", usado no donut
      const pendentesAtivos = pendentes.filter((a) => !jaPassou(a.dataHoraInicio));

      setMetricas({
        total: todos.length,
        pendentes: pendentes.length,
        confirmadosHoje: confirmadosHoje.length,
        faltaram: faltaram.length,
        pendentesAtivos: pendentesAtivos.length,
      });
      setListas({ total: todos, pendentes, confirmadosHoje, faltaram });
      setTendencias({
        total: agruparPorDiaCriacao(todos, DIAS_TENDENCIA),
        pendentes: agruparPorDiaCriacao(pendentes, DIAS_TENDENCIA),
        confirmadosHoje: agruparPorDiaCriacao(confirmadosTodos, DIAS_TENDENCIA),
        faltaram: agruparPorDiaCriacao(faltaram, DIAS_TENDENCIA),
      });
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

  return { metricas, listas, tendencias, carregando, erro };
}