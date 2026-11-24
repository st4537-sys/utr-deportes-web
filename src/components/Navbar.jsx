import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">UTR Deportes ({user.rol})</div>
      <div className="nav-links">
        <Link to="/inventario">Inventario</Link>
        <Link to="/mis-prestamos">Mis Préstamos</Link>
        {user.rol === 'ADMIN' && <Link to="/admin">Panel Admin</Link>}
        <button onClick={handleLogout} className="btn-secondary">
          Salir
        </button>
      </div>
    </nav>
  );
}