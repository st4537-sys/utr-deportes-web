import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    matricula: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombre || !form.matricula || !form.email || !form.password || !form.confirmPassword) {
      setError('Completa todos los campos.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await register({
        nombre: form.nombre,
        matricula: form.matricula,
        email: form.email,
        password: form.password,
      });
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="card form-box" onSubmit={handleSubmit}>
        <h2>Registro de Estudiante</h2>
        {error && <div className="alert-error">{error}</div>}

        <label>Nombre Completo</label>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />

        <label>Matrícula</label>
        <input type="text" name="matricula" value={form.matricula} onChange={handleChange} />

        <label>Correo Electrónico</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>Contraseña</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} />

        <label>Confirmar Contraseña</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Registrando...' : 'Crear Cuenta'}
        </button>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}