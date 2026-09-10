import { useState, useEffect, useCallback } from 'react';
import { listarAgendamentos } from '../services/agendamentoService';
import type { Agendamento } from '../types/Agendamento';

// ATENÇÃO: assume que o back-end filtra os agendamentos pelo usuário autenticado
// quando o perfil não é ADMIN. Ver aviso na conversa sobre esse ponto.
export function useProximaConsulta() {
  const [proximaConsulta, setProximaConsulta] = useState<Agendamento | null>(null);
  const [totalFuturas, setTotalFuturas] = useState(0);
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

      const agora = Date.now();
      const futuras = todos
        .filter(
          (a) =>
            (a.status === 'PENDENTE' || a.status === 'CONFIRMADO') &&
            new Date(a.dataHoraInicio).getTime() >= agora
        )
        .sort(
          (a, b) => new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime()
        );

      setProximaConsulta(futuras[0] ?? null);
      setTotalFuturas(futuras.length);
    } catch {
      setErro('Não foi possível carregar sua próxima consulta.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      buscar();
    });
  }, [buscar]);

  return { proximaConsulta, totalFuturas, carregando, erro };
}