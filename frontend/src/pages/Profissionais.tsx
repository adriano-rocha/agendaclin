import { useState, useEffect } from 'react';
import { listarProfissionais } from '../services/profissionalService';
import type { Profissional } from '../types/Profissional';

function obterIniciais(nome: string): string {
  const partes = nome.trim().split(' ');
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await listarProfissionais();
        setProfissionais(dados);
      } catch {
        setErro('Não foi possível carregar os profissionais.');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Carregando profissionais...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">{erro}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profissionais</h1>

      {profissionais.length === 0 && (
        <p className="text-gray-500 text-center py-10">Nenhum profissional cadastrado.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {profissionais.map((prof) => (
          <div
            key={prof.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-semibold text-lg flex items-center justify-center mb-3">
              {obterIniciais(prof.nome)}
            </div>
            <h2 className="text-sm font-semibold text-gray-900">{prof.nome}</h2>
            <span className="text-xs text-gray-500 mt-1">{prof.especialidade?.nome}</span>
          </div>
        ))}
      </div>
    </div>
  );
}