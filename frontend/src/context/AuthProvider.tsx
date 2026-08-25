import { useState } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import type { Usuario } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [carregando] = useState(false);

  async function login(email: string, senha: string) {
    const response = await api.post('/login', { email, senha });
    const { token: novoToken, usuario: novoUsuario } = response.data;

    setToken(novoToken);
    setUsuario(novoUsuario);

    localStorage.setItem('token', novoToken);
    localStorage.setItem('usuario', JSON.stringify(novoUsuario));
  }

  function logout() {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  function atualizarUsuario(usuarioAtualizado: Usuario) {
    setUsuario(usuarioAtualizado);
    localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, atualizarUsuario, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}