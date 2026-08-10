import { createContext } from 'react';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: string;
}

export interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  carregando: boolean;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);