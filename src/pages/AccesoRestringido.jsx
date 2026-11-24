import { Link } from 'react-router-dom';

export default function AccesoRestringido() {
  return (
    <div className="auth-container">
      <div className="card form-box" style={{ textAlign: 'center' }}>
        <h2>403 — Acceso Restringido</h2>
        <p>No cuentas con los permisos necesarios para acceder a esta sección.</p>
        <Link to="/inventario" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Volver al Inventario
        </Link>
      </div>
    </div>
  );
}