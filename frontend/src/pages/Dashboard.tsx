import { useState } from "react";
import { Link } from "react-router-dom";
import { useMetricas } from "../hooks/useMetricas";
import { useProximaConsulta } from "../hooks/useProximaConsulta";
import { useAuth } from "../hooks/useAuth";
import { useProfissionaisMap } from "../hooks/useProfissionaisMap";
import { ModalListaAgendamentos } from "../components/ModalListaAgendamentos";
import { Sparkline } from "../components/Sparkline";
import { DonutStatusAgendamentos } from "../components/DonutStatusAgendamentos";
import { BarraComparativaAgendamentos } from "../components/BarraComparativaAgendamentos";
import { CardProximaConsulta } from "../components/CardProximaConsulta";

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

function DashboardAdmin() {
  const { metricas, listas, tendencias, carregando, erro } = useMetricas();
  const { mapa: profissionaisMap } = useProfissionaisMap();
  const [categoriaAberta, setCategoriaAberta] = useState<CategoriaCard | null>(null);

  if (carregando) return <p className="text-gray-500">Carregando métricas...</p>;
  if (erro) return <p className="text-red-600">{erro}</p>;

  return (
    <>
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

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
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

      {categoriaAberta && (
        <ModalListaAgendamentos
          titulo={TITULOS_MODAL[categoriaAberta]}
          agendamentos={listas[categoriaAberta]}
          profissionaisMap={profissionaisMap}
          onFechar={() => setCategoriaAberta(null)}
        />
      )}
    </>
  );
}

function DashboardPaciente() {
  const { proximaConsulta, totalFuturas, carregando, erro } = useProximaConsulta();
  const { mapa: profissionaisMap } = useProfissionaisMap();

  if (carregando) return <p className="text-gray-500">Carregando sua agenda...</p>;
  if (erro) return <p className="text-red-600">{erro}</p>;

  const profissional = proximaConsulta ? profissionaisMap[proximaConsulta.profissionalId] : undefined;

  return (
    <div className="max-w-xl">
      <CardProximaConsulta
        consulta={proximaConsulta}
        profissional={profissional}
        totalFuturas={totalFuturas}
      />

      {proximaConsulta && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/agendamentos/novo"
            className="rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            + Novo Agendamento
          </Link>
          <Link
            to="/agendamentos"
            className="rounded-md border border-gray-200 px-4 py-2.5 text-center text-sm font-medium text-gray-600 transition-colors hover:border-primary/30 hover:bg-sky-50 hover:text-primary"
          >
            Ver meus agendamentos
          </Link>
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  const { usuario } = useAuth();
  const ehAdmin = usuario?.perfil === "ADMIN";

  return (
    <div className="space-y-8">
      <header className="border-b border-gray-200 pb-6">
        <p className="text-sm font-medium text-[#055DF9]">Painel de controle</p>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">
          Olá, {usuario?.nome ?? "bem-vindo"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {ehAdmin
            ? "Acompanhe aqui os agendamentos e indicadores da clínica."
            : "Acompanhe aqui sua próxima consulta."}
        </p>
      </header>

      {ehAdmin ? <DashboardAdmin /> : <DashboardPaciente />}
    </div>
  );
}