// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import RotaProtegida from './routes/RotaProtegida';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Login from './pages/Login';
import './App.css';
import Cadastro from './pages/Cadastro';
import { Dashboard } from './pages/Dashboard';
import { Agendamentos } from './pages/Agendamentos';
import { NovoAgendamento } from './pages/NovoAgendamento';
import Profissionais from './pages/Profissionais';
import Perfil from './pages/Perfil';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route element={<RotaProtegida />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agendamentos" element={<Agendamentos />} />
              <Route path="/agendamentos/novo" element={<NovoAgendamento />} />
              <Route path="/profissionais" element={<Profissionais />} />
               <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;