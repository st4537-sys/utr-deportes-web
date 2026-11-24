import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventario from './pages/Inventario';
import MisPrestamos from './pages/MisPrestamos';
import AccesoRestringido from './pages/AccesoRestringido';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loadingSession } = useAuth();

  if (loadingSession) return <p style={{ padding: '2rem' }}>Verificando sesión...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.rol !== 'ADMIN') return <Navigate to="/acceso-restringido" replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/acceso-restringido" element={<AccesoRestringido />} />
          <Route
            path="/inventario"
            element={
              <ProtectedRoute>
                <Inventario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-prestamos"
            element={
              <ProtectedRoute>
                <MisPrestamos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <div className="container"><h2>Panel de Administración (Próximo hito)</h2></div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/inventario" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}