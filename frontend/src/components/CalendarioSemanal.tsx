import { useMemo } from 'react';
import type { Agendamento } from '../types/Agendamento';
import type { Profissional } from '../types/Profissional';

interface CalendarioSemanalProps {
  agendamentos: Agendamento[];
  profissionaisMap: Record<number, Profissional>;
  dataReferencia?: Date;
  onSelecionarAgendamento: (agendamento: Agendamento) => void;
}

const HORARIOS_GRADE = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const CORES_BLOCO: Record<string, string> = {
  PENDENTE: 'border-yellow-500 bg-yellow-50 text-yellow-800',
  CONFIRMADO: 'border-green-600 bg-green-50 text-green-800',
  CANCELADO: 'border-red-400 bg-red-50 text-red-600 line-through opacity-70',
  CONCLUIDO: 'border-gray-400 bg-gray-50 text-gray-600',
};

function obterInicioDaSemana(data: Date): Date {
  const inicio = new Date(data);
  inicio.setHours(0, 0, 0, 0);
  inicio.setDate(inicio.getDate() - inicio.getDay());
  return inicio;
}

function ehMesmoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function chaveHora(horario: string): number {
  return Number(horario.split(':')[0]);
}

export function CalendarioSemanal({
  agendamentos,
  profissionaisMap,
  dataReferencia = new Date(),
  onSelecionarAgendamento,
}: CalendarioSemanalProps) {
  const diasDaSemana = useMemo(() => {
    const inicio = obterInicioDaSemana(dataReferencia);
    return Array.from({ length: 7 }, (_, i) => {
      const dia = new Date(inicio);
      dia.setDate(inicio.getDate() + i);
      return dia;
    });
  }, [dataReferencia]);

  const hoje = new Date();

  function agendamentosDoSlot(dia: Date, horario: string): Agendamento[] {
    return agendamentos.filter((a) => {
      const data = new Date(a.dataHoraInicio);
      return ehMesmoDia(data, dia) && data.getHours() === chaveHora(horario);
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <div className="min-w-180">
          <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-gray-200">
            <div className="border-r border-gray-100" />
            {diasDaSemana.map((dia, i) => {
              const ehHoje = ehMesmoDia(dia, hoje);
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-0.5 border-r border-gray-100 py-3 last:border-r-0 ${
                    ehHoje ? 'bg-sky-50' : ''
                  }`}
                >
                  <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {DIAS_SEMANA_ABREV[i]}
                  </span>
                  <span className={`text-sm font-semibold ${ehHoje ? 'text-primary' : 'text-gray-700'}`}>
                    {dia.getDate()}
                  </span>
                </div>
              );
            })}
          </div>

          {HORARIOS_GRADE.map((horario) => (
            <div
              key={horario}
              className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start justify-end border-r border-gray-100 px-2 py-2">
                <span className="text-xs text-gray-400">{horario}</span>
              </div>
              {diasDaSemana.map((dia, i) => {
                const eventos = agendamentosDoSlot(dia, horario);

                return (
                  <div
                    key={i}
                    className="min-h-16 space-y-1 border-r border-gray-100 p-1 transition-colors last:border-r-0 hover:bg-gray-50"
                  >
                    {eventos.map((agendamento) => {
                      const profissional = profissionaisMap[agendamento.profissionalId];

                      return (
                        <button
                          key={agendamento.id}
                          type="button"
                          onClick={() => onSelecionarAgendamento(agendamento)}
                          className={`w-full cursor-pointer rounded border-l-2 px-1.5 py-1 text-left text-[11px] leading-tight transition-opacity hover:opacity-80 ${CORES_BLOCO[agendamento.status]}`}
                        >
                          <p className="font-semibold">
                            {new Date(agendamento.dataHoraInicio).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {profissional && <p className="truncate">{profissional.nome}</p>}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}