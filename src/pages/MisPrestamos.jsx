import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

export default function MisPrestamos() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPrestamos = async () => {
      try {
        const data = await apiFetch('/api/sports/loans');
        setLoans(Array.isArray(data) ? data : data.loans || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    cargarPrestamos();
  }, []);

  return (
    <div className="container">
      <h2>Mis Préstamos Deportivos</h2>
      {error && <div className="alert-error">{error}</div>}
      {loading ? (
        <p>Cargando historial...</p>
      ) : loans.length === 0 ? (
        <p>No tienes préstamos registrados.</p>
      ) : (
        <div className="grid-cards">
          {loans.map((loan) => (
            <div key={loan.loanId || loan.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Folio #{loan.loanId || loan.id}</strong>
                <span className={`status-${loan.estatus}`}>{loan.estatus}</span>
              </div>
              <h3>{loan.item}</h3>
              <p><strong>Cantidad:</strong> {loan.cantidad}</p>
              {loan.canchaOActividad && <p><strong>Cancha/Actividad:</strong> {loan.canchaOActividad}</p>}
              {loan.horaSalida && (
                <p><strong>Salida:</strong> {new Date(loan.horaSalida).toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}