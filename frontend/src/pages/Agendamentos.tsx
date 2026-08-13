// frontend/src/pages/Agendamentos.tsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { ModalConfirmacao } from '../components/ModalConfirmacao';
import { useAuth } from '../hooks/useAuth';

type AcaoPendente = { tipo: 'cancelar' | 'confirmar'; id: number } | null;

const CORES_STATUS: Record<string, string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
  CONCLUIDO: 'bg-gray-100 text-gray-800',
};

export function Agendamentos() {
  const [statusFiltro, setStatusFiltro] = useState<string | undefined>(undefined);
  const { agendamentos, pagina, setPagina, totalPaginas, carregando, erro, cancelar, confirmar } =
    useAgendamentos(1, statusFiltro);
  const { usuario } = useAuth();
  const [acaoPendente, setAcaoPendente] = useState<AcaoPendente>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  async function executarAcaoPendente() {
    if (!acaoPendente) return;

    setErroAcao(null);

    try {
      if (acaoPendente.tipo === 'cancelar') {
        await cancelar(acaoPendente.id);
      } else {
        await confirmar(acaoPendente.id);
      }
      setAcaoPendente(null);
    } catch {
      setErroAcao(
        acaoPendente.tipo === 'cancelar'
          ? 'Cancelamento só é permitido com no mínimo 2h de antecedência.'
          : 'Não foi possível confirmar este agendamento.'
      );
    }
  }

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Carregando agendamentos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">{erro}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meus Agendamentos</h1>

        <div className="flex items-center gap-3">
          <select
            value={statusFiltro ?? ''}
            onChange={(e) => setStatusFiltro(e.target.value || undefined)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
          >
            <option value="">Todos os status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="CANCELADO">Cancelado</option>
            <option value="CONCLUIDO">Concluído</option>
          </select>

          <Link
            to="/agendamentos/novo"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Novo Agendamento
          </Link>
        </div>
      </div>

      {agendamentos.length === 0 && (
        <p className="text-gray-500 text-center py-10">Nenhum agendamento encontrado.</p>
      )}

      <ul className="space-y-3">
        {agendamentos.map((agendamento) => (
          <li
            key={agendamento.id}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-900">
                {new Date(agendamento.dataHoraInicio).toLocaleString('pt-BR')}
              </span>
              <span
                className={`inline-block w-fit text-xs font-semibold px-2 py-1 rounded-full ${CORES_STATUS[agendamento.status]}`}
              >
                {agendamento.status}
              </span>
            </div>

            <div className="flex gap-2">
              {agendamento.status === 'PENDENTE' && (
                <button
                  onClick={() => setAcaoPendente({ tipo: 'cancelar', id: agendamento.id })}
                  className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                >
                  Cancelar
                </button>
              )}

              {agendamento.status === 'PENDENTE' && usuario?.perfil === 'ADMIN' && (
                <button
                  onClick={() => setAcaoPendente({ tipo: 'confirmar', id: agendamento.id })}
                  className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
                >
                  Confirmar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          disabled={pagina <= 1}
          onClick={() => setPagina(pagina - 1)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-gray-200"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          {pagina} de {totalPaginas}
        </span>
        <button
          disabled={pagina >= totalPaginas}
          onClick={() => setPagina(pagina + 1)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-gray-200"
        >
          Próxima
        </button>
      </div>

      {acaoPendente && (
        <ModalConfirmacao
          titulo={acaoPendente.tipo === 'cancelar' ? 'Cancelar agendamento' : 'Confirmar agendamento'}
          mensagem={`Tem certeza que deseja ${acaoPendente.tipo === 'cancelar' ? 'cancelar' : 'confirmar'} este agendamento?`}
          erro={erroAcao}
          onConfirmar={executarAcaoPendente}
          onCancelar={() => {
            setAcaoPendente(null);
            setErroAcao(null);
          }}
        />
      )}
    </div>
  );
}