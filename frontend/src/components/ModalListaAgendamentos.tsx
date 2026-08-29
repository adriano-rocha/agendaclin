import type { Agendamento } from '../types/Agendamento';
import type { Profissional } from '../types/Profissional';

interface ModalListaAgendamentosProps {
  titulo: string;
  agendamentos: Agendamento[];
  profissionaisMap: Record<number, Profissional>;
  onFechar: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  CANCELADO: 'Cancelado',
  CONCLUIDO: 'Concluído',
};

function formatarHorario(dataHoraInicio: string) {
  return new Date(dataHoraInicio).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ModalListaAgendamentos({
  titulo,
  agendamentos,
  profissionaisMap,
  onFechar,
}: ModalListaAgendamentosProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm max-h-[80vh] flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>

        <div className="mt-4 flex-1 overflow-y-auto">
          {agendamentos.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum agendamento encontrado.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {agendamentos.map((agendamento) => {
                const profissional = profissionaisMap[agendamento.profissionalId];

                return (
                  <li key={agendamento.id} className="py-2.5 text-sm">
                    {profissional && (
                      <div className="mb-1">
                        <span className="font-medium text-gray-900">{profissional.nome}</span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({profissional.especialidade?.nome})
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {formatarHorario(agendamento.dataHoraInicio)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {STATUS_LABEL[agendamento.status] ?? agendamento.status}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onFechar}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}