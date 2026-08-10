import { Perfil } from '../domain/entities/Usuario';

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: number;
        perfil: Perfil;
      };
    }
  }
}