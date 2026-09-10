import { Link } from 'react-router-dom';
import type { Agendamento } from '../types/Agendamento';
import type { Profissional } from '../types/Profissional';

interface CardProximaConsultaProps {
  consulta: Agendamento | null;
  profissional?: Profissional;
  totalFuturas: number;
}

function formatarDataConsulta(dataHoraInicio: string) {
  const data = new Date(dataHoraInicio);
  const dataFormatada = data.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
  const horaFormatada = data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return { dataFormatada, horaFormatada };
}

export function CardProximaConsulta({ consulta, profissional, totalFuturas }: CardProximaConsultaProps) {
  if (!consulta) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-base font-medium text-gray-900">Você não tem nenhuma consulta agendada.</p>
        <p className="mt-1 text-sm text-gray-500">Que tal marcar sua próxima consulta agora mesmo?</p>
        <Link
          to="/agendamentos/novo"
          className="mt-5 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Agendar consulta
        </Link>
      </div>
    );
  }

  const { dataFormatada, horaFormatada } = formatarDataConsulta(consulta.dataHoraInicio);
  const restantes = totalFuturas - 1;

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <span className="absolute inset-y-0 left-0 w-1.5 bg-primary" />
      <div className="pl-3 sm:pl-4">
        <p className="text-sm font-medium text-gray-500">Sua próxima consulta</p>
        <p className="mt-1 text-2xl font-semibold capitalize text-gray-900">
          {dataFormatada} às {horaFormatada}
        </p>

        {profissional && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900">{profissional.nome}</p>
            <p className="text-sm text-gray-500">{profissional.especialidade?.nome}</p>
          </div>
        )}

        <span
          className={`mt-4 inline-block rounded-full px-2 py-1 text-xs font-semibold ${
            consulta.status === 'CONFIRMADO'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {consulta.status === 'CONFIRMADO' ? 'Confirmado' : 'Pendente de confirmação'}
        </span>

        {restantes > 0 && (
          <p className="mt-4 text-sm text-gray-500">
            Você tem mais {restantes} consulta{restantes > 1 ? 's' : ''} agendada{restantes > 1 ? 's' : ''}.
          </p>
        )}
      </div>
    </div>
  );
}