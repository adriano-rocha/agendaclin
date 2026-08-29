import { useState } from "react";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { useMetricas } from "../hooks/useMetricas";
import { useAuth } from "../hooks/useAuth";
import { useProfissionaisMap } from "../hooks/useProfissionaisMap";
import { ModalListaAgendamentos } from "../components/ModalListaAgendamentos";

type CategoriaCard = "total" | "pendentes" | "confirmadosHoje";

interface CardMetricaProps {
  titulo: string;
  valor: number;
  corAccent: string;
  corFundoIcone: string;
  icone: React.ElementType;
  onClick: () => void;
}

function CardMetrica({
  titulo,
  valor,
  corAccent,
  corFundoIcone,
  icone: Icone,
  onClick,
}: CardMetricaProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-left transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#055DF9]"
    >
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${corFundoIcone}`}>
        <Icone size={20} className={corAccent} />
      </div>
      <p className="text-sm text-gray-500">{titulo}</p>
      <p className={`mt-1 text-3xl font-semibold ${corAccent}`}>{valor}</p>
    </button>
  );
}

const TITULOS_MODAL: Record<CategoriaCard, string> = {
  total: "Total de agendamentos",
  pendentes: "Agendamentos pendentes",
  confirmadosHoje: "Confirmados hoje",
};

export function Dashboard() {
  const { metricas, listas, carregando, erro } = useMetricas();
  const { usuario } = useAuth();
  const { mapa: profissionaisMap } = useProfissionaisMap();
  const [categoriaAberta, setCategoriaAberta] = useState<CategoriaCard | null>(null);

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CardMetrica
            titulo="Total de agendamentos"
            valor={metricas.total}
            corAccent="text-[#055DF9]"
            corFundoIcone="bg-blue-50"
            icone={ClipboardList}
            onClick={() => setCategoriaAberta("total")}
          />
          <CardMetrica
            titulo="Pendentes"
            valor={metricas.pendentes}
            corAccent="text-yellow-600"
            corFundoIcone="bg-yellow-50"
            icone={Clock}
            onClick={() => setCategoriaAberta("pendentes")}
          />
          <CardMetrica
            titulo="Confirmados hoje"
            valor={metricas.confirmadosHoje}
            corAccent="text-green-600"
            corFundoIcone="bg-green-50"
            icone={CheckCircle2}
            onClick={() => setCategoriaAberta("confirmadosHoje")}
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