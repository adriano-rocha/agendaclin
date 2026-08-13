import { Link } from 'react-router-dom';

export default function AreaLogada() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Área logada</h1>
        <p className="text-sm text-gray-500 mt-2">Dashboard vem no próximo bloco</p>
        <Link
          to="/agendamentos"
          className="inline-block mt-6 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-md hover:bg-blue-700"
        >
          Ver agendamentos
        </Link>
      </div>
    </div>
  );
}