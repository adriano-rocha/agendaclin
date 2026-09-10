import { NavLink } from "react-router-dom";
import { useContagemPendentes } from "../../hooks/useContagemPendentes";
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

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  badge?: number;
}

interface NavSection {
  titulo: string;
  itens: NavItem[];
}

const linkBase =
  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-600 transition-colors hover:bg-sky-50 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const linkAtivo = "bg-sky-50 text-primary font-medium";

interface SidebarProps {
  aberta: boolean;
  aoFechar: () => void;
}

export function Sidebar({ aberta, aoFechar }: SidebarProps) {
  const { usuario, logout } = useAuth();
  const contagemPendentes = useContagemPendentes();

  // 🔑 "sections" precisou entrar AQUI DENTRO do componente — só assim
  // pode ler "contagemPendentes", que é um state local do componente.
  const sections: NavSection[] = [
    {
      titulo: "PRINCIPAL",
      itens: [
        { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
        {
          to: "/agendamentos",
          label: "Agendamentos",
          icon: CalendarDays,
          badge: contagemPendentes > 0 ? contagemPendentes : undefined,
        },
        { to: "/agendamentos/novo", label: "Novo Agendamento", icon: CalendarPlus },
      ],
    },
    {
      titulo: "GESTÃO",
      itens: [{ to: "/profissionais", label: "Profissionais", icon: Users }],
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white p-4 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        aberta ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-dark text-sm font-bold text-white">
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

      <nav className="flex flex-1 flex-col gap-6">
        {sections.map((section) => (
          <div key={section.titulo} className="flex flex-col gap-1">
            <span className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-gray-400">
              {section.titulo}
            </span>
            {section.itens.map((link) => (
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
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    <link.icon size={18} className="shrink-0" />
                    <span className="flex-1">{link.label}</span>
                    {link.badge !== undefined && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isActive
                            ? "bg-primary text-white"
                            : "bg-sky-100 text-primary"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
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
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
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