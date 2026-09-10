import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { useAgendamentosSemana } from '../hooks/useAgendamentosSemana';
import { useProfissionaisMap } from '../hooks/useProfissionaisMap';
import { ModalConfirmacao } from '../components/ModalConfirmacao';
import { ModalDetalheAgendamento } from '../components/ModalDetalheAgendamento';
import { CalendarioSemanal } from '../components/CalendarioSemanal';
import { useAuth } from '../hooks/useAuth';
import type { Agendamento } from '../types/Agendamento';

type AcaoPendente = { tipo: 'cancelar' | 'confirmar'; id: number } | null;
type Visualizacao = 'lista' | 'calendario';

const CORES_STATUS: Record<string, string> = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
  CONCLUIDO: 'bg-gray-100 text-gray-800',
};

function obterInicioDaSemana(data: Date): Date {
  const inicio = new Date(data);
  inicio.setHours(0, 0, 0, 0);
  inicio.setDate(inicio.getDate() - inicio.getDay());
  return inicio;
}

function obterFimDaSemana(inicioDaSemana: Date): Date {
  const fim = new Date(inicioDaSemana);
  fim.setDate(inicioDaSemana.getDate() + 6);
  return fim;
}

function formatarIntervaloSemana(inicio: Date, fim: Date): string {
  const opcoes: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  return `${inicio.toLocaleDateString('pt-BR', opcoes)} – ${fim.toLocaleDateString('pt-BR', opcoes)}`;
}

export function Agendamentos() {
  const [statusFiltro, setStatusFiltro] = useState<string | undefined>(undefined);
  const [visualizacao, setVisualizacao] = useState<Visualizacao>('lista');
  const [semanaReferencia, setSemanaReferencia] = useState(() => new Date());
  const { agendamentos, pagina, setPagina, totalPaginas, carregando, erro, cancelar, confirmar } =
    useAgendamentos(1, statusFiltro);
  const { usuario } = useAuth();
  const { mapa: profissionaisMap } = useProfissionaisMap();
  const [acaoPendente, setAcaoPendente] = useState<AcaoPendente>(null);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null);

  const inicioDaSemana = obterInicioDaSemana(semanaReferencia);
  const fimDaSemana = obterFimDaSemana(inicioDaSemana);

  const {
    agendamentos: agendamentosDaSemana,
    carregando: carregandoSemana,
    erro: erroSemana,
  } = useAgendamentosSemana(inicioDaSemana, fimDaSemana, statusFiltro, visualizacao === 'calendario');

  function irParaSemanaAnterior() {
    setSemanaReferencia((atual) => {
      const nova = new Date(atual);
      nova.setDate(atual.getDate() - 7);
      return nova;
    });
  }

  function irParaProximaSemana() {
    setSemanaReferencia((atual) => {
      const nova = new Date(atual);
      nova.setDate(atual.getDate() + 7);
      return nova;
    });
  }

  function irParaHoje() {
    setSemanaReferencia(new Date());
  }

  async function executarAcaoPendente() {
    if (!acaoPendente) return;

    try {
      if (acaoPendente.tipo === 'cancelar') {
        await cancelar(acaoPendente.id);
        toast.success('Agendamento cancelado.');
      } else {
        await confirmar(acaoPendente.id);
        toast.success('Agendamento confirmado.');
      }
      setAcaoPendente(null);
    } catch {
      toast.error(
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
    <div className={`mx-auto px-4 py-8 ${visualizacao === 'calendario' ? 'max-w-6xl' : 'max-w-3xl'}`}>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Meus Agendamentos</h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-md border border-gray-200 p-0.5">
            <button
              onClick={() => setVisualizacao('lista')}
              className={`cursor-pointer rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                visualizacao === 'lista' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setVisualizacao('calendario')}
              className={`cursor-pointer rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                visualizacao === 'calendario' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Calendário
            </button>
          </div>

          <select
            value={statusFiltro ?? ''}
            onChange={(e) => setStatusFiltro(e.target.value || undefined)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 sm:w-auto"
          >
            <option value="">Todos os status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="CANCELADO">Cancelado</option>
            <option value="CONCLUIDO">Concluído</option>
          </select>

          <Link
            to="/agendamentos/novo"
            className="w-full text-center bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary-dark transition-colors sm:w-auto"
          >
            + Novo Agendamento
          </Link>
        </div>
      </div>

      {visualizacao === 'calendario' ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={irParaSemanaAnterior}
                className="cursor-pointer rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Semana anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={irParaProximaSemana}
                className="cursor-pointer rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Próxima semana"
              >
                <ChevronRight size={18} />
              </button>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {formatarIntervaloSemana(inicioDaSemana, fimDaSemana)}
              </span>
            </div>

            <button
              onClick={irParaHoje}
              className="cursor-pointer rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-primary/30 hover:bg-sky-50 hover:text-primary"
            >
              Hoje
            </button>
          </div>

          {carregandoSemana && (
            <p className="py-10 text-center text-sm text-gray-400">Carregando calendário...</p>
          )}

          {erroSemana && !carregandoSemana && (
            <p className="py-10 text-center text-sm text-red-600">{erroSemana}</p>
          )}

          {!carregandoSemana && !erroSemana && (
            <CalendarioSemanal
              agendamentos={agendamentosDaSemana}
              profissionaisMap={profissionaisMap}
              dataReferencia={semanaReferencia}
              onSelecionarAgendamento={setAgendamentoSelecionado}
            />
          )}
        </>
      ) : (
        <>
          {agendamentos.length === 0 && (
            <p className="text-gray-500 text-center py-10">Nenhum agendamento encontrado.</p>
          )}

          <ul className="space-y-3">
            {agendamentos.map((agendamento) => (
              <li
                key={agendamento.id}
                onClick={() => setAgendamentoSelecionado(agendamento)}
                className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm cursor-pointer transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setAcaoPendente({ tipo: 'cancelar', id: agendamento.id });
                      }}
                      className="cursor-pointer px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                    >
                      Cancelar
                    </button>
                  )}

                  {agendamento.status === 'PENDENTE' && usuario?.perfil === 'ADMIN' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAcaoPendente({ tipo: 'confirmar', id: agendamento.id });
                      }}
                      className="cursor-pointer px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
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
              className="cursor-pointer px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-gray-200"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              {pagina} de {totalPaginas}
            </span>
            <button
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina(pagina + 1)}
              className="cursor-pointer px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-gray-200"
            >
              Próxima
            </button>
          </div>
        </>
      )}

      {acaoPendente && (
        <ModalConfirmacao
          titulo={acaoPendente.tipo === 'cancelar' ? 'Cancelar agendamento' : 'Confirmar agendamento'}
          mensagem={`Tem certeza que deseja ${acaoPendente.tipo === 'cancelar' ? 'cancelar' : 'confirmar'} este agendamento?`}
          onConfirmar={executarAcaoPendente}
          onCancelar={() => setAcaoPendente(null)}
        />
      )}

      {agendamentoSelecionado && (
        <ModalDetalheAgendamento
          agendamento={agendamentoSelecionado}
          profissional={profissionaisMap[agendamentoSelecionado.profissionalId]}
          onFechar={() => setAgendamentoSelecionado(null)}
        />
      )}
    </div>
  );
}