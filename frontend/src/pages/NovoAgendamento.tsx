import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listarProfissionais, listarEspecialidades } from '../services/profissionalService';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { useAuth } from '../hooks/useAuth';
import type { Profissional } from '../types/Profissional';
import type { Especialidade } from '../types/Especialidade';
import { AvatarProfissional } from '../components/AvatarProfissional';
import { registroFicticio } from '../utils/registroProfissional';

const HORARIOS_DISPONIVEIS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

function obterDataMinima(): string {
  const hoje = new Date();
  return hoje.toISOString().slice(0, 10);
}

export function NovoAgendamento() {
  const { usuario } = useAuth();
  const { criar } = useAgendamentos();
  const navigate = useNavigate();

  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);

  const [especialidadeId, setEspecialidadeId] = useState('');
  const [profissionalId, setProfissionalId] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');

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
        toast.error('Não foi possível carregar especialidades/profissionais.');
      } finally {
        setCarregandoOpcoes(false);
      }
    }

    carregarOpcoes();
  }, []);

  const profissionaisFiltrados = especialidadeId
    ? profissionais.filter((p) => p.especialidadeId === Number(especialidadeId))
    : [];

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
      toast.success('Agendamento criado com sucesso!');
      navigate('/agendamentos');
    } catch {
      toast.error('Não foi possível criar o agendamento. Verifique o horário e tente novamente.');
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
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Agendamento</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Especialidade</span>
          <select
            value={especialidadeId}
            onChange={(e) => {
              setEspecialidadeId(e.target.value);
              setProfissionalId('');
            }}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
          >
            <option value="">Selecione</option>
            {especialidades.map((esp) => (
              <option key={esp.id} value={esp.id}>
                {esp.nome}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="block text-sm font-medium text-gray-700 mb-1">Profissional</span>

          {!especialidadeId && (
            <p className="text-sm text-gray-400 italic">Selecione uma especialidade primeiro.</p>
          )}

          {especialidadeId && profissionaisFiltrados.length === 0 && (
            <p className="text-sm text-gray-400 italic">Nenhum profissional disponível.</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {profissionaisFiltrados.map((prof) => {
              const selecionado = profissionalId === String(prof.id);

              return (
                <button
                  key={prof.id}
                  type="button"
                  onClick={() => setProfissionalId(String(prof.id))}
                  className={`flex flex-col items-center gap-2 border rounded-lg p-3 text-center transition-colors ${
                    selecionado
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <AvatarProfissional nome={prof.nome} especialidade={prof.especialidade?.nome} tamanho="sm" />
                  <span className="text-sm font-medium text-gray-900">{prof.nome}</span>
                  <span className="text-xs text-gray-500">{prof.especialidade?.nome}</span>
                  <span className="text-xs text-gray-400">
                    {registroFicticio(prof.especialidade?.nome)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Data</span>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            min={dataMinima}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Horário</span>
          <select
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
          >
            <option value="">Selecione um horário</option>
            {HORARIOS_DISPONIVEIS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={enviando || !profissionalId}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enviando ? 'Agendando...' : 'Agendar'}
        </button>
      </form>
    </div>
  );
}