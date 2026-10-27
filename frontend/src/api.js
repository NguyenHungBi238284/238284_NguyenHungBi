// Thứ tự ưu tiên: config.js (lúc chạy) > VITE_API_URL (lúc build) > localhost (phát triển)
const runtime = window.__APP_CONFIG__ || {};
export const API_URL = (
  runtime.API_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000'
).replace(/\/+$/, '');

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    // phản hồi không có nội dung JSON
  }
  if (!res.ok) {
    throw new Error((data && data.message) || `Lỗi máy chủ (${res.status})`);
  }
  return data;
}

export const getEmployees = (search = '') =>
  request(`/api/employees${search ? `?search=${encodeURIComponent(search)}` : ''}`);

export const createEmployee = (body) =>
  request('/api/employees', { method: 'POST', body: JSON.stringify(body) });

export const updateEmployee = (id, body) =>
  request(`/api/employees/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteEmployee = (id) =>
  request(`/api/employees/${id}`, { method: 'DELETE' });
