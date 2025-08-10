// src/admin/ProductsPage.jsx
import React, { useEffect, useState } from 'react';
import { products } from '../services/cmsStore';

const emptyForm = { name: '', price: 0, model: '', ios: '' };

export default function ProductsPage() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [q, setQ] = useState('');

  const load = async () => {
    const data = await products.list();
    setRows(data);
  };

  useEffect(() => { load(); }, []);

  const startCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setOpenForm(true);
  };
  const startEdit = (row) => {
    setEditId(row.id);
    setForm({ name: row.name, price: row.price, model: row.model || '', ios: row.ios || '' });
    setOpenForm(true);
  };
  const save = async () => {
    if (!form.name.trim()) return alert('Nama wajib diisi');
    if (!form.price || Number.isNaN(Number(form.price))) return alert('Harga tidak valid');

    if (editId) await products.update(editId, { ...form, price: Number(form.price) });
    else await products.create({ ...form, price: Number(form.price) });

    setOpenForm(false);
    await load();
  };
  const del = async (id) => {
    if (window.confirm('Hapus produk ini?')) {
      await products.remove(id);
      await load();
    }
  };

  const filtered = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Produk</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Cari produk…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd' }}
          />
          <button onClick={startCreate} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#2ecc71', color: '#fff', cursor: 'pointer' }}>
            + Tambah
          </button>
        </div>
      </div>

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Nama</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Harga</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Model (GLB)</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>iOS (USDZ)</th>
              <th style={{ padding: 10, borderBottom: '1px solid #eee' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: 10 }}>{r.name}</td>
                <td style={{ padding: 10 }}>Rp {r.price.toLocaleString('id-ID')}</td>
                <td style={{ padding: 10 }}>{r.model || '-'}</td>
                <td style={{ padding: 10 }}>{r.ios || '-'}</td>
                <td style={{ padding: 10, display: 'flex', gap: 8 }}>
                  <button onClick={() => startEdit(r)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => del(r.id)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ffb3b3', color: '#e74c3c', background: '#fff5f5', cursor: 'pointer' }}>Hapus</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="5" style={{ padding: 16, color: '#888', textAlign: 'center' }}>Tidak ada data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog form */}
      {openForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'grid', placeItems: 'center', zIndex: 1000,
        }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, width: 420, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginTop: 0 }}>{editId ? 'Edit Produk' : 'Tambah Produk'}</h3>

            <label>Nama</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                   style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', marginBottom: 8 }} />

            <label>Harga</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                   style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', marginBottom: 8 }} />

            <label>Model (path .glb)</label>
            <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}
                   placeholder="/assets/xxx.glb"
                   style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', marginBottom: 8 }} />

            <label>iOS (path .usdz)</label>
            <input value={form.ios} onChange={(e) => setForm({ ...form, ios: e.target.value })}
                   placeholder="/assets/xxx.usdz"
                   style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', marginBottom: 16 }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setOpenForm(false)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }}>Batal</button>
              <button onClick={save} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#2ecc71', color: '#fff' }}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
