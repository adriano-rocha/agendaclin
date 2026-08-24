import { useMetricas } from '../hooks/useMetricas';

interface CardMetricaProps {
  titulo: string;
  valor: number;
  corAccent: string;
}

function CardMetrica({ titulo, valor, corAccent }: CardMetricaProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
      <p className="text-sm text-gray-400">{titulo}</p>
      <p className={`mt-2 text-3xl font-semibold ${corAccent}`}>{valor}</p>
    </div>
  );
}

export function Dashboard() {
  const { metricas, carregando, erro } = useMetricas();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-100">Dashboard</h1>

      {carregando && <p className="text-gray-400">Carregando métricas...</p>}
      {erro && <p className="text-red-400">{erro}</p>}

      {!carregando && !erro && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CardMetrica
            titulo="Total de agendamentos"
            valor={metricas.total}
            corAccent="text-blue-400"
          />
          <CardMetrica
            titulo="Pendentes"
            valor={metricas.pendentes}
            corAccent="text-yellow-400"
          />
          <CardMetrica
            titulo="Confirmados hoje"
            valor={metricas.confirmadosHoje}
            corAccent="text-green-400"
          />
        </div>
      )}
    </div>
  );
}