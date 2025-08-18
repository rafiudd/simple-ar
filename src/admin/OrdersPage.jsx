import React, { useEffect, useState } from 'react';
import { deleteOrder, orderService, updateStatusOrder } from '../services/orderService';

const STATUS = ['Sedang Diproses', 'Selesai'];

export default function OrdersPage() {
  const [rows, setRows] = useState([]);
  const [activeTab, setActiveTab] = useState('Semua');

  const load = async () => {
    try {
      const data = await orderService.getListOrder();
      setRows(data.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || '')));
    } catch (err) {
      console.error('Gagal load orders:', err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, status) => {
    try {
      await updateStatusOrder(id, status);
      await load();
    } catch (err) {
      console.error('Gagal update status:', err);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Hapus pesanan ini?')) return;
    try {
      await deleteOrder(id);
      await load();
    } catch (err) {
      console.error('Gagal hapus order:', err);
    }
  };

  // Filter data sesuai tab
  const filteredRows = activeTab === 'Semua' ? rows : rows.filter((r) => (r.status || 'Diterima') === activeTab);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Pesanan</h2>

      {/* TAB BAR */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {['Semua', ...STATUS].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: activeTab === tab ? '2px solid #333' : '1px solid #ccc',
              background: activeTab === tab ? '#333' : '#f9f9f9',
              color: activeTab === tab ? '#fff' : '#333',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

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
            {filteredRows.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: 10 }}>#{r.id}</td>
                <td style={{ padding: 10 }}>{r.customer_name || '-'}</td>
                <td style={{ padding: 10 }}>
                  {r.items?.map((it, i) => (
                    <div key={i} style={{ marginBottom: 4 }}>
                      {it.qty}x {it.nama_menu} @{(it.unit_price ?? 0).toLocaleString('id-ID')}
                    </div>
                  ))}
                </td>
                <td style={{ padding: 10 }}>Rp {(r.total_price ?? 0).toLocaleString('id-ID')}</td>

                <td style={{ padding: 10, borderRadius: 6 }}>
                  <select
                    value={r.status || 'Diterima'}
                    onChange={(e) => update(r.id, e.target.value)}
                    style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd' }}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: 10 }}>
                  <button
                    onClick={() => del(r.id)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid #ffb3b3',
                      color: '#e74c3c',
                      background: '#fff5f5',
                      cursor: 'pointer',
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: 16, textAlign: 'center', color: '#888' }}>
                  Tidak ada pesanan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
