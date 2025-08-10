// src/services/cmsStore.js
// Sederhana: simpan di localStorage. Ganti fungsi-fungsi ini ke Axios kalau sudah ada backend.

const KEYS = {
  PRODUCTS: 'cms_products',
  ORDERS: 'cms_orders',
  AUTH: 'cms_authed',
};

// init dummy data kalau kosong
function init() {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    const seed = [
      { id: 'p1', name: 'Matcha Cake', price: 25000, model: '/assets/cake2.glb', ios: '/assets/coconchair.usdz' },
      { id: 'p2', name: 'Es Kopi Special', price: 20000, model: '/assets/minum.glb', ios: null },
      { id: 'p3', name: 'Kursi Mini', price: 50000, model: '/assets/minum.glb', ios: '/assets/coconchair.usdz' },
    ];
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(seed));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
  }
}
init();

// helpers
const read = (k) => JSON.parse(localStorage.getItem(k) || '[]');
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// Auth super sederhana (demo)
export const auth = {
  login: async (password) => {
    const ok = password === 'admin123'; // ganti dari env nanti
    if (ok) localStorage.setItem(KEYS.AUTH, 'true');
    return ok;
  },
  logout: () => localStorage.removeItem(KEYS.AUTH),
  isAuthed: () => localStorage.getItem(KEYS.AUTH) === 'true',
};

// Products
export const products = {
  list: async () => read(KEYS.PRODUCTS),
  create: async (data) => {
    const rows = read(KEYS.PRODUCTS);
    const id = `p${Date.now()}`;
    rows.push({ id, ...data });
    write(KEYS.PRODUCTS, rows);
    return id;
  },
  update: async (id, data) => {
    const rows = read(KEYS.PRODUCTS).map((r) => (r.id === id ? { ...r, ...data } : r));
    write(KEYS.PRODUCTS, rows);
  },
  remove: async (id) => {
    const rows = read(KEYS.PRODUCTS).filter((r) => r.id !== id);
    write(KEYS.PRODUCTS, rows);
  },
};

// Orders
export const orders = {
  list: async () => read(KEYS.ORDERS),
  upsert: async (order) => {
    const rows = read(KEYS.ORDERS);
    const idx = rows.findIndex((r) => r.id === order.id);
    if (idx >= 0) rows[idx] = order; else rows.push(order);
    write(KEYS.ORDERS, rows);
  },
  updateStatus: async (id, status) => {
    const rows = read(KEYS.ORDERS).map((r) => (r.id === id ? { ...r, status } : r));
    write(KEYS.ORDERS, rows);
  },
};
