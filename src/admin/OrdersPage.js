// src/admin/OrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { orders } from '../services/cmsStore';

const STATUS = ['Diterima', 'Sedang Diproses', 'Siap Diambil', 'Selesai'];

export default function OrdersPage() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const data = await orders.list();
    // urutkan terbaru di atas
    setRows(data.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')));
  };

  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    await orders.updateStatus(id, status);
    await load();
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Pesanan</h2>

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Order ID</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Nama</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Item</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Total</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Status</th>
              <th style={{ padding: 10, borderBottom: '1px solid #eee' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: 10 }}>#{r.id}</td>
                <td style={{ padding: 10 }}>{r.name || '-'}</td>
                <td style={{ padding: 10 }}>
                  {r.items?.map((it, i) => (
                    <div key={i}>{it.qty}x {it.name}</div>
                  ))}
                </td>
                <td style={{ padding: 10 }}>Rp {(r.total ?? 0).toLocaleString('id-ID')}</td>
                <td style={{ padding: 10 }}>{r.status || 'Diterima'}</td>
                <td style={{ padding: 10 }}>
                  <select
                    value={r.status || 'Diterima'}
                    onChange={(e) => update(r.id, e.target.value)}
                    style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd' }}
                  >
                    {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan="6" style={{ padding: 16, textAlign: 'center', color: '#888' }}>Belum ada pesanan</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
