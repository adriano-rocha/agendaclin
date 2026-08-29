import { useEffect, useState } from 'react';
import { listarProfissionais } from '../services/profissionalService';
import type { Profissional } from '../types/Profissional';

export function useProfissionaisMap() {
  const [mapa, setMapa] = useState<Record<number, Profissional>>({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarProfissionais();
        const novoMapa: Record<number, Profissional> = {};
        dados.forEach((prof) => {
          novoMapa[prof.id] = prof;
        });
        setMapa(novoMapa);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  return { mapa, carregando };
}