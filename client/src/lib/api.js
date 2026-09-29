// Leave VITE_API_URL empty when the API and the site share the same domain.
const BASE = `${import.meta.env.VITE_API_URL ?? ''}/api`;

export class ApiError extends Error {
  constructor(code, status, fields = {}) {
    super(code);
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

async function request(path, { body, ...options } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('network', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error ?? 'server', res.status, data.fields);
  return data;
}

export const api = {
  availability: (query, signal) => request(`/availability?${new URLSearchParams(query)}`, { signal }),
  reserve: (booking) => request('/reservations', { method: 'POST', body: booking }),
  contact: (message) => request('/contact', { method: 'POST', body: message }),
};
