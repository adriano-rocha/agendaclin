import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { to: "/agendamentos", label: "Agendamentos" },
  { to: "/agendamentos/novo", label: "Novo Agendamento" },
  { to: "/profissionais", label: "Profissionais" },
];

const linkBase =
  "block rounded-md px-3 py-2 border-2 border-transparent text-gray-200 transition-colors hover:border-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500";
const linkAtivo = "bg-blue-600 text-white";

export function Sidebar() {
  const { usuario, logout } = useAuth();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-700 bg-gray-900 p-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-blue-400">AgendaClin</h2>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkAtivo : ""}`
          }
        >
          Dashboard
        </NavLink>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkAtivo : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-2 border-t border-gray-700 pt-4 text-sm text-gray-300">
        <span>{usuario?.nome}</span>
        <button
          onClick={logout}
          className="rounded-md border-2 border-gray-600 px-3 py-1.5 text-gray-200 transition-colors hover:border-blue-500"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}