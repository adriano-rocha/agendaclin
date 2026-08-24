import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RotaProtegida() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}