import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { atualizarPerfil, alterarSenha } from "../services/usuarioService";

export default function Perfil() {
  const { usuario, logout, atualizarUsuario } = useAuth();

  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  async function handleSalvarPerfil(e: React.FormEvent) {
    e.preventDefault();
    setSalvandoPerfil(true);

    try {
      const usuarioAtualizado = await atualizarPerfil({ nome, email });
      atualizarUsuario(usuarioAtualizado);
      toast.success("Dados atualizados com sucesso.");
    } catch {
      toast.error("Não foi possível atualizar seus dados. Verifique o e-mail informado.");
    } finally {
      setSalvandoPerfil(false);
    }
  }

  async function handleAlterarSenha(e: React.FormEvent) {
    e.preventDefault();
    setSalvandoSenha(true);

    try {
      await alterarSenha({ senhaAtual, novaSenha });
      toast.success("Senha alterada com sucesso.");
      setSenhaAtual("");
      setNovaSenha("");
    } catch {
      toast.error("Senha atual incorreta.");
    } finally {
      setSalvandoSenha(false);
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <h1 className="text-xl font-bold">Meu perfil</h1>

      <form onSubmit={handleSalvarPerfil} className="space-y-3 border p-4 rounded">
        <h2 className="font-semibold">Dados pessoais</h2>

        <div>
          <label className="block text-sm">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={salvandoPerfil}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {salvandoPerfil ? "Salvando..." : "Salvar dados"}
        </button>
      </form>

      <form onSubmit={handleAlterarSenha} className="space-y-3 border p-4 rounded">
        <h2 className="font-semibold">Alterar senha</h2>

        <div>
          <label className="block text-sm">Senha atual</label>
          <input
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm">Nova senha</label>
          <input
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={salvandoSenha}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {salvandoSenha ? "Salvando..." : "Alterar senha"}
        </button>
      </form>

      <button
        onClick={logout}
        className="text-red-600 underline text-sm"
      >
        Sair da conta
      </button>
    </div>
  );
}