const API_BASE = '/api';

async function request(path, options = {}) {
  let token = options.token || localStorage.getItem('token');
  
  // Defensive check for potential string "null" or "undefined" from localStorage
  if (token === 'null' || token === 'undefined') {
    token = null;
  }

  const headers = { 
    'Content-Type': 'application/json', 
    ...options.headers 
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export const loginUser = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const getMe = (options) => request('/auth/me', options);

// Users
export const fetchUsers = (options) => request('/users', options);
export const createUser = (user) =>
  request('/users', { method: 'POST', body: JSON.stringify(user) });
export const updateUser = (id, data) =>
  request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser = (id) =>
  request(`/users/${id}`, { method: 'DELETE' });

// Orders
export const fetchOrders = (options) => request('/orders', options);
export const fetchOrder = (id, options) => request(`/orders/${id}`, options);
export const createOrder = (order) =>
  request('/orders', { method: 'POST', body: JSON.stringify(order) });
export const updateOrder = (id, data) =>
  request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteOrder = (id) =>
  request(`/orders/${id}`, { method: 'DELETE' });
