import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  Users,
  User,
  LogOut,
  X,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/agendamentos", label: "Agendamentos", icon: CalendarDays },
  { to: "/agendamentos/novo", label: "Novo Agendamento", icon: CalendarPlus },
  { to: "/profissionais", label: "Profissionais", icon: Users },
];

const linkBase =
  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-600 transition-colors hover:bg-blue-50 hover:text-[#055DF9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#055DF9]";
const linkAtivo = "bg-blue-50 text-[#055DF9] font-medium";

interface SidebarProps {
  aberta: boolean;
  aoFechar: () => void;
}

export function Sidebar({ aberta, aoFechar }: SidebarProps) {
  const { usuario, logout } = useAuth();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white p-4 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        aberta ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#055DF9] text-sm font-bold text-white">
            A
          </div>
          <h2 className="text-lg font-semibold text-gray-900">AgendaClin</h2>
        </div>
        <button
          onClick={aoFechar}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 md:hidden"
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={aoFechar}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkAtivo : ""}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#055DF9]" />
                )}
                <link.icon size={18} className="shrink-0" />
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 text-sm">
        <NavLink
          to="/perfil"
          onClick={aoFechar}
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkAtivo : ""}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#055DF9]" />
              )}
              <User size={18} className="shrink-0" />
              <span className="truncate">{usuario?.nome}</span>
            </>
          )}
        </NavLink>
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-500"
        >
          <LogOut size={18} className="shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}