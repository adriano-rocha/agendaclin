import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  const [sidebarAberta, setSidebarAberta] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        aberta={sidebarAberta}
        aoFechar={() => setSidebarAberta(false)}
      />

      {sidebarAberta && (
        <div
          onClick={() => setSidebarAberta(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarAberta(true)}
            className="rounded-md p-1.5 text-gray-600 hover:bg-gray-100"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <span className="text-base font-semibold text-gray-900">
            AgendaClin
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}