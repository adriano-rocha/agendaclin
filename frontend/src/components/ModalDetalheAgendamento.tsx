// frontend/src/components/ModalDetalheAgendamento.tsx
import type { Agendamento } from '../types/Agendamento';
import type { Profissional } from '../types/Profissional';

interface ModalDetalheAgendamentoProps {
  agendamento: Agendamento;
  profissional?: Profissional;
  onFechar: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  CANCELADO: 'Cancelado',
  CONCLUIDO: 'Concluído',
};

export function ModalDetalheAgendamento({
  agendamento,
  profissional,
  onFechar,
}: ModalDetalheAgendamentoProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900">Detalhes do agendamento</h3>

        <div className="mt-4 space-y-1 text-sm">
          <p className="text-gray-700">
            {new Date(agendamento.dataHoraInicio).toLocaleString('pt-BR')}
          </p>
          <p className="text-gray-500">
            {STATUS_LABEL[agendamento.status] ?? agendamento.status}
          </p>

          {profissional && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="font-medium text-gray-900">{profissional.nome}</p>
              <p className="text-gray-500">{profissional.especialidade?.nome}</p>
            </div>
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