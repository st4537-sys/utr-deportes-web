import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

export default function Inventario() {
  const [items, setItems] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [filtroDeporte, setFiltroDeporte] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para Pantalla B2 (Modal Solicitar Préstamo)
  const [selectedItem, setSelectedItem] = useState(null);
  const [loanForm, setLoanForm] = useState({ cantidad: 1, canchaOActividad: '' });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const cargarInventario = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filtroDeporte) params.append('deporte', filtroDeporte);
      if (soloDisponibles) params.append('disponible', 'true');

      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await apiFetch(`/api/sports/items${query}`);
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiFetch('/api/sports/items/sports')
      .then((data) => setDeportes(Array.isArray(data) ? data : data.sports || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    cargarInventario();
  }, [filtroDeporte, soloDisponibles]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setLoanForm({ cantidad: 1, canchaOActividad: '' });
    setModalError('');
  };

  const handleChange = (e) => {
    setLoanForm({ ...loanForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    const cantidadNum = Number(loanForm.cantidad);
    if (!cantidadNum || cantidadNum < 1 || cantidadNum > selectedItem.disponibles) {
      setModalError(`La cantidad debe estar entre 1 y ${selectedItem.disponibles}.`);
      return;
    }
    if (!loanForm.canchaOActividad.trim()) {
      setModalError('Indica la cancha o actividad deportiva.');
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/api/sports/loans', {
        method: 'POST',
        body: {
          itemId: selectedItem.id,
          cantidad: cantidadNum,
          canchaOActividad: loanForm.canchaOActividad.trim(),
        },
      });
      alert('Préstamo solicitado correctamente.');
      setSelectedItem(null);
      cargarInventario();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Inventario de Material Deportivo</h2>

      {/* Filtros B1 */}
      <div className="filters-bar card">
        <select value={filtroDeporte} onChange={(e) => setFiltroDeporte(e.target.value)}>
          <option value="">Todas las disciplinas</option>
          {deportes.map((dep, idx) => (
            <option key={idx} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(e) => setSoloDisponibles(e.target.checked)}
          />
          Solo disponibles
        </label>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {loading ? (
        <p>Cargando material deportivo...</p>
      ) : (
        <div className="grid-cards">
          {items.map((item) => (
            <div key={item.id} className="card item-card">
              <span className="badge">{item.codigo}</span>
              <h3>{item.nombre}</h3>
              <p><strong>Disciplina:</strong> {item.deporte}</p>
              <p><strong>Estado:</strong> {item.estadoFisico}</p>
              <p><strong>Disponibles:</strong> {item.disponibles}</p>
              <button
                className="btn-primary"
                disabled={item.disponibles <= 0}
                onClick={() => handleSelect(item)}
              >
                {item.disponibles > 0 ? 'Solicitar Préstamo' : 'Sin Stock'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal B2 — Solicitar Préstamo Deportivo */}
      {selectedItem && (
        <div className="modal-backdrop">
          <div className="card modal-box">
            <h3>Solicitar: {selectedItem.nombre}</h3>
            <p>Disponibles actualmente: <strong>{selectedItem.disponibles}</strong></p>
            {modalError && <div className="alert-error">{modalError}</div>}

            <form onSubmit={handleSubmit}>
              <label>Cantidad a solicitar</label>
              <input
                type="number"
                name="cantidad"
                min="1"
                max={selectedItem.disponibles}
                value={loanForm.cantidad}
                onChange={handleChange}
              />

              <label>Cancha o Actividad</label>
              <input
                type="text"
                name="canchaOActividad"
                placeholder="Ej. Cancha 2 - Torneo"
                value={loanForm.canchaOActividad}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setSelectedItem(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Confirmar Préstamo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}