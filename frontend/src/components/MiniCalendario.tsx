import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface MiniCalendarioProps {
  dataSelecionada: string; // formato "YYYY-MM-DD"
  aoSelecionarData: (data: string) => void;
  dataMinima: string; // formato "YYYY-MM-DD"
}

// 🔑 Monta a data manualmente (ano, mês, dia) em vez de usar toISOString(),
// que trabalha em UTC e pode "voltar um dia" dependendo do fuso do navegador.
function formatarDataISO(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function MiniCalendario({
  dataSelecionada,
  aoSelecionarData,
  dataMinima,
}: MiniCalendarioProps) {
  const hoje = new Date();
  const [mesReferencia, setMesReferencia] = useState(
    () => new Date(hoje.getFullYear(), hoje.getMonth(), 1),
  );

  const ano = mesReferencia.getFullYear();
  const mes = mesReferencia.getMonth();

  // 🔑 getDay() do dia 1 do mês diz em qual coluna da semana o mês começa (0 = domingo)
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  // 🔑 Truque: dia "0" do mês seguinte = último dia do mês atual
  const totalDiasNoMes = new Date(ano, mes + 1, 0).getDate();

  // 🔑 Preenche os "buracos" antes do dia 1 com null, pra alinhar a grade nas colunas certas
  const dias: (Date | null)[] = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from(
      { length: totalDiasNoMes },
      (_, i) => new Date(ano, mes, i + 1),
    ),
  ];

  function irParaMesAnterior() {
    setMesReferencia(new Date(ano, mes - 1, 1));
  }

  function irParaProximoMes() {
    setMesReferencia(new Date(ano, mes + 1, 1));
  }

  return (
    <div className="border border-gray-200 rounded-md p-3">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={irParaMesAnterior}
          className="p-1 rounded hover:bg-gray-100 text-gray-500"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-gray-900">
          {NOMES_MESES[mes]} {ano}
        </span>
        <button
          type="button"
          onClick={irParaProximoMes}
          className="p-1 rounded hover:bg-gray-100 text-gray-500"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DIAS_SEMANA.map((dia, index) => (
          <span
            key={index}
            className="text-center text-xs font-medium text-gray-400"
          >
            {dia}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dias.map((diaData, index) => {
          if (!diaData) {
            return <span key={`vazio-${index}`} />;
          }

          const dataISO = formatarDataISO(diaData);
          const desabilitado = dataISO < dataMinima;
          const selecionado = dataISO === dataSelecionada;

          return (
            <button
              key={dataISO}
              type="button"
              disabled={desabilitado}
              onClick={() => aoSelecionarData(dataISO)}
              className={`aspect-square rounded-md text-sm transition-all ${
                selecionado
                  ? "bg-primary text-white font-medium shadow-sm cursor-pointer"
                  : desabilitado
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {diaData.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
