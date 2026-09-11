import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  listarProfissionais,
  listarEspecialidades,
} from "../services/profissionalService";
import { useAgendamentos } from "../hooks/useAgendamentos";
import { useAuth } from "../hooks/useAuth";
import type { Profissional } from "../types/Profissional";
import type { Especialidade } from "../types/Especialidade";
import { AvatarProfissional } from "../components/AvatarProfissional";
import { registroFicticio } from "../utils/registroProfissional";
import { MiniCalendario } from "../components/MiniCalendario";
import { listarHorariosOcupados } from "../services/agendamentoService";

const HORARIOS_DISPONIVEIS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const ENDERECO_CLINICA = "Rua Capitão Cavalcanti, 130";

function obterDataMinima(): string {
  const hoje = new Date();
  return hoje.toISOString().slice(0, 10);
}

function formatarPreco(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function NovoAgendamento() {
  const { usuario } = useAuth();
  const { criar } = useAgendamentos();
  const navigate = useNavigate();

  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);

  const [especialidadeId, setEspecialidadeId] = useState("");
  const [profissionalId, setProfissionalId] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([]);

  const [enviando, setEnviando] = useState(false);

  const dataMinima = obterDataMinima();

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [especialidadesRes, profissionaisRes] = await Promise.all([
          listarEspecialidades(),
          listarProfissionais(),
        ]);
        setEspecialidades(especialidadesRes);
        setProfissionais(profissionaisRes);
      } catch {
        toast.error("Não foi possível carregar especialidades/profissionais.");
      } finally {
        setCarregandoOpcoes(false);
      }
    }

    carregarOpcoes();
  }, []);

  useEffect(() => {
    async function buscarHorariosOcupados() {
      if (!profissionalId || !data) {
        setHorariosOcupados([]);
        return;
      }

      try {
        const ocupados = await listarHorariosOcupados(Number(profissionalId), data);
        setHorariosOcupados(ocupados);
      } catch {
        toast.error("Não foi possível verificar os horários disponíveis.");
      }
    }

    queueMicrotask(buscarHorariosOcupados);
  }, [profissionalId, data]);

  const profissionaisFiltrados = especialidadeId
    ? profissionais.filter((p) => p.especialidadeId === Number(especialidadeId))
    : [];

  const especialidadeSelecionada = especialidades.find(
    (e) => String(e.id) === especialidadeId,
  );
  const profissionalSelecionado = profissionais.find(
    (p) => String(p.id) === profissionalId,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!usuario) return;

    setEnviando(true);

    try {
      const dataHoraInicio = new Date(`${data}T${horario}:00`);

      await criar({
        usuarioId: usuario.id,
        profissionalId: Number(profissionalId),
        dataHoraInicio: dataHoraInicio.toISOString(),
      });
      toast.success("Agendamento criado com sucesso!");
      navigate("/agendamentos");
    } catch {
      toast.error(
        "Não foi possível criar o agendamento. Verifique o horário e tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  if (carregandoOpcoes) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Carregando opções...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Novo Agendamento</h1>
        <p className="mt-1 text-sm text-gray-500">
          Escolha a especialidade, o profissional e o melhor horário para a
          consulta.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4"
        >
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Especialidade
            </span>
            <select
              value={especialidadeId}
              onChange={(e) => {
                setEspecialidadeId(e.target.value);
                setProfissionalId("");
              }}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
            >
              <option value="">Selecione</option>
              {especialidades.map((esp) => (
                <option key={esp.id} value={esp.id}>
                  {esp.nome} — {formatarPreco(esp.preco)}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Profissional
            </span>

            {!especialidadeId && (
              <p className="text-sm text-gray-400 italic">
                Selecione uma especialidade primeiro.
              </p>
            )}

            {especialidadeId && profissionaisFiltrados.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                Nenhum profissional disponível.
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              {profissionaisFiltrados.map((prof) => {
                const selecionado = profissionalId === String(prof.id);

                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => setProfissionalId(String(prof.id))}
                    className={`relative flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all cursor-pointer ${
                      selecionado
                        ? "border-primary/30 bg-sky-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {selecionado && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                    <AvatarProfissional
                      nome={prof.nome}
                      especialidade={prof.especialidade?.nome}
                      tamanho="sm"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {prof.nome}
                    </span>
                    <span className="text-xs text-gray-500">
                      {prof.especialidade?.nome}
                    </span>
                    <span className="text-xs text-gray-400">
                      {registroFicticio(prof.especialidade?.nome)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </span>
            <MiniCalendario
              dataSelecionada={data}
              aoSelecionarData={setData}
              dataMinima={dataMinima}
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">
              Horário
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {HORARIOS_DISPONIVEIS.map((h) => {
                const selecionado = horario === h;
                const ocupado = horariosOcupados.includes(h);

                return (
                  <button
                    key={h}
                    type="button"
                    disabled={ocupado}
                    onClick={() => setHorario(h)}
                    className={`rounded-md border px-2 py-2 text-sm font-medium transition-all cursor-pointer ${
                      selecionado
                        ? "border-primary bg-primary text-white shadow-sm"
                        : ocupado
                          ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                          : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando || !profissionalId || !data || !horario}
            className="w-full bg-primary text-white font-medium py-2.5 rounded-md hover:bg-primary/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? "Agendando..." : "Agendar"}
          </button>
        </form>

        <aside className="lg:col-span-1 lg:sticky lg:top-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Resumo da Consulta
            </h2>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Especialidade</dt>
                <dd className="text-gray-900 font-medium text-right">
                  {especialidadeSelecionada?.nome ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Médico</dt>
                <dd className="text-gray-900 font-medium text-right">
                  {profissionalSelecionado?.nome ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Data</dt>
                <dd className="text-gray-900 font-medium text-right">
                  {data || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Horário</dt>
                <dd className="text-gray-900 font-medium text-right">
                  {horario || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-gray-500">Local</dt>
                <dd className="text-gray-900 font-medium text-right">
                  {ENDERECO_CLINICA}
                </dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-gray-100 pt-3 mt-1">
                <dt className="text-gray-700 font-medium">Valor</dt>
                <dd className="text-primary font-semibold text-right">
                  {especialidadeSelecionada
                    ? formatarPreco(especialidadeSelecionada.preco)
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}