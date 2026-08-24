import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-950 p-8 text-gray-100">
        <Outlet />
      </main>
    </div>
  );
}