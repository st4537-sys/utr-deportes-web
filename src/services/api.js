const RAW_BASE_URL = import.meta.env.VITE_API_URL || '';
// Elimina barras finales o '/api' duplicado porque los endpoints ya incluyen '/api/...'
const BASE_URL = RAW_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
const APP_TOKEN = import.meta.env.VITE_API_APP_TOKEN;

export const apiFetch = async (endpoint, options = {}) => {
  const userToken = localStorage.getItem('user_token');

  const headers = {
    'Content-Type': 'application/json',
    'x-api-token': APP_TOKEN,
    ...options.headers,
  };

  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // 401 Unauthorized: limpiar sesión y redirigir a Login
  if (response.status === 401) {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Sesión expirada o token inválido. Inicia sesión nuevamente.');
  }

  // 403 Forbidden: redirigir a pantalla de acceso restringido
  if (response.status === 403) {
    if (window.location.pathname !== '/acceso-restringido') {
      window.location.href = '/acceso-restringido';
    }
    throw new Error('Acceso restringido: no tienes permisos para este recurso.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Si Swagger devuelve detalles por campo en errors: [{ campo, mensaje }]
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const detalles = data.errors.map((e) => `${e.campo}: ${e.mensaje}`).join(' | ');
      throw new Error(detalles);
    }
    if (response.status === 404) {
      throw new Error(data?.message || 'Recurso no encontrado (404).');
    }
    if (response.status === 409) {
      throw new Error(data?.message || 'Conflicto en la operación o sin stock disponible (409).');
    }
    if (response.status === 429) {
      throw new Error('Demasiadas peticiones. Espera un momento e intenta de nuevo.');
    }
    throw new Error(data?.message || `Error del servidor (${response.status}).`);
  }

  return data;
};