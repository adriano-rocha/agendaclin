// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import RotaProtegida from './routes/RotaProtegida';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import AreaLogada from './pages/AreaLogada';
import { Agendamentos } from './pages/Agendamentos';
import { NovoAgendamento } from './pages/NovoAgendamento';
import Profissionais from './pages/Profissionais';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/"
            element={
              <RotaProtegida>
                <AreaLogada />
              </RotaProtegida>
            }
          />
          <Route
            path="/agendamentos"
            element={
              <RotaProtegida>
                <Agendamentos />
              </RotaProtegida>
            }
          />
          <Route
            path="/agendamentos/novo"
            element={
              <RotaProtegida>
                <NovoAgendamento />
              </RotaProtegida>
            }
          />
          <Route
            path="/profissionais"
            element={
              <RotaProtegida>
                <Profissionais />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;