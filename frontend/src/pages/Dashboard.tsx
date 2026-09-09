// frontend/src/pages/Dashboard.tsx
import { useState } from "react";
import { useMetricas } from "../hooks/useMetricas";
import { useAuth } from "../hooks/useAuth";
import { useProfissionaisMap } from "../hooks/useProfissionaisMap";
import { ModalListaAgendamentos } from "../components/ModalListaAgendamentos";
import { Sparkline } from "../components/Sparkline";
import { DonutStatusAgendamentos } from "../components/DonutStatusAgendamentos";
import { BarraComparativaAgendamentos } from "../components/BarraComparativaAgendamentos";

type CategoriaCard = "total" | "pendentes" | "confirmadosHoje" | "faltaram";

interface CardMetricaProps {
  titulo: string;
  valor: number;
  corAccent: string;
  corBarra: string;
  corHex: string;
  tendencia: number[];
  onClick: () => void;
}

function CardMetrica({
  titulo,
  valor,
  corAccent,
  corBarra,
  corHex,
  tendencia,
  onClick,
}: CardMetricaProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-5 pl-6 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#055DF9]"
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 ${corBarra}`} />
      <div>
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className={`mt-1 text-3xl font-semibold ${corAccent}`}>{valor}</p>
      </div>
      <Sparkline dados={tendencia} cor={corHex} />
    </button>
  );
}

const TITULOS_MODAL: Record<CategoriaCard, string> = {
  total: "Total de agendamentos",
  pendentes: "Agendamentos pendentes",
  confirmadosHoje: "Confirmados hoje",
  faltaram: "Pacientes que faltaram",
};

export function Dashboard() {
  const { metricas, listas, tendencias, carregando, erro } = useMetricas();
  const { usuario } = useAuth();
  const { mapa: profissionaisMap } = useProfissionaisMap();
  const [categoriaAberta, setCategoriaAberta] = useState<CategoriaCard | null>(
    null,
  );

  return (
    <div className="space-y-8">
      <header className="border-b border-gray-200 pb-6">
        <p className="text-sm font-medium text-[#055DF9]">Painel de controle</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">
          Olá, {usuario?.nome ?? "bem-vindo"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Acompanhe aqui os agendamentos e indicadores da clínica.
        </p>
      </header>

      {carregando && <p className="text-gray-500">Carregando métricas...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      {!carregando && !erro && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CardMetrica
            titulo="Total de agendamentos"
            valor={metricas.total}
            corAccent="text-[#055DF9]"
            corBarra="bg-[#055DF9]"
            corHex="#055DF9"
            tendencia={tendencias.total}
            onClick={() => setCategoriaAberta("total")}
          />
          <CardMetrica
            titulo="Pendentes"
            valor={metricas.pendentes}
            corAccent="text-yellow-600"
            corBarra="bg-yellow-500"
            corHex="#ca8a04"
            tendencia={tendencias.pendentes}
            onClick={() => setCategoriaAberta("pendentes")}
          />
          <CardMetrica
            titulo="Confirmados hoje"
            valor={metricas.confirmadosHoje}
            corAccent="text-green-600"
            corBarra="bg-green-600"
            corHex="#16a34a"
            tendencia={tendencias.confirmadosHoje}
            onClick={() => setCategoriaAberta("confirmadosHoje")}
          />
          <CardMetrica
            titulo="Faltaram"
            valor={metricas.faltaram}
            corAccent="text-red-600"
            corBarra="bg-red-600"
            corHex="#dc2626"
            tendencia={tendencias.faltaram}
            onClick={() => setCategoriaAberta("faltaram")}
          />
        </div>
      )}

      {!carregando && !erro && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DonutStatusAgendamentos
            pendentes={metricas.pendentesAtivos}
            confirmadosHoje={metricas.confirmadosHoje}
            faltaram={metricas.faltaram}
            total={metricas.total}
          />
          <BarraComparativaAgendamentos
            total={metricas.total}
            pendentes={metricas.pendentes}
            confirmadosHoje={metricas.confirmadosHoje}
            faltaram={metricas.faltaram}
          />
        </div>
      )}

      {categoriaAberta && (
        <ModalListaAgendamentos
          titulo={TITULOS_MODAL[categoriaAberta]}
          agendamentos={listas[categoriaAberta]}
          profissionaisMap={profissionaisMap}
          onFechar={() => setCategoriaAberta(null)}
        />
      )}
    </div>
  );
}
