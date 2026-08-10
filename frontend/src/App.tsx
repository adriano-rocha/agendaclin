import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import RotaProtegida from './routes/RotaProtegida';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

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
                <h1>Área logada (placeholder — Dashboard vem no próximo bloco)</h1>
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